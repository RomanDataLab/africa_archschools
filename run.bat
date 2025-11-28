@echo off
REM Complete run script - processes data and starts visualization

echo ======================================
echo Running Africa Population Centroids
echo ======================================
echo.

REM Step 1: Process data with Python
echo Step 1: Processing population data...
python process_population.py

if %errorlevel% neq 0 (
    echo !  Python processing had issues, but continuing...
)

REM Step 2: Copy GeoJSON to React app
echo.
echo Step 2: Copying GeoJSON files to React app...
if not exist react-map\public\data mkdir react-map\public\data

if exist output\africa_grid_centroids.geojson (
    copy output\africa_grid_centroids.geojson react-map\public\data\
    echo √ Copied grid centroids
)

if exist output\africa_country_centroids.geojson (
    copy output\africa_country_centroids.geojson react-map\public\data\
    echo √ Copied country centroids
)

REM Step 3: Start React app
echo.
echo Step 3: Starting React visualization...
echo Opening browser at http://localhost:3000
echo.

cd react-map
call npm start




