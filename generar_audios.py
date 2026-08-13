#!/usr/bin/env python3
"""
Generar audios de ORASIC Content Studio
Usa ElevenLabs API (plan gratuito: solo voz GEORGE disponible)
"""

import requests
import os
import json
from pathlib import Path

# CONFIG
ELEVEN_API_KEY = "sk_a74f086bd8beb0ea127ac691b3ebcec93076dfc5c93f0be4"  # Reemplazar con tu API key
VOICE_TIKTOK = "nFccCJzT3deukHEz1QRb"  # BRIAN (voz predeterminada gratuita)
VOICE_INSTAGRAM = "JBFgncBSd8RMcJVDRZzb"  # GEORGE
ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech"

OUTPUT_DIR = Path("contenido/lote-1-tiktok/audios")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# GUIONES: {día: (tiktok_texto, instagram_texto)}
GUIONES = {
    13: (
        "¿Miedo de que una app haga tu negocio frío? Escúchame. La mayoría cree que la tecnología reemplaza el trato. Falso. Te cuesta dinero tardar 3 días en responder. La app no te reemplaza. Solo quita lo aburrido. Confirmaciones automáticas, más tiempo para hablar con quién de verdad lo necesita. Automatización con alma. Escríbenos hoy. +51 999 039 947",
        "Automatizar tu negocio no lo vuelve frío. La tardanza sí. Muchos evitan la tecnología por miedo a perder la cercanía con sus clientes. Tienen razón en lo que sienten. Pero están diagnosticando mal. No es la máquina la que enfría. Es tardar tres días en responder un mensaje que pasó desapercibido. En ORASIC Lab vemos la automatización distinto. No es reemplazar tu presencia. Es multiplicarla. El sistema confirma citas, manda recordatorios, responde preguntas frecuentes. Todo automático, pero con tu tono, tu marca, tu calidez. Y tú solo apareces cuando hay algo de verdad que resolver. Es como tener diez versiones de ti respondiendo siempre a tiempo, mientras tú te enfocas en lo que te hace único. Tus clientes se sienten cuidados. Tú te sientes dueño de tu tiempo de nuevo. Cuéntanos cómo es tu rutina hoy. Link en bio."
    ),
    14: (
        "Tu alumno se fue hace tres clases y no lo notaste. En academias, gimnasios y cursos online es normal. Un alumno deja de venir. Pasan días. Una semana. Recién al mes te das cuenta cuando revisas el cobro de la tarjeta que falló. Ya se fue. Imagina esto: el alumno X no viene a la clase del martes. La app te avisa el miércoles por la mañana. Tú llamas ese día, lo reconectas, se queda. No esperas a que desaparezca. No esperas al mes. Actúas el mismo día que detectas la ausencia. Sistema de alertas automáticas. Reportes de asistencia en tiempo real. Recuperación de clientes antes de que se vayan. Menos deserciones. Más ingresos. Sin sorpresas. Escríbenos hoy. +51 999 039 947",
        "¿Sabes cuál es el mayor problema de una academia o curso online? No es la calidad de las clases. No es falta de publicidad. Es esto. Un alumno se apunta. Las primeras dos semanas es gold, asiste, entusiasmado, pregunta. Semana tres: viene a dos de tres clases. Semana cuatro: viene a una. Semana cinco: no viene. ¿Cuándo te enteras que se fue? Mes y medio después, cuando revisas el registro y ves que tiene siete ausencias. Recién ahí intentas llamar. Pero ya es tarde. Desapareció. ¿Cuántos alumnos así pierdes cada mes? ¿Cuánto dinero recurrente se escurre sin que ni te enteres? En ORASIC Lab vemos esto diferente. No es un problema de los alumnos son infieles. Es un problema de visibilidad. Imagina que tuvieras un sistema que te avisa el mismo día que alguien falta por primera vez. Saca un reporte automático si alguien falta dos clases seguidas. Te sugiere a quién llamar hoy para evitar que se vaya. Eso no es futurista. Es hoy. Académicos que usan este sistema recuperan entre veinte y treinta por ciento de los alumnos que estaban a punto de irse. ¿Sabes qué significa? Dinero que ya habías perdido, volviendo a entrar. El alumno no cambió. Tú solo actuaste a tiempo. Aulas llenas. Churn eliminado. Sin perder alumnos en silencio. ¿Tu academia sangra clientes silenciosamente? Link en bio. Hablamos."
    ),
    17: (
        "¿Sabes por qué fracasan la mayoría de proyectos de apps? Muchas agencias empiezan por lo bonito: lindos diseños, colores, animaciones. Pero tu problema real? Sigue igual. Y el dinero se acabó. En ORASIC Lab hacemos lo opuesto. No preguntamos qué color quieres. Preguntamos: ¿qué te hace perder dinero hoy? ¿Citas que se olvidan? Primero: sistema de reservas. ¿Mensajes perdidos? Primero: CRM sencillo. El diseño hermoso viene después. Cuando lo urgente ya genera dinero. En semanas: problema resuelto. En meses: obra maestra. ¿Cuál es tu problema número uno? Más cinquenta uno novecientos noventa y nueve cero trescientos noventa y nueve cuarenta y siete.",
        "¿Sabes cuál es la diferencia entre un proyecto de software que despega y uno que se estanca? Imagina esto: contratas una agencia, pasan ocho semanas, te muestran mockups hermosos en Figma. Colores perfectos, transiciones suave, diseño que da envidia. Pero cuando lo usas, el problema por el que lo solicitaste sigue ahí. Y el presupuesto se acabó. En ORASIC Lab lo hacemos diferente porque entendemos dónde falla la mayoría: no es en el diseño. Es en las prioridades. Primero: ¿cuál es el dolor real de tu negocio? ¿Pierdes citas porque no hay sistema de reservas? ¿Se te pierden mensajes entre cien chats? ¿Tus clientes no pagan porque no existe un método claro? Ahí es donde empezamos. Feísimo si es necesario, pero funcional. Después, cuando lo urgente ya está generando dinero, viene el diseño que enamora. Es la diferencia entre un proyecto que resuelve y un proyecto que brilla pero no funciona. Semanas tienes lo urgente resuelto y ganando. Meses después tienes la obra maestra. Cuéntanos cuál es tu problema número uno. Link en bio. DM."
    ),
    19: (
        "No sabes nada de tecnología. Perfecto. La mayoría de dueños cree que sin saber de código no puede trabajar con una agencia de software. Ese miedo lo frena. No te vamos a pedir nada imposible. Solo tres cosas: cómo trabajas hoy. Qué se te complica más. Tu WhatsApp. El resto? Nosotros. Sin tecnicismos. Sin confusión. Los clientes que menos sabían de tech son los que más aman el resultado. Escríbenos. +51 999 039 947",
        "No sé nada de tecnología. ¿Puedo trabajar con una agencia de software? La respuesta que nadie te da: deberías. La mayoría cree que necesitas una maestría en programación para trabajar con developers. Falso. De hecho, muchos de nuestros mejores clientes son los que menos saben de código. ¿Por qué? Porque no traen prejuicios. No dicen eso no es posible. Solo dicen esto me duele. En ORASIC Lab no eres tú quien se adapta a nosotros. Somos nosotros quienes nos adaptamos a ti. Todo lo que necesitamos saber: cómo trabajas hoy. Tu rutina honesta. Qué se te complica más. Dónde pierdes tiempo y dinero. Tu número de WhatsApp. El único idioma técnico que importa. Con eso es suficiente. Tú me cuentas el problema, yo te construyo la solución. Y en cada paso te explico qué estoy haciendo, sin tecnicismos innecesarios. El resultado: un cliente sin ansiedad. Una app que funciona. Un negocio que crece. Cuéntame cuál es tu problema sin nombre. Link en bio. Escríbeme."
    ),
    24: (
        "Mito: la automatización hace tu negocio frío. Realidad: lo que hace tu negocio frío es no responder en tiempo. Es tardar tres días en contestar porque se te perdió el mensaje. La app no te reemplaza. Te quita lo aburrido. Sistema responde. Tú apareces. El cliente se siente atendido. Tú no te quemas. Ganan los dos. Automatización no es igual frío. Automatización es eficiente. Hablemos. +51 999 039 947",
        "El mito que frena a la mayoría de pymes: si automatizo, pierdo el trato personal. La realidad es más cruel. Lo que enfría una relación no es la máquina. Es tardar tres días en responder un mensaje porque se te perdió entre cien chats de WhatsApp. Es decirle sí, sí, está en mis manos y después olvidarte. Es tener que elegir entre responder clientes o hacer el trabajo real. Eso es lo que los pierde. No la tecnología. La automatización no reemplaza tú. Solo libera el tiempo que malgastas en lo repetitivo. Imagina esto: confirmación automática de citas. Cliente se siente cuidado. Recordatorio automático. Cliente no se olvida. Respuesta automática a preguntas frecuentes. Cliente obtiene respuesta ya. Y tú? Apareces solo cuando hay algo que realmente requiere tu expertise. Cuando un cliente tiene un problema de verdad, llama y adivina? Estás disponible. Porque no estás buscando el email que se te pasó hace cuatro días. Resultado: clientes que se sienten atendidos. Negocios que responden rápido. Y tú, con tiempo para lo que realmente te hace único. ¿Cómo es tu realidad hoy? Link en bio. DM."
    ),
    28: (
        "¿Cuánto se demora hacer una app? Las agencias te dicen tres meses. Spoiler: no es verdad. Te dan fechas bonitas en una reunión. Después se estira, sube el costo, y sigues esperando. En ORASIC Lab no inventamos fechas. Te mostramos la versión uno funcionando. Después tú decides qué tan rápido seguimos. No promesas. Realidad en tu pantalla. Días: algo real. Semanas: lo urgente resuelto. Cuéntanos tu proyecto. +51 999 039 947",
        "¿Cuánto se demora en verdad hacer una app? La respuesta que escuchas en reuniones versus la verdad que vives después son historias completamente distintas. Escenario típico: agencia te dice te dejamos listo en tres meses. Mes uno: primeras reuniones. ¿Por qué tardó tanto? Mes dos: cambios de alcance. ¿Qué pasó con lo acordado? Mes cuatro: casi está. Mentira. Mes cinco: en serio, la próxima semana. Mes seis: te sigue cobrando. ¿Te pasa esto? No eres el único. En ORASIC Lab hacemos una cosa rara: no te damos una fecha. Te damos un prototipo. Así es: semana uno tienes una versión funcionando. Feícha, sí, pero funcional. Desde ahí, vos decides: ¿le agrego más? Semana dos tiene versión dos. ¿Está bien así? Vamos por las mejoras visuales. ¿Necesito cambiar esto? Lo cambiamos en días, no en meses. No es magia. Es transparencia. Ves lo que le falta. Te digo qué cuesta. Vos decides. Fin de la historia: en días ves algo real. En semanas tienes resuelto tu problema más urgente. En meses, tienes la obra maestra. Sin sorpresas. Sin almost done. ¿Tienes un proyecto? Platiquemos. Link en bio. DM."
    ),
    30: (
        "Construyendo más de cien apps aprendimos algo. Cada negocio cree que su caso es único. Pero la mayoría falla por lo mismo: responden tarde. Hablamos con un cliente, demora tres días responder, venta perdida. Con app? Responde en veinte minutos, venta cerrada. Un negocio rápido cierra más. Sin agregar gente. +51 999 039 947",
        "Construyendo más de cien apps en dos años aprendimos algo inesperado. Creíamos que cada negocio era un caso único. Resulta que no. Salud, belleza, retail, pymes de servicios. Industrias completamente distintas. Dueños con historias completamente distintas. Pero todos fallaban por lo mismo. ¿Adivinas qué? No era falta de calidad en el servicio. No era porque el producto fuera malo. Era porque respondían lento. Un prospecto escribía. Ellos leían tres días después. Ya estaba comprado con la competencia. El patrón es tan simple que nadie lo ve. Cada segundo que demoras en responder es dinero que pierdes. No es exageración. Es física de negocio. Un chat sin respuesta en dos horas: cliente que se va. Un email olvidado: oportunidad perdida. Un mensaje que pasaste por alto: venta que no fue. Y la ironía: los dueños más ocupados son los que menos responden. Porque están ocupados haciendo cosas que podrían automatizarse. Mensajes, confirmaciones, cambios de cita, preguntas frecuentes. Cosas que una máquina hace perfectamente mientras tú duermes. Así que si quieres vender más sin trabajar más horas, sin contratar gente, sin inventar estrategias complicadas. Solo necesitas responder rápido. Y eso es exactamente lo que hace una app bien construida. ¿Listo? Platiquemos. Link en bio."
    )
}

