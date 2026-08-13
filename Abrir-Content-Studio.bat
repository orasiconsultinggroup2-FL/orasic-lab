@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

REM Verificar que Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no está instalado o no está en el PATH
    pause
    exit /b 1
)

REM Matar proceso anterior en puerto 5050 (si existe)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5050"') do (
    taskkill /pid %%a /f >nul 2>&1
)

REM Iniciar servidor en terminal separada
cd /d "%~dp0"
start "ORASIC Content Studio - Servidor" cmd /k "python -m http.server 5050"

REM Esperar a que el servidor esté listo
echo Iniciando Content Studio...
timeout /t 2 /nobreak >nul

REM Abrir en navegador
start "" "http://localhost:5050/content-studio/"

echo.
echo ✓ Content Studio abierto en http://localhost:5050/content-studio/
echo ✓ Cierra la ventana "ORASIC Content Studio - Servidor" cuando termines
echo.
pause
