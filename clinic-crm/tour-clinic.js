/* Tour guiado para ORASIC Dental CRM */
(function () {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  const irA = async (pagina) => {
    document.querySelector(`[data-page="${pagina}"]`)?.click();
    await esperar(420);
  };

  async function esperarAppLista(intentos = 60) {
    for (let i = 0; i < intentos; i++) {
      if (document.getElementById('app').style.display !== 'none' && document.querySelector('[data-page="dashboard"]')) {
        return true;
      }
      await esperar(150);
    }
    return false;
  }

  const PASOS = [
    {
      centro: true,
      titulo: 'Bienvenido a ORASIC Dental CRM',
      texto:
        'En 3 minutos te muestro cada parte. Esta app hace tres cosas: <b>gestiona tu base de pacientes</b>, <b>organiza tus citas</b> y <b>te avisa cuando se vencen los recordatorios</b>.<br><br>Nada de esto sale de tu navegador: los datos de tu clínica son privados.',
    },
    {
      objetivo: '[data-page="dashboard"]',
      titulo: 'El panel principal',
      texto:
        '<b>Dashboard</b> es tu resumen del día: cuántas citas tienes, cuáles confirmadas, cuáles pendientes y los recordatorios que vencen hoy.<br><br>Lo primero que mirás al abrir la app.',
      antes: () => irA('dashboard'),
    },
    {
      objetivo: '.stat-grid',
      titulo: 'Tus números del día',
      texto:
        'Los cuatro cuadros de arriba son tu tablero: <b>Total de citas</b>, <b>Confirmadas</b>, <b>Pendientes</b> y <b>Recordatorios por enviar</b>.<br><br>De un vistazo sabés el estado de hoy.',
    },
    {
      objetivo: '[data-page="patients"]',
      titulo: 'Tu base de pacientes',
      texto:
        '<b>Pacientes</b> es donde llevás la ficha de cada uno: nombre, teléfono, email, fecha de nacimiento y notas especiales (alergias, trabajos previos, etc).<br><br>Todos los datos en un lugar.',
      antes: () => irA('patients'),
    },
    {
      objetivo: '[data-page="appointments"]',
      titulo: 'Tu agenda de citas',
      texto:
        '<b>Citas</b> es la grilla de tu mes: quién, a qué hora, con qué doctor, en qué sillón, y el estado (pendiente, confirmada, hecha, no asistió).<br><br>La podes filtrar por mes o buscar un paciente.',
      antes: () => irA('appointments'),
    },
    {
      objetivo: '[data-page="reminders"]',
      titulo: 'Recordatorios automáticos',
      texto:
        '<b>Recordatorios</b> te dice a quién le tienes que llamar o enviar WhatsApp antes de su próxima cita.<br><br>Sirve para reducir las ausencias: una llamada 24 horas antes sube mucho la asistencia.',
      antes: () => irA('reminders'),
    },
    {
      objetivo: '#btn-tour',
      titulo: 'Manual y tour',
      texto:
        '<b>Ver tour guiado</b> vuelve a abrir este recorrido cuando quieras.<br><br><b>Manual de uso</b> tiene toda la explicación por escrito y qué hacer si algo falla.',
      antes: () => irA('manual'),
    },
    {
      centro: true,
      titulo: 'Listo',
      texto:
        'La rutina diaria:<br><br><b>1.</b> Mirás el Dashboard al abrir.<br><b>2.</b> Revisás los Recordatorios por vencer.<br><b>3.</b> Confirmás citas por WhatsApp o llamada.<br><b>4.</b> Cuando termina cada cita, marcarla como hecha.<br><br>Eso es todo. El sistema hace el resto.',
    },
  ];

  (async function () {
    if (!(await esperarAppLista())) return;
    OrasicTour.iniciar({
      clave: 'tourDentalVisto',
      boton: '#btn-tour',
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