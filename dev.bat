@echo off
cd /d "%~dp0"
title Finanzas Premium — Desarrollo
echo ============================================
echo  Finanzas Premium v7 — Modo Desarrollo
echo ============================================
echo.
echo Iniciando en modo desarrollo...
echo La ventana se abrira automaticamente.
echo Para cerrar, cierra esta ventana.
echo.
call npm run dev
pause
