# Sello ORASIC — checklist de certificación antes de entregar

Ninguna aplicación sale con el Sello ORASIC si no marca todo lo siguiente. Esto es lo que separa "hicimos una app con IA" de "entregamos un sistema con garantías reales" — es tu diferenciación de verdad, no el logo.

## Checklist

- [ ] **Diagnóstico documentado** — existe un workflow mapeado (`05-workflows/`) que justifica cada pieza usada, no piezas usadas "porque existían"
- [ ] **Instrucciones con límites explícitos** — el system prompt declara qué NO hace el agente y cuándo escala a un humano
- [ ] **Modelo(s) justificado(s) por tarea** — no se usó el modelo más caro donde uno económico bastaba
- [ ] **Costos medidos y documentados** — el cliente recibe un costo real por tarea, no una estimación genérica
- [ ] **Test suite completo y pasando** — las 4 categorías de `06-evaluaciones/` corridas y documentadas
- [ ] **RAG/memoria revisada por el cliente** (si aplica) — el cliente aprobó explícitamente la información cargada, no se asumió
- [ ] **Documentación técnica de entrega** — qué se construyó, con qué piezas, cómo mantenerlo
- [ ] **ORASIC Care definido** — qué incluye el acompañamiento post-entrega, con qué cadencia, y quién responde si algo falla

## Qué recibe el cliente al final (paquete de entrega)

1. La aplicación funcionando
2. Documento de arquitectura (la ficha de arnés de ese proyecto, sin datos internos de ORASIC)
3. Reporte de costos operativos esperados
4. Resumen de test suite (qué se probó, qué garantiza)
5. Propuesta de ORASIC Care (si aplica)

## Nota honesta

Este checklist certifica *proceso*, no resultado de negocio. No promete que el proyecto le genere X ingresos al cliente — promete que se construyó con disciplina verificable. Es una distinción importante para no sobre-vender el sello en una propuesta comercial.
