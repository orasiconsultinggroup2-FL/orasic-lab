/* ORASIC Lead Hunter — front */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const estado = {
  leads: [],
  columnas: [],
  cargos: [],
  filtro: '',
  leadAbierto: null,
};

/* ---------------- utilidades ---------------- */

async function api(ruta, opciones = {}) {
  const res = await fetch(ruta, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
    body: opciones.body ? JSON.stringify(opciones.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

let toastTimer;
function toast(texto) {
  const el = $('#toast');
  el.textContent = texto;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 3200);
}

const escapar = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const iniciales = (nombre) =>
  String(nombre || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

function avatarHtml(lead, clase = 'avatar') {
  return lead.foto
    ? `<img class="${clase}" src="${escapar(lead.foto)}" alt="" referrerpolicy="no-referrer"
         onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'${clase}',textContent:'${escapar(iniciales(lead.nombre))}'}))">`
    : `<div class="${clase}">${escapar(iniciales(lead.nombre))}</div>`;
}

/* ---------------- navegacion ---------------- */

$$('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    $$('.tab').forEach((t) => t.classList.toggle('is-active', t === tab));
    $$('.vista').forEach((v) => v.classList.toggle('is-active', v.id === `vista-${tab.dataset.vista}`));
  });
});

function irA(vista) {
  $(`.tab[data-vista="${vista}"]`).click();
}

/* ---------------- estado de claves ---------------- */

async function cargarEstado() {
  const info = await api('/api/estado');
  estado.columnas = info.estados;
  $('#estadoClaves').innerHTML = `
    <span class="chip ${info.apify ? 'ok' : 'mal'}">Apify ${info.apify ? 'conectado' : 'sin clave'}</span>
    <span class="chip ${info.ia ? 'ok' : 'mal'}">IA ${info.ia ? info.ia : 'sin clave'}</span>`;
}

/* ---------------- buscador ---------------- */

function pintarCargos() {
  $('#cajaCargos').innerHTML = estado.cargos
    .map(
      (c, i) =>
        `<span class="etiqueta">${escapar(c)}<button type="button" data-quitar="${i}" aria-label="Quitar">&times;</button></span>`
    )
    .join('');
}

$('#cajaCargos').addEventListener('click', (e) => {
  const i = e.target.dataset.quitar;
  if (i === undefined) return;
  estado.cargos.splice(Number(i), 1);
  pintarCargos();
});

$('#inputCargo').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ',') return;
  e.preventDefault();
  const valor = e.target.value.trim();
  if (valor && !estado.cargos.includes(valor)) {
    estado.cargos.push(valor);
    pintarCargos();
  }
  e.target.value = '';
});

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function pintarCredito(c) {
  if (!c) return;
  estado.credito = c;
  const caja = $('#credito');
  caja.className = `credito ${c.nivel}`;
  $('#creditoMes').textContent = MESES[Number(c.mes.slice(5)) - 1] || c.mes;
  $('#creditoCifras').textContent =
    `US$ ${c.gastadoUsd.toFixed(2)} usados de US$ ${c.limiteUsd.toFixed(2)}`;
  $('#creditoFill').style.width = `${Math.max(c.porcentaje, c.gastadoUsd > 0 ? 2 : 0)}%`;

  const pie = $('#creditoPie');
  if (c.nivel === 'critico') {
    pie.textContent =
      `Queda muy poco: US$ ${c.restanteUsd.toFixed(2)}, unos ${c.leadsRestantes} leads. ` +
      `El crédito se renueva solo el 1 del mes que viene. No te van a cobrar nada.`;
  } else if (c.nivel === 'aviso') {
    pie.textContent =
      `Ya usaste el ${c.porcentaje}%. Te quedan US$ ${c.restanteUsd.toFixed(2)}, ` +
      `unos ${c.leadsRestantes} leads hasta que se renueve.`;
  } else {
    pie.textContent =
      `Te quedan US$ ${c.restanteUsd.toFixed(2)} — alcanzan para unos ${c.leadsRestantes} leads más este mes. ` +
      `Se renueva solo cada mes y no hay tarjeta asociada.`;
  }
}

