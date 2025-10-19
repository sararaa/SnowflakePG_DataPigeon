@echo off
echo 🚀 Starting EV Charging Platform Streamlit App...
echo.

REM Check if Next.js API is running
echo 🔍 Checking if Next.js API is running...
curl -s http://localhost:3003/api/chargers >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Next.js API is running on port 3003
) else (
    echo ❌ Next.js API is not running!
    echo Please start your Next.js API first:
    echo   cd "C:\path\to\your\project"
    echo   npm run dev
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo 🌐 Starting Streamlit app...
echo The app will open in your browser at: http://localhost:8501
echo.

REM Run Streamlit
streamlit run streamlit_app.py
