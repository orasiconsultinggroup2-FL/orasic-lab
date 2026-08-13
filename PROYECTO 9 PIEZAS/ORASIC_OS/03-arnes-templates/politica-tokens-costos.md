# Pieza 1 — Tokens: medir costo por tarea, no por uso

## Principio
No mides "cuántos tokens gastó el modelo". Mides **cuánto costó completar una tarea de negocio** (una cotización generada, un ticket resuelto, un reporte armado). Esa es la diferencia entre transparencia real para el cliente y una métrica que a nadie le importa.

## Fórmula de costo por tarea

```
Costo por tarea = (tokens de entrada × precio input del modelo)
                 + (tokens de salida × precio output del modelo)
                 + costo de llamadas a herramientas/MCPs de terceros (si las hay)
```

Para saber los precios vigentes por modelo, no los inventes ni los memorices: consulta `https://docs.claude.com` antes de cotizar a un cliente, porque cambian.

## Qué registrar por cada tarea (plantilla de log)

| Fecha | Proyecto | Tarea completada | Modelo usado | Tokens in/out | Costo estimado | # de intentos hasta éxito |
|---|---|---|---|---|---|---|
| | | | | | | |

`# de intentos hasta éxito` importa tanto como el costo: una tarea que cuesta poco pero falla 3 veces antes de salir bien es más cara de lo que parece (tiempo tuyo + reintentos).

## Regla operativa para ORASIC LAB

1. Antes de escribir código de producción para un cliente, define el **presupuesto de tokens por tarea tipo** (ej. "responder un ticket de soporte no debería costar más de X").
2. Si una tarea excede el presupuesto sistemáticamente, es señal de que el modelo elegido es demasiado grande para esa tarea (revisa `politica-modelos.md`) o de que el prompt/skill está mal diseñado (demasiado contexto innecesario).
3. Este log es lo que alimenta la "transparencia total en costos de IA operativa" que el documento original promete al cliente — sin este registro, esa promesa es marketing vacío.

<<< COMPLETAR >>>: define aquí tus presupuestos por tipo de tarea una vez tengas 2-3 semanas de datos reales de tu propio uso (cliente cero).
