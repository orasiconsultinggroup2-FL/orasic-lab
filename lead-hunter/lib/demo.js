// Leads de demostracion: perfiles inventados, no son personas reales.
// Sirven para recorrer toda la app (kanban, detalle, mensajes) sin gastar
// un centavo ni configurar ninguna clave.
const AHORA = () => new Date().toISOString();

const PERFILES = [
  {
    nombre: 'Ana Quispe Herrera',
    titular: 'Fundadora en Clinica Dental Sonrisa | Odontologa',
    cargo: 'Fundadora',
    empresa: 'Clinica Dental Sonrisa',
    ubicacion: 'Lima, Peru',
    puntaje: 9,
    publicaciones: [
      {
        fecha: 'hace 3 dias',
        texto:
          'Semana complicada: 9 pacientes no vinieron a su cita y no avisaron. Cada silla vacia son 45 minutos que ya estaban pagados. Alguien encontro una forma de bajar esto que no sea llamar uno por uno?',
      },
    ],
    analisis:
      'Ana dirige una clinica dental en Lima y acaba de publicar sobre 9 inasistencias en una semana, calculando ella misma la perdida por silla vacia. Ya identifico el problema y ya descarto la solucion manual (llamar uno por uno), asi que esta buscando activamente una alternativa. Es exactamente el dolor que resuelve un sistema de reservas con recordatorios automaticos.',
    gancho: 'Su publicacion de hace 3 dias sobre las 9 citas perdidas',
    mensaje:
      'Hola Ana, lei tu posteo sobre las 9 citas perdidas de esta semana.\n\nEn ORASIC Lab armamos sistemas de reservas con confirmacion y recordatorio automatico por WhatsApp para clinicas. Es justo el caso de no tener que llamar uno por uno.\n\nTe sirve una llamada de 20 minutos para ver como quedaria con tu agenda? Es un diagnostico sin costo.\n\nSaludos,\nFernando',
  },
  {
    nombre: 'Carlos Restrepo Mesa',
    titular: 'Gerente General | Gimnasios Fuerza (3 sedes)',
    cargo: 'Gerente General',
    empresa: 'Gimnasios Fuerza',
    ubicacion: 'Medellin, Colombia',
    puntaje: 8,
    publicaciones: [
      {
        fecha: 'hace 1 semana',
        texto:
          'Abrimos la tercera sede. Feliz, pero ahora tengo tres Excel distintos de membresias y ninguno cuadra con el otro. Crecer tambien duele.',
      },
    ],
    analisis:
      'Carlos maneja tres sedes de gimnasios en Medellin y acaba de decir publicamente que lleva las membresias en tres Excel que no cuadran entre si. El dolor es de consolidacion: no sabe cuantos socios activos tiene en total ni quien esta por vencer. Un panel unico de membresias con vencimientos y cobros es directamente lo que pide.',
    gancho: 'Los tres Excel de membresias que menciono al abrir la tercera sede',
    mensaje:
      'Hola Carlos, vi tu posteo sobre los tres Excel de membresias que no cuadran.\n\nEn ORASIC Lab construimos paneles unicos para negocios con varias sedes: membresias, vencimientos y cobros en una sola pantalla, con avisos automaticos a los socios que estan por vencer.\n\nTe interesa una llamada corta para ver como se veria con tus tres sedes? Va sin costo.\n\nSaludos,\nFernando',
  },
  {
    nombre: 'Lucia Fernandez Ojeda',
    titular: 'Directora | Estudio Contable Fernandez & Asociados',
    cargo: 'Directora',
    empresa: 'Estudio Contable Fernandez & Asociados',
    ubicacion: 'Arequipa, Peru',
    puntaje: 7,
    publicaciones: [
      {
        fecha: 'hace 5 dias',
        texto:
          'Enero y julio son los meses en los que mi equipo trabaja los sabados. No por volumen de clientes, sino por perseguir documentos que nos mandan por WhatsApp, correo y a veces en foto.',
      },
    ],
    analisis:
      'Lucia dirige un estudio contable en Arequipa. Su publicacion apunta a que el cuello de botella no es la carga de trabajo sino la recepcion desordenada de documentos por tres canales distintos. Un portal simple donde el cliente sube y el estudio ve el estado de cada carpeta le devuelve los sabados al equipo.',
    gancho: 'Los sabados de trabajo persiguiendo documentos por WhatsApp y correo',
    mensaje:
      'Hola Lucia, me quedo pegado tu posteo: los sabados no son por volumen sino por perseguir documentos.\n\nEn ORASIC Lab hacemos portales donde el cliente sube lo que falta y el estudio ve de un vistazo que carpeta esta completa y cual no. Todo el ida y vuelta deja de vivir en el WhatsApp.\n\nTe sirve una llamada de 20 minutos para ver si aplica a tu caso? Sin costo.\n\nSaludos,\nFernando',
  },
  {
    nombre: 'Miguel Angel Torres',
    titular: 'Dueno | Distribuidora Torres SAC | Ferreteria y construccion',
    cargo: 'Dueno',
    empresa: 'Distribuidora Torres SAC',
    ubicacion: 'Trujillo, Peru',
    puntaje: 6,
    publicaciones: [],
    analisis:
      'Miguel es dueno de una distribuidora de materiales de construccion en Trujillo. No tiene publicaciones recientes, asi que el analisis se apoya solo en el rubro y el cargo: distribuidoras de este tamano suelen manejar stock y pedidos de vendedores en papel o Excel. Es un encaje probable pero no confirmado; conviene tratarlo como lead frio.',
    gancho: 'El rubro (distribuidora) y el cargo de dueno — sin publicaciones para personalizar',
    mensaje:
      'Hola Miguel, veo que manejas Distribuidora Torres en Trujillo.\n\nEn ORASIC Lab trabajamos con distribuidoras que llevan stock y pedidos en Excel o papel, y les armamos un sistema donde el vendedor carga el pedido desde el celular y el stock se descuenta solo.\n\nSi te interesa, hacemos un diagnostico de 20 minutos sin costo para ver si tiene sentido en tu operacion.\n\nSaludos,\nFernando',
  },
  {
    nombre: 'Paola Jimenez Cruz',
    titular: 'CEO en Bella Studio | Cadena de salones de belleza',
    cargo: 'CEO',
    empresa: 'Bella Studio',
    ubicacion: 'Bogota, Colombia',
    puntaje: 9,
    publicaciones: [
      {
        fecha: 'hace 2 dias',
        texto:
          'Pregunta honesta para duenas de salon: como manejan las reservas? Nosotras seguimos con un cuaderno por sede y una chica contestando el Instagram. Sabemos que se nos escapan clientas pero no encontramos con que reemplazarlo.',
      },
    ],
    analisis:
      'Paola dirige una cadena de salones en Bogota y pregunto abiertamente en LinkedIn como manejar reservas, admitiendo que usan cuaderno por sede mas una persona contestando Instagram. Dice explicitamente que se les escapan clientas y que no encontraron reemplazo. Es el lead de mayor intencion de la lista: ya pidio ayuda en publico.',
    gancho: 'Su pregunta abierta de hace 2 dias sobre como manejar las reservas',
    mensaje:
      'Hola Paola, vi tu pregunta sobre como manejan las reservas.\n\nEn ORASIC Lab hacemos justo eso para salones: agenda por sede y por profesional, reserva desde el link de Instagram y recordatorio automatico por WhatsApp. El cuaderno y la chica contestando dejan de ser el sistema.\n\nTe muestro como se ve en una llamada de 20 minutos? Sin costo.\n\nSaludos,\nFernando',
  },
  {
    nombre: 'Jorge Luis Camacho',
    titular: 'Jefe de Operaciones | Transportes Andinos',
    cargo: 'Jefe de Operaciones',
    empresa: 'Transportes Andinos',
    ubicacion: 'Cusco, Peru',
    puntaje: 5,
    publicaciones: [
      {
        fecha: 'hace 3 semanas',
        texto: 'Felicitaciones al equipo por cerrar el semestre sin accidentes. Orgulloso.',
      },
    ],
    analisis:
      'Jorge es jefe de operaciones en una empresa de transporte en Cusco. Su unica publicacion reciente es institucional y no revela ningun dolor operativo. Ademas no es dueno, asi que probablemente no decide una compra de software por su cuenta. Encaje bajo: sirve mas para entender el rubro que para contactar hoy.',
    gancho: 'Poco material — solo una publicacion institucional sin dolor visible',
    mensaje:
      'Hola Jorge, vi que cerraron el semestre sin accidentes en Transportes Andinos, felicitaciones.\n\nEn ORASIC Lab armamos paneles de seguimiento de flota y despachos para empresas de transporte. Si en algun momento estan evaluando ordenar esa parte, hacemos un diagnostico de 20 minutos sin costo.\n\nQuedo atento.\n\nSaludos,\nFernando',
  },
];

export function generarLeadsDemo() {
  const ahora = AHORA();
  return PERFILES.map((p, i) => ({
    id: `demo-${i + 1}`,
    ...p,
    foto: '',
    acerca: '',
    experiencia: [{ cargo: p.cargo, empresa: p.empresa, periodo: '2019 - hoy' }],
    linkedinUrl: 'https://www.linkedin.com/feed/',
    estado: i === 1 ? 'contactado' : i === 4 ? 'respondio' : 'nuevo',
    nota: '',
    esDemo: true,
    busqueda: { keyword: 'demo', cargos: [], ubicacion: 'Peru y Colombia' },
    creadoEn: new Date(Date.parse(ahora) - i * 60000).toISOString(),
    actualizadoEn: ahora,
  }));
}
