# ORASIC Lab — Contexto del proyecto

Landing page de ORASIC Lab (agencia de software/apps a medida con IA, Perú y Colombia). Sitio en `orasic-lab.vercel.app`.

## Stack
- Un solo archivo `index.html` estático (sin framework), Tailwind vía CDN (`cdn.tailwindcss.com`), JS vanilla al final del body.
- Deploy: GitHub (`orasiconsultinggroup2-FL/orasic-lab`, rama `main`) conectado a Vercel — auto-deploy en cada `git push`. No usar `vercel --prod` manual salvo emergencia.
- **Importante:** esta carpeta está sincronizada por OneDrive. Las operaciones de git deben correrse desde la PowerShell real del usuario en Windows — sandboxes/agentes remotos suelen fallar al borrar archivos de bloqueo internos de git sobre esta carpeta montada.

## Decisiones de diseño vigentes
- Tema 100% oscuro en todo el sitio (no alternar con secciones blancas — se probó y generaba cortes visuales feos).
- Portafolio (`RUBROS` en el `<script>` al final del HTML) ordenado con rubros pyme primero (Belleza, Salud, Retail y Moda, Deporte, Comunidad, Ventas B2B, Marketing, Educación, Productividad) y los institucionales/consultoría al final (Liderazgo y Coaching, Institucional y Corporativo, Minería y Conflictos Sociales) — el primero de la lista se auto-abre al cargar la página, tiene que calzar con el pitch de "reservas y WhatsApp para negocios reales".
- No inventar testimonios de clientes. No existen todavía — pendiente hasta que el usuario consiga 3-4 reales con nombre y rubro.

## Contenido redes (TikTok / Instagram)
- Formato de video: gráficos de marca renderizados por script propio (Python/PIL + ffmpeg, no modelo generativo de imagen/video) sobre la paleta exacta del sitio — fondo #080A0F, violeta #A78BFA, cyan #22D3EE, rosa #F472B6, naranja #FB923C. Script y assets en `contenido/lote-1-tiktok/` (carpeta de trabajo: outputs del sandbox, no versionada aquí).
- Locución en off — **producción manual en la web de ElevenLabs**: usar SIEMPRE una de estas 3 voces aprobadas por el usuario — "Giancarlos - Latin American Narrator", "Jorge - Warm, Close and Friendly", "Diego Cárdenas - Soothing and Meditative". No usar otras voces sin confirmar con el usuario primero.
- Locución en off — **automática desde Content Studio (vía API)**: las 3 voces de arriba son *voces de biblioteca* y el plan gratuito de ElevenLabs **las bloquea por API** (`HTTP 402 — Free users cannot use library voices via the API`). Desbloquearlas cuesta ~$5/mes (plan Starter), descartado por la regla de gratuidad. Voz aprobada para este flujo: **"George"** (voz predeterminada de ElevenLabs, categoría Narración) — su español convence al usuario. Requiere las reglas de pronunciación (`ORASIC Lab = Orásic Lab`, `WhatsApp = Guatsáp`) para que no suene con acento inglés.
- Regla editorial "antes/después": no repetir siempre el mismo caso de uso (reservas + cobro). Rotar rubros y casos (CRM/ventas B2B, dashboards, automatización de soporte, etc.) entre piezas para no encasillar la marca, ya que el mensaje de "+100 apps en 12 rubros" contradice mostrar un solo caso una y otra vez.
- WhatsApp de contacto correcto para CTAs: +51 999 039 947 (no el número anterior 986 375 900, que estaba mal).

## ORASIC Content Studio (app interna, `content-studio/index.html`)
- App de gestión de contenido: genera guiones, arma videos verticales con voz en off y organiza el calendario. **Todavía NO está versionada ni desplegada** — el usuario no quiere hacerla pública aún. Vive solo local.
- **Arrancar con `Abrir-Content-Studio.bat`** (Windows) o `npm start` dentro de `content-studio/`. Accesible por `http://localhost:3000/content-studio/`. Con `file://` el navegador bloquea las llamadas a APIs y además usa un `localStorage` distinto.
- Backend Node.js seguro: endpoints autenticados (localhost), sin CORS abierto, RCE prevenido. Publica/sincroniza artículos en Supabase.
- **Regla del usuario: todo tiene que ser gratuito.** Se descartaron Ayrshare, suscripción de Higgsfield y el plan Starter de ElevenLabs por costo.
- **Publicar a redes NO es automático** y no puede serlo gratis (TikTok exige backend + auditoría; Meta, app aprobada). Se verificó que ZOLLA tampoco lo hace: su `SocialManager.js` solo copia al portapapeles. Flujo vigente: *Copiar todo para publicar* → *Ir a TikTok/Instagram* → pegar → publicar → marcar ✓ Publicado.

## Pendientes conocidos
- Confirmar visualmente el menú mobile (botón hamburguesa) en un celular real.
- Sumar testimonios reales cuando estén disponibles.
- Sección de **evaluación de contenido publicado** (métricas manuales → diagnóstico de embudo, validación de estrategia y detección del "dolor"): propuesta y aprobada conceptualmente, pendiente de implementar.
- Dar más movimiento a las tarjetas del video (hoy solo hacen fundido; se ve estático para TikTok).

## Historial de sesiones
Ver `sesiones-claude/` en esta carpeta para resúmenes de sesiones anteriores de trabajo con Claude.
