@echo off
title North Shore Voice - Startup
color 0A

echo.
echo  ==========================================
echo   NORTH SHORE VOICE - AI Phone Platform
echo  ==========================================
echo.

echo  [1/2] Starting Backend Server...
start "Backend - Port 5000" cmd /k "cd /d %~dp0 && run-backend.bat"

timeout /t 3 /nobreak > nul

echo  [2/2] Starting Frontend Server...
start "Frontend - Port 5173" cmd /k "cd /d %~dp0 && run-frontend.bat"

echo.
echo  ==========================================
echo   SERVERS STARTING IN NEW WINDOWS
echo  ==========================================
echo.
echo   Wait 10-15 seconds for servers to start
echo.
echo   Then open these URLs:
echo.
echo   Frontend:  http://localhost:5173
echo   Demo:      http://localhost:5173/demo
echo   API:       http://localhost:5000/api/status
echo.
echo  ==========================================
echo.
pause
