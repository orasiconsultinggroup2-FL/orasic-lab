import { requireKey } from './env.js';

// Actores de HarvestAPI: funcionan sin cookies ni sesion de LinkedIn, asi que
// no hay ninguna cuenta propia expuesta a bloqueos.
const ACTOR_BUSQUEDA = 'harvestapi~linkedin-profile-search';
const ACTOR_POSTS = 'harvestapi~linkedin-profile-posts';

const PERFILES_POR_PAGINA = 25;
const COSTO_POR_PAGINA = 0.1;
const COSTO_POR_PERFIL = 0.004;

export function estimarCosto(cantidadLeads) {
  const paginas = Math.max(1, Math.ceil(cantidadLeads / PERFILES_POR_PAGINA));
  return {
    paginas,
    costoUsd: Number((paginas * COSTO_POR_PAGINA + cantidadLeads * COSTO_POR_PERFIL).toFixed(3)),
  };
}

async function correrActor(actor, input, { timeoutMs = 300000 } = {}) {
  const token = requireKey(
    'APIFY_TOKEN',
    'Sacala en https://console.apify.com/settings/integrations y pegala en el archivo .env'
  );
  const url = `https://api.apify.com/v2/acts/${actor}/run-sync-get-dataset-items`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
      signal: ctrl.signal,
    });
    const texto = await res.text();
    if (!res.ok) {
      const err = new Error(`Apify respondio ${res.status}: ${texto.slice(0, 500)}`);
      err.statusCode = res.status === 401 || res.status === 403 ? 401 : 502;
      throw err;
    }
    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? datos : [];
  } catch (e) {
    if (e.name === 'AbortError') {
      const err = new Error('Apify tardo demasiado. Proba con menos leads.');
      err.statusCode = 504;
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function limpiar(lista) {
  return (lista || []).map((s) => String(s).trim()).filter(Boolean);
}

// LinkedIn filtra por nombre de ubicacion, de lo mas especifico a lo mas amplio.
// Mandamos solo el nivel mas fino que el usuario haya completado.
function armarUbicaciones({ pais, estado, ciudad }) {
  if (ciudad) return [ciudad];
  if (estado) return [estado];
  if (pais) return [pais];
  return [];
}

export async function buscarPerfiles({ keyword, cargos, pais, estado, ciudad, limite }) {
  const cantidad = Math.max(1, Math.min(Number(limite) || 20, 500));
  const input = {
    profileScraperMode: 'Full',
    maxItems: cantidad,
    takePages: Math.max(1, Math.ceil(cantidad / PERFILES_POR_PAGINA)),
    startPage: 1,
  };

  if (keyword) input.searchQuery = String(keyword).trim();
  const titulos = limpiar(cargos);
  if (titulos.length) input.currentJobTitles = titulos;
  const ubicaciones = armarUbicaciones({ pais, estado, ciudad });
  if (ubicaciones.length) input.locations = ubicaciones;

  const crudos = await correrActor(ACTOR_BUSQUEDA, input);
  return crudos.slice(0, cantidad).map(normalizarPerfil).filter((p) => p.linkedinUrl);
}

export async function buscarPublicaciones(urls, maxPosts = 3) {
  if (!urls.length) return new Map();
  const crudos = await correrActor(ACTOR_POSTS, {
    targetUrls: urls,
    maxPosts,
    includeReposts: false,
    includeQuotePosts: true,
    scrapeReactions: false,
    scrapeComments: false,
  });

  const porPerfil = new Map();
  for (const post of crudos) {
    const url = normalizarUrl(
      post.authorProfileUrl ||
        post.profileUrl ||
        post.author?.linkedinUrl ||
        post.author?.publicIdentifier ||
        post.targetUrl
    );
    if (!url) continue;
    const texto = String(post.content || post.text || post.postContent || '').trim();
    if (!texto) continue;
    const lista = porPerfil.get(url) || [];
    if (lista.length < maxPosts) {
      lista.push({ texto: texto.slice(0, 900), fecha: post.postedAt?.date || post.postedAt || post.date || null });
    }
    porPerfil.set(url, lista);
  }
  return porPerfil;
}

export function normalizarUrl(valor) {
  if (!valor) return '';
  let v = String(valor).trim();
  if (!v) return '';
  if (!v.startsWith('http')) v = `https://www.linkedin.com/in/${v.replace(/^\/+|\/+$/g, '')}`;
  return v.split('?')[0].replace(/\/+$/, '').toLowerCase();
}

function primerTexto(...candidatos) {
  for (const c of candidatos) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return '';
}

function normalizarPerfil(p) {
  const linkedinUrl = normalizarUrl(p.linkedinUrl || p.profileUrl || p.url || p.publicIdentifier);
  const posicion = Array.isArray(p.currentPosition) ? p.currentPosition[0] : p.currentPosition;
  const primeraExperiencia = Array.isArray(p.experience) ? p.experience[0] : null;

  const nombre =
    primerTexto(p.name, p.fullName, [p.firstName, p.lastName].filter(Boolean).join(' ')) ||
    'Sin nombre';

  return {
    id: linkedinUrl || p.id || `lead-${Math.random().toString(36).slice(2)}`,
    nombre,
    titular: primerTexto(p.headline, p.subtitle, posicion?.position),
    cargo: primerTexto(posicion?.position, primeraExperiencia?.position, p.jobTitle),
    empresa: primerTexto(
      posicion?.companyName,
      primeraExperiencia?.companyName,
      p.companyName,
      p.company?.name
    ),
    ubicacion: primerTexto(
      p.location?.linkedinText,
      p.location?.parsed?.text,
      typeof p.location === 'string' ? p.location : '',
      p.locationName
    ),
    foto: primerTexto(p.photo, p.photoUrl, p.profilePicture, p.pictureUrl, p.avatar),
    acerca: primerTexto(p.about, p.summary, p.description).slice(0, 1500),
    linkedinUrl,
    experiencia: (Array.isArray(p.experience) ? p.experience : []).slice(0, 3).map((e) => ({
      cargo: primerTexto(e.position, e.title),
      empresa: primerTexto(e.companyName, e.company?.name),
      periodo: primerTexto(e.duration, e.period, e.dateRange),
    })),
    publicaciones: [],
  };
}
