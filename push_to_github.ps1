# LifeLink - Push to GitHub Script
$ErrorActionPreference = "Continue"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " LifeLink - Push to GitHub (VIKRAM-1318)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot

Write-Host "[1/4] Checking repository status..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
}

Write-Host "[2/4] Staging and committing all files..." -ForegroundColor Yellow
git add -A
git -c user.name="R VIKRAM" -c user.email="rv367629@gmail.com" commit -m "feat: complete LifeLink MERN stack application with emergency dispatch, donor management, and admin dashboard"

Write-Host "[3/4] Configuring remote..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/VIKRAM-1318/blood-donation-app.git
git branch -M main

Write-Host "[4/4] Pushing to https://github.com/VIKRAM-1318/blood-donation-app..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n====================================================" -ForegroundColor Red
    Write-Host "Notice: If 'blood-donation-app' is not yet created on GitHub:" -ForegroundColor Red
    Write-Host "1. Create repository at: https://github.com/new (Name: blood-donation-app)" -ForegroundColor White
    Write-Host "2. Run: .\push_to_github.ps1" -ForegroundColor White
    Write-Host "====================================================" -ForegroundColor Red
} else {
    Write-Host "`nSUCCESS! Your code has been pushed to GitHub." -ForegroundColor Green
    Write-Host "Repo URL: https://github.com/VIKRAM-1318/blood-donation-app" -ForegroundColor Green
}
