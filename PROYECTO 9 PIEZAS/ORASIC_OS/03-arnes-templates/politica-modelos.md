# Pieza 2 — Modelos: elegir la IA correcta según la complejidad de la tarea

## Principio
No uses el modelo más potente disponible "por si acaso". Cada nivel de modelo existe para un tipo de tarea distinto. Usar el modelo equivocado es la forma más común de quemar presupuesto sin mejorar calidad.

## Marco de decisión (aplica a cualquier familia de modelos, no memorices precios aquí — verifica en docs.claude.com)

| Nivel | Cuándo usarlo | Ejemplos de tarea típica en un proyecto ORASIC |
|---|---|---|
| **Rápido / económico** (ej. Haiku) | Tareas de alto volumen, baja ambigüedad, formato predecible | Clasificar un ticket, extraer un dato de un formulario, responder FAQ con respuesta ya conocida |
| **Balanceado** (ej. Sonnet) | La mayoría del trabajo agéntico real: razonamiento moderado, uso de herramientas, generación de contenido | Responder a un cliente con contexto de CRM, generar un borrador de documento, orquestar 2-3 pasos de un workflow |
| **Máxima capacidad** (ej. Opus) | Ambigüedad alta, razonamiento largo, decisiones de negocio con consecuencias, tareas donde un error es costoso | Diseñar la arquitectura de un sistema nuevo, analizar un contrato completo, decisiones que afectan a un cliente directamente |

## Regla operativa

1. **Por defecto, usa el modelo balanceado.** Solo subes de nivel si el modelo balanceado falla repetidamente en una tarea específica (mide esto con el log de `politica-tokens-costos.md`).
2. **Nunca uses el modelo más caro para tareas de alto volumen.** Si vas a correr algo miles de veces (ej. clasificar tickets), un modelo económico bien afinado con un buen prompt gana casi siempre.
3. **Documenta la decisión por skill, no por proyecto.** Cada skill en `01-skills/` debe declarar qué nivel de modelo necesita — así el arnés puede enrutar automáticamente.

## Matriz de enrutamiento por proyecto (se llena al diagnosticar cada cliente)

| Workflow / tarea del cliente | Modelo asignado | Razón |
|---|---|---|
| <<< COMPLETAR >>> | | |
