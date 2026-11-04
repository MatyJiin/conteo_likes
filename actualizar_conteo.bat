@echo off
chcp 65001 > nul
echo ========================================================
echo   ACTUALIZANDO CONTEO DE LIKES EN VIVO (17 PUBLICACIONES)
echo ========================================================
echo.
node contar_todos.js
echo.
node export_csv.js
echo.
echo ========================================================
echo   ¡Listo! Datos actualizados en:
echo   - index.html (Abrelo en el navegador o recárgalo con F5)
echo   - conteo_likes.csv (Archivo para Excel)
echo ========================================================
echo.
pause

