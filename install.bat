@echo off
echo ========================================
echo    GramSathi - Installation Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Setting up Environment Variables...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please configure it with your credentials.
) else (
    echo .env file already exists.
)
echo.

echo [3/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [4/4] Installation Complete!
echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo 1. Configure backend\.env with your credentials
echo 2. Start MongoDB: mongod
echo 3. Start Backend: cd backend && npm run dev
echo 4. Start Frontend: cd frontend && npm start
echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo.
pause
