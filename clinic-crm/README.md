# ORASIC Dental CRM (demo)

App de gestión de citas para clínicas dentales — producto/demo de ORASIC Lab. Single-page app estática (sin build), igual patrón que `content-studio/`, hablando directo a Supabase desde el navegador.

## Cómo levantarla

```bash
python -m http.server 5051
```

Abrir `http://localhost:5051/clinic-crm/`. **No abrir con `file://`** — el navegador bloquea las llamadas a Supabase.

Al entrar por primera vez, usa la pestaña **"Crear mi clínica"** para registrar la clínica del dentista y tu usuario admin. Los siguientes usuarios (doctor, recepcionista) se agregan manualmente en Supabase por ahora (no hay pantalla de invitación todavía).

## Backend (Supabase)

- Proyecto: `orasic-dental-crm-demo` (id `crtkozepmebjtqosepos`, región `sa-east-1`).
- Costo: **$0/mes** (plan free). La org ya tenía 2 proyectos activos (límite del plan free); se pausó el proyecto vacío "Mauricio Perez Aeckerle" para liberar el slot — no se tocó ningún proyecto con datos.
- Auth: Supabase Auth (email/password). Tabla `profiles` extiende `auth.users` con `role` (admin/doctor/receptionist) y `clinic_id`.
- Tablas: `clinics`, `profiles`, `chairs`, `patients`, `appointments`, `reminders` — RLS activado en todas, cada usuario solo ve datos de su propia clínica.
- La URL y la publishable key están hardcodeadas en `index.html` (son públicas por diseño; la seguridad real la da RLS, no el secreto de la key).

## WhatsApp — simulado, costo cero

No se conectó la API oficial de WhatsApp Cloud (Meta) porque requiere número verificado y dejó de ser gratis a escala. En su lugar:

- Al crear una cita se generan automáticamente 2 recordatorios (24h y 1h antes) en la tabla `reminders`.
- En la sección **Recordatorios**, cuando un recordatorio está "listo" (ya pasó su hora de envío), el botón **💬 Enviar** abre un modal con el mensaje ya armado (mismas plantillas que el `whatsapp.service.js` de referencia), un botón para copiarlo y un link `https://wa.me/<telefono>?text=...` que abre WhatsApp Web/App con el mensaje precargado — se envía manualmente con un clic.
- No hay cron server-side: la cola de recordatorios se calcula al cargar la página (mismo espíritu manual que el flujo "copiar todo para publicar" de `content-studio` para redes sociales).

## Manual de uso y carga de pacientes

Dentro de la app hay una sección **Manual de uso** (sidebar → Ayuda) con la guía paso a paso para el dentista/recepcionista.

Los pacientes se pueden cargar uno por uno, o en bloque desde **Pacientes → Importar CSV** si ya existen en Excel/Google Sheets/otro sistema (columnas: `nombre`, `telefono` obligatorias; `dni`, `email`, `fecha_nacimiento` opcionales). No es posible importar contactos directamente desde WhatsApp de forma gratuita — WhatsApp no expone esa lista a terceros sin la API de negocio de pago — así que la vía es exportar a CSV desde donde ya estén y subirlos aquí.

## Pendiente / roadmap futuro

- Conectar WhatsApp Cloud API real (Meta) si el volumen de la clínica lo justifica y se acepta el costo.
- Pantalla de invitación de usuarios (doctor/recepcionista) sin pasar por Supabase directamente.
- Multi-clínica (hoy cada login crea/pertenece a una sola clínica).
- Vista de calendario visual para citas (hoy es tabla/lista).
