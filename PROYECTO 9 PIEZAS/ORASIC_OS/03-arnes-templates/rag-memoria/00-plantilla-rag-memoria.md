# Pieza 4 — RAG + Memoria: base de conocimiento que aprende del negocio del cliente

## Advertencia honesta antes de la plantilla
Esta es la pieza que **menos sentido tiene construir en abstracto sin un cliente real**. Un RAG genérico "para cualquier negocio" es una carpeta vacía disfrazada de producto. No la sobre-construyas ahora — deja lista la estructura, y llénala cuando exista el primer cliente pagante o, mientras tanto, con el negocio real de ORASIC LAB como caso de prueba.

## Qué es (y qué no es)
- **Es:** una fuente de verdad estructurada (documentos, FAQs, catálogo, políticas, histórico de conversaciones relevantes) que el agente consulta antes de responder sobre hechos del negocio.
- **No es:** el modelo "memorizando" conversaciones pasadas sin control. Toda memoria persistente debe ser explícita, revisable y editable por el dueño del negocio — igual que tu propio sistema de memoria en este entorno separa "usuario", "feedback", "proyecto" y "referencia".

## Estructura mínima por proyecto

```
[cliente]/rag/
├── 01-hechos-del-negocio.md      # qué vende, precios, políticas, horarios
├── 02-faq.md                      # preguntas frecuentes con respuesta aprobada
├── 03-tono-y-marca.md             # cómo habla la marca (ejemplos reales)
├── 04-historial-decisiones.md     # decisiones de negocio que el agente debe recordar
└── 05-exclusiones.md              # qué NO debe decir nunca (legal, competidores, promesas)
```

## Regla operativa

1. **Nunca alimentes el RAG con información que el cliente no haya aprobado explícitamente.** Es su negocio, no una inferencia tuya.
2. **Separa hechos verificables de opiniones/tono.** Un hecho mal cargado (precio incorrecto) es un error de negocio; un tono mal cargado es un error de tono. Se corrigen distinto.
3. **Revisión periódica obligatoria:** el "cerebro empresarial que aprende" que promete el sello ORASIC solo es honesto si hay un proceso humano de revisión — no auto-aprendizaje sin supervisión.

## Para tu propio caso (cliente cero, mientras no hay clientes)

<<< COMPLETAR >>>: cuando mapees tu workflow en `05-workflows/01-workflow-cliente-cero-orasic-lab.md`, usa esta misma estructura para documentar el conocimiento de ORASIC LAB (tu propuesta de valor, tu proceso de cotización, tus precios). Es la forma más rápida de probar esta pieza sin inventar un cliente ficticio.
