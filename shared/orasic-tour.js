/* =========================================================================
   ORASIC Tour — motor de recorrido guiado, compartido por todas las apps.
   =========================================================================

   Sin dependencias. Se puede pegar tal cual dentro de un bloque de script si
   la app es de un solo archivo, o cargarse como archivo suelto.

   Uso:

     OrasicTour.iniciar({
       clave: 'tourMiApp',          // identificador en localStorage
       boton: '#btnTour',           // selector del boton "Ver tour" (opcional)
       autoAbrir: true,             // se abre solo la primera visita
       tema: { acento: '#A78BFA', fondo: '#0F131C', texto: '#E7ECF5' },
       pasos: [
         { titulo, texto, centro: true },
         { titulo, texto, objetivo: '#algo', antes: async () => {...} },
       ],
     });

   Cada paso:
     titulo   — encabezado del globo
     texto    — HTML permitido (<b>, <i>, <br>)
     objetivo — selector CSS del elemento a iluminar
     centro   — true: sin objetivo, el globo va al medio de la pantalla
     antes    — funcion (puede ser async) que prepara la pantalla antes de
                señalar: cambiar de seccion, cargar datos de ejemplo, abrir
                un detalle. Es lo que hace que el tour *opere* la app en vez
                de solo describirla.
   ========================================================================= */

