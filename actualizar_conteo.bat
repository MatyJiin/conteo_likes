@echo off
chcp 65001 > nul
echo ========================================================
echo   ACTUALIZANDO CONTEO DE LIKES EN VIVO (SIN CACHE)
echo ========================================================
echo.
node scrape_all_fresh.js
echo.
echo ========================================================
echo   ¡Listo! Conteo actualizado con los números reales.
echo ========================================================
echo.
pause