let costoTimer;
function actualizarCosto() {
  const n = Number($('#inputLimite').value);
  $('#etiquetaLimite').textContent = `${n} leads`;
  clearTimeout(costoTimer);
  costoTimer = setTimeout(async () => {
    try {
      const { costoUsd, paginas, credito } = await api(`/api/costo?leads=${n}`);
      pintarCredito(credito);

      const noAlcanza = credito && costoUsd > credito.restanteUsd;
      $('#btnBuscar').disabled = noAlcanza;
      $('#costoEstimado').textContent = noAlcanza
        ? `US$ ${costoUsd.toFixed(2)} — no te alcanza el crédito. Bajá a ${credito.leadsRestantes} leads o menos.`
        : `Costo: US$ ${costoUsd.toFixed(2)} (${paginas} pág. de 25). ` +
          `Pedí múltiplos de 25 y te rinde el doble: el peaje por página se paga igual.`;
    } catch {
      $('#costoEstimado').textContent = '';
    }
  }, 200);
}
$('#inputLimite').addEventListener('input', actualizarCosto);

function log(texto, esError = false) {
  const li = document.createElement('li');
  li.textContent = texto;
  if (esError) li.className = 'err';
  $('#registro').append(li);
  $('#registro').scrollTop = $('#registro').scrollHeight;
}

$('#formBusqueda').addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  const btn = $('#btnBuscar');

  btn.disabled = true;
  btn.textContent = 'Buscando...';
  $('#progreso').hidden = false;
  $('#registro').innerHTML = '';
  $('#barraFill').style.width = '6%';
  $('#progresoTexto').textContent = 'Conectando con Apify...';

  const inicio = Date.now();
  const reloj = setInterval(() => {
    $('#progresoTiempo').textContent = `${Math.round((Date.now() - inicio) / 1000)}s`;
  }, 1000);

  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword: datos.keyword,
        cargos: estado.cargos,
        pais: datos.pais,
        estado: datos.estado,
        ciudad: datos.ciudad,
        limite: Number(datos.limite),
        conPublicaciones: $('#chkPosts').checked,
      }),
    });

    // El servidor manda NDJSON: una linea = un evento.
    const lector = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await lector.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lineas = buffer.split('\n');
      buffer = lineas.pop();
      for (const linea of lineas) {
        if (linea.trim()) manejarEvento(JSON.parse(linea));
      }
    }
  } catch (err) {
    log(err.message, true);
    toast(err.message);
  } finally {
    clearInterval(reloj);
    btn.disabled = false;
    btn.textContent = 'Buscar leads';
  }
});

function manejarEvento(ev) {
  switch (ev.tipo) {
    case 'fase':
      $('#progresoTexto').textContent = ev.texto;
      $('#barraFill').style.width = ev.fase === 'buscando' ? '12%' : ev.fase === 'publicaciones' ? '30%' : '40%';
      log(ev.texto);
      break;
    case 'perfiles':
      log(`${ev.cantidad} perfiles encontrados`);
      break;
    case 'avance': {
      const pct = 40 + (ev.hechos / ev.total) * 58;
      $('#barraFill').style.width = `${pct}%`;
      $('#progresoTexto').textContent = `Redactando mensajes ${ev.hechos}/${ev.total} — ${ev.nombre}`;
      break;
    }
    case 'credito':
      pintarCredito(ev.credito);
      break;
    case 'aviso':
      log(ev.texto, true);
      break;
    case 'error':
      $('#progresoTexto').textContent = 'La búsqueda falló';
      log(ev.texto, true);
      toast(ev.texto);
      if (ev.credito) pintarCredito(ev.credito);
      break;
    case 'fin':
      $('#barraFill').style.width = '100%';
      if (ev.aviso) {
        $('#progresoTexto').textContent = ev.aviso;
        log(ev.aviso, true);
        return;
      }
      estado.leads = ev.leads || estado.leads;
      pintarKanban();
      $('#progresoTexto').textContent = `Listo: ${ev.agregados} leads nuevos, ${ev.actualizados} actualizados.`;
      log('Búsqueda terminada');
      toast(`${ev.agregados} leads nuevos guardados`);
      if (ev.agregados) setTimeout(() => irA('leads'), 700);
      break;
  }
}

/* ---------------- demo sin claves ---------------- */

$('#btnDemo').addEventListener('click', async (e) => {
  e.target.disabled = true;
  try {
    const res = await api('/api/demo', { method: 'POST' });
    estado.leads = res.leads;
    pintarKanban();
    toast(`${res.agregados || res.actualizados} leads de ejemplo cargados`);
    irA('leads');
  } catch (err) {
    toast(err.message);
  } finally {
    e.target.disabled = false;
  }
});

