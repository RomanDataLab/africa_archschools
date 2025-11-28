@echo off
REM Setup script for Africa Population Centroids project (Windows)

echo ======================================
echo Africa Population Centroids Setup
echo ======================================
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

echo √ Python found
python --version

REM Setup Python environment
echo.
echo Setting up Python environment...
python -m pip install --upgrade pip
pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo √ Python dependencies installed
) else (
    echo X Failed to install Python dependencies
    exit /b 1
)

REM Check Node.js
echo.
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js 14 or higher.
    exit /b 1
)

echo √ Node.js found
node --version
npm --version

REM Setup React app
echo.
echo Setting up React application...
cd react-map
call npm install

if %errorlevel% equ 0 (
    echo √ React dependencies installed
) else (
    echo X Failed to install React dependencies
    exit /b 1
)

cd ..

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Run Python script: python process_population.py
echo 2. Copy GeoJSON files: copy output\*.geojson react-map\public\data\
echo 3. Start React app: cd react-map ^&^& npm start
echo.
echo Or use the run.bat script to do all at once!

pause




