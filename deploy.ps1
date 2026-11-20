# Deploy script for pure-dental to Vercel
# Usage: Right-click -> "Run with PowerShell" or run: powershell -ExecutionPolicy Bypass -File deploy.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploying pure-dental to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if vercel CLI is installed
$vercel = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercel) {
    Write-Host "[INFO] Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm i -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install vercel CLI. Install Node.js first: https://nodejs.org/" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "[INFO] Logging into Vercel..." -ForegroundColor Yellow
vercel login

Write-Host "[INFO] Deploying..." -ForegroundColor Yellow
vercel --prod

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Done! Your site is live on Vercel." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
