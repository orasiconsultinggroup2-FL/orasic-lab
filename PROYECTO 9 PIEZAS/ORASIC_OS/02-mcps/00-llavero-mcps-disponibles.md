# Pieza 5 — Llavero de MCPs

Este catálogo es real: son los conectores a los que ya tienes acceso hoy en este entorno de Cowork (algunos activos, otros pendientes de autorización). No es una lista aspiracional — es tu inventario de partida. Nombres exactos de marca pueden variar; verifica en tu panel de conectores de Cowork/Claude antes de prometerle algo a un cliente.

## Ya conectados o disponibles para activar en esta sesión

| Categoría | Conector | Para qué sirve en un proyecto ORASIC |
|---|---|---|
| Backend / base de datos | Supabase | Crear y migrar bases de datos, ejecutar SQL, desplegar funciones — el backend técnico de cualquier app que construyas para un cliente |
| Archivos / almacenamiento en la nube | Conector de archivos tipo Drive | Leer, buscar y gestionar documentos del cliente sin pedirle que los suba manualmente cada vez |
| Contenido multimedia con IA | Suite de generación de imagen/video/audio/voz | Generar assets de marketing, videos explicativos, doblaje, avatares — útil para el "Sello ORASIC" en proyectos que incluyen contenido, no solo software |
| Navegador | Claude en Chrome | Automatizar tareas en apps web que no tienen MCP propio (ej. portales sin API) |
| Escritorio | Control de computadora | Automatizar apps de escritorio nativas cuando no hay alternativa vía API |
| Tareas programadas | Scheduled tasks | Convertir cualquier workflow en un proceso recurrente (reportes diarios, chequeos semanales) sin que tú tengas que disparar cada corrida |

## Requieren que autorices el acceso (ya aparecen listados, falta login)

| Categoría | Conectores pendientes | Relevancia para ORASIC |
|---|---|---|
| Pagos / cobros | PayPal, Stripe, Square, QuickBooks | Núcleo de cualquier proyecto de facturación o e-commerce para un cliente PYME |
| CRM / ventas | HubSpot, Close, Apollo, ZoomInfo, Clay, Outreach | Automatizar seguimiento de leads y pipeline — pieza fuerte para clientes con equipo comercial |
| Comunicación | Gmail, Slack, Google Calendar | Base de casi cualquier agente de atención o asistente interno |
| Productividad / gestión | Notion, Asana, ClickUp, Linear, Monday, Atlassian | Para clientes que ya gestionan proyectos en estas herramientas |
| Documentos y firmas | DocuSign, Canva, Google Drive, MS365 | Entregables, contratos, diseño de marca del cliente |
| Marketing / SEO | Ahrefs, Klaviyo, Similarweb, Supermetrics | Reportes de marketing automatizados |
| Analítica de producto | Amplitude, Pendo | Para clientes que ya construyen producto digital propio |
| Datos | BigQuery | Análisis de datos a gran escala si el cliente ya tiene su data warehouse |

Para activarlos: conectores de claude.ai se autorizan desde configuración de conectores; el resto vía `claude mcp` o `/mcp` en una sesión interactiva. Actívalos solo cuando un proyecto real los necesite — no actives todo "por si acaso", eso ensucia tu llavero.

## El hueco LATAM real (esto es honesto, no está resuelto todavía)

El documento original promete un "llavero de integraciones con herramientas LATAM" como diferenciador. Hoy, en este inventario, **no hay ningún conector nativo para**: Mercado Pago, Nequi, Yape, PSE, WhatsApp Business API, facturación electrónica local (DIAN, SAT, SII, SUNAT), ni bancos locales. Eso significa que el diferenciador LATAM del sello ORASIC **todavía no existe como MCP listo** — hoy se resolvería con integraciones custom (vía API REST directa) por cada proyecto, no con un conector reutilizable. Es una brecha real que vale la pena resolver pronto si el diferenciador LATAM es central a tu propuesta de valor.

## Registro de MCPs probados por proyecto

| Proyecto | MCP usado | Funcionó bien / problema encontrado | Fecha |
|---|---|---|---|
| <<< COMPLETAR conforme uses cada uno >>> | | | |
