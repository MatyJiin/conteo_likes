@echo off
chcp 65001 > nul
echo ========================================================
echo   ACTUALIZANDO CONTEO OFICIAL EN VIVO (META GRAPH API)
echo ========================================================
echo.
node actualizar_api.js
echo.
echo ========================================================
echo   ¡Listo! Conteo oficial actualizado desde Meta.
echo ========================================================
echo.
pause
