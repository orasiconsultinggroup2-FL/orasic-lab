/* Pasos del tour de Trazabilidad de Licitaciones (ColinaNet). */
(function () {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  // cargarDatosEjemplo() pregunta y avisa con ventanas del navegador. Durante
  // el tour eso corta el hilo, asi que las silenciamos solo por ese instante.
  async function cargarEjemploSilencioso() {
    if (document.querySelector('#tbody-licitaciones tr td button')) return;
    if (typeof cargarDatosEjemplo !== 'function') return;
    const alertOriginal = window.alert;
    const confirmOriginal = window.confirm;
    window.alert = () => {};
    window.confirm = () => true;
    try {
      cargarDatosEjemplo();
    } finally {
      window.alert = alertOriginal;
      window.confirm = confirmOriginal;
    }
    await esperar(250);
  }

  function cerrarModales() {
    document.querySelectorAll('.modal').forEach((m) => (m.style.display = 'none'));
  }

  window.iniciarTourLicitaciones = function () {
    return OrasicTour.iniciar({
      clave: 'tourLicitacionesVisto',
      boton: '#btn-tour',
      tema: {
        acento: '#2E5C8A',
        acento2: '#1B3A5C',
        fondo: '#ffffff',
        texto: '#1B3A5C',
        textoSuave: '#5a6b7d',
        velo: 'rgba(20, 35, 50, .72)',
      },
      pasos: [
        {
          centro: true,
          titulo: 'Bienvenido al control de licitaciones',
          texto:
            'En 2 minutos te muestro cada parte. El sistema resuelve una sola pregunta, la que cuesta plata: <b>¿qué documento me falta y para cuándo?</b><br><br>Podés salir cuando quieras con <b>Saltar</b>.',
        },
        {
          objetivo: '.stats',
          titulo: 'Los cinco números de arriba',
          texto:
            'Es el tablero del día. El que más importa es el último, <b>Documentos por Vencer</b>: si ese número no está en cero, hay algo que atender hoy.<br><br><b>Valor Total en Juego</b> es la suma de todo lo que estás disputando ahora mismo.',
        },
        {
          objetivo: '#modal-nueva .modal-contenido',
          titulo: 'Así se registra una licitación',
          texto:
            'Mirá cómo se completa un proceso real — no toques nada, es solo para que lo veas.<br><br>Código OSCE, nombre, entidad y valor.',
          antes: async () => {
            if (typeof abrirModalNuevaLicitacion === 'function') abrirModalNuevaLicitacion();
            await esperar(250);
          },
          durante: async (vigente) => {
            await OrasicTour.escribir(document.getElementById('codigo'), 'AS-SM-4-2026-MPT/1', { vigente });
            if (!vigente()) return;
            await OrasicTour.escribir(document.getElementById('nombre'), 'Mantenimiento de vías urbanas — Zona Norte', { vigente });
            if (!vigente()) return;
            await OrasicTour.escribir(document.getElementById('entidad'), 'Municipalidad Provincial de Trujillo', { vigente });
            if (!vigente()) return;
            await OrasicTour.escribir(document.getElementById('valor'), '285000', { vigente });
          },
        },
        {
          objetivo: '#modal-nueva .modal-contenido',
          titulo: 'La fecha de cierre es la que manda',
          texto:
            'De ahí sale la cuenta regresiva y las alertas de vencimiento. Le sumamos las fechas y el responsable, y guardamos de verdad para que la veas aparecer en la tabla.',
          durante: async (vigente) => {
            const hoyStr = new Date().toISOString().split('T')[0];
            const cierre = new Date();
            cierre.setDate(cierre.getDate() + 25);
            await OrasicTour.escribir(document.getElementById('fecha-publicacion'), hoyStr, { vigente });
            if (!vigente()) return;
            await OrasicTour.escribir(
              document.getElementById('fecha-cierre'),
              cierre.toISOString().slice(0, 16),
              { vigente }
            );
            if (!vigente()) return;
            await OrasicTour.escribir(document.getElementById('responsable'), 'Juan Pérez', { vigente });
            if (!vigente()) return;
            await esperar(400);
            if (!vigente()) return;
            // Guardamos de verdad: esta app vive en localStorage del navegador,
            // no hay ningun backend real detras — es un ejemplo tan seguro como
            // los que ya carga "Cargar Ejemplo".
            const alertOriginal = window.alert;
            window.alert = () => {};
            document.querySelector('#form-nueva-licitacion button[type="submit"]')?.click();
            await esperar(150);
            window.alert = alertOriginal;
          },
        },
        {
          objetivo: '#tbody-licitaciones tr:last-child',
          titulo: 'Ahí está, ya en la tabla',
          texto:
            'Apenas guardás, el proceso aparece en la lista con estado <b>En Estudio</b> y su barra de avance en 0%.<br><br>A partir de acá le vas sumando documentos y moviéndola de estado a medida que avanza.',
        },
        {
          objetivo: '#tabla-licitaciones',
          titulo: 'Todo lo que tenés en juego',
          texto:
            'Cada fila es una licitación, con su estado y su barra de <b>avance documental</b> — qué porcentaje del expediente ya está listo.<br><br>Acabo de cargar tres ejemplos para que veas cómo se ve funcionando.',
          antes: cargarEjemploSilencioso,
        },
        {
          objetivo: '.filtros',
          titulo: 'Cuando ya tengas muchas',
          texto:
            'Buscás por nombre o por código OSCE, o filtrás por estado para ver solo lo que está <b>En Preparación</b> y necesita trabajo esta semana.',
        },
        {
          objetivo: '#detalle-contenido',
          titulo: 'El expediente de cada licitación',
          texto:
            'Acá está el corazón del sistema: <b>la lista de documentos</b> de esa licitación, cada uno con su estado y su vencimiento.<br><br>Los que están por vencer se marcan solos. Eso es lo que evita que un expediente se caiga por un papel viejo.',
          antes: async () => {
            const fila = document.querySelector('#tbody-licitaciones button');
            if (fila) fila.click();
            await esperar(320);
          },
        },
        {
          objetivo: '#modal-detalle .modal-contenido',
          titulo: 'Documentos, estado e historial',
          texto:
            '<b>➕ Documento</b> agrega un papel al expediente.<br><b>🔄</b> le cambia el estado (pendiente, en trámite, listo).<br><br>Abajo queda el <b>historial</b>: quién hizo qué y cuándo. Si mañana alguien pregunta por qué se presentó tarde, la respuesta está ahí.',
        },
        {
          objetivo: '.acciones button:nth-child(2)',
          titulo: 'Sacar la información afuera',
          texto:
            '<b>Exportar</b> baja todo a un archivo que podés abrir en Excel o mandar por correo.<br><br>Sirve para el reporte a gerencia y como respaldo: los datos viven en este navegador, así que exportar de vez en cuando es tu copia de seguridad.',
          antes: async () => {
            cerrarModales();
            await esperar(200);
          },
        },
        {
          centro: true,
          titulo: 'Listo',
          texto:
            'La rutina es corta:<br><br><b>1.</b> Mirás <i>Documentos por Vencer</i>.<br><b>2.</b> Entrás a las licitaciones que tengan algo pendiente.<br><b>3.</b> Actualizás el estado de cada documento a medida que avanza.<br><br>Para repetir este tour: el botón <b>🧭 Ver tour</b> arriba.',
        },
      ],
    });
  };

  // Este bloque se inyecta al final del body, cuando la app ya se inicializo.
  window.iniciarTourLicitaciones();
})();
