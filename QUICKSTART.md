# Quick Start Guide

Get up and running in 3 simple steps!

## Prerequisites

- Python 3.8+ ([Download](https://www.python.org/downloads/))
- Node.js 14+ ([Download](https://nodejs.org/))
- Git (optional, for cloning)

## Installation & Setup

### Windows

```batch
# 1. Install dependencies
setup.bat

# 2. Run the complete pipeline (data processing + visualization)
run.bat
```

### Mac/Linux

```bash
# 1. Make scripts executable
chmod +x setup.sh run.sh

# 2. Install dependencies
./setup.sh

# 3. Run the complete pipeline (data processing + visualization)
./run.sh
```

## What Happens?

1. **Python Processing** (~5-10 minutes)
   - Creates sample population data (or processes WorldPop data if provided)
   - Calculates population-weighted centroids
   - Exports GeoJSON files

2. **React Visualization** (launches automatically)
   - Copies data to React app
   - Starts development server
   - Opens browser at http://localhost:3000

## Using Real WorldPop Data

For real high-resolution data:

1. Download from [WorldPop](https://hub.worldpop.org/geodata/summary?id=24777)
   - File: `AFR_ppp_2020_1km_Aggregated.tif` (~2GB)
2. Save to: `output/AFR_ppp_2020_1km_Aggregated.tif`
3. Run: `python process_population.py`

## Manual Steps (if automated scripts don't work)

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Install React dependencies
cd react-map
npm install
cd ..

# 3. Process data
python process_population.py

# 4. Copy data to React
cp output/*.geojson react-map/public/data/
# Windows: copy output\*.geojson react-map\public\data\

# 5. Start visualization
cd react-map
npm start
```

## Expected Output

### Terminal
```
Generating grid-based centroids (0.5° grid)
Processing grid: 100%|████████████| 150/150
Generated 1247 centroids
Saved to output/africa_grid_centroids.geojson

Generating country-level centroids
Processing countries: 100%|████████| 54/54
Saved to output/africa_country_centroids.geojson
```

### Browser (http://localhost:3000)
- Interactive map of Africa
- Colored circles representing population centers
- Larger circles = higher population
- Click circles for detailed information
- Toggle between different visualization layers

## Troubleshooting

**Script won't run?**
- Ensure Python and Node.js are installed
- Check you're in the project directory
- Try manual steps above

**Map shows "Using sample data"?**
- This is normal! Sample data demonstrates functionality
- For real data, follow "Using Real WorldPop Data" section

**Port 3000 already in use?**
- Another app is using port 3000
- Kill other processes or change port in package.json

## Next Steps

- Read `README.md` for detailed documentation
- See `USAGE.md` for customization options
- Explore `process_population.py` to modify parameters
- Edit `react-map/src/App.js` for visualization changes

## Support

Questions? Check out:
- [WorldPop Documentation](https://www.worldpop.org/)
- [React Leaflet Docs](https://react-leaflet.js.org/)
- [Rasterio Documentation](https://rasterio.readthedocs.io/)

Enjoy exploring population patterns in Africa! 🌍