$('#btnBorrarDemo').addEventListener('click', async () => {
  try {
    const res = await api('/api/demo', { method: 'DELETE' });
    estado.leads = res.leads;
    pintarKanban();
    toast('Leads de ejemplo borrados');
  } catch (err) {
    toast(err.message);
  }
});

/* ---------------- kanban ---------------- */

$('#filtroLeads').addEventListener('input', (e) => {
  estado.filtro = e.target.value.toLowerCase().trim();
  pintarKanban();
});

function coincide(lead) {
  if (!estado.filtro) return true;
  return [lead.nombre, lead.empresa, lead.cargo, lead.titular]
    .join(' ')
    .toLowerCase()
    .includes(estado.filtro);
}

function pintarKanban() {
  $('#contadorLeads').textContent = estado.leads.length;
  $('#leadsVacio').hidden = estado.leads.length > 0;
  $('#kanban').hidden = estado.leads.length === 0;

  const nuevos = estado.leads.filter((l) => (l.estado || 'nuevo') === 'nuevo').length;
  $('#rafagaBannerSub').textContent = nuevos
    ? `${nuevos} lead${nuevos === 1 ? '' : 's'} nuevo${nuevos === 1 ? '' : 's'} listo${nuevos === 1 ? '' : 's'} para contactar.`
    : 'No tenés leads nuevos ahora mismo — hacé una búsqueda o cargá la demo.';

  const visibles = estado.leads.filter(coincide);

  $('#kanban').innerHTML = estado.columnas
    .map((col) => {
      const dentro = visibles.filter((l) => (l.estado || 'nuevo') === col.id);
      return `<div class="columna" data-columna="${col.id}">
        <h2>${escapar(col.label)} <b>${dentro.length}</b></h2>
        <div class="tarjetas">${dentro.map(tarjetaHtml).join('')}</div>
      </div>`;
    })
    .join('');
}

function tarjetaHtml(lead) {
  const p = lead.puntaje;
  const clase = p == null ? 'bajo' : p >= 8 ? 'alto' : p >= 5 ? '' : 'bajo';
  return `<article class="tarjeta" draggable="true" data-id="${escapar(lead.id)}">
    ${avatarHtml(lead)}
    <div style="min-width:0">
      <div class="tarjeta-nombre">${lead.esDemo ? '<span class="badge-demo">demo</span> ' : ''}${escapar(lead.nombre)}
        ${p != null ? `<span class="puntaje ${clase}">${p}/10</span>` : ''}</div>
      <div class="tarjeta-meta">${escapar([lead.cargo, lead.empresa].filter(Boolean).join(' · ') || lead.titular)}</div>
    </div>
  </article>`;
}

let arrastrado = null;

$('#kanban').addEventListener('dragstart', (e) => {
  const tarjeta = e.target.closest('.tarjeta');
  if (!tarjeta) return;
  arrastrado = tarjeta.dataset.id;
  tarjeta.classList.add('arrastrando');
});

$('#kanban').addEventListener('dragend', (e) => {
  e.target.closest('.tarjeta')?.classList.remove('arrastrando');
  $$('.columna').forEach((c) => c.classList.remove('sobre'));
  arrastrado = null;
});

$('#kanban').addEventListener('dragover', (e) => {
  const col = e.target.closest('.columna');
  if (!col || !arrastrado) return;
  e.preventDefault();
  $$('.columna').forEach((c) => c.classList.toggle('sobre', c === col));
});

$('#kanban').addEventListener('drop', async (e) => {
  const col = e.target.closest('.columna');
  if (!col || !arrastrado) return;
  e.preventDefault();
  await cambiarEstado(arrastrado, col.dataset.columna);
});

$('#kanban').addEventListener('click', (e) => {
  const tarjeta = e.target.closest('.tarjeta');
  if (tarjeta) abrirLead(tarjeta.dataset.id);
});

async function cambiarEstado(id, nuevoEstado) {
  const lead = estado.leads.find((l) => l.id === id);
  if (!lead || lead.estado === nuevoEstado) return;
  lead.estado = nuevoEstado;
  pintarKanban();
  try {
    await api(`/api/leads/${encodeURIComponent(id)}`, { method: 'PATCH', body: { estado: nuevoEstado } });
  } catch (err) {
    toast(err.message);
  }
}

/* ---------------- detalle ---------------- */

