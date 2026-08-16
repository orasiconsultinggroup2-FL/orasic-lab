#!/usr/bin/env python3
"""
ORASIC Lab — Video Generator
Replica exacto del diseño Canvas del navegador.
"""

import sys
import re
import textwrap
from PIL import Image, ImageDraw, ImageFont
import imageio
import numpy as np
from math import pi, cos, sin

WIDTH = 1080
HEIGHT = 1920
FPS = 24
DURATION_PER_CARD = 2.5
FRAMES_PER_CARD = int(DURATION_PER_CARD * FPS)

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def parse_script(script_text):
    cards = []
    if '[CARD' in script_text:
        matches = re.findall(r'\[CARD\s+\d+[^\]]*\]\s*([^[]*?)(?=\[CARD|\Z)', script_text, re.DOTALL)
        for i, text in enumerate(matches):
            text = text.strip()
            if text:
                cards.append(text)
    else:
        sections = ['HOOK', 'PROBLEMA', 'SOLUCION', 'RESULTADO', 'CTA']
        for section_name in sections:
            pattern = rf'\[{section_name}[^\]]*\]\s*([^[]*?)(?=\[|$)'
            matches = re.findall(pattern, script_text, re.DOTALL | re.IGNORECASE)
            if matches:
                text = matches[0].strip()
                if text:
                    cards.append(text)

    if not cards and script_text.strip():
        cards.append(script_text.strip())

    return cards

def draw_radial_gradient(img_array, cx, cy, r, color_center, color_edge):
    """Dibuja un gradiente radial en el array de numpy."""
    h, w = img_array.shape[:2]
    y, x = np.ogrid[:h, :w]

    # Distancia desde el centro
    dist = np.sqrt((x - cx)**2 + (y - cy)**2)
    dist = np.clip(dist / r, 0, 1)

    # Interpola entre los colores
    for i in range(3):
        img_array[:, :, i] = (
            color_center[i] * (1 - dist) +
            color_edge[i] * dist
        ).astype(np.uint8)

def create_card_image(text, card_num, total_cards):
    """Crea una tarjeta exacta al Canvas del navegador."""
    img = Image.new('RGB', (WIDTH, HEIGHT), color=hex_to_rgb('#080A0F'))
    img_array = np.array(img)

    # Glows de fondo
    # Glow violeta arriba-izquierda
    draw_radial_gradient(
        img_array,
        cx=int(WIDTH * 0.25),
        cy=int(HEIGHT * 0.18),
        r=int(WIDTH * 0.9),
        color_center=(167*0.28//255, 139*0.28//255, 250*0.28//255),
        color_edge=(0, 0, 0)
    )

    # Glow cyan abajo-derecha
    draw_radial_gradient(
        img_array,
        cx=int(WIDTH * 0.8),
        cy=int(HEIGHT * 0.85),
        r=int(WIDTH * 0.95),
        color_center=(34*0.22//255, 211*0.22//255, 238*0.22//255),
        color_edge=(0, 0, 0)
    )

    img = Image.fromarray(img_array)
    draw = ImageDraw.Draw(img)

    # Logo ORASIC LAB
    try:
        logo_font = ImageFont.truetype("arial.ttf", 34)
    except:
        logo_font = ImageFont.load_default()

    # "ORASIC" en violeta
    draw.text((WIDTH/2 - 52, 120), "ORASIC", fill=hex_to_rgb('#A78BFA'), font=logo_font, anchor="lm")
    # "LAB" en cyan
    draw.text((WIDTH/2 + 66, 120), "LAB", fill=hex_to_rgb('#22D3EE'), font=logo_font, anchor="lm")

    # Barra acento rosa
    draw.rectangle([(WIDTH/2 - 40, 170), (WIDTH/2 + 40, 176)], fill=hex_to_rgb('#F472B6'))

    # Texto principal
    try:
        main_font = ImageFont.truetype("arial.ttf", 72)
    except:
        main_font = ImageFont.load_default()

    # Wrappea el texto
    wrapped = textwrap.fill(text, width=25)
    lines = wrapped.split('\n')

    line_height = int(72 * 1.22)
    y_start = HEIGHT // 2 - (len(lines) - 1) * line_height // 2

    for i, line in enumerate(lines):
        y = y_start + i * line_height
        draw.text((WIDTH // 2, y), line, fill=hex_to_rgb('#F9FAFB'), font=main_font, anchor="mm")

    # Puntos de progreso abajo
    dot_y = HEIGHT - 130
    gap = 34
    start_x = WIDTH / 2 - (total_cards - 1) * gap / 2

    for d in range(total_cards):
        x = int(start_x + d * gap)
        radius = 9 if d == card_num - 1 else 6
        color = hex_to_rgb('#F472B6') if d == card_num - 1 else tuple(int(c * 0.25) for c in hex_to_rgb('#FFFFFF'))
        draw.ellipse([(x - radius, dot_y - radius), (x + radius, dot_y + radius)], fill=color)

    return np.array(img)

def generate_video(script_text, output_path="output.mp4"):
    print("[*] Parseando guion...")
    cards = parse_script(script_text)

    if not cards:
        print("[!] No se encontro contenido")
        sys.exit(1)

    print(f"[OK] {len(cards)} tarjetas extraidas")
    print(f"[*] Generando {len(cards)} imagenes...")

    frames = []
    fade_frames = 6

    for i, card in enumerate(cards, 1):
        print(f"    [{i}/{len(cards)}] {card[:40]}...", end="", flush=True)

        img_array = create_card_image(card, i, len(cards))

        # Fade in
        for j in range(fade_frames):
            alpha = j / fade_frames
            frame = (img_array.astype(float) * alpha).astype(np.uint8)
            frames.append(frame)

        # Frames normales
        for _ in range(FRAMES_PER_CARD - fade_frames * 2):
            frames.append(img_array)

        # Fade out
        for j in range(fade_frames, 0, -1):
            alpha = j / fade_frames
            frame = (img_array.astype(float) * alpha).astype(np.uint8)
            frames.append(frame)

        print(" OK")

    print(f"[*] Creando video ({len(frames)} frames)...")
    try:
        writer = imageio.get_writer(output_path, fps=FPS, codec='libx264', pixelformat='yuv420p')
        for frame in frames:
            writer.append_data(frame)
        writer.close()
    except Exception as e:
        print(f"[!] Error: {e}")
        sys.exit(1)

    print(f"[OK] Video generado: {output_path}")
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python generate_video.py '<guion>' [output.mp4]")
        sys.exit(1)

    script = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else "output.mp4"

    try:
        generate_video(script, output)
        sys.exit(0)
    except Exception as e:
        print(f"[!] Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
