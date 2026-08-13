import fs from 'node:fs';
import path from 'node:path';

// Base de datos = dos archivos JSON en /data. Suficiente para miles de leads y
// no obliga a levantar Postgres ni pagar Supabase.
let DATA_DIR = '';
let LEADS_FILE = '';
let SETTINGS_FILE = '';

// Precargado con los datos reales de ORASIC Lab: el usuario abre la app y ya
// puede buscar sin configurar nada. Todo editable desde la seccion Ajustes.
export const AJUSTES_POR_DEFECTO = {
  nombre: 'Fernando',
  empresa: 'ORASIC Lab',
  cargo: 'Fundador',
  descripcionEmpresa:
    'ORASIC Lab construye aplicaciones a medida con IA para negocios reales en Peru y Colombia: ' +
    'sistemas de reservas, CRMs, paneles de gestion, automatizacion de atencion por WhatsApp y ' +
    'dashboards. Mas de 100 apps construidas en 12 rubros (salud, belleza, retail, deporte, ' +
    'educacion, mineria, ventas B2B, marketing, institucional). Slogan: "Tu negocio, hecho aplicacion".',
  oferta:
    'Un diagnostico gratuito de 20 minutos donde detectamos que parte del negocio se esta perdiendo ' +
    'plata por procesos manuales (agenda en cuaderno, seguimiento por chat, reportes en Excel) y ' +
    'mostramos como quedaria resuelto en una app a medida. Sin costo y sin compromiso. ' +
    'Web: orasic-lab.vercel.app | WhatsApp: +51 999 039 947',
  idiomaMensajes: 'es',
  paisPorDefecto: 'Peru',
  modeloIA: 'claude-sonnet-5',
};

export const ESTADOS = [
  { id: 'nuevo', label: 'Nuevos' },
  { id: 'contactado', label: 'Contactados' },
  { id: 'respondio', label: 'Respondieron' },
  { id: 'sin_respuesta', label: 'Sin respuesta' },
  { id: 'reunion', label: 'Reunion agendada' },
];

export function initStore(rootDir) {
  DATA_DIR = path.join(rootDir, 'data');
  LEADS_FILE = path.join(DATA_DIR, 'leads.json');
  SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
  GASTO_FILE = path.join(DATA_DIR, 'gasto.json');
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LEADS_FILE)) writeJson(LEADS_FILE, []);
  if (!fs.existsSync(SETTINGS_FILE)) writeJson(SETTINGS_FILE, AJUSTES_POR_DEFECTO);
  if (!fs.existsSync(GASTO_FILE)) writeJson(GASTO_FILE, { mes: '', gastadoUsd: 0, busquedas: [] });
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  // Escritura atomica: si el proceso muere a mitad no queda un JSON corrupto.
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

export function getSettings() {
  return { ...AJUSTES_POR_DEFECTO, ...readJson(SETTINGS_FILE, {}) };
}

export function saveSettings(patch) {
  const next = { ...getSettings(), ...patch };
  writeJson(SETTINGS_FILE, next);
  return next;
}

/* ---------- Control del credito gratuito de Apify ----------
   Apify da US$5 de credito por mes. Como no hay tarjeta cargada, pasarse no
   genera un cobro — pero si deja al usuario sin buscar hasta el mes siguiente.
   Llevamos la cuenta local para avisar antes de que eso pase. */

export const LIMITE_MENSUAL_USD = 5;

let GASTO_FILE = '';

const mesActual = () => new Date().toISOString().slice(0, 7); // "2026-08"

export function getCredito() {
  const datos = readJson(GASTO_FILE, {});
  // Al cambiar de mes el credito se renueva solo: arrancamos de cero.
  if (datos.mes !== mesActual()) {
    return { mes: mesActual(), gastadoUsd: 0, busquedas: [] };
  }
  return {
    mes: datos.mes,
    gastadoUsd: Number(datos.gastadoUsd) || 0,
    busquedas: Array.isArray(datos.busquedas) ? datos.busquedas : [],
  };
}

export function resumenCredito() {
  const { mes, gastadoUsd, busquedas } = getCredito();
  const restanteUsd = Math.max(0, LIMITE_MENSUAL_USD - gastadoUsd);
  const porcentaje = Math.min(100, Math.round((gastadoUsd / LIMITE_MENSUAL_USD) * 100));
  // A 0.008 USD por lead cuando se buscan paginas completas de 25.
  const leadsRestantes = Math.floor(restanteUsd / 0.008);
  return {
    mes,
    limiteUsd: LIMITE_MENSUAL_USD,
    gastadoUsd: Number(gastadoUsd.toFixed(3)),
    restanteUsd: Number(restanteUsd.toFixed(3)),
    porcentaje,
    leadsRestantes,
    busquedas: busquedas.slice(-20).reverse(),
    nivel: porcentaje >= 90 ? 'critico' : porcentaje >= 70 ? 'aviso' : 'ok',
  };
}

export function registrarGasto({ costoUsd, leads, keyword }) {
  const actual = getCredito();
  actual.gastadoUsd = Number((actual.gastadoUsd + costoUsd).toFixed(3));
  actual.busquedas.push({
    fecha: new Date().toISOString(),
    costoUsd,
    leads,
    keyword: keyword || '',
  });
  // Guardamos solo las ultimas 200 para que el archivo no crezca sin control.
  actual.busquedas = actual.busquedas.slice(-200);
  writeJson(GASTO_FILE, actual);
  return resumenCredito();
}

export function getLeads() {
  return readJson(LEADS_FILE, []);
}

export function saveLeads(leads) {
  writeJson(LEADS_FILE, leads);
  return leads;
}

// Inserta los leads nuevos y actualiza los que ya existian, sin pisar el estado
// del kanban ni las notas que el usuario ya escribio.
export function upsertLeads(nuevos) {
  const actuales = getLeads();
  const porId = new Map(actuales.map((l) => [l.id, l]));
  let agregados = 0;
  let actualizados = 0;

  for (const lead of nuevos) {
    const previo = porId.get(lead.id);
    if (previo) {
      porId.set(lead.id, {
        ...previo,
        ...lead,
        estado: previo.estado,
        nota: previo.nota,
        mensaje: lead.mensaje || previo.mensaje,
        creadoEn: previo.creadoEn,
        actualizadoEn: new Date().toISOString(),
      });
      actualizados++;
    } else {
      porId.set(lead.id, lead);
      agregados++;
    }
  }

  const lista = [...porId.values()].sort(
    (a, b) => new Date(b.creadoEn) - new Date(a.creadoEn)
  );
  saveLeads(lista);
  return { agregados, actualizados, total: lista.length };
}

export function updateLead(id, patch) {
  const leads = getLeads();
  const i = leads.findIndex((l) => l.id === id);
  if (i === -1) return null;
  leads[i] = { ...leads[i], ...patch, actualizadoEn: new Date().toISOString() };
  saveLeads(leads);
  return leads[i];
}

export function deleteLead(id) {
  const leads = getLeads();
  const next = leads.filter((l) => l.id !== id);
  saveLeads(next);
  return leads.length !== next.length;
}
