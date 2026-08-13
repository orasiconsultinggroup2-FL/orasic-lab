import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadEnv } from './lib/env.js';
import {
  initStore,
  getSettings,
  saveSettings,
  getLeads,
  saveLeads,
  updateLead,
  deleteLead,
  upsertLeads,
  resumenCredito,
  registrarGasto,
  ESTADOS,
} from './lib/store.js';
import { buscarPerfiles, buscarPublicaciones, estimarCosto, normalizarUrl } from './lib/apify.js';
import { analizarLead, proveedorDisponible } from './lib/ai.js';
import { generarLeadsDemo } from './lib/demo.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(ROOT, 'public');
// 5070 y no 5060: Chrome bloquea el 5060 por ser puerto reservado de SIP
// (ERR_UNSAFE_PORT). Ver la lista de puertos vetados del navegador.
const PORT = Number(process.env.PORT) || 5070;

loadEnv(ROOT);
initStore(ROOT);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

function leerBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 2_000_000) reject(new Error('Body demasiado grande'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('JSON invalido'));
      }
    });
    req.on('error', reject);
  });
}

function servirEstatico(req, res, pathname) {
  const rel = pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = path.join(PUBLIC_DIR, rel);
  // Evita que un ../ se escape de /public.
  if (!file.startsWith(PUBLIC_DIR)) {
    res.writeHead(403).end('Prohibido');
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('No encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}

// --- Busqueda con progreso en vivo (NDJSON) ------------------------------
// Cada linea es un evento JSON. El front lo lee con un ReadableStream y va
// pintando la barra de progreso, igual que en el video.
async function manejarBusqueda(req, res) {
  const params = await leerBody(req);
  res.writeHead(200, {
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const emitir = (evento) => {
    if (!res.writableEnded) res.write(`${JSON.stringify(evento)}\n`);
  };

  const ajustes = getSettings();
  const conPublicaciones = params.conPublicaciones !== false;
  const presupuesto = estimarCosto(Number(params.limite) || 20);

  try {
    // Alarma de credito: si esta busqueda te dejaria sin saldo, no arranca.
    const credito = resumenCredito();
    if (presupuesto.costoUsd > credito.restanteUsd) {
      emitir({
        tipo: 'error',
        credito,
        texto:
          `Esta búsqueda cuesta US$ ${presupuesto.costoUsd.toFixed(2)} y solo te quedan ` +
          `US$ ${credito.restanteUsd.toFixed(2)} del crédito gratis de este mes. ` +
          `Probá con menos leads (te alcanza para ~${credito.leadsRestantes}) o esperá al ${
            credito.mes.slice(5) === '12' ? 'año que viene' : 'mes que viene'
          }, que se renueva solo.`,
      });
      return res.end();
    }
    if (credito.nivel !== 'ok') {
      emitir({
        tipo: 'aviso',
        texto: `Atención: ya usaste el ${credito.porcentaje}% del crédito gratis de este mes (US$ ${credito.gastadoUsd.toFixed(2)} de US$ 5).`,
      });
    }

    emitir({ tipo: 'fase', fase: 'buscando', texto: 'Buscando perfiles en LinkedIn...' });

    const perfiles = await buscarPerfiles({
      keyword: params.keyword,
      cargos: params.cargos,
      pais: params.pais || ajustes.paisPorDefecto,
      estado: params.estado,
      ciudad: params.ciudad,
      limite: params.limite,
    });

    // Apify ya cobro la pagina aunque no haya devuelto nada, asi que el gasto
    // se registra igual: es la unica forma de que el contador no mienta.
    const credito2 = registrarGasto({
      costoUsd: estimarCosto(perfiles.length || 1).costoUsd,
      leads: perfiles.length,
      keyword: params.keyword || '',
    });
    emitir({ tipo: 'credito', credito: credito2 });

    if (!perfiles.length) {
      emitir({
        tipo: 'fin',
        total: 0,
        aviso: 'La busqueda no devolvio perfiles. Proba con otra palabra clave o una ubicacion mas amplia.',
      });
      return res.end();
    }

    emitir({ tipo: 'perfiles', cantidad: perfiles.length });

    if (conPublicaciones) {
      emitir({ tipo: 'fase', fase: 'publicaciones', texto: 'Trayendo publicaciones recientes...' });
      try {
        const posts = await buscarPublicaciones(perfiles.map((p) => p.linkedinUrl), 3);
        for (const perfil of perfiles) {
          perfil.publicaciones = posts.get(normalizarUrl(perfil.linkedinUrl)) || [];
        }
      } catch (e) {
        // Sin publicaciones el mensaje es menos personal, pero el flujo sigue.
        emitir({ tipo: 'aviso', texto: `No se pudieron traer publicaciones: ${e.message}` });
      }
    }

    emitir({
      tipo: 'fase',
      fase: 'redactando',
      texto: 'Analizando perfiles y redactando mensajes...',
      total: perfiles.length,
    });

    const ahora = new Date().toISOString();
    const listos = [];
    let hechos = 0;
    let errorClave = null;

    // Concurrencia de 3: rapido sin llegar al rate limit de la API.
    const cola = [...perfiles];
    const trabajador = async () => {
      while (cola.length) {
        const perfil = cola.shift();
        let ia = { analisis: '', gancho: '', puntaje: null, mensaje: '' };
        try {
          if (!errorClave) ia = await analizarLead(perfil, ajustes);
        } catch (e) {
          if (e.code === 'MISSING_KEY') errorClave = e.message;
          else emitir({ tipo: 'aviso', texto: `${perfil.nombre}: ${e.message}` });
        }
        listos.push({
          ...perfil,
          ...ia,
          estado: 'nuevo',
          nota: '',
          busqueda: {
            keyword: params.keyword || '',
            cargos: params.cargos || [],
            ubicacion: [params.ciudad, params.estado, params.pais || ajustes.paisPorDefecto]
              .filter(Boolean)
              .join(', '),
          },
          creadoEn: ahora,
          actualizadoEn: ahora,
        });
        hechos++;
        emitir({ tipo: 'avance', hechos, total: perfiles.length, nombre: perfil.nombre });
      }
    };

    await Promise.all([trabajador(), trabajador(), trabajador()]);

    const resumen = upsertLeads(listos);
    if (errorClave) emitir({ tipo: 'aviso', texto: errorClave });
    emitir({ tipo: 'fin', ...resumen, leads: getLeads() });
    res.end();
  } catch (e) {
    emitir({ tipo: 'error', texto: e.message });
    res.end();
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;
  const metodo = req.method;

  try {
    if (!pathname.startsWith('/api/')) return servirEstatico(req, res, pathname);

    if (pathname === '/api/estado' && metodo === 'GET') {
      return json(res, 200, {
        apify: Boolean(process.env.APIFY_TOKEN),
        ia: proveedorDisponible(),
        estados: ESTADOS,
      });
    }

    if (pathname === '/api/settings') {
      if (metodo === 'GET') return json(res, 200, getSettings());
      if (metodo === 'PUT') return json(res, 200, saveSettings(await leerBody(req)));
    }

    if (pathname === '/api/leads' && metodo === 'GET') {
      return json(res, 200, getLeads());
    }

    if (pathname === '/api/costo' && metodo === 'GET') {
      const n = Number(url.searchParams.get('leads')) || 20;
      return json(res, 200, { ...estimarCosto(n), credito: resumenCredito() });
    }

    if (pathname === '/api/credito' && metodo === 'GET') {
      return json(res, 200, resumenCredito());
    }

    if (pathname === '/api/search' && metodo === 'POST') {
      return manejarBusqueda(req, res);
    }

    // Carga perfiles inventados para recorrer la app sin claves ni gasto.
    if (pathname === '/api/demo' && metodo === 'POST') {
      const resumen = upsertLeads(generarLeadsDemo());
      return json(res, 200, { ...resumen, leads: getLeads() });
    }

    if (pathname === '/api/demo' && metodo === 'DELETE') {
      const quedan = getLeads().filter((l) => !l.esDemo);
      return json(res, 200, { leads: saveLeads(quedan) });
    }

    const matchLead = pathname.match(/^\/api\/leads\/(.+)$/);
    if (matchLead) {
      const id = decodeURIComponent(matchLead[1]);

      if (id.endsWith('/regenerar') && metodo === 'POST') {
        const leadId = id.replace(/\/regenerar$/, '');
        const lead = getLeads().find((l) => l.id === leadId);
        if (!lead) return json(res, 404, { error: 'Lead no encontrado' });
        const ia = await analizarLead(lead, getSettings());
        return json(res, 200, updateLead(leadId, ia));
      }

      if (metodo === 'PATCH') {
        const patch = await leerBody(req);
        const permitido = {};
        for (const campo of ['estado', 'nota', 'mensaje', 'analisis', 'puntaje']) {
          if (campo in patch) permitido[campo] = patch[campo];
        }
        const lead = updateLead(id, permitido);
        return lead ? json(res, 200, lead) : json(res, 404, { error: 'Lead no encontrado' });
      }

      if (metodo === 'DELETE') {
        return deleteLead(id)
          ? json(res, 200, { ok: true })
          : json(res, 404, { error: 'Lead no encontrado' });
      }
    }

    json(res, 404, { error: 'Ruta no encontrada' });
  } catch (e) {
    json(res, e.statusCode || 500, { error: e.message, code: e.code });
  }
});

server.listen(PORT, () => {
  const faltantes = [];
  if (!process.env.APIFY_TOKEN) faltantes.push('APIFY_TOKEN');
  if (!proveedorDisponible()) faltantes.push('ANTHROPIC_API_KEY');

  console.log(`\n  ORASIC Lead Hunter  ->  http://localhost:${PORT}\n`);
  if (faltantes.length) {
    console.log(`  Falta configurar en .env: ${faltantes.join(', ')}`);
    console.log('  Copia .env.example a .env y pega tus claves.\n');
  }
});
