@echo off
echo Starting North Shore Voice Frontend...
echo.

cd /d "%~dp0frontend"

echo Starting Vite dev server on port 5173...
echo.

npx vite --port 5173 --host

