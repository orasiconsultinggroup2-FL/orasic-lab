# ORASIC Lead Hunter

Busca profesionales en LinkedIn por rubro, cargo y ubicación, guarda cada uno en una base de
datos local, los analiza con IA y escribe un mensaje de contacto distinto para cada uno —
listo para copiar y pegar en LinkedIn.

Construido a partir del método del video, adaptado a ORASIC Lab: los ajustes ya vienen
cargados con tu nombre, tu empresa y tu oferta (diagnóstico gratuito de 20 min).

---

> **La app se explica sola.** Al abrirla por primera vez arranca un **tour guiado** de 16 pasos
> que señala cada parte con globos (se repite desde el botón *Ver tour*). Y en la pestaña
> **Manual** está todo por escrito. Este README es solo la parte técnica.

## Verla funcionando sin claves (2 minutos)

```bash
node lead-hunter/server.js
```

Abrí http://localhost:5070 → pestaña **Buscar** → botón **Cargar demo**. Carga 6 perfiles de
ejemplo (inventados) con su análisis y su mensaje ya escritos. No busca nada en LinkedIn, no
gasta nada y no necesita ninguna clave.

---

## Arrancar de verdad en 3 pasos

### 1. Conseguir las dos claves — las dos gratis, ninguna pide tarjeta

**Google Gemini** (analiza los perfiles y escribe los mensajes):
1. https://aistudio.google.com/apikey — entrás con tu Gmail.
2. *Create API key* → copiala. Empieza con `AIza...`
3. Plan gratuito real: sin tarjeta, sin vencimiento.

**Apify** (entra a LinkedIn):
1. Registrate en https://console.apify.com — **sin tarjeta**, US$ 5 de crédito por mes.
2. **Settings → Integrations** (https://console.apify.com/settings/integrations).
3. Tocá el ojito para revelar el **Personal API token** y copialo.

> Anthropic y OpenAI siguen soportados (`ANTHROPIC_API_KEY` / `OPENAI_API_KEY`) pero **ninguna
> de las dos tiene plan gratuito**: se pagan por uso. Por eso el camino por defecto es Gemini.

### 2. Pegar las claves

Copiá `.env.example` a `.env` y pegá tus claves adentro:

```bash
cd "lead-hunter" && cp .env.example .env
```

El archivo `.env` está en `.gitignore` — nunca se sube a GitHub.

### 3. Levantar la app

```bash
node lead-hunter/server.js
```

Abrí http://localhost:5070

No hay que instalar nada: no usa ninguna dependencia de npm, solo Node 20+.

---

## Cómo se usa

**Buscar** — escribís el rubro (`clinica dental`, `gimnasio`, `agencia de marketing`), agregás
los cargos que te interesan (Fundador, Gerente General, CEO), elegís país / región / ciudad y
cuántos leads traer. La app te muestra el costo estimado en Apify **antes** de buscar.

Mientras corre vas viendo el progreso real: buscando perfiles → trayendo publicaciones →
redactando mensajes uno por uno.

**Leads** — todo cae en un tablero kanban con 5 columnas: Nuevos, Contactados, Respondieron,
Sin respuesta, Reunión agendada. Arrastrás las tarjetas de una columna a otra. Tocás una
tarjeta y ves:

- el análisis que hizo la IA del perfil,
- el gancho concreto que usó para personalizar,
- un puntaje de encaje del 1 al 10,
- sus últimas publicaciones,
- el mensaje **editable**. El botón *Copiar* respeta los saltos de línea que agregues a mano
  (el bug que se ve en el video está arreglado).

También podés regenerar el mensaje, abrir el perfil de LinkedIn, dejar una nota interna y
exportar todo a CSV.

**Ajustes** — tu nombre, tu empresa, qué hace, la oferta concreta y el idioma de los mensajes.
Cuanto más específica la oferta, mejores salen los mensajes. Si algún día vendés este sistema
a un cliente, lo único que cambia es esta pantalla.

---

## Cuánto cuesta

Apify cobra por búsqueda: **US$ 0.10 por página** (25 perfiles) + **US$ 0.004 por perfil**.

| Leads | Costo aprox. |
|-------|--------------|
| 20    | US$ 0.18     |
| 50    | US$ 0.40     |
| 100   | US$ 0.80     |
| 150   | US$ 1.20     |

Con los US$ 5 gratis del plan mensual entran unos 600 leads, y se renuevan solos cada mes. La IA
(Gemini) no cuesta nada en el plan gratuito.

Como no hay tarjeta cargada en ningún lado, cuando el crédito se agota la búsqueda falla y avisa.
**No hay forma de que te cobren sin querer.**

---

## Cómo está armado

```
lead-hunter/
  server.js          servidor HTTP (Node puro, cero dependencias)
  lib/apify.js       llamadas a los actores de LinkedIn + normalización de perfiles
  lib/ai.js          prompt de análisis y redacción (Anthropic / OpenAI)
  lib/store.js       base de datos = JSON en /data, con escritura atómica
  lib/env.js         lector de .env
  public/            index.html + styles.css + app.js (vanilla, tema oscuro ORASIC)
                     tour.js — tour guiado; los pasos se editan en el array PASOS
  data/              leads.json y settings.json — ignorados por git
```

Los actores de Apify son `harvestapi/linkedin-profile-search` y
`harvestapi/linkedin-profile-posts`: **funcionan sin cookies ni sesión de LinkedIn**, así que
no hay ninguna cuenta propia expuesta a bloqueos.

Las claves viven solo en el servidor. El navegador nunca las ve.

---

## Notas

- **Puerto 5070, no 5060.** Chrome bloquea el 5060 (`ERR_UNSAFE_PORT`) porque lo reserva para
  SIP. Si algún día cambiás el puerto con la variable `PORT`, evitá también 5061, 6000 y 6666.
- El botón **Cargar demo** mete 6 perfiles inventados para ver el tablero sin claves ni gasto.
  **Borrar demo** los saca.
- Los datos de perfiles son datos personales de terceros: `data/` está fuera de git a
  propósito. Si algún día publicás esto, revisá los términos de LinkedIn y la ley de
  protección de datos que te aplique antes de escalar el volumen de contactos.
- Si una búsqueda vuelve vacía, casi siempre es la ubicación: probá solo con el país, o con el
  nombre de ciudad tal como aparece en LinkedIn (`Lima`, `Medellín`).
