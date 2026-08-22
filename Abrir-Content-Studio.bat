@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

REM Verificar que Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    pause
    exit /b 1
)

REM Matar proceso anterior en puerto 3000 (si existe)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    taskkill /pid %%a /f >nul 2>&1
)

REM Cambiar a carpeta content-studio
cd /d "%~dp0content-studio"

REM Instalar dependencias si no existen
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

REM Iniciar servidor en terminal separada
start "ORASIC Content Studio - Servidor Node" cmd /k "npm start"

REM Esperar a que el servidor esté listo
echo Iniciando Content Studio...
timeout /t 3 /nobreak >nul

REM Abrir en navegador
start "" "http://localhost:3000/content-studio/"

echo.
echo ✓ Content Studio abierto en http://localhost:3000/content-studio/
echo ✓ Cierra la ventana "ORASIC Content Studio - Servidor Node" cuando termines
echo.
pause