function abrirLead(id) {
  const lead = estado.leads.find((l) => l.id === id);
  if (!lead) return;
  estado.leadAbierto = lead;

  const publis = lead.publicaciones?.length
    ? lead.publicaciones
        .map(
          (p) =>
            `<div class="publi"><b>${escapar(p.fecha || 'Publicación reciente')}</b>${escapar(p.texto)}</div>`
        )
        .join('')
    : '<p class="costo">No se trajeron publicaciones para este perfil.</p>';

  $('#modalContenido').innerHTML = `
    <div class="perfil">
      ${avatarHtml(lead, 'avatar')}
      <div>
        <h2>${escapar(lead.nombre)} ${lead.puntaje != null ? `<span class="puntaje">${lead.puntaje}/10</span>` : ''}</h2>
        <p>${escapar(lead.titular || lead.cargo)}</p>
        <p>${escapar([lead.empresa, lead.ubicacion].filter(Boolean).join(' · '))}</p>
      </div>
    </div>

    <div class="bloque">
      <h3>Análisis con IA</h3>
      <div class="analisis">
        <p>${escapar(lead.analisis) || '<em>Sin análisis. Probá regenerar.</em>'}</p>
        ${lead.gancho ? `<div class="gancho">Gancho: ${escapar(lead.gancho)}</div>` : ''}
      </div>
    </div>

    <div class="bloque">
      <h3>Últimas publicaciones</h3>
      ${publis}
    </div>

    <div class="bloque">
      <h3>Mensaje listo para enviar</h3>
      <textarea id="mensajeEditor">${escapar(lead.mensaje)}</textarea>
      <div class="botonera">
        <button class="btn btn-primario btn-mini" id="btnCopiar">Copiar mensaje</button>
        <button class="btn btn-suave btn-mini" id="btnAbrirLinkedin">Abrir LinkedIn</button>
        <button class="btn btn-suave btn-mini" id="btnRegenerar">Regenerar</button>
        <select class="btn btn-suave btn-mini estado-select" id="selEstado">
          ${estado.columnas
            .map(
              (c) =>
                `<option value="${c.id}" ${(lead.estado || 'nuevo') === c.id ? 'selected' : ''}>${escapar(c.label)}</option>`
            )
            .join('')}
        </select>
        <button class="btn btn-suave btn-mini" id="btnBorrar">Eliminar</button>
      </div>
    </div>

    <div class="bloque">
      <h3>Nota interna</h3>
      <textarea id="notaEditor" rows="3" placeholder="Qué pasó con este lead...">${escapar(lead.nota)}</textarea>
    </div>`;

  $('#modal').hidden = false;
  cablearModal(lead);
}

function cablearModal(lead) {
  const editor = $('#mensajeEditor');

  // Guardado automatico del mensaje y la nota al salir del campo.
  const guardar = async (campo, valor) => {
    if (lead[campo] === valor) return;
    lead[campo] = valor;
    try {
      await api(`/api/leads/${encodeURIComponent(lead.id)}`, { method: 'PATCH', body: { [campo]: valor } });
    } catch (e) {
      toast(e.message);
    }
  };
  editor.addEventListener('blur', () => guardar('mensaje', editor.value));
  $('#notaEditor').addEventListener('blur', (e) => guardar('nota', e.target.value));

  $('#btnCopiar').addEventListener('click', async () => {
    // Se copia el valor crudo del textarea: conserva los saltos de linea que
    // el usuario haya agregado a mano.
    const texto = editor.value;
    await guardar('mensaje', texto);
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      editor.select();
      document.execCommand('copy');
    }
    toast('Mensaje copiado con sus saltos de línea');
  });

  $('#btnAbrirLinkedin').addEventListener('click', () => {
    window.open(lead.linkedinUrl, '_blank', 'noopener');
  });

  $('#btnRegenerar').addEventListener('click', async (e) => {
    e.target.disabled = true;
    e.target.textContent = 'Regenerando...';
    try {
      const actualizado = await api(`/api/leads/${encodeURIComponent(lead.id)}/regenerar`, { method: 'POST' });
      Object.assign(lead, actualizado);
      abrirLead(lead.id);
      pintarKanban();
      toast('Mensaje regenerado');
    } catch (err) {
      toast(err.message);
      e.target.disabled = false;
      e.target.textContent = 'Regenerar';
    }
  });

  $('#selEstado').addEventListener('change', async (e) => {
    await cambiarEstado(lead.id, e.target.value);
    toast('Estado actualizado');
  });

  $('#btnBorrar').addEventListener('click', async () => {
    if (!confirm(`¿Eliminar a ${lead.nombre} de la base?`)) return;
    await api(`/api/leads/${encodeURIComponent(lead.id)}`, { method: 'DELETE' });
    estado.leads = estado.leads.filter((l) => l.id !== lead.id);
    cerrarModal();
    pintarKanban();
    toast('Lead eliminado');
  });
}

