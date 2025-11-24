@echo off
echo ========================================
echo College Resource Hub - Setup Script
echo ========================================
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend/.env file with your credentials
echo 2. Start MongoDB service
echo 3. Run 'npm run dev' in backend folder
echo 4. Run 'npm start' in frontend folder
echo.
echo For detailed setup instructions, see README.md
echo.
pause