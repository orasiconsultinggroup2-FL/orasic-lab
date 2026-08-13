#!/usr/bin/env python3
"""
Organizador de videos descargados de Content Studio.
Monitorea la carpeta de Descargas y mueve/renombra videos
hacia contenido/VIDEOS A PUBLICAR/ con nomenclatura estandarizada.
"""

import os
import shutil
import time
from pathlib import Path
from datetime import datetime
import re

# Rutas
DOWNLOADS = Path.home() / 'Downloads'
ORASIC_LAB = Path.home() / 'OneDrive' / 'Documentos' / 'ORASIC LAB'
DEST = Path(r"C:\Users\FERNANDO\OneDrive\Documentos\ORASIC LAB\VIDEOS A PUBLICAR")
TRACKING_FILE = ORASIC_LAB / '.organizar-videos-tracking.txt'

def ensure_dest():
    """Crea la carpeta destino si no existe."""
    DEST.mkdir(parents=True, exist_ok=True)

def is_valid_orasic_video(filename):
    """Verifica si el archivo ya tiene el formato estandarizado YYYY-MM-DD_PLATAFORMA_TITULO.ext"""
    pattern = r'^\d{4}-\d{2}-\d{2}_\w+_.+\.(mp4|webm)$'
    return bool(re.match(pattern, filename, re.IGNORECASE))

def get_platform_from_filename(filename):
    """Extrae la plataforma del nombre del archivo (YYYY-MM-DD_PLATAFORMA_TITULO.ext)"""
    match = re.match(r'^\d{4}-\d{2}-\d{2}_(\w+)_.+\.(mp4|webm)$', filename, re.IGNORECASE)
    return match.group(1) if match else None

def get_dest_path(filename):
    """Retorna la ruta de destino basada en la plataforma extraída del nombre"""
    platform = get_platform_from_filename(filename)
    if not platform:
        return DEST / filename

    # Plataformas conocidas
    platform_lower = platform.lower()
    if platform_lower in ['instagram', 'tiktok', 'linkedin', 'facebook', 'youtube', 'blog']:
        platform_folder = DEST / platform
        platform_folder.mkdir(parents=True, exist_ok=True)
        return platform_folder / filename
    else:
        # Si la plataforma es desconocida, guardar en raíz
        return DEST / filename

def get_tracked_files():
    """Lee los archivos ya procesados."""
    if TRACKING_FILE.exists():
        with open(TRACKING_FILE, 'r') as f:
            return set(line.strip() for line in f if line.strip())
    return set()

def track_file(filename):
    """Marca un archivo como procesado."""
    with open(TRACKING_FILE, 'a') as f:
        f.write(f"{filename}\n")

def organize_videos(watch=False, interval=2):
    """
    Organiza los videos descargados.

    Args:
        watch: Si True, monitorea continuamente (daemon mode).
        interval: Segundos entre chequeos (solo si watch=True).
    """
    ensure_dest()
    tracked = get_tracked_files()

    while True:
        found_any = False

        for file_path in DOWNLOADS.glob('*.mp4'):
            if file_path.name in tracked:
                continue

            if not is_valid_orasic_video(file_path.name):
                continue

            found_any = True
            dest_path = get_dest_path(file_path.name)

            try:
                shutil.move(str(file_path), str(dest_path))
                track_file(file_path.name)
                print(f"✓ Movido: {file_path.name} → {dest_path.relative_to(ORASIC_LAB)}")
            except Exception as e:
                print(f"✗ Error moviendo {file_path.name}: {e}")

        for file_path in DOWNLOADS.glob('*.webm'):
            if file_path.name in tracked:
                continue

            if not is_valid_orasic_video(file_path.name):
                continue

            found_any = True
            # Convertir .webm a .mp4 renombrando
            new_name = file_path.stem + '.mp4'
            dest_path = get_dest_path(new_name)

            try:
                shutil.move(str(file_path), str(dest_path))
                track_file(file_path.name)
                print(f"✓ Movido: {file_path.name} → {new_name} ({dest_path.relative_to(ORASIC_LAB)})")
            except Exception as e:
                print(f"✗ Error moviendo {file_path.name}: {e}")

        if not watch:
            break

        if found_any or len(tracked) == 0:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Esperando videos... (presiona Ctrl+C para salir)")

        time.sleep(interval)

if __name__ == '__main__':
    import sys

    print("🎬 Organizador de videos ORASIC LAB")
    print(f"   Origen: {DOWNLOADS}")
    print(f"   Destino: {DEST}")
    print()

    watch_mode = '--watch' in sys.argv or '-w' in sys.argv

    if watch_mode:
        print("🔍 Modo monitor activado (Ctrl+C para detener)")
        try:
            organize_videos(watch=True, interval=2)
        except KeyboardInterrupt:
            print("\n✓ Detenido.")
    else:
        organize_videos(watch=False)
        print(f"\n✓ Proceso completado.")