function cerrarModal() {
  $('#modal').hidden = true;
  estado.leadAbierto = null;
}

$('#modal').addEventListener('click', (e) => {
  if (e.target.dataset.cerrar !== undefined) cerrarModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#modal').hidden) cerrarModal();
});

/* ---------------- modo rafaga ----------------
   Recorre los leads "nuevos" uno por uno: un solo atajo copia el mensaje,
   abre LinkedIn y marca "contactado", sin tener que ir y venir del kanban. */

const LIMITE_DIARIO_SUGERIDO = 10;
const CLAVE_CONTADOR_DIARIO = 'rafagaContactosHoy';

function contadorDeHoy() {
  const hoy = new Date().toISOString().slice(0, 10);
  let datos = { fecha: hoy, cantidad: 0 };
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CONTADOR_DIARIO) || 'null');
    if (guardado && guardado.fecha === hoy) datos = guardado;
  } catch {
    /* localStorage no disponible: seguimos en memoria, sin persistir */
  }
  return datos;
}

function sumarContactoHoy() {
  const datos = contadorDeHoy();
  datos.cantidad += 1;
  try {
    localStorage.setItem(CLAVE_CONTADOR_DIARIO, JSON.stringify(datos));
  } catch {
    /* no pasa nada si no se puede guardar: el aviso solo dura la sesion */
  }
  return datos.cantidad;
}

const rafaga = { cola: [], indice: 0, marcados: 0 };

$('#btnRafaga').addEventListener('click', () => {
  rafaga.cola = estado.leads
    .filter((l) => (l.estado || 'nuevo') === 'nuevo')
    .sort((a, b) => (b.puntaje ?? -1) - (a.puntaje ?? -1));
  rafaga.indice = 0;
  rafaga.marcados = 0;
  $('#rafaga').hidden = false;
  document.body.style.overflow = 'hidden';
  pintarRafaga();
});

function cerrarRafaga() {
  $('#rafaga').hidden = true;
  document.body.style.overflow = '';
}

function pintarRafaga() {
  const total = rafaga.cola.length;
  $('#rafagaProgreso').textContent = total ? `${Math.min(rafaga.indice + 1, total)} de ${total}` : '';

  const hoy = contadorDeHoy();
  const aviso = $('#rafagaAviso');
  if (hoy.cantidad >= LIMITE_DIARIO_SUGERIDO) {
    aviso.hidden = false;
    aviso.textContent =
      `Ya marcaste ${hoy.cantidad} contactos hoy. LinkedIn empieza a desconfiar de más que eso por día — ` +
      `podés seguir, pero lo prudente es dejar el resto para mañana.`;
  } else {
    aviso.hidden = true;
  }

  if (!total) {
    $('#rafagaContenido').innerHTML = `
      <div class="rafaga-vacio">
        <h2>No hay leads nuevos para contactar</h2>
        <p>El modo ráfaga solo toma los que están en la columna "Nuevos". Buscá más leads o revisá el kanban.</p>
        <button class="btn btn-primario" data-cerrar-rafaga>Cerrar</button>
      </div>`;
    return;
  }

  if (rafaga.indice >= total) {
    $('#rafagaContenido').innerHTML = `
      <div class="rafaga-fin">
        <h2>🎉 Terminaste la ráfaga</h2>
        <p>Marcaste ${rafaga.marcados} lead${rafaga.marcados === 1 ? '' : 's'} como contactado en esta sesión.</p>
        <button class="btn btn-primario" data-cerrar-rafaga>Cerrar</button>
      </div>`;
    return;
  }

  const lead = rafaga.cola[rafaga.indice];
  $('#rafagaContenido').innerHTML = `
    <div class="rafaga-perfil">
      ${avatarHtml(lead)}
      <div>
        <h2>${escapar(lead.nombre)} ${lead.puntaje != null ? `<span class="puntaje">${lead.puntaje}/10</span>` : ''}</h2>
        <p>${escapar([lead.cargo, lead.empresa].filter(Boolean).join(' · ') || lead.titular)}</p>
      </div>
    </div>
    <div class="rafaga-mensaje">${escapar(lead.mensaje) || '<em>Este lead no tiene mensaje generado.</em>'}</div>
    <button class="btn btn-primario rafaga-btn-grande" id="rafagaEjecutar">
      Copiar, abrir LinkedIn y marcar contactado <kbd>Enter</kbd>
    </button>
    <div class="rafaga-secundarios">
      <button class="btn btn-suave btn-mini" id="rafagaAtras" ${rafaga.indice === 0 ? 'disabled' : ''}>← Anterior <kbd>←</kbd></button>
      <button class="btn btn-suave btn-mini" id="rafagaSaltar">Saltar sin marcar <kbd>→</kbd></button>
    </div>`;

  $('#rafagaEjecutar')?.addEventListener('click', ejecutarAccionRafaga);
  $('#rafagaSaltar')?.addEventListener('click', () => {
    rafaga.indice += 1;
    pintarRafaga();
  });
  $('#rafagaAtras')?.addEventListener('click', () => {
    if (rafaga.indice > 0) rafaga.indice -= 1;
    pintarRafaga();
  });
}

async function ejecutarAccionRafaga() {
  const lead = rafaga.cola[rafaga.indice];
  if (!lead || !lead.mensaje) return;

  try {
    await navigator.clipboard.writeText(lead.mensaje);
  } catch {
    /* portapapeles bloqueado: seguimos igual, LinkedIn se abre igual */
  }
  window.open(lead.linkedinUrl, '_blank', 'noopener');

  lead.estado = 'contactado';
  const cantidadHoy = sumarContactoHoy();
  rafaga.marcados += 1;
  try {
    await api(`/api/leads/${encodeURIComponent(lead.id)}`, { method: 'PATCH', body: { estado: 'contactado' } });
  } catch (err) {
    toast(err.message);
  }
  pintarKanban();

  toast(
    cantidadHoy === LIMITE_DIARIO_SUGERIDO
      ? `Contacto ${cantidadHoy} de hoy — es el número que se recomienda como tope diario.`
      : 'Copiado y marcado. Pegalo en la pestaña de LinkedIn que se abrió.'
  );

  rafaga.indice += 1;
  pintarRafaga();
}

$('#rafaga').addEventListener('click', (e) => {
  if (e.target.dataset.cerrarRafaga !== undefined) cerrarRafaga();
});

document.addEventListener('keydown', (e) => {
  if ($('#rafaga').hidden) return;
  if (e.key === 'Escape') return cerrarRafaga();
  if (rafaga.indice >= rafaga.cola.length) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    ejecutarAccionRafaga();
  } else if (e.key === 'ArrowRight') {
    rafaga.indice += 1;
    pintarRafaga();
  } else if (e.key === 'ArrowLeft' && rafaga.indice > 0) {
    rafaga.indice -= 1;
    pintarRafaga();
  }
});

/* ---------------- exportar ---------------- */

$('#btnExportar').addEventListener('click', () => {
  if (!estado.leads.length) return toast('No hay leads para exportar');
  const cols = ['nombre', 'cargo', 'empresa', 'ubicacion', 'linkedinUrl', 'puntaje', 'estado', 'analisis', 'mensaje', 'nota'];
  const celda = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...estado.leads.map((l) => cols.map((c) => celda(l[c])).join(','))].join('\r\n');

  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `leads-orasic-${new Date().toISOString().slice(0, 10)}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
});

/* ---------------- ajustes ---------------- */

$('#formAjustes').addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  try {
    await api('/api/settings', { method: 'PUT', body: datos });
    $('#avisoAjustes').textContent = 'Guardado.';
    setTimeout(() => ($('#avisoAjustes').textContent = ''), 2500);
    toast('Ajustes guardados');
  } catch (err) {
    toast(err.message);
  }
});

async function cargarAjustes() {
  const ajustes = await api('/api/settings');
  const form = $('#formAjustes');
  for (const [clave, valor] of Object.entries(ajustes)) {
    if (form.elements[clave]) form.elements[clave].value = valor;
  }
  $('#inputPais').value = ajustes.paisPorDefecto || '';
}

/* ---------------- arranque ---------------- */

(async function iniciar() {
  pintarCargos();
  actualizarCosto();
  try {
    await cargarEstado();
    await cargarAjustes();
    estado.leads = await api('/api/leads');
    pintarKanban();
  } catch (e) {
    toast(`No se pudo cargar: ${e.message}`);
  }
})();
