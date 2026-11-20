@echo off
cd /d "%~dp0"
echo Deploying Al Raza Travel...
call npx wrangler deploy
echo.
pause
