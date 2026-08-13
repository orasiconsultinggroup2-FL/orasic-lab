---
name: resumen-ejecutivo-dolor-resuelto
description: Genera un resumen ejecutivo de 250-350 palabras para informes de consultoría, estructurado para llevar al lector directamente del dolor de negocio a la solución y su impacto cuantificado. Usar cuando el usuario necesita cerrar un informe de consultoría o presentar una recomendación a un público ejecutivo.
---

# Resumen Ejecutivo Centrado en el Dolor Resuelto

## Posición en el pipeline
Es el cierre natural del pipeline: recibe el dolor validado (Skill 1) y la solución/modelo de negocio (Skill 2) para producir el documento que un ejecutivo lee primero y, muchas veces, el único que lee completo.

## Entradas obligatorias
1. **Descripción detallada del dolor/síntoma** identificado, con datos de impacto si están disponibles (o marcados como estimación).
2. **Descripción de la solución propuesta** y su mecanismo específico de alivio.
3. **Resultados esperados**, en términos de reducción/eliminación del dolor, con métricas clave — siempre distinguiendo dato real de proyección.
4. **Público objetivo ejecutivo** — su preocupación típica suele ser costo, riesgo, reputación o cumplimiento.

## Salida
Texto de 250-350 palabras, estructura de 4 párrafos:

1. **Párrafo 1 — El dolor:** define claramente el problema que está costando dinero, generando riesgo o afectando el servicio. Cifra el impacto si hay dato; si no, se declara como estimación.
2. **Párrafo 2 — La solución:** presenta la propuesta y explica cómo alivia directamente el dolor descrito.
3. **Párrafo 3 — El impacto esperado:** cuantifica el alivio proyectado y su relación con las preocupaciones del ejecutivo (costo, riesgo, reputación, cumplimiento).
4. **Párrafo 4 — Próximos pasos:** enfocados en validar y escalar el alivio del dolor, no en generalidades.

Al final, Claude puede sugerir una visualización simple (ej. "gráfico de barras: tiempo promedio de trámite antes/después") si ayuda a comunicar el antes/después, pero no genera la visualización a menos que se le pida.

## Ejemplo de apertura
"El 35% de las solicitudes de préstamo Pymes son abandonadas durante el proceso de documentación, generando una pérdida estimada de $1.2M/año en oportunidades..." — seguido de cómo la solución propuesta reduce ese abandono atacando los puntos de fricción identificados.

## Qué NO hacer
- No inflar el párrafo 3 con cifras de impacto que no tienen respaldo — marcar siempre como proyección si no hay dato duro.
- No exceder las 350 palabras — el formato ejecutivo depende de la brevedad.
- No usar jerga técnica que no le hable directamente a la preocupación del ejecutivo (costo, riesgo, reputación, cumplimiento).