def generar_audio(texto, voice_id, output_file):
    """Genera audio con ElevenLabs API"""
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "text": texto,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    try:
        response = requests.post(
            f"{ENDPOINT}/{voice_id}",
            headers=headers,
            json=data
        )

        if response.status_code == 200:
            with open(output_file, 'wb') as f:
                f.write(response.content)
            print(f"[OK] {output_file.name}")
            return True
        else:
            print(f"[FAIL] Error {response.status_code}: {output_file.name}")
            print(f"   {response.text}")
            return False
    except Exception as e:
        print(f"[FAIL] Exception: {output_file.name} - {e}")
        return False

def main():
    print("[*] Generando audios ORASIC (ElevenLabs API)")
    print(f"[*] Directorio: {OUTPUT_DIR}")
    print()

    # Duraciones por día y plataforma
    duraciones = {
        13: {"tiktok": 30, "instagram": 52},
        14: {"tiktok": 32, "instagram": 55},
        17: {"tiktok": 32, "instagram": 55},
        19: {"tiktok": 30, "instagram": 52},
        24: {"tiktok": 29, "instagram": 54},
        28: {"tiktok": 31, "instagram": 58},
        30: {"tiktok": 33, "instagram": 60},
    }

    generados = 0
    fallidos = 0

    for dia, (texto_tiktok, texto_instagram) in GUIONES.items():
        # TikTok
        output_tiktok = OUTPUT_DIR / f"audio-{dia}-tiktok-GEORGE.mp3"
        if generar_audio(texto_tiktok, VOICE_TIKTOK, output_tiktok):
            generados += 1
        else:
            fallidos += 1

        # Instagram
        output_instagram = OUTPUT_DIR / f"audio-{dia}-instagram-GEORGE.mp3"
        if generar_audio(texto_instagram, VOICE_INSTAGRAM, output_instagram):
            generados += 1
        else:
            fallidos += 1

    print()
    print(f"[OK] Generados: {generados}")
    print(f"[FAIL] Fallidos: {fallidos}")
    print(f"[SAVE] Audios guardados en: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
