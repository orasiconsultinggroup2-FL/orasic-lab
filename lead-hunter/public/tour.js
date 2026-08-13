/* Tour guiado: recorre la app señalando cada parte con un globo.
   Se abre solo la primera vez y despues desde el boton "Ver tour". */

(function () {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  // Cada paso apunta a un elemento real. `antes` prepara la pantalla
  // (cambiar de pestaña, cargar la demo, abrir una tarjeta) antes de señalar.
  const PASOS = [
    {
      titulo: 'Bienvenido a Lead Hunter',
      texto:
        'En 2 minutos te muestro para qué sirve cada parte. La app hace tres cosas: <b>busca</b> gente en LinkedIn, <b>analiza</b> quién es cada uno, y <b>escribe</b> un mensaje distinto para cada persona.<br><br>Podés salir cuando quieras con <b>Saltar</b>.',
      centro: true,
    },
    {
      objetivo: '.tabs',
      titulo: 'Las cuatro pestañas',
      texto:
        '<b>Buscar</b> es donde pedís los leads.<br><b>Leads</b> es tu tablero de seguimiento.<br><b>Ajustes</b> es quién sos vos y qué vendés.<br><b>Manual</b> es la explicación escrita completa.',
      antes: () => irAVista('buscar'),
    },
    {
      objetivo: '#formBusqueda .campo:first-child',
      titulo: '1. A qué rubro le vendés',
      texto:
        'Acá va <b>lo que hace el negocio del cliente que buscás</b>, no lo que hacés vos.<br><br>Ejemplos: <i>clinica dental</i>, <i>gimnasio</i>, <i>agencia de marketing</i>.<br><br>Una sola idea. Si ponés tres cosas juntas, LinkedIn no encuentra a nadie.',
    },
    {
      objetivo: '#inputCargo',
      titulo: '2. A quién le escribís dentro de ese negocio',
      texto:
        'Escribís un cargo y apretás <b>Enter</b>; queda como etiqueta. Podés poner varios: Fundador, Gerente General, Dueño.<br><br>Apuntá siempre a <b>quien decide y firma</b>. Escribirle a un empleado es perder el mensaje.',
    },
    {
      objetivo: '#inputPais',
      titulo: '3. Dónde están',
      texto:
        'Empezá poniendo solo el <b>país</b> y dejá región y ciudad vacías. Si te trae demasiada gente que no sirve, ahí sí achicás a una ciudad.<br><br>Al revés no funciona: si arrancás muy específico, no aparece nadie.',
    },
    {
      objetivo: '#inputLimite',
      titulo: '4. Cuántos traer — y cuánto cuesta',
      texto:
        'Movés la barra y <b>abajo del botón te dice cuánto va a costar antes de gastar nada</b>.<br><br>Empezá con 10. En serio: el problema nunca es conseguir leads, es escribirle bien a los que ya tenés.',
    },
    {
      objetivo: '#btnBuscar',
      titulo: '5. Buscar',
      texto:
        'Al apretarlo vas viendo el progreso en vivo: busca los perfiles → lee sus últimas publicaciones → escribe un mensaje para cada uno.<br><br>Con 20 leads tarda unos 3 minutos. <b>Esto sí necesita las dos claves gratis</b> (están explicadas en el Manual).',
    },
    {
      objetivo: '#credito',
      titulo: 'La alarma del crédito',
      texto:
        'Esta barra lleva la cuenta sola de los US$ 5 gratis del mes: cuánto gastaste, cuánto queda y para cuántos leads más alcanza.<br><br>Si una búsqueda te dejaría sin saldo, <b>el botón se bloquea antes de gastar</b>. Y el 1 de cada mes se reinicia solo.',
    },
    {
      objetivo: '.demo-caja',
      titulo: 'Pero hoy no necesitás claves',
      texto:
        'Este botón carga <b>6 perfiles de ejemplo inventados</b>, con su análisis y su mensaje ya escritos. No busca nada en LinkedIn y no gasta un centavo.<br><br>Es lo que vamos a usar ahora para que veas el resto.',
    },
    {
      objetivo: '#btnRafaga',
      titulo: 'Modo ráfaga — el atajo del día a día',
      texto:
        'Este botón toma todos los leads "Nuevos", ordenados por puntaje, y te lleva de uno en uno.<br><br>Con la tecla <b>Enter</b> copiás el mensaje, se abre LinkedIn y el lead pasa solo a "Contactado". <b>→</b> salta sin marcar, <b>←</b> vuelve atrás, <b>Esc</b> sale.<br><br>Es lo más parecido a automático sin tocar el límite de LinkedIn: vos seguís pegando el mensaje a mano, pero todo lo demás es un solo toque de tecla.',
    },
    {
      objetivo: '#kanban',
      titulo: 'Tu tablero de seguimiento',
      texto:
        'Cada persona es una tarjeta y cada columna es una etapa:<br><br><b>Nuevos → Contactados → Respondieron → Reunión agendada</b><br><br><b>Arrastrás las tarjetas con el mouse</b> de una columna a otra. Ese arrastre es todo tu seguimiento: si no lo movés, en dos semanas no sabés a quién le escribiste.',
      antes: async () => {
        await cargarDemoSiHaceFalta();
        irAVista('leads');
        await esperar(350);
      },
    },
    {
      objetivo: '.kanban .tarjeta',
      titulo: 'El número al lado del nombre',
      texto:
        'Ese <b>9/10</b> es qué tan buen cliente sería esta persona para vos, según la IA.<br><br>Empezá siempre por los de 8 y 9: son los que ya publicaron en LinkedIn el problema que vos resolvés.<br><br>Ahora la abrimos.',
    },
    {
      objetivo: '.analisis',
      titulo: 'Qué entendió la IA de esta persona',
      texto:
        'Leyó su perfil y sus últimas publicaciones, y te resume <b>quién es, qué le duele y por qué te conviene</b>.<br><br>Abajo, el <b>gancho</b>: el dato exacto que usó para personalizar el mensaje.',
      antes: async () => {
        abrirPrimeraTarjeta();
        await esperar(300);
      },
    },
    {
      objetivo: '#mensajeEditor',
      titulo: 'El mensaje, listo para enviar',
      texto:
        'Está escrito para <b>esta persona en particular</b>, mencionando algo real de su perfil.<br><br><b>Es editable</b> y lo que cambies se guarda solo. Si no te gusta, el botón <b>Regenerar</b> pide otro.',
    },
    {
      objetivo: '#btnCopiar',
      titulo: 'Cómo se envía de verdad',
      texto:
        '<b>1.</b> Leelo completo. Nunca envíes sin leer.<br><b>2.</b> <b>Copiar mensaje</b>.<br><b>3.</b> <b>Abrir LinkedIn</b> → botón Mensaje → pegás → enviás.<br><b>4.</b> Volvés y arrastrás la tarjeta a <i>Contactados</i>.<br><br>La app <b>no envía sola</b>, y está bien que así sea: LinkedIn restringe las cuentas que mandan en masa. <b>Máximo 5 a 10 por día.</b>',
    },
    {
      objetivo: '#formAjustes [name="oferta"]',
      titulo: 'Lo que más cambia los mensajes',
      texto:
        'De acá sale el tono de todo. El campo <b>Oferta</b> es el más importante: es lo que le proponés al lead en el primer contacto.<br><br><i>«Un diagnóstico gratuito de 20 minutos»</i> funciona mucho mejor que <i>«servicios de software»</i>.<br><br>Ya viene cargado con los datos de ORASIC Lab.',
      antes: async () => {
        cerrarModalSiAbierto();
        irAVista('ajustes');
        await esperar(350);
      },
    },
    {
      objetivo: '#estadoClaves',
      titulo: 'Tus dos llaves',
      texto:
        'Cuando estén las dos en <b>verde</b>, podés buscar de verdad. Las dos son <b>gratis y ninguna pide tarjeta</b>:<br><br><b>Gemini</b> escribe los mensajes.<br><b>Apify</b> entra a LinkedIn.<br><br>Cómo sacarlas, paso a paso, está en el Manual.',
    },
    {
      titulo: 'Eso es todo',
      texto:
        'Tenés el <b>Manual</b> arriba con todo esto por escrito, más qué hacer si algo falla.<br><br>Para repetir este tour, el botón <b>Ver tour</b> arriba a la derecha.<br><br>Los leads de ejemplo los sacás con <b>Borrar demo</b>, en la pestaña Buscar.',
      centro: true,
      antes: async () => {
        irAVista('manual');
        await esperar(300);
      },
    },
  ];

  /* ---------- ayudas que tocan la app ---------- */

  function irAVista(nombre) {
    document.querySelector(`.tab[data-vista="${nombre}"]`)?.click();
  }

  async function cargarDemoSiHaceFalta() {
    const hay = document.querySelector('.kanban .tarjeta');
    if (hay) return;
    document.querySelector('#btnDemo')?.click();
    for (let i = 0; i < 30 && !document.querySelector('.kanban .tarjeta'); i++) {
      await esperar(100);
    }
  }

  function abrirPrimeraTarjeta() {
    if (!document.querySelector('#modal').hidden) return;
    document.querySelector('.kanban .tarjeta')?.click();
  }

  function cerrarModalSiAbierto() {
    const modal = document.querySelector('#modal');
    if (modal && !modal.hidden) modal.querySelector('.modal-cerrar')?.click();
  }

  /* ---------- capa del tour ---------- */

  let indice = 0;
  let activo = false;
  const capa = document.createElement('div');
  capa.className = 'tour';
  capa.hidden = true;
  capa.innerHTML = `
    <div class="tour-foco" id="tourFoco"></div>
    <div class="tour-globo" id="tourGlobo">
      <div class="tour-paso" id="tourPaso"></div>
      <h3 id="tourTitulo"></h3>
      <div id="tourTexto"></div>
      <div class="tour-pie">
        <button type="button" class="tour-saltar" id="tourSaltar">Saltar</button>
        <div class="tour-nav">
          <button type="button" class="btn btn-suave btn-mini" id="tourAtras">Atrás</button>
          <button type="button" class="btn btn-primario btn-mini" id="tourSig">Siguiente</button>
        </div>
      </div>
    </div>`;
  document.body.append(capa);

  const foco = capa.querySelector('#tourFoco');
  const globo = capa.querySelector('#tourGlobo');

  function ubicarGlobo(rect) {
    const margen = 16;
    const ancho = globo.offsetWidth;
    const alto = globo.offsetHeight;

    if (!rect) {
      globo.style.left = `${(innerWidth - ancho) / 2}px`;
      globo.style.top = `${(innerHeight - alto) / 2}px`;
      return;
    }

    // Debajo del elemento si entra; si no, arriba; si tampoco, al costado.
    let top = rect.bottom + margen;
    if (top + alto > innerHeight - 10) top = rect.top - alto - margen;
    if (top < 10) top = Math.max(10, Math.min(rect.top, innerHeight - alto - 10));

    let left = rect.left + rect.width / 2 - ancho / 2;
    left = Math.max(12, Math.min(left, innerWidth - ancho - 12));

    globo.style.left = `${left}px`;
    globo.style.top = `${top}px`;
  }

  function iluminar(el) {
    if (!el) {
      // Sin objetivo: el recuadro se encoge a nada en el centro, pero su sombra
      // sigue oscureciendo toda la pantalla.
      foco.style.borderColor = 'transparent';
      foco.style.left = `${innerWidth / 2}px`;
      foco.style.top = `${innerHeight / 2}px`;
      foco.style.width = '0px';
      foco.style.height = '0px';
      ubicarGlobo(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const p = 8;
    foco.style.borderColor = 'var(--violeta)';
    foco.style.left = `${r.left - p}px`;
    foco.style.top = `${r.top - p}px`;
    foco.style.width = `${r.width + p * 2}px`;
    foco.style.height = `${r.height + p * 2}px`;
    ubicarGlobo(r);
  }

  async function mostrar(i) {
    indice = Math.max(0, Math.min(i, PASOS.length - 1));
    const paso = PASOS[indice];

    globo.style.opacity = '0';
    if (paso.antes) await paso.antes();

    let el = paso.centro ? null : document.querySelector(paso.objetivo);
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      await esperar(320);
      // El scroll pudo mover el elemento: lo volvemos a medir.
      el = document.querySelector(paso.objetivo);
    }

    capa.querySelector('#tourPaso').textContent = `Paso ${indice + 1} de ${PASOS.length}`;
    capa.querySelector('#tourTitulo').textContent = paso.titulo;
    capa.querySelector('#tourTexto').innerHTML = paso.texto;
    capa.querySelector('#tourAtras').disabled = indice === 0;
    capa.querySelector('#tourSig').textContent =
      indice === PASOS.length - 1 ? 'Terminar' : 'Siguiente';

    iluminar(el);
    globo.style.opacity = '1';
  }

  function abrir() {
    activo = true;
    capa.hidden = false;
    document.body.style.overflow = 'hidden';
    mostrar(0);
  }

  function cerrar() {
    activo = false;
    capa.hidden = true;
    document.body.style.overflow = '';
    localStorage.setItem('tourVisto', '1');
  }

  capa.querySelector('#tourSig').addEventListener('click', () => {
    if (indice === PASOS.length - 1) cerrar();
    else mostrar(indice + 1);
  });
  capa.querySelector('#tourAtras').addEventListener('click', () => mostrar(indice - 1));
  capa.querySelector('#tourSaltar').addEventListener('click', cerrar);

  document.addEventListener('keydown', (e) => {
    if (!activo) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowRight') capa.querySelector('#tourSig').click();
    if (e.key === 'ArrowLeft' && indice > 0) mostrar(indice - 1);
  });

  addEventListener('resize', () => {
    if (!activo) return;
    const paso = PASOS[indice];
    iluminar(paso.centro ? null : document.querySelector(paso.objetivo));
  });

  document.querySelector('#btnTour')?.addEventListener('click', abrir);

  // Primera visita: se abre solo, pero con un respiro para que cargue todo.
  if (!localStorage.getItem('tourVisto')) setTimeout(abrir, 700);
})();
