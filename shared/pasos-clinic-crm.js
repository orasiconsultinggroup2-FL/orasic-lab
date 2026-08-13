/* Pasos del tour de ORASIC Dental CRM. Se inyecta dentro de index.html. */
(function () {
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  const irA = async (pagina) => {
    document.querySelector(`.nav-item[data-page="${pagina}"]`)?.click();
    await esperar(400);
  };

  /* ---------- Pacientes y citas de ejemplo ----------
     Se cargan SOLO en pantalla mientras dura el tour: reemplazamos el `cache`
     en memoria y volvemos a dibujar. No se escribe nada en Supabase, y al
     cerrar el tour se restauran los datos reales de la clinica. */

  const hoy = new Date();
  const dia = (n) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  };
  const haceHoras = (h) => new Date(Date.now() - h * 3600000).toISOString();
  const enHoras = (h) => new Date(Date.now() + h * 3600000).toISOString();

  const PACIENTES = [
    { id: 'd1', full_name: 'Rosa Quispe Mamani', phone: '987654321', dni: '45678912', email: 'rosa.quispe@gmail.com', birth_date: '1991-04-18', notes: 'Alergia a la penicilina' },
    { id: 'd2', full_name: 'Diego Ramírez Soto', phone: '912345678', dni: '41235678', email: 'diego.rs@gmail.com', birth_date: '1988-11-02', notes: '' },
    { id: 'd3', full_name: 'Valeria Ochoa Restrepo', phone: '956781234', dni: '47891234', email: null, birth_date: '1996-07-25', notes: 'Tratamiento de ortodoncia en curso' },
    { id: 'd4', full_name: 'Luis Fernández Paz', phone: '998877665', dni: '09876543', email: 'luis.fpaz@gmail.com', birth_date: '1983-01-30', notes: '' },
    { id: 'd5', full_name: 'Camila Torres Vega', phone: '955443322', dni: '72345678', email: null, birth_date: '1999-09-14', notes: 'Le teme al torno — avisar antes' },
    { id: 'd6', full_name: 'Sergio Medina Cruz', phone: '944556677', dni: '43219876', email: null, birth_date: '1979-06-11', notes: '' },
  ];

  const paciente = (id) => PACIENTES.find((p) => p.id === id);

  const CITAS = [
    { id: 'a1', patient_id: 'd1', appointment_date: dia(0), appointment_time: '09:00', service_type: 'Limpieza dental', status: 'confirmed', notes: '' },
    { id: 'a2', patient_id: 'd3', appointment_date: dia(0), appointment_time: '11:30', service_type: 'Control de ortodoncia', status: 'confirmed', notes: '' },
    { id: 'a3', patient_id: 'd5', appointment_date: dia(0), appointment_time: '16:00', service_type: 'Extracción', status: 'scheduled', notes: 'Paciente nerviosa' },
    { id: 'a4', patient_id: 'd2', appointment_date: dia(1), appointment_time: '10:00', service_type: 'Resina', status: 'scheduled', notes: '' },
    { id: 'a5', patient_id: 'd4', appointment_date: dia(2), appointment_time: '08:30', service_type: 'Evaluación inicial', status: 'scheduled', notes: '' },
    { id: 'a6', patient_id: 'd6', appointment_date: dia(3), appointment_time: '15:00', service_type: 'Blanqueamiento', status: 'scheduled', notes: '' },
  ].map((c) => ({
    ...c,
    patients: { full_name: paciente(c.patient_id).full_name, phone: paciente(c.patient_id).phone },
    profiles: { full_name: 'Dra. Mariana Ruiz' },
    chairs: { name: 'Sillón 1' },
  }));

  const cita = (id) => CITAS.find((c) => c.id === id);
  const recordatorio = (id, citaId, tipo, sendAt, sent) => ({
    id,
    appointment_id: citaId,
    reminder_type: tipo,
    send_at: sendAt,
    sent_at: sent ? sendAt : null,
    status: sent ? 'sent' : 'pending',
    appointments: {
      appointment_date: cita(citaId).appointment_date,
      appointment_time: cita(citaId).appointment_time,
      service_type: cita(citaId).service_type,
      patients: cita(citaId).patients,
    },
  });

  // Dos ya vencidos (listos para mandar), uno ya mandado, dos a futuro.
  const RECORDATORIOS = [
    recordatorio('r1', 'a3', '1h', haceHoras(1), false),
    recordatorio('r2', 'a4', '24h', haceHoras(3), false),
    recordatorio('r3', 'a1', '24h', haceHoras(26), true),
    recordatorio('r4', 'a5', '24h', enHoras(20), false),
    recordatorio('r5', 'a6', '24h', enHoras(60), false),
  ];

  let cacheReal = null;

  function activarEjemplo() {
    if (typeof cache === 'undefined' || cacheReal) return;
    cacheReal = cache;
    cache = {
      ...cacheReal,
      patients: PACIENTES,
      appointments: CITAS,
      reminders: RECORDATORIOS,
    };
    if (typeof navigate === 'function') navigate(currentPage);
  }

  function restaurarReales() {
    if (!cacheReal) return;
    cache = cacheReal;
    cacheReal = null;
    if (typeof navigate === 'function') navigate(currentPage);
  }

  window.iniciarTourDental = function () {
    return OrasicTour.iniciar({
      clave: 'tourDentalVisto',
      boton: '#btn-tour',
      alAbrir: activarEjemplo,
      alCerrar: restaurarReales,
      tema: { acento: '#A78BFA', acento2: '#22D3EE', fondo: '#111827', texto: '#F9FAFB', textoSuave: '#9CA3AF' },
      pasos: [
        {
          centro: true,
          titulo: 'Bienvenido a ORASIC Dental',
          texto:
            'En 2 minutos te muestro cada parte. El sistema hace tres cosas: <b>guarda tus pacientes</b>, <b>ordena la agenda de citas</b> y <b>te avisa a quién hay que recordarle</b> para que no falte.<br><br>Para que veas todo funcionando, cargué <b>6 pacientes y 6 citas de ejemplo</b>. Son solo de mentira y en pantalla: <b>no se guarda nada</b>, y al terminar el tour vuelven tus datos reales.',
        },
        {
          objetivo: '#sidebar nav',
          titulo: 'El menú de la izquierda',
          texto:
            'Todo se maneja desde acá.<br><br><b>Dashboard</b> — el resumen del día.<br><b>Pacientes</b> — tu base de datos.<br><b>Citas</b> — la agenda.<br><b>Recordatorios</b> — los avisos por WhatsApp.<br><br>En el celular este menú aparece abajo de la pantalla.',
          antes: () => irA('dashboard'),
        },
        {
          objetivo: '#page-body',
          titulo: 'Dashboard: cómo viene el día',
          texto:
            'Mirá los números: hay <b>3 citas para hoy</b>, 6 pacientes cargados y recordatorios esperando que los mandes.<br><br>Si abrís el sistema una sola vez al día, que sea acá.',
        },
        {
          objetivo: '#page-actions',
          titulo: 'Cargar tus pacientes',
          texto:
            '<b>+ Nuevo paciente</b> los carga de a uno.<br><br><b>Importar CSV</b> los sube todos juntos si ya los tenés en Excel. Solo hacen falta dos columnas: <b>nombre</b> y <b>telefono</b>.<br><br>Esto se hace una vez al principio. Después solo agregás los nuevos.',
          antes: () => irA('patients'),
        },
        {
          objetivo: '#modal-overlay .modal-box',
          titulo: 'Así se llena una ficha',
          texto:
            'Mirá cómo se completa — no toques nada, es solo para que lo veas.<br><br>Nombre, teléfono, DNI y una nota. El teléfono es el dato que no puede faltar: por ahí le llega el recordatorio.',
          antes: async () => {
            document.querySelector('#page-actions .btn-primary')?.click();
            for (let i = 0; i < 20 && !document.getElementById('f-name'); i++) await esperar(80);
          },
          durante: async (vigente) => {
            await OrasicTour.escribir(document.getElementById('f-name'), 'Andrea Salinas Coronel', { vigente });
            if (!vigente()) return;
            await OrasicTour.escribir(document.getElementById('f-phone'), '987001122', { vigente });
            if (!vigente()) return;
            await OrasicTour.escribir(document.getElementById('f-dni'), '48123456', { vigente });
            if (!vigente()) return;
            await OrasicTour.escribir(document.getElementById('f-notes'), 'Primera visita — pide presupuesto de ortodoncia', { vigente });
          },
        },
        {
          centro: true,
          titulo: 'Esto fue solo una demostración',
          texto:
            'Esa ficha <b>no se guardó</b> — era de mentira, para que veas el formulario en acción.<br><br>Cuando cargues un paciente de verdad, completás igual y tocás <b>Guardar</b>. Ahora cerramos sin guardar nada.',
          antes: async () => {
            if (typeof closeModal === 'function') closeModal();
            await esperar(200);
          },
        },
        {
          objetivo: '#page-body',
          titulo: 'La ficha de cada paciente',
          texto:
            'Ahí está la lista real: Rosa, Diego, Valeria, Luis, Camila y Sergio. De cada uno guardás nombre, teléfono, DNI y notas ("alergia a la penicilina", "le teme al torno").<br><br>El <b>teléfono es el dato clave</b>: es por donde le llega el recordatorio. Sin teléfono no se le puede avisar.',
        },
        {
          objetivo: '#page-actions',
          titulo: 'Agendar una cita',
          texto:
            'Con <b>+ Nueva cita</b> elegís el paciente, el día y la hora.<br><br>Y acá está lo bueno: al guardarla, el sistema <b>crea solo dos recordatorios</b>, uno para 24 horas antes y otro para 1 hora antes. No tenés que acordarte de nada.',
          antes: () => irA('appointments'),
        },
        {
          objetivo: '#page-body',
          titulo: 'La agenda',
          texto:
            'Acá está la agenda cargada: limpieza, control de ortodoncia, extracción, resina… cada una con su paciente, su hora y su estado.<br><br>Desde acá las editás o las cancelás. Si cancelás una, sus recordatorios se cancelan también.',
        },
        {
          objetivo: '#page-body',
          titulo: 'Recordatorios: el corazón del sistema',
          texto:
            'Acá está la razón de ser de todo esto: <b>que el paciente no falte</b>.<br><br>Fijate que hay dos marcados como <b>listos</b>: ya les llegó la hora de avisar. Tocás <b>Enviar</b> y se abre WhatsApp con el mensaje ya escrito para esa persona y esa cita — vos solo apretás enviar.<br><br>Los de más abajo todavía no llegaron a su hora, y uno ya figura como enviado.',
          antes: () => irA('reminders'),
        },
        {
          objetivo: '.nav-item[data-page="reminders"] .badge, #badge-reminders',
          titulo: 'El numerito rojo',
          texto:
            'Ese número te dice <b>cuántos recordatorios están esperando</b> que los mandes.<br><br>La rutina es simple: abrís el sistema, mirás ese número, y mandás los que estén listos. Dos minutos por día.',
        },
        {
          objetivo: '.nav-item[data-page="manual"]',
          titulo: 'El manual escrito',
          texto:
            'Todo esto explicado con más detalle, incluida la carga masiva por CSV y qué hacer si algo falla.<br><br>Para repetir este tour: <b>Ver tour guiado</b>, acá mismo en el menú.',
          antes: () => irA('manual'),
        },
        {
          centro: true,
          titulo: 'Listo',
          texto:
            'La rutina diaria son tres pasos:<br><br><b>1.</b> Agendás las citas que van entrando.<br><b>2.</b> Mirás el numerito de Recordatorios.<br><b>3.</b> Mandás los que estén listos.<br><br>Eso es todo. Lo demás lo hace el sistema.',
        },
      ],
    });
  };
})();