(function (global) {
  'use strict';

  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  const TEMA_POR_DEFECTO = {
    acento: '#A78BFA',
    acento2: '#22D3EE',
    fondo: '#0F131C',
    texto: '#E7ECF5',
    textoSuave: '#8B97AB',
    velo: 'rgba(4, 6, 10, .82)',
  };

  function inyectarEstilos(tema) {
    if (document.getElementById('orasic-tour-css')) return;
    const css = `
.otour { position: fixed; inset: 0; z-index: 2147483000; }
.otour[hidden] { display: none !important; }
.otour-foco {
  position: absolute; border-radius: 12px;
  box-shadow: 0 0 0 9999px ${tema.velo};
  border: 2px solid ${tema.acento};
  transition: all .35s cubic-bezier(.4,0,.2,1);
  pointer-events: none;
}
.otour-globo {
  position: absolute; width: min(400px, calc(100vw - 24px));
  background: ${tema.fondo}; color: ${tema.texto};
  border: 1px solid ${tema.acento}; border-radius: 16px;
  padding: 20px 22px; box-shadow: 0 20px 60px rgba(0,0,0,.55);
  font: 14px/1.6 ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif;
  transition: opacity .2s, left .35s cubic-bezier(.4,0,.2,1), top .35s cubic-bezier(.4,0,.2,1);
}
.otour-contador {
  font-size: 11px; text-transform: uppercase; letter-spacing: .08em;
  color: ${tema.acento2}; margin-bottom: 7px;
}
.otour-globo h3 { margin: 0 0 10px; font-size: 17px; line-height: 1.3; color: ${tema.texto}; }
.otour-texto { color: ${tema.textoSuave}; }
.otour-texto b { color: ${tema.texto}; }
.otour-pie { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; }
.otour-nav { display: flex; gap: 8px; }
.otour-btn {
  border: 0; border-radius: 9px; padding: 8px 16px;
  font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
}
.otour-btn-1 { background: ${tema.acento}; color: #07101A; }
.otour-btn-2 { background: transparent; color: ${tema.texto}; border: 1px solid ${tema.acento}; }
.otour-btn:disabled { opacity: .4; cursor: not-allowed; }
.otour-saltar { background: none; border: 0; color: ${tema.textoSuave}; font: inherit; font-size: 13px; cursor: pointer; padding: 0; }
.otour-saltar:hover { color: ${tema.texto}; }
@media (max-width: 720px) { .otour-globo { padding: 16px 18px; } .otour-globo h3 { font-size: 15px; } }`;
    const el = document.createElement('style');
    el.id = 'orasic-tour-css';
    el.textContent = css;
    document.head.append(el);
  }

  let temaActivo = TEMA_POR_DEFECTO;

  function iniciar(config) {
    const pasos = config.pasos || [];
    if (!pasos.length) return null;

    const clave = config.clave || 'orasicTourVisto';
    const tema = Object.assign({}, TEMA_POR_DEFECTO, config.tema || {});
    temaActivo = tema;
    inyectarEstilos(tema);

    const capa = document.createElement('div');
    capa.className = 'otour';
    capa.hidden = true;
    capa.innerHTML =
      '<div class="otour-foco"></div>' +
      '<div class="otour-globo">' +
      '<div class="otour-contador"></div>' +
      '<h3></h3><div class="otour-texto"></div>' +
      '<div class="otour-pie">' +
      '<button type="button" class="otour-saltar">Saltar</button>' +
      '<div class="otour-nav">' +
      '<button type="button" class="otour-btn otour-btn-2 otour-atras">Atrás</button>' +
      '<button type="button" class="otour-btn otour-btn-1 otour-sig">Siguiente</button>' +
      '</div></div></div>';
    document.body.append(capa);

    const foco = capa.querySelector('.otour-foco');
    const globo = capa.querySelector('.otour-globo');
    const btnSig = capa.querySelector('.otour-sig');
    const btnAtras = capa.querySelector('.otour-atras');

    let indice = 0;
    let activo = false;
    let generacion = 0; // se incrementa en cada mostrar(): cancela animaciones del paso anterior

    function ubicarGlobo(rect) {
      const margen = 16;
      const ancho = globo.offsetWidth;
      const alto = globo.offsetHeight;

      if (!rect) {
        globo.style.left = (innerWidth - ancho) / 2 + 'px';
        globo.style.top = (innerHeight - alto) / 2 + 'px';
        return;
      }
      // Debajo del elemento si entra; si no, arriba; si tampoco, donde quepa.
      let top = rect.bottom + margen;
      if (top + alto > innerHeight - 10) top = rect.top - alto - margen;
      if (top < 10) top = Math.max(10, Math.min(rect.top, innerHeight - alto - 10));

      let left = rect.left + rect.width / 2 - ancho / 2;
      left = Math.max(12, Math.min(left, innerWidth - ancho - 12));

      globo.style.left = left + 'px';
      globo.style.top = top + 'px';
    }

    function iluminar(el) {
      if (!el) {
        // Sin objetivo: el recuadro se encoge a nada en el centro, pero su
        // sombra sigue oscureciendo toda la pantalla.
        foco.style.borderColor = 'transparent';
        foco.style.left = innerWidth / 2 + 'px';
        foco.style.top = innerHeight / 2 + 'px';
        foco.style.width = '0px';
        foco.style.height = '0px';
        ubicarGlobo(null);
        return;
      }
      const r = el.getBoundingClientRect();
      const p = 8;
      foco.style.borderColor = tema.acento;
      foco.style.left = r.left - p + 'px';
      foco.style.top = r.top - p + 'px';
      foco.style.width = r.width + p * 2 + 'px';
      foco.style.height = r.height + p * 2 + 'px';
      ubicarGlobo(r);
    }

    async function mostrar(i) {
      const miGen = ++generacion; // todo lo que dependia de la generacion anterior se corta
      indice = Math.max(0, Math.min(i, pasos.length - 1));
      const paso = pasos[indice];
      const vigente = () => generacion === miGen;

      globo.style.opacity = '0';
      if (paso.antes) {
        try {
          await paso.antes(vigente);
        } catch (e) {
          console.warn('[tour] falló la preparación del paso', indice + 1, e);
        }
      }
      if (!vigente()) return; // el usuario ya avanzo a otro paso mientras esperabamos

      let el = null;
      if (!paso.centro && paso.objetivo) {
        el = document.querySelector(paso.objetivo);
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' });
          await esperar(320);
          if (!vigente()) return;
          // El scroll pudo mover el elemento: lo volvemos a medir.
          el = document.querySelector(paso.objetivo);
        }
      }

      capa.querySelector('.otour-contador').textContent =
        'Paso ' + (indice + 1) + ' de ' + pasos.length;
      capa.querySelector('h3').textContent = paso.titulo || '';
      capa.querySelector('.otour-texto').innerHTML = paso.texto || '';
      btnAtras.disabled = indice === 0;
      btnSig.textContent = indice === pasos.length - 1 ? 'Terminar' : 'Siguiente';

      iluminar(el);
      globo.style.opacity = '1';

      // "durante" corre EN PARALELO a que el usuario lee el texto — es lo que
      // permite ver un formulario llenarse solo mientras el globo explica,
      // en vez de tener que elegir entre mostrar el texto o la animacion.
      if (paso.durante) {
        Promise.resolve(paso.durante(vigente)).catch((e) =>
          console.warn('[tour] fallo la animacion del paso', indice + 1, e)
        );
      }
    }

    function abrir() {
      if (activo) return;
      activo = true;
      capa.hidden = false;
      document.body.style.overflow = 'hidden';
      if (config.alAbrir) config.alAbrir();
      mostrar(0);
    }

    function cerrar() {
      if (!activo) return;
      activo = false;
      capa.hidden = true;
      document.body.style.overflow = '';
      try {
        localStorage.setItem(clave, '1');
      } catch (e) {
        /* modo incognito: no pasa nada, el tour se volvera a abrir */
      }
      // Deja limpio lo que el tour haya preparado (datos de ejemplo, vistas).
      if (config.alCerrar) config.alCerrar();
    }

    btnSig.addEventListener('click', () => {
      if (indice === pasos.length - 1) cerrar();
      else mostrar(indice + 1);
    });
    btnAtras.addEventListener('click', () => mostrar(indice - 1));
    capa.querySelector('.otour-saltar').addEventListener('click', cerrar);

    document.addEventListener('keydown', (e) => {
      if (!activo) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') btnSig.click();
      if (e.key === 'ArrowLeft' && indice > 0) mostrar(indice - 1);
    });

    addEventListener('resize', () => {
      if (!activo) return;
      const paso = pasos[indice];
      iluminar(paso.centro ? null : document.querySelector(paso.objetivo));
    });

    if (config.boton) {
      // Delegado en document: asi tambien funciona en botones que el framework
      // monta despues (por ejemplo el menu mobile de React).
      document.addEventListener('click', (e) => {
        if (e.target.closest && e.target.closest(config.boton)) {
          e.preventDefault();
          abrir();
        }
      });
    }

    let visto = false;
    try {
      visto = Boolean(localStorage.getItem(clave));
    } catch (e) {
      /* sin localStorage: se comporta como primera visita */
    }
    if (config.autoAbrir !== false && !visto) setTimeout(abrir, config.demora || 700);

    return { abrir, cerrar, mostrar };
  }

  /* ---------- Escritura animada en un campo ----------
     Tipea texto letra por letra en un input/textarea, como si alguien lo
     estuviera llenando en vivo. Dispara los eventos nativos de input/change
     para que frameworks como React (que escuchan onChange) tambien lo vean.
     Uso tipico dentro de un paso `antes`: primero se ilumina el campo con
     `objetivo`, y en `antes` se llama a este helper para que se escriba
     mientras el globo explica que es. */
  const inputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  const textareaSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;

  function fijarValorNativo(el, texto) {
    const setter = el.tagName === 'TEXTAREA' ? textareaSetter : inputSetter;
    setter.call(el, texto);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // date, datetime-local y number no aceptan bien un valor letra por letra
  // (el navegador rechaza los estados intermedios invalidos) — en esos se
  // pone el valor final directo, con un resalte breve en vez de tipeo.
  const TIPOS_SIN_TIPEO = new Set(['date', 'datetime-local', 'time', 'number']);

  async function escribir(el, texto, opciones = {}) {
    if (!el) return;
    const vigente = opciones.vigente || (() => true);
    const cps = opciones.cps || 22; // caracteres por segundo

    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    el.focus();

    if (TIPOS_SIN_TIPEO.has(el.type)) {
      const sombraPrevia = el.style.boxShadow;
      el.style.transition = 'box-shadow .2s';
      el.style.boxShadow = `0 0 0 3px ${temaActivo.acento}55`;
      fijarValorNativo(el, texto);
      await esperar(350);
      if (vigente()) el.style.boxShadow = sombraPrevia;
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    fijarValorNativo(el, '');
    let acumulado = '';
    for (const letra of String(texto)) {
      if (!vigente()) return; // el usuario ya avanzo: cortamos para no pisar el paso siguiente
      acumulado += letra;
      fijarValorNativo(el, acumulado);
      // Variacion leve de ritmo: se ve mas humano que un tipeo perfectamente parejo.
      await esperar(1000 / cps + Math.random() * 25);
    }
    el.dispatchEvent(new Event('change', { bubbles: true }));
    await esperar(200);
  }

  async function seleccionar(el, valor, opciones = {}) {
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    el.focus();
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    if (setter) setter.call(el, valor);
    else el.value = valor;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    await esperar(opciones.pausaMs ?? 300);
  }

  global.OrasicTour = { iniciar, escribir, seleccionar };
})(window);
