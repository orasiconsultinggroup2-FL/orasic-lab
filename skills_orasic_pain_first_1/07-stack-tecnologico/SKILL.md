---
name: recomendador-stack-tecnologico
description: Recomienda arquitectura y stack tecnológico considerando escala, funcionalidad y restricciones reales de implementación (equipo disponible, presupuesto, sistemas legados, requisitos de cumplimiento). Usar cuando el usuario necesita decidir qué tecnología usar para construir una app o sistema, especialmente antes de definir historias de usuario técnicas.
---

# Recomendador de Stack Tecnológico

## Ajuste respecto a versiones anteriores
Se eliminó el framing forzado de "dolor" que tenía la versión original de este skill. Es una skill técnica normal — recomienda arquitectura por restricciones reales, no necesita encajar artificialmente en la estructura pain-first del resto del paquete.

## Posición en el pipeline
**Si el objetivo es construir una app real para un cliente, esta skill debe ejecutarse antes de Skill 4 (Historias de Usuario + Wireframes)** — las historias de usuario y sus criterios de aceptación dependen del stack ya decidido. Si el objetivo es solo asesorar sin construir, puede usarse de forma independiente.

## Entradas obligatorias
1. **Tipo de aplicación y escala estimada.**
2. **Restricciones reales de implementación**, por ejemplo:
   - Sistemas legados con los que debe integrarse.
   - Habilidades del equipo interno disponible.
   - Presupuesto y tiempo disponibles.
   - Requisitos de cumplimiento (ej. accesibilidad, protección de datos).
3. **Preferencias del cliente** (cloud/on-prem, presupuesto aproximado).

Si el usuario no da restricciones reales, Claude pregunta antes de recomendar — una recomendación de stack sin restricciones reales es genérica y poco útil.

## Salida
Tabla de recomendación donde cada elección se justifica contra una restricción real de entrada:

| Restricción | Recomendación | Justificación |
|---|---|---|
| Necesita integrarse con sistema legado en COBOL, sin presupuesto para reemplazo | Node.js + módulo de comunicación TN3270 | Evita reemplazo costoso del legacy |
| Equipo interno solo maneja PHP | WordPress + plugin de formularios dinámicos | Aprovecha habilidades existentes, reduce tiempo y costo de capacitación |

Incluye, cuando aplique: backend, frontend, base de datos, hosting/infraestructura, y cualquier consideración de cumplimiento relevante.

## Ejemplo de uso
Propuesta técnica para una pyme manufacturera sin personal TI especializado: se recomienda stack low-code/no-code para minimizar dependencia de desarrolladores caros, justificado explícitamente por esa restricción.

## Qué NO hacer
- No recomendar tecnología "de moda" sin conectarla a una restricción real declarada.
- No asumir presupuesto ilimitado si el usuario no lo confirma.
- No forzar el framing de "dolor" en la salida — esta skill es técnica, no de negocio.
