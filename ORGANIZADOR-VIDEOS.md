# 🎬 Organizador de Videos — ORASIC Lab

Script automático para organizar videos descargados desde Content Studio hacia la estructura de `contenido/VIDEOS A PUBLICAR/`.

## ¿Qué hace?

Monitorea tu carpeta de **Descargas** y mueve automáticamente los videos generados por Content Studio (con formato `YYYY-MM-DD_PLATAFORMA_TITULO.mp4`) hacia:

```
ORASIC LAB/contenido/VIDEOS A PUBLICAR/
```

Mantiene la nomenclatura estandarizada y evita duplicados.

## Instalación

**Requisito:** Python 3.7+ (debería estar instalado en tu máquina)

1. Abre una PowerShell en la carpeta `ORASIC LAB`
2. Ejecuta:

```bash
python organizar-descargas.py --watch
```

## Uso

### Opción 1: Ejecución manual (una sola vez)

```bash
python organizar-descargas.py
```

Busca videos en Descargas y los mueve. Listo.

### Opción 2: Monitoreo continuo (recomendado)

```bash
python organizar-descargas.py --watch
```

El script se queda corriendo, chequea cada 2 segundos si hay videos nuevos, y los mueve automáticamente.

**Para detener:** Presiona `Ctrl + C`

### Opción 3: Usar el archivo .bat (Windows)

Haz doble clic en `Organizar-Videos.bat` — te ofrece un menú con las opciones.

## Nomenclatura

Los videos deben llegar a Descargas con este formato (generado automáticamente por Content Studio):

```
YYYY-MM-DD_PLATAFORMA_TITULO.mp4
```

Ejemplos:
- `2026-08-12_TikTok_Un-alumno-deja-de-venir-tres-clases.mp4`
- `2026-08-12_Instagram_Recordatorios-de-citas.mp4`
- `2026-08-12_LinkedIn_Problema-de-inventario.mp4`

## Carpetas

- **Origen:** `C:\Users\FERNANDO\Downloads`
- **Destino:** `ORASIC LAB\contenido\VIDEOS A PUBLICAR\`

## Seguimiento

El script mantiene un archivo oculto (`.organizar-videos-tracking.txt`) para evitar procesar el mismo video dos veces.

Si necesitas reiniciar el seguimiento, borra ese archivo.

## Troubleshooting

**"Python no encontrado"**
- Asegúrate de que Python está en tu PATH: `python --version`
- Si no: instala desde [python.org](https://www.python.org/) con "Add Python to PATH" marcado

**El script no mueve nada**
- Verifica que los videos en Descargas tengan el formato `YYYY-MM-DD_...`
- Content Studio debe estar generando nombres estandarizados

**Quiero recrear el tracking**
- Borra el archivo `.organizar-videos-tracking.txt` en la raíz de ORASIC LAB
- El script lo recreará

---

**Modo daemon sugerido:**

Deja una PowerShell abierta con `python organizar-descargas.py --watch` mientras trabajas en Content Studio. Los videos se moverán automáticamente.
