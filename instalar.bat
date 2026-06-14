@echo off
cd /d "%~dp0"
title Finanzas Premium — Instalacion
echo ============================================
echo  Finanzas Premium v7 — Instalacion
echo ============================================
echo.
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado.
    echo Descarga Node.js LTS desde: https://nodejs.org
    echo Luego vuelve a ejecutar este archivo.
    pause
    exit /b 1
)
echo Node.js OK.
echo.
echo Instalando dependencias (puede tardar 2-5 minutos)...
call npm install
if errorlevel 1 (
    echo ERROR durante la instalacion.
    pause
    exit /b 1
)
echo.
echo ============================================
echo  Instalacion completada con exito!
echo  Ejecuta dev.bat para iniciar la aplicacion
echo ============================================
pause
