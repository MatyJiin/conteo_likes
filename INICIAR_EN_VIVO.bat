@echo off
title Conteo en Vivo - Voces de la Patagonia
chcp 65001 > nul
echo ========================================================
echo   INICIANDO PANEL DE CONTEO EN VIVO Y EN DIRECTO
echo ========================================================
echo.
echo 1. Iniciando servidor en http://localhost:3000 ...
start /b node server.js

timeout /t 2 /nobreak > nul

echo 2. Abriendo navegador...
start http://localhost:3000

echo.
echo ========================================================
echo   EL SISTEMA ESTA TRANSMITIENDO EN VIVO
echo   - No cierres esta ventana negra para mantener el servidor activo.
echo   - Puedes minimizarla si lo deseas.
echo ========================================================
echo.

node server.js

