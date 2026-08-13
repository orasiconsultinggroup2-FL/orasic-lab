/* Tour para ORASIC Content Studio */
(function () {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  const irA = async (pagina) => {
    document.querySelector(`[data-page="${pagina}"]`)?.click();
    await esperar(420);
  };

  async function esperarAppLista(intentos = 60) {
    for (let i = 0; i < intentos; i++) {
      if (document.querySelector('[data-page="dashboard"]')) return true;
      await esperar(150);
    }
    return false;
  }

  const PASOS = [
    {
      centro: true,
      titulo: 'Bienvenido a ORASIC Content Studio',
      texto:
        'Aquí generamos guiones, narración, videos y gestionamos el calendario de publicación para TikTok, Instagram, Blog, LinkedIn y Facebook.<br><br>Todo en un lugar, sin servidores, sin login, sin pagar.',
    },
    {
      objetivo: '[data-page="dashboard"]',
      titulo: '📊 Dashboard — Tu panel de control',
      texto: 'Resumen en tiempo real de todo tu contenido: total de piezas, publicadas, programadas y pendientes. También muestra alertas de piezas para hoy y las próximas publicaciones.',
      antes: () => irA('dashboard'),
    },
    {
      objetivo: '[data-page="dashboard"]',
      titulo: '💡 Rutina diaria',
      texto: 'Cada mañana abre el Dashboard. Si hay alerta roja, esa es la pieza del día. Revisa el guion y publícalo.',
      antes: () => irA('dashboard'),
    },
    {
      objetivo: '[data-page="crear"]',
      titulo: '✦ Crear Contenido — El flujo de 4 pasos',
      texto: '<b>PASO 1:</b> Elegís qué plataforma (TikTok, Instagram, Blog, LinkedIn, Facebook) y tu objetivo (Awareness, Leads, Educación, Conversión, Comunidad, Portafolio).',
      antes: () => irA('crear'),
    },
    {
      objetivo: '[data-page="crear"]',
      titulo: '✦ Paso 2 — Brief de Contenido',
      texto: '<b>Tema y Mensaje clave:</b> selectores con opciones que cambian según el objetivo del Paso 1. La IA usa esto para generar el guion.',
      antes: () => irA('crear'),
    },
    {
      objetivo: '[data-page="crear"]',
      titulo: '✦ Paso 3 — Generación con IA',
      texto: 'Claude (o plantillas inteligentes) genera:<br><b>• TikTok/Facebook:</b> guión de 130 palabras + caption + hashtags<br><b>• Instagram:</b> guión de carrusel (5 slides) + caption<br><b>• Blog:</b> título SEO + intro + artículo (600+ palabras)<br><b>• LinkedIn:</b> post profesional + hashtags',
      antes: () => irA('crear'),
    },
    {
      objetivo: '[data-page="crear"]',
      titulo: '✦ Paso 4 — Programar & Guardar',
      texto: 'Define el estado (Borrador, Listo, Programado, Publicado), fecha/hora, archivo de asset y notas internas. Luego guarda en el banco.',
      antes: () => irA('crear'),
    },
    {
      objetivo: '[data-page="banco"]',
      titulo: '▤ Banco de Contenido — Tu repositorio',
      texto: 'Lista todas las piezas con filtros por estado y plataforma. Acciones: Ver detalles, Editar, Marcar como publicado, o Eliminar.',
      antes: () => irA('banco'),
    },
    {
      objetivo: '[data-page="calendario"]',
      titulo: '◫ Calendario — Vista mensual',
      texto: 'Cuadrícula con todas las piezas organizadas por fecha. Colores: verde = publicada, cyan = programada, naranja = lista, gris = borrador.<br><br>Clic en una pieza para ver sus detalles.',
      antes: () => irA('calendario'),
    },
    {
      objetivo: '[data-page="guiones"]',
      titulo: '✍ Guiones por lote — Genera múltiples a la vez',
      texto: 'Selecciona varias piezas del calendario y genera sus guiones en secuencia automática. Ideal para la sesión semanal: cada lunes, genera toda la semana de una vez.',
      antes: () => irA('guiones'),
    },
    {
      objetivo: '[data-page="video"]',
      titulo: '🎬 Estudio de video — Arma MP4 vertical',
      texto: 'Convierte el guion en un video 9:16 con gráficos de marca en movimiento (tarjetas animadas). Todo en el navegador, sin servidores.<br><br>Duración: ~2.8 segundos por tarjeta. Apunta a 20-30 segundos totales.',
      antes: () => irA('video'),
    },
    {
      objetivo: '[data-page="video"]',
      titulo: '🎙 Narración opcional',
      texto: 'Dentro del estudio de video: casilla "🎙 Narrar con ElevenLabs" para agregar voz en off automática. El video se ajusta solo a la duración de la locución.',
      antes: () => irA('video'),
    },
    {
      objetivo: '[data-page="voz"]',
      titulo: '🎙 Voz en off — Configurar una sola vez',
      texto: '<b>En ⚙ Configuración:</b> pega tu API Key de ElevenLabs, luego agrega voces por su Voice ID. Pruébala con 🎧.<br><br>Voz actual: <b>George</b> (predeterminada, gratuita, suena natural en español).',
      antes: () => irA('voz'),
    },
    {
      objetivo: '[data-page="voz"]',
      titulo: '🎙 Pronunciación — Evita el acento gringo',
      texto: 'Reglas para que George pronuncie bien:<br><code>ORASIC Lab = Orásic Lab</code><br><code>WhatsApp = Guatsáp</code><br><br>Solo afecta el audio, no la ortografía en pantalla.',
      antes: () => irA('voz'),
    },
    {
      objetivo: '[data-page="publicar"]',
      titulo: '↗ Publicar — Copia y pega en redes',
      texto: 'Tres botones por pieza:<br><b>✨ Copiar limpio:</b> guion sin marcadores<br><b>📋 Copiar todo para publicar:</b> caption + hashtags<br><b>↗ Ir a TikTok/IG:</b> abre la red con contenido copiado',
      antes: () => irA('publicar'),
    },
    {
      objetivo: '[data-page="rendimiento"]',
      titulo: '📊 Rendimiento — Métricas de lo publicado',
      texto: 'Trackea manualmente el rendimiento de cada pieza: views, engagement, alcance por plataforma. Sirve para detectar qué funciona y qué no.',
      antes: () => irA('rendimiento'),
    },
    {
      objetivo: '[data-page="estrategia"]',
      titulo: '◎ Estrategia de Marca — Tu referencia',
      texto: 'Guarda tu público objetivo, tonos de voz, mensajes clave, pilares editoriales y el contexto que la IA necesita para generar contenido alineado con tu marca.',
      antes: () => irA('estrategia'),
    },
    {
      centro: true,
      titulo: '✓ La rutina semanal',
      texto: '<b>Lunes:</b> Abre "Guiones por lote", selecciona toda la semana sin guion, genera en lote.<br><br><b>Martes-Viernes:</b> Entra a "Banco", edita y revisa cada guion, arma el video en el estudio.<br><br><b>Cada día:</b> Publica a mano en cada red (la app copia al portapapeles).<br><br>Dashboard te muestra siempre qué va venciendo.',
    },
  ];

  (async function () {
    if (!(await esperarAppLista())) return;
    OrasicTour.iniciar({
      clave: 'tourContentStudioVisto',
      boton: '[data-page="manual"]',
      demora: 400,
      tema: {
        acento: '#A78BFA',
        acento2: '#22D3EE',
        fondo: '#080A0F',
        texto: '#F9FAFB',
        textoSuave: '#9CA3AF',
        velo: 'rgba(8, 10, 15, .85)',
      },
      pasos: PASOS,
    });
  })();
})();