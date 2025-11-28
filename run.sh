#!/bin/bash

# Complete run script - processes data and starts visualization

echo "======================================"
echo "Running Africa Population Centroids"
echo "======================================"
echo ""

# Step 1: Process data with Python
echo "Step 1: Processing population data..."
python3 process_population.py

if [ $? -ne 0 ]; then
    echo "⚠️  Python processing had issues, but continuing..."
fi

# Step 2: Copy GeoJSON to React app
echo ""
echo "Step 2: Copying GeoJSON files to React app..."
mkdir -p react-map/public/data

if [ -f "output/africa_grid_centroids.geojson" ]; then
    cp output/africa_grid_centroids.geojson react-map/public/data/
    echo "✓ Copied grid centroids"
fi

if [ -f "output/africa_country_centroids.geojson" ]; then
    cp output/africa_country_centroids.geojson react-map/public/data/
    echo "✓ Copied country centroids"
fi

# Step 3: Start React app
echo ""
echo "Step 3: Starting React visualization..."
echo "Opening browser at http://localhost:3000"
echo ""

cd react-map
npm start




