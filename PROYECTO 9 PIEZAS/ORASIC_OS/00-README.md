# ORASIC_OS — Sistema de 9 Piezas (versión operativa)

Este no es el documento conceptual (ese ya existe: `PROYECTO_9_PIEZAS_IA.md.txt`). Esto es la carpeta de trabajo real: plantillas, catálogos y checklists que Fer usa primero para su propio trabajo diario, y que después se convierten en el Sello ORASIC de cada aplicación entregada a un cliente.

## Regla de oro

**Todo lo que hay aquí se prueba primero en ORASIC LAB (cliente cero) antes de ofrecerse a un cliente real.** Si una plantilla no sobrevive el uso diario de Fer, no está lista para venderse como parte del Sello ORASIC. Nada se queda en "documentado pero no probado".

## Mapa de carpetas → pieza

| Carpeta | Pieza(s) | Qué contiene | Estado |
|---|---|---|---|
| `01-skills/` | 6. Skills | Guía para documentar un skill + catálogo de skills ya disponibles | Plantilla lista, catálogo inicial poblado |
| `02-mcps/` | 5. MCPs | Llavero real de integraciones disponibles hoy en este entorno | Catálogo inicial poblado, pendiente de uso real por proyecto |
| `03-arnes-templates/` | 1. Tokens · 2. Modelos · 3. Instrucciones · 7. Arnés | Políticas de costo, enrutamiento de modelos, instrucciones base, y la plantilla maestra que las une | Plantillas listas, faltan datos reales de tu operación |
| `04-arquitecturas/` | — (apoyo transversal) | Patrones genéricos por tipo de app (chatbot, CRM, dashboard) | Esqueleto, se llena con cada proyecto real |
| `05-workflows/` | 8. Workflows | Cuestionario de diagnóstico + primer mapeo real (ORASIC LAB) | Plantilla lista, mapeo de cliente cero pendiente de que tú la respondas |
| `06-evaluaciones/` | 9. Evaluaciones | Checklist de test suite obligatorio | Plantilla lista |
| `07-sello-cliente/` | Resultado final | Checklist de certificación "Sello ORASIC" + qué activa ORASIC Care | Plantilla lista |

## Cómo se usa esto en tu día a día (antes de tener clientes)

1. **Esta semana:** llena `05-workflows/01-workflow-cliente-cero-orasic-lab.md` con tu propio proceso real (cómo captas un prospecto, cómo cotizas, cómo entregas). Es el primer workflow real del sistema.
2. **De ese mapeo salen tareas repetitivas.** Cada tarea repetitiva que identifiques es candidata a `01-skills/` (algo que escribes una vez y reusas) o `02-mcps/` (una integración que necesitas).
3. **Cada vez que construyas un skill nuevo,** documéntalo con la plantilla de `01-skills/00-como-crear-un-skill.md` — no lo dejes suelto en tu cabeza o en un chat.
4. **Antes de considerar "terminada" cualquier pieza,** pásala por `06-evaluaciones/00-plantilla-test-suite.md`.
5. **Cuando aparezca el primer cliente real,** el arnés (`03-arnes-templates/00-plantilla-arnes-agentico.md`) es lo que instancias por proyecto, y `07-sello-cliente/` es el checklist que decide si esa app sale con el Sello ORASIC.

## Cómo se convierte en Sello ORASIC por proyecto

El orden no es "usar las 9 piezas siempre completas". Es: **diagnóstico real → seleccionar solo las piezas que ese cliente necesita → construir reusando lo que ya existe en esta carpeta → evaluar → certificar con el checklist de `07-sello-cliente/`.** Un proyecto pequeño puede no necesitar RAG+Memoria completo; forzarlo sin necesidad es sobre-ingeniería, no es un mejor sello.

## Qué falta que solo tú puedes llenar

Ninguna plantilla de esta carpeta inventa datos de tu negocio, tus precios, tus clientes objetivo o tus herramientas LATAM específicas (Mercado Pago, WhatsApp Business, DIAN/SAT/SII, etc.) porque no los conozco y no me corresponde inventarlos. Cada plantilla tiene una sección `<<< COMPLETAR >>>` para eso.
