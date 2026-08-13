# Pieza 7 — Arnés Agéntico: la arquitectura que une todas las piezas

## Principio
El arnés no es una pieza nueva que se construye desde cero por proyecto. Es el ensamblaje de las piezas 1-6 y 8-9 en una configuración concreta para un caso de uso. Si ya hiciste bien las otras piezas, el arnés es mayormente "conectar", no "inventar".

## Ficha de arnés por proyecto (clonar esta plantilla en cada proyecto nuevo)

```markdown
# Arnés — [Nombre del proyecto/cliente]

## 1. Diagnóstico (pieza 8)
Workflow mapeado: [enlace a 05-workflows/]
Problema real que resuelve este agente: [una frase]

## 2. Instrucciones (pieza 3)
[enlace a la instancia de instrucciones-base.md adaptada]

## 3. Modelo(s) asignado(s) (pieza 2)
| Tarea | Modelo | Razón |
|---|---|---|

## 4. Skills activados (pieza 6)
[lista de skills de 01-skills/ usados, con versión/fecha]

## 5. MCPs conectados (pieza 5)
[lista de 02-mcps/ activados para este proyecto, con permisos otorgados]

## 6. RAG / Memoria (pieza 4)
[enlace a la carpeta rag/ del cliente, o "no aplica — proyecto sin necesidad de memoria persistente"]

## 7. Presupuesto de costos (pieza 1)
[costo objetivo por tarea, enlace al log de 03-arnes-templates/politica-tokens-costos.md]

## 8. Evaluaciones (pieza 9)
[enlace al test suite específico de este proyecto]

## 9. Estado de certificación
[ ] Pasa test suite
[ ] Costos dentro de presupuesto
[ ] Límites de instrucciones verificados
[ ] Listo para checklist de Sello ORASIC (07-sello-cliente/)
```

## Regla operativa

1. **No hay arnés sin diagnóstico previo.** Si no llenaste la sección 1 con un workflow real, no estás construyendo un arnés — estás improvisando una arquitectura.
2. **El arnés es lo que hace que el 70% de reutilización prometido en el documento original sea real.** Cada vez que reutilizas un skill, un MCP o una plantilla de instrucciones de un proyecto anterior en vez de crearlo de nuevo, ese es el número que sube.
3. **Guarda una ficha de arnés por proyecto, no la borres al entregar.** Es tu biblioteca de arquitecturas probadas — la próxima vez que un cliente pida algo parecido, clonas la ficha más cercana en vez de empezar de cero.

## Tu primer arnés real (recomendación)

Antes de tener un cliente, construye la ficha de arnés para **ORASIC LAB mismo** (ej. un asistente interno que te ayude a dar seguimiento a prospectos, o que arme cotizaciones). Es la forma más rápida de descubrir en qué falla esta plantilla antes de que un cliente pagante lo note.
