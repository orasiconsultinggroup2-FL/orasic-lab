---
name: historias-usuario-wireframes
description: Genera historias de usuario (formato Como/quiero/para que) junto con la descripción textual del flujo de pantallas que las resuelve, ambas centradas en la eliminación de un dolor específico. Usar cuando el usuario está definiendo el backlog o los requisitos de una app real, especialmente si el objetivo final es que un equipo construya esa app.
---

# Historias de Usuario + Flujo de Pantallas Basado en Dolor

## Por qué está fusionada
Historia de usuario y wireframe casi siempre se generan juntos en un flujo de trabajo real: se define el flujo antes de escribir el ticket, o el ticket obliga a pensar el flujo. Mantenerlos separados forzaba a invocar dos skills distintas para una sola tarea de producto.

## Posición en el pipeline
**Requiere Skill 7 (Stack Tecnológico) como entrada previa si el objetivo es construir una app real** — los criterios de aceptación y la factibilidad del flujo dependen de qué stack ya se decidió. Si el objetivo es solo documentar (sin construir aún), puede usarse sin ese prerrequisito, pero Claude debe advertirlo.

## Entradas obligatorias
1. **Dolor de usuario específico y validado** (ej. "los ciudadanos adultos mayores abandonan el trámite de subsidio porque requieren ir presencialmente 3 veces").
2. **Rol del usuario** que experimenta el dolor.
3. **Objetivo de negocio** vinculado al alivio del dolor (ej. "aumentar completitud de trámites en un 40%" — marcado como meta, no como resultado garantizado).
4. **Stack tecnológico ya decidido** (si existe — output de Skill 7).

## Salida

### A) Historias de usuario
Formato:
> Como [rol que sufre el dolor],
> quiero [acción que alivia el dolor],
> para que [beneficio concreto que elimina/reduce el dolor].

Con criterios de aceptación verificables (ej. "El usuario completa el envío del documento en menos de 3 minutos sin necesidad de visitar una oficina").

### B) Flujo de pantallas (wireframe textual)
Para cada pantalla del flujo:
- Qué muestra.
- Qué paso del dolor elimina o reduce específicamente.
- Qué información pide y por qué (solo lo estrictamente necesario — se debe justificar cada campo).

## Ejemplo de uso
Backlog inicial para un sistema de gestión de turnos hospitalarios, partiendo del dolor de "pacientes esperando horas sin información": la historia de usuario define la acción, el wireframe define cómo la pantalla de estado en tiempo real resuelve la ansiedad de espera.

## Qué NO hacer
- No generar historias de usuario sin criterios de aceptación verificables.
- No diseñar flujos que ignoren las restricciones del stack ya decidido (si existe).
- No pedir más campos de información de los estrictamente necesarios para resolver el dolor — cada campo debe justificarse.
