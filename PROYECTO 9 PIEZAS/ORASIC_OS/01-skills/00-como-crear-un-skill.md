# Pieza 6 — Skills: cómo documentar uno nuevo

## Principio
Un skill de ORASIC no es "un prompt que funcionó una vez". Es una función documentada, con entrada/salida claras, probada, y reusable sin que tengas que recordar cómo la hiciste funcionar la primera vez.

## Cuándo crear un skill nuevo
Cuando te repites. Si hiciste la misma tarea (o una variante cercana) dos veces para clientes/proyectos distintos, la tercera vez debería ser un skill, no un prompt improvisado.

## Plantilla de documentación por skill

```markdown
# Skill: [nombre]

## Qué hace
[una frase]

## Cuándo usarlo (trigger)
[qué pide el usuario/cliente para que este skill se active]

## Entrada esperada
[qué datos/archivos necesita]

## Salida
[qué produce — archivo, texto, acción]

## Modelo recomendado
[según politica-modelos.md]

## Costo típico observado
[según politica-tokens-costos.md, se llena después de 3-5 usos reales]

## Limitaciones conocidas
[qué NO puede hacer todavía]

## Historial de uso
| Fecha | Proyecto | Resultado |
|---|---|---|
```

## Regla operativa
1. **No documentes el skill hasta que lo hayas usado al menos dos veces con éxito.** Documentar demasiado pronto congela una solución que todavía no está probada.
2. Un skill sin "limitaciones conocidas" documentadas no está listo para reutilizarse en un proyecto de cliente — es una promesa sin garantía.
3. Cuando un skill falla en un proyecto nuevo, la corrección va al historial de uso, no se pierde en el chat de esa sesión.
