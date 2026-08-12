/* =========================================================================
   ORASIC Tour — motor de recorrido guiado, compartido por todas las apps.
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
    let generacion = 0;

    function ubicarGlobo(rect) {
      const margen = 16;
      const ancho = globo.offsetWidth;
      const alto = globo.offsetHeight;

      if (!rect) {
        globo.style.left = (innerWidth - ancho) / 2 + 'px';
        globo.style.top = (innerHeight - alto) / 2 + 'px';
        return;
      }
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
      const miGen = ++generacion;
      indice = Math.max(0, Math.min(i, pasos.length - 1));
      const paso = pasos[indice];
      const vigente = () => generacion === miGen;

      globo.style.opacity = '0';
      if (paso.antes) {
        try {
          await paso.antes(vigente);
        } catch (e) {
          console.warn('[tour]', e);
        }
      }
      if (!vigente()) return;

      let el = null;
      if (!paso.centro && paso.objetivo) {
        el = document.querySelector(paso.objetivo);
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' });
          await esperar(320);
          if (!vigente()) return;
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

      if (paso.durante) {
        Promise.resolve(paso.durante(vigente)).catch(console.warn);
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
      } catch (e) {}
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
    } catch (e) {}
    if (config.autoAbrir !== false && !visto) setTimeout(abrir, config.demora || 700);

    return { abrir, cerrar, mostrar };
  }

  global.OrasicTour = { iniciar };
})(window);