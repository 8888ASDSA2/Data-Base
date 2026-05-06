@echo off
echo ========================================
echo Word Finder - Tracking Server
echo ========================================
echo.
echo Starting backend server...
echo.

cd api

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Server starting on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm start

pause
