---
name: entregables-estrategicos-pain-first
description: Genera, a partir de un dolor validado (Skill 1), los tres entregables estratégicos que comunican la misma propuesta en distinto formato- Modelo de Negocio (Canvas), Pitch Deck, y Mensajes de Valor. Usar cuando el usuario necesita presentar una solución a un cliente, inversionista, o equipo interno, en cualquiera de esos tres formatos.
---

# Entregables Estratégicos Basados en Dolor (Canvas / Deck / Mensajes de Valor)

## Por qué está fusionada
Las versiones anteriores separaban Canvas, Pitch Deck y Propuesta de Valor en tres skills distintas. Se fusionaron porque los tres parten exactamente del mismo insumo (dolor + solución + segmento) y generan variantes del mismo contenido central en distinto empaque. Mantenerlas separadas obligaba a repetir el mismo dolor tres veces en una sesión de trabajo real.

## Posición en el pipeline
Depende de Skill 1 (dolor validado). Puede alimentar a Skill 6 (Resumen Ejecutivo) y, si el objetivo es construir una app, a Skill 7 (Stack Tecnológico).

## Entradas obligatorias
1. **Dolor sectorial validado** (output de Skill 1, con su estado de evidencia).
2. **Idea de negocio o solución** que alivia ese dolor.
3. **Segmento de cliente** que experimenta ese dolor.
4. **Formato deseado**: Canvas, Deck, Mensajes de Valor, o los tres.

Si el usuario no especifica formato, Claude pregunta cuál necesita antes de generar los tres — no genera exceso de contenido no pedido.

## Salida por formato

### A) Lienzo de Modelo de Negocio
Cada bloque debe derivarse explícitamente del dolor de entrada:
- Propuesta de Valor: cómo alivia el dolor, en términos concretos.
- Segmentos de Clientes: quién experimenta el dolor.
- Canales/Relaciones: cómo se llega y se apoya a esos clientes.
- Flujos de Ingresos: vinculados al alivio del dolor.
- Recursos/Actividades Clave: enfocados en entregar el alivio.
- Estructura de costos, socios clave (según corresponda).

### B) Esquema de Pitch Deck
- Problema: el dolor específico, con datos o estimaciones (marcadas como tal).
- Solución: mecanismo exacto de alivio.
- Valoración: cuantificación del alivio (ej. "reduce tiempo de trámite de 30 a 5 días") — solo si hay base para la cifra; si no, se marca como proyección.
- Modelo de Negocio: cómo se monetiza el alivio.
- Resto de la estructura estándar de deck (equipo, tracción, ask) según lo que el usuario pida.

### C) Propuesta de Valor y Mensajes Clave
- Frase principal: "[Producto/Servicio] reduce/elimina [dolor específico] en [métrica o resultado] para [cliente objetivo]."
- 3-5 mensajes de apoyo, cada uno vinculando un beneficio con la reducción de un aspecto del dolor.
- Sugerencia de tono adaptado al canal y al estado emocional asociado al dolor.

## Qué NO hacer
- No inventar métricas de "reducción esperada" sin base — marcarlas siempre como proyección si no hay dato.
- No generar los tres formatos si el usuario solo pidió uno.
- No desconectar ningún bloque del dolor de entrada — si un bloque del Canvas no se puede justificar por el dolor, señalarlo en vez de rellenarlo genéricamente.
