@echo off
:: Deploy script for pure-dental to Vercel
:: Usage: Run this file (deploy.ps1 or deploy.bat) from the pure-dental folder

echo ========================================
echo  Deploying pure-dental to Vercel
echo ========================================

:: Check if vercel CLI is installed
where vercel >nul 2>&1
if errorlevel 1 (
    echo [INFO] Vercel CLI not found. Installing...
    npm i -g vercel
    if errorlevel 1 (
        echo [ERROR] Failed to install vercel CLI. Install Node.js first: https://nodejs.org/
        pause
        exit /b 1
    )
)

echo [INFO] Logging into Vercel...
vercel login

echo [INFO] Deploying...
vercel --prod

echo ========================================
echo  Done! Your site is live on Vercel.
echo ========================================
pause
