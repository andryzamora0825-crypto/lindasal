@echo off
echo ========================================================
echo        Subiendo el codigo a GitHub automaticamente...
echo ========================================================
echo.

git init
git remote remove origin 2>nul
git remote add origin https://github.com/andryzamora0825-crypto/lindasal
git branch -M main
git add .
git commit -m "Actualizacion del proyecto Lindasal"
git push origin main -f

echo.
echo ========================================================
echo  Proceso 100%% terminado. Verifique si hubo errores arriba.
echo ========================================================
pause
