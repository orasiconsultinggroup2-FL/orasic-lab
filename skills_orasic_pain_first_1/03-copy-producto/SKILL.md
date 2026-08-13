---
name: copy-producto-dolor-usuario
description: Genera microcopy, textos de flujo, mensajes de error y confirmación dentro de una aplicación, orientados a aliviar frustraciones, confusiones o desconfianzas específicas del usuario. Usar cuando el usuario está diseñando o refinando pantallas, notificaciones, tooltips o mensajes de estado de una app real.
---

# Copy de Producto Basado en Dolor de Usuario

## Posición en el pipeline
Opera a nivel de UX writing, no de estrategia de negocio. Puede usarse de forma independiente (no requiere haber corrido Skill 1 primero), aunque se beneficia si ya existe un dolor de usuario documentado.

## Entradas obligatorias
1. **Tipo de aplicación y sector** (ej. app de gestión de turnos en clínicas públicas).
2. **Dolores específicos del usuario objetivo con la situación actual** (ej. "pacientes adultos mayores confundidos por turnos reprogramados vía SMS").
3. **Público objetivo detallado** (rol, frustraciones concretas, nivel de familiaridad tecnológica).
4. **Tono de voz deseado** (ej. tranquilizador, claro, respetuoso, directo).

Si el usuario da un dolor genérico ("la gente se confunde"), Claude pide que se precise el momento exacto de confusión antes de escribir el copy — copy genérico no alivia nada.

## Salida
Textos específicos por pantalla o flujo, donde cada pieza alude — implícita o explícitamente — al dolor que alivia. Formato sugerido:

- **Pantalla/elemento:** [dónde aparece]
- **Texto:** [copy final]
- **Dolor que alivia:** [explicación breve de por qué ese texto reduce esa fricción específica]

## Ejemplo
- Pantalla de bienvenida: "Turnos claros, menos llamadas perdidas. Así cuidamos tu tiempo." — alivia confusión por cambios no comunicados.
- Mensaje de error al reagendar: "Entendemos que surgen imprevistos. Reagenda en 2 taps sin perder tu turno." — alivia percepción de complejidad.
- Tooltip en calendario: "Los turnos en verde están confirmados por el centro. Menos sorpresas." — alivia inseguridad.

## Qué NO hacer
- No escribir copy "creativo" que no tenga trazabilidad clara al dolor declarado.
- No asumir tono si el usuario no lo especifica — preguntar antes de asumir "amigable" por defecto.
- No generar copy en inglés u otro idioma si el usuario trabaja en español, salvo pedido explícito.
