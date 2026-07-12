@echo off
title ELVYN CLOTH Ecommerce Runner
color 0B
echo ====================================================================
echo             ELVYN CLOTH E-COMMERCE PLATFORM RUNNER               
echo ====================================================================
echo.

:: Detect scripts path
set "SCRIPT_DIR=%~dp0"

:: Set Client and Server directories
set "CLIENT_DIR=%SCRIPT_DIR%"
set "SERVER_DIR=%SCRIPT_DIR%..\ELVYN-CLOTH-SERVER"

:: Adjust paths if batch is run from one of the subdirectories
if exist "%SCRIPT_DIR%package.json" (
    if exist "%SCRIPT_DIR%..\ELVYN-CLOTH-SERVER\package.json" (
        :: Currently in ELVYN-CLOTH-CLIENT
        set "CLIENT_DIR=%SCRIPT_DIR%"
        set "SERVER_DIR=%SCRIPT_DIR%..\ELVYN-CLOTH-SERVER"
    ) else if exist "%SCRIPT_DIR%..\ELVYN-CLOTH-CLIENT\package.json" (
        :: Currently in ELVYN-CLOTH-SERVER
        set "SERVER_DIR=%SCRIPT_DIR%"
        set "CLIENT_DIR=%SCRIPT_DIR%..\ELVYN-CLOTH-CLIENT"
    )
)

echo [1/3] Checking environment configuration...
if not exist "%SERVER_DIR%\.env" (
    echo [WARNING] .env file is missing in ELVYN-CLOTH-SERVER!
    echo Creating one from .env.example...
    copy "%SERVER_DIR%\.env.example" "%SERVER_DIR%\.env"
) else (
    echo [OK] Backend .env file detected.
)

if not exist "%CLIENT_DIR%\.env" (
    echo [WARNING] .env file is missing in ELVYN-CLOTH-CLIENT!
    echo Creating a default .env file...
    echo NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1 > "%CLIENT_DIR%\.env"
    echo JWT_ACCESS_SECRET=accesssecret >> "%CLIENT_DIR%\.env"
) else (
    echo [OK] Frontend .env file detected.
)

echo.
echo [2/3] Checking port availability...
:: Check if Port 5000 is already in use
netstat -ano | findstr :5000 > nul
if %errorlevel% equ 0 (
    echo [INFO] Port 5000 is already active (possibly Server is already running).
) else (
    echo [INFO] Port 5000 is free.
)

:: Check if Port 3000 is already in use
netstat -ano | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo [INFO] Port 3000 is already active (possibly Client is already running).
) else (
    echo [INFO] Port 3000 is free.
)

echo.
echo [3/3] Launching systems...
echo.

:: Launch Backend Server
echo Launching Backend Server in a new window...
start "ELVYN Server" cmd /k "cd /d "%SERVER_DIR%" && pnpm dev"

:: Wait 2 seconds for server startup
timeout /t 2 /nobreak > nul

:: Launch Frontend Client
echo Launching Frontend Client in a new window...
start "ELVYN Client" cmd /k "cd /d "%CLIENT_DIR%" && pnpm dev"

echo.
echo ====================================================================
echo  System successfully launched!
echo  ------------------------------------------------------------------
echo  - Frontend Client: http://localhost:3000
echo  - Backend API Server: http://localhost:5000/api/v1
echo  ------------------------------------------------------------------
echo  Default Super Admin Credentials:
echo  - Email: fahimrahman0145@gmail.com
echo  - Pass:  12345678
echo ====================================================================
echo.
pause
