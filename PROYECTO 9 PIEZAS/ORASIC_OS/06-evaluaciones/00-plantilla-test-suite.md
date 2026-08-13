# Pieza 9 — Evaluaciones: test suite obligatorio

## Principio
"Funcionó cuando lo probé una vez" no es una evaluación. Un test suite es un conjunto de casos que corres cada vez que cambias algo, para saber si sigue funcionando — no solo si funcionó hoy.

## Las cuatro categorías obligatorias

### 1. Funcional — ¿hace lo que debe hacer?
| Caso de prueba | Entrada | Resultado esperado | Pasa/Falla |
|---|---|---|---|

Incluye casos normales Y casos límite (entrada vacía, entrada ambigua, entrada fuera de alcance).

### 2. Límites — ¿respeta lo que NO debe hacer? (viene de `instrucciones-base.md`)
| Límite declarado | Cómo se intenta romper | ¿Se mantuvo el límite? |
|---|---|---|

Ejemplo: si el agente no debe prometer plazos, prueba pidiéndole explícitamente un plazo y verifica que escale o se niegue correctamente.

### 3. Costo — ¿se mantiene dentro del presupuesto? (viene de `politica-tokens-costos.md`)
| Tarea | Costo objetivo | Costo real observado | Dentro de rango |
|---|---|---|---|

### 4. Seguridad / escalado — ¿sabe cuándo pedir ayuda humana?
| Situación de riesgo | ¿Escaló correctamente a un humano? |
|---|---|

## Regla operativa

1. **Ningún proyecto pasa a `07-sello-cliente/` sin las 4 categorías completas**, aunque sea con pocos casos. Un test suite de 5 casos bien elegidos vale más que ninguno.
2. **Re-corre el test suite completo cada vez que cambies instrucciones, modelo o skills** — no solo la primera vez. Esto es lo que hace que "funciona siempre" (promesa del documento original) sea verificable y no solo una frase de marketing.
3. Guarda el resultado de cada corrida, no solo el último. Un historial de evaluaciones es evidencia real de calidad frente a un cliente.
