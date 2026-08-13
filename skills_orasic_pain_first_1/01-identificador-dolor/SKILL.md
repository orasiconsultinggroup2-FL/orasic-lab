---
name: identificador-dolor-sectorial
description: Identifica y genera ideas de negocio o de producto a partir de un dolor sectorial específico, verificable y evidenciado. Es el punto de entrada de todo el pipeline pain-first (skills 2 a 8). Usar cuando el usuario quiere explorar oportunidades de negocio, validar un problema antes de construir una solución, o iniciar un diagnóstico con un cliente/sector.
---

# Identificador y Generador de Ideas de Negocio Basado en Dolor Sectorial

## Posición en el pipeline
Primer eslabón. Su output alimenta directamente a: Skill 2 (Entregables Estratégicos), Skill 7 (Stack Tecnológico) y, en general, cualquier skill del paquete que requiera un "dolor validado" como entrada.

## Regla no negociable: evidencia obligatoria
A diferencia de versiones anteriores de este framework, **no se genera ninguna idea sin evidencia del dolor**, aunque sea estimada. Si el usuario no la tiene, Claude debe:
1. Preguntar explícitamente por la fuente (dato propio, queja recurrente, estudio de sector, observación directa).
2. Si no existe evidencia dura, marcar el dolor como **"estimado, no verificado"** en el output — nunca presentarlo como dato confirmado.
3. Nunca inventar cifras, porcentajes o estudios que no fueron proporcionados por el usuario ni encontrados en una búsqueda real.

Esto protege contra el mayor riesgo del framework: construir sobre un dolor que no existe o es menor de lo que se asume.

## Entradas obligatorias
1. **Sector/industria específica** (ej. salud pública, retail de alimentos, municipalidad, construcción).
2. **Dolor(es) específico(s)**, con evidencia o estimación declarada como tal (ej. "pérdida del 30% de medicamentos por vencimiento en farmacias municipales por falta de trazabilidad — dato del propio cliente" vs. "estimado: alta tasa de abandono en trámites, sin dato duro aún").
3. **Escala objetivo** (pyme, mediana empresa, gran empresa, entidad pública).

Si falta el dolor específico, Claude no debe generar ideas genéricas de "innovación en el sector" — debe pedir que se precise antes de continuar.

## Filtro previo: ¿vale la pena resolver este dolor?
Antes de generar ideas, Claude evalúa brevemente (2-3 líneas) si el dolor declarado tiene el tamaño suficiente para justificar una solución dedicada: frecuencia, costo aproximado, cantidad de afectados. Si el dolor parece menor o anecdótico, Claude lo dice directamente en vez de inflarlo con ideas de negocio innecesarias.

## Salida
Lista de 3-5 ideas de negocio. Cada una debe indicar explícitamente:
- **a) Dolor que aborda** — citando literalmente la entrada proporcionada por el usuario.
- **b) Descripción breve de la solución.**
- **c) Propuesta de valor** vinculada directamente a la reducción/eliminación de ese dolor.
- **d) Modelo de ingreso sugerido.**
- **e) Estado de la evidencia** — "validado con dato" o "estimado, pendiente de validar".

## Ejemplo de uso
Iniciar un taller de innovación con un cliente gubernamental sobre gestión de residuos: primero se documentan sus dolores específicos con datos (bajos índices de reciclaje, costo de rellenos sanitarios) antes de generar cualquier idea.

## Qué NO hacer
- No generar ideas "creativas" desconectadas del dolor de entrada.
- No presentar estimaciones como si fueran datos confirmados.
- No saltar el filtro de tamaño del dolor solo porque el usuario ya tiene entusiasmo por una idea.
