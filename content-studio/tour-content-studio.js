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
        'En 3 minutos te muestro cómo generar contenido para TikTok, Instagram, blog y LinkedIn sin dejar la app.<br><br>Guiones, audios, videos armados y calendario: todo en un lugar.',
    },
    {
      objetivo: '[data-page="dashboard"]',
      titulo: 'Tu panel de control',
      texto: '<b>Dashboard</b> muestra el estado de tu contenido: videos publicados, pendientes, programados y el rendimiento general.',
      antes: () => irA('dashboard'),
    },
    {
      objetivo: '[data-page="crear"]',
      titulo: 'Crear contenido nuevo',
      texto:
        '<b>Crear</b> abre el flujo de 4 pasos:<br><br><b>1.</b> Elegís qué red (TikTok, Instagram, Blog, LinkedIn).<br><b>2.</b> Escribís el guión (o te ayuda la IA).<br><b>3.</b> Se genera el audio con voz en off.<br><b>4.</b> Se arma el video con gráficos de marca.',
      antes: () => irA('crear'),
    },
    {
      objetivo: '[data-page="guiones"]',
      titulo: 'Tu banco de guiones',
      texto:
        '<b>Guiones</b> guarda todo lo que escribiste. Los podes editar, regenerar, reutilizar en otro video o borrar.',
      antes: () => irA('guiones'),
    },
    {
      objetivo: '[data-page="calendario"]',
      titulo: 'Calendario de publicación',
      texto:
        '<b>Calendario</b> te muestra qué publicaste cada día y qué está programado.<br><br>Sirve para no repetir temas y para planificar adelante.',
      antes: () => irA('calendario'),
    },
    {
      objetivo: '[data-page="blog"]',
      titulo: 'Artículos del blog',
      texto:
        '<b>Blog</b> lista los artículos publicados en tu landing. Editables, con fecha y categoría.',
      antes: () => irA('blog'),
    },
    {
      centro: true,
      titulo: 'Listo',
      texto:
        'La rutina:<br><br><b>1.</b> Mirá el Dashboard para ver rendimiento.<br><b>2.</b> Entrá a <b>Crear</b> cuando tengas una idea.<br><b>3.</b> Revisá el <b>Calendario</b> antes de publicar (para no repetir).<br><b>4.</b> Publicá a mano en cada red (la app copia al portapapeles).<br><br>Eso es todo.',
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