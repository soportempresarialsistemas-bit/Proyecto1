@echo off
cd /d "%~dp0"
title Finanzas Premium — Construir Instalador
echo ============================================
echo  Finanzas Premium v7 — Construccion
echo ============================================
echo.
echo Este proceso crea un instalador .exe para Windows.
echo Puede tardar 5-10 minutos.
echo.
echo Paso 1/3: Instalando dependencias...
call npm install
if errorlevel 1 goto error
echo.
echo Paso 2/3: Compilando la interfaz...
call npm run build
if errorlevel 1 goto error
echo.
echo Paso 3/3: Creando instalador de Windows...
call npx electron-builder --win
if errorlevel 1 goto error
echo.
echo ============================================
echo  Instalador creado en la carpeta: release\
echo ============================================
explorer release
goto end
:error
echo.
echo ERROR durante la construccion.
:end
pause
