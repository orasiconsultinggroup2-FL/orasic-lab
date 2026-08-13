---
name: plan-medios-contenido-redes
description: Genera un plan de medios y contenido multiformato para redes sociales (copy, guion de video, calendario, hashtags, CTA) a partir de un dolor/segmento validado, junto con una plantilla de carga manual de métricas para diagnosticar qué corregir. Usar cuando el usuario necesita preparar contenido de redes para un cliente sin herramienta propia de gestión de contenido, típicamente en una consultoría o diagnóstico inicial.
---

# Plan de Medios y Contenido para Redes Basado en Dolor de Audiencia

## Alcance y honestidad técnica
Este skill es completamente autónomo — no depende de ninguna aplicación externa, conector, o herramienta específica del usuario. Se diseñó así deliberadamente: su caso de uso principal es cuando un cliente **no tiene** un Content Studio propio ni presupuesto para uno, por lo que el entregable debe sostenerse solo, como documento.

**Importante sobre publicación real:** ninguna plataforma social (TikTok, Instagram, LinkedIn) entrega métricas completas por API pública abierta para terceros sin integración oficial aprobada. Este skill no asume ni promete publicación automática ni métricas en tiempo real — el módulo de medición se basa en carga manual de datos, que es la única vía realista disponible salvo que el usuario tenga un conector específico ya configurado (ej. TikTok vía un proveedor con OAuth propio), en cuyo caso ese conector se usa aparte, fuera de este skill.

## Posición en el pipeline
Recibe el dolor/segmento validado de Skill 1. Independiente de las skills 2-7; no requiere haberlas corrido antes.

## Entradas obligatorias
1. **Dolor/segmento validado** (de dónde viene el cliente objetivo, qué le frustra o le falta).
2. **Canales relevantes** — dónde consume contenido ese segmento específico, no una lista genérica de redes.
3. **Objetivo de la campaña** (awareness, leads, venta directa, portafolio).
4. **Presupuesto disponible** o si es 100% orgánico.
5. **Duración del plan** (ej. 30 días, un mes de lanzamiento).

## Salida — documento único consolidado
Un solo documento con las siguientes secciones (se decidió consolidar en uno solo, no en archivos separados, para reducir fricción de gestión en clientes sin equipo dedicado):

### 1. Resumen del enfoque
2-3 líneas: qué dolor ataca el contenido y por qué esos canales.

### 2. Calendario de contenido
Tabla: fecha / plataforma / pilar de contenido / idea / formato / objetivo (awareness, leads, etc.) / CTA.

### 3. Guiones y copy por pieza
Para cada pieza del calendario: guion o copy completo, hashtags sugeridos, CTA específico.

### 4. Plantilla de métricas y diagnóstico
Tabla para carga manual post-publicación (vistas, guardados, comentarios, mensajes generados) + una guía breve de qué indica cada patrón (ej. "alto alcance, bajo guardado → el hook funciona pero el contenido no engancha") para que el cliente sepa qué corregir sin depender de un analista.

## Ejemplo de uso
Cliente de retail local sin presupuesto para gestión de redes: se entrega un documento de 30 días con calendario, guiones listos para grabar/publicar manualmente, y la plantilla de métricas para que el propio dueño cargue números semanalmente y ajuste.

## Qué NO hacer
- No prometer publicación automática ni "un botón" salvo que el usuario confirme tener un conector real disponible, y en ese caso, tratarlo como herramienta aparte, no como parte de este skill.
- No inventar canales "de moda" si no coinciden con dónde está realmente el segmento del cliente.
- No fragmentar el entregable en varios documentos — se prioriza un solo documento consolidado.
