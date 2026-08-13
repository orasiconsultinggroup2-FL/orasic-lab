// Analisis + redaccion del mensaje. Anthropic es el camino principal; si solo
// hay clave de OpenAI cargada, el sistema sigue funcionando igual.
const IDIOMAS = { es: 'espanol neutro latinoamericano', en: 'ingles', pt: 'portugues' };

function contextoDelPerfil(lead) {
  const partes = [
    `Nombre: ${lead.nombre}`,
    lead.titular && `Titular de LinkedIn: ${lead.titular}`,
    lead.cargo && `Cargo actual: ${lead.cargo}`,
    lead.empresa && `Empresa: ${lead.empresa}`,
    lead.ubicacion && `Ubicacion: ${lead.ubicacion}`,
    lead.acerca && `Acerca de: ${lead.acerca}`,
  ].filter(Boolean);

  if (lead.experiencia?.length) {
    partes.push(
      'Experiencia reciente:\n' +
        lead.experiencia
          .map((e) => `- ${[e.cargo, e.empresa, e.periodo].filter(Boolean).join(' | ')}`)
          .join('\n')
    );
  }

  if (lead.publicaciones?.length) {
    partes.push(
      'Publicaciones recientes en LinkedIn:\n' +
        lead.publicaciones
          .map((p, i) => `[${i + 1}]${p.fecha ? ` (${p.fecha})` : ''} ${p.texto}`)
          .join('\n')
    );
  } else {
    partes.push('Publicaciones recientes: no se pudieron obtener.');
  }

  return partes.join('\n');
}

function armarPrompt(lead, ajustes) {
  const idioma = IDIOMAS[ajustes.idiomaMensajes] || IDIOMAS.es;
  return `Sos un SDR senior. Analizas un perfil de LinkedIn y escribis un primer mensaje de contacto en frio.

## Quien escribe el mensaje
Nombre: ${ajustes.nombre || '(sin definir)'}
Cargo: ${ajustes.cargo || '(sin definir)'}
Empresa: ${ajustes.empresa || '(sin definir)'}
Que hace la empresa: ${ajustes.descripcionEmpresa || '(sin definir)'}
Oferta concreta: ${ajustes.oferta || '(sin definir)'}

## Perfil del lead
${contextoDelPerfil(lead)}

## Que tenes que devolver
Un objeto JSON, sin texto antes ni despues, con estas claves:
- "analisis": 2 a 4 oraciones sobre quien es esta persona, que hace su empresa y por que podria necesitar la oferta. Basate SOLO en los datos de arriba, no inventes.
- "gancho": una frase corta que nombre el dato concreto del perfil que usaste para personalizar (una publicacion, el cargo, la empresa).
- "puntaje": entero del 1 al 10 sobre que tan buen encaje tiene con la oferta.
- "mensaje": el mensaje de contacto listo para pegar en LinkedIn.

## Reglas del mensaje
- Escribilo en ${idioma}.
- Maximo 90 palabras. Que se lea como escrito por una persona apurada, no por un bot.
- Arranca por algo real y verificable del perfil (idealmente una publicacion reciente). Si no hay publicaciones, usa el cargo o la empresa.
- Nada de emojis, hashtags, signos de exclamacion ni frases tipo "espero que estes muy bien" o "vi tu impresionante trayectoria".
- Una sola pregunta al final, concreta y de bajo compromiso.
- Firmalo con ${ajustes.nombre || 'el nombre del remitente'}.
- No prometas resultados numericos ni menciones clientes reales.
- Si los datos del perfil son pobres, decilo en "analisis" y baja el "puntaje" en vez de inventar.`;
}

function extraerJson(texto) {
  const limpio = texto.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const candidato = limpio.startsWith('{') ? limpio : limpio.slice(limpio.indexOf('{'));
  const fin = candidato.lastIndexOf('}');
  return JSON.parse(fin === -1 ? candidato : candidato.slice(0, fin + 1));
}

async function llamarAnthropic(prompt, modelo, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelo,
      max_tokens: 1200,
      messages: [
        { role: 'user', content: prompt },
        // Prefill: fuerza a que la respuesta arranque como JSON.
        { role: 'assistant', content: '{' },
      ],
    }),
  });
  const texto = await res.text();
  if (!res.ok) {
    const err = new Error(`Anthropic respondio ${res.status}: ${texto.slice(0, 400)}`);
    err.statusCode = res.status === 401 ? 401 : 502;
    throw err;
  }
  const data = JSON.parse(texto);
  return `{${data.content?.map((b) => b.text || '').join('') || ''}`;
}

async function llamarOpenAI(prompt, apiKey) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const texto = await res.text();
  if (!res.ok) {
    const err = new Error(`OpenAI respondio ${res.status}: ${texto.slice(0, 400)}`);
    err.statusCode = res.status === 401 ? 401 : 502;
    throw err;
  }
  return JSON.parse(texto).choices?.[0]?.message?.content || '';
}

async function llamarGemini(prompt, apiKey) {
  const modelo = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1200 },
      }),
    }
  );
  const texto = await res.text();
  if (!res.ok) {
    const err = new Error(`Gemini respondio ${res.status}: ${texto.slice(0, 400)}`);
    err.statusCode = res.status === 401 || res.status === 403 ? 401 : 502;
    throw err;
  }
  const data = JSON.parse(texto);
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
}

// Orden de preferencia: Gemini primero porque su plan gratuito no pide tarjeta.
export function proveedorDisponible() {
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return null;
}

export async function analizarLead(lead, ajustes) {
  const proveedor = proveedorDisponible();
  if (!proveedor) {
    const err = new Error(
      'Falta GEMINI_API_KEY en el archivo .env para analizar los perfiles. Es gratis y sin tarjeta: https://aistudio.google.com/apikey'
    );
    err.statusCode = 400;
    err.code = 'MISSING_KEY';
    throw err;
  }

  const prompt = armarPrompt(lead, ajustes);
  let crudo;
  if (proveedor === 'gemini') {
    crudo = await llamarGemini(prompt, process.env.GEMINI_API_KEY);
  } else if (proveedor === 'anthropic') {
    crudo = await llamarAnthropic(prompt, ajustes.modeloIA || 'claude-sonnet-5', process.env.ANTHROPIC_API_KEY);
  } else {
    crudo = await llamarOpenAI(prompt, process.env.OPENAI_API_KEY);
  }

  let parsed;
  try {
    parsed = extraerJson(crudo);
  } catch {
    // Antes que perder el lead, guardamos el texto crudo como mensaje.
    parsed = { analisis: '', gancho: '', puntaje: null, mensaje: crudo.trim() };
  }

  return {
    analisis: String(parsed.analisis || '').trim(),
    gancho: String(parsed.gancho || '').trim(),
    puntaje: Number.isFinite(Number(parsed.puntaje)) ? Number(parsed.puntaje) : null,
    mensaje: String(parsed.mensaje || '').trim(),
  };
}
