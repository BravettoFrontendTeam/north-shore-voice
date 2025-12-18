@echo off
echo Starting North Shore Voice Backend...
echo.

cd /d "%~dp0backend"

REM Set environment variables
set PORT=5000
set NODE_ENV=development
set CORS_ORIGIN=http://localhost:5173
set JWT_SECRET=northshore-dev-secret-key
set TWILIO_ACCOUNT_SID=AC65f60409f8149ef6272f000208341b94
set WEBHOOK_BASE_URL=http://localhost:5000/api/telephony/webhooks
set DEFAULT_FROM_NUMBER=+15551234567

echo Environment configured!
echo Starting server on port %PORT%...
echo.

npx ts-node-dev --respawn --transpile-only src/index.ts

