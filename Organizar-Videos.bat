@echo off
title ORASIC Lab - Organizador de Videos
cls
echo ===================================================
echo   ORASIC LAB - ORGANIZADOR DE VIDEOS DE DESCARGAS
echo ===================================================
echo.
echo [1] Organizar videos pendientes de Descargas ahora
echo [2] Iniciar monitoreo continuo (Modo Watch)
echo [3] Salir
echo.
set /p opcion="Elige una opcion [1-3]: "

if "%opcion%"=="1" (
    python organizar-descargas.py
    pause
)
if "%opcion%"=="2" (
    python organizar-descargas.py --watch
)
if "%opcion%"=="3" exit
