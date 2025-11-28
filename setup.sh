#!/bin/bash

# Setup script for Africa Population Centroids project

echo "======================================"
echo "Africa Population Centroids Setup"
echo "======================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null
then
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python3 found: $(python3 --version)"

# Setup Python environment
echo ""
echo "Setting up Python environment..."
python3 -m pip install --upgrade pip
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Python dependencies installed"
else
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

# Check Node.js
echo ""
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo "✓ npm found: $(npm --version)"

# Setup React app
echo ""
echo "Setting up React application..."
cd react-map
npm install

if [ $? -eq 0 ]; then
    echo "✓ React dependencies installed"
else
    echo "❌ Failed to install React dependencies"
    exit 1
fi

cd ..

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Run Python script: python3 process_population.py"
echo "2. Copy GeoJSON files: cp output/*.geojson react-map/public/data/"
echo "3. Start React app: cd react-map && npm start"
echo ""
echo "Or use the run.sh script to do all at once!"




