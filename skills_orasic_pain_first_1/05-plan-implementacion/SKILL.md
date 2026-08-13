---
name: plan-implementacion-por-fases
description: Genera un plan de implementación por etapas que separa claramente qué se construye en el MVP versus versiones posteriores, y que incluye actividades explícitas para mitigar riesgos de adopción y dolores de transición. Usar cuando el usuario necesita planificar el desarrollo o despliegue de una solución real, no solo documentarla.
---

# Plan de Implementación por Etapas (MVP / v2 + Mitigación de Riesgo)

## Ajuste respecto a versiones anteriores
La versión original de este skill se enfocaba solo en mitigar riesgos de adopción humana (resistencia al cambio, miedo a lo desconocido). Se mantiene esa capa, pero se añade una **separación explícita de alcance por fase (MVP vs. v2 vs. futuro)**, porque este paquete de skills ahora puede alimentar construcción real de apps para clientes, y un plan sin esa separación no es accionable para un equipo técnico.

## Posición en el pipeline
Puede recibir como entrada el output de Skill 4 (Historias de Usuario) para tener claridad de qué funcionalidades existen antes de secuenciarlas.

## Entradas obligatorias
1. **Alcance del proyecto** (funcionalidades/módulos, idealmente desde Skill 4).
2. **Dolor(es) principal(es)** que la solución debe aliviar.
3. **Riesgos conocidos de implementación** (resistencia al cambio, integración con sistemas críticos, baja adopción por percepción de complejidad).
4. **Recursos disponibles o limitaciones** (equipo, presupuesto, tiempo).
5. **Fecha límite u horizonte temporal.**

## Salida

### Parte 1 — Alcance por versión
- **MVP:** funcionalidades mínimas que resuelven el dolor crítico. Todo lo demás se pospone explícitamente.
- **v2 / siguiente iteración:** funcionalidades que mejoran pero no son bloqueantes para el alivio del dolor principal.
- **Futuro / no comprometido:** ideas mencionadas pero fuera de alcance actual — se documentan para no perderlas, sin comprometer fecha.

### Parte 2 — Plan por fases
- **Fase 1 (Descubrimiento):** mapeo de dolor actual + co-diseño con usuarios afectados, para asegurar que el MVP resuelve el dolor real.
- **Fase 2 (Diseño/Prototipo):** pruebas de usabilidad con usuarios que sufren el dolor, para validar el MVP antes de invertir en desarrollo completo.
- **Fase 3 (Desarrollo):** sprint inicial enfocado en el flujo que más reduce el dolor crítico. Se definen métricas de alivio del dolor como KPIs de sprint.
- **Fase 4 (Pruebas):** escenarios que replican situaciones reales de alto dolor/estrés del usuario.
- **Fase 5 (Despliegue/Capacitación):** plan de capacitación centrado en "cómo esto te libera de [dolor específico]", con materiales que anticipan preguntas y miedos conocidos.

Cada fase incluye estimación de duración y responsables cuando esa información esté disponible; si no, se deja como campo a completar, sin inventar plazos.

## Ejemplo de uso
Implementación de un sistema de compras públicas en una alcaldía: la fase inicial se dedica exclusivamente a mapear los dolores específicos de los funcionarios de compras antes de diseñar cualquier pantalla, y el MVP se limita a resolver solo el dolor de mayor impacto (trazabilidad), dejando reportes avanzados para v2.

## Qué NO hacer
- No mezclar MVP y v2 en una sola lista sin distinción — la separación es obligatoria.
- No inventar fechas o duraciones si el usuario no las proporcionó.
- No omitir la fase de validación con usuarios reales solo porque el cliente tiene prisa — señalar el riesgo si se salta.
