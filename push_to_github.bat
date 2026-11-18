@echo off
setlocal
echo ====================================================
echo  LifeLink - Push to GitHub (VIKRAM-1318)
echo ====================================================
cd /d "%~dp0"

echo [1/4] Initializing local repository...
if not exist ".git" (
    git init
)

echo [2/4] Staging and committing all files...
git add -A
git -c user.name="R VIKRAM" -c user.email="rv367629@gmail.com" commit -m "feat: complete LifeLink MERN stack application with emergency dispatch, donor management, and admin dashboard" >nul 2>&1

echo [3/4] Configuring remote repository...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/VIKRAM-1318/blood-donation-app.git
git branch -M main

echo [4/4] Pushing to GitHub (https://github.com/VIKRAM-1318/blood-donation-app)...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ====================================================
    echo Notice: If the repo "blood-donation-app" doesn't exist yet on GitHub:
    echo 1. Open: https://github.com/new
    echo 2. Set repository name to: blood-donation-app
    echo 3. Click "Create repository"
    echo 4. Re-run this script: push_to_github.bat
    echo ====================================================
) else (
    echo.
    echo ====================================================
    echo SUCCESS! Repository pushed to:
    echo https://github.com/VIKRAM-1318/blood-donation-app
    echo ====================================================
)

echo.
pause
