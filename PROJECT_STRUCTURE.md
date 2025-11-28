# Project Structure

```
voronoi_africa/
│
├── 📁 output/                          # Generated data files
│   ├── .gitkeep                        # Keep directory in git
│   ├── africa_grid_centroids.geojson   # Grid-based centroids (generated)
│   ├── africa_country_centroids.geojson # Country centroids (generated)
│   └── AFR_ppp_2020_1km_Aggregated.tif # WorldPop data (optional download)
│
├── 📁 react-map/                       # React visualization app
│   ├── 📁 public/
│   │   ├── 📁 data/                    # GeoJSON files for web app
│   │   │   ├── .gitkeep
│   │   │   ├── africa_grid_centroids.geojson
│   │   │   └── africa_country_centroids.geojson
│   │   └── index.html                  # HTML template
│   │
│   ├── 📁 src/
│   │   ├── App.js                      # Main React component
│   │   ├── App.css                     # Styling
│   │   ├── index.js                    # React entry point
│   │   └── index.css                   # Global styles
│   │
│   ├── package.json                    # Node.js dependencies
│   ├── .gitignore                      # Git ignore rules
│   └── README.md                       # React app documentation
│
├── 🐍 process_population.py            # Main data processing script
├── 🐍 visualize_sample.py              # Quick preview tool
├── 📄 requirements.txt                 # Python dependencies
│
├── 🔧 setup.sh                         # Setup script (Unix)
├── 🔧 setup.bat                        # Setup script (Windows)
├── 🔧 run.sh                           # Run pipeline (Unix)
├── 🔧 run.bat                          # Run pipeline (Windows)
│
├── 📖 README.md                        # Main documentation
├── 📖 QUICKSTART.md                    # Quick start guide
├── 📖 USAGE.md                         # Detailed usage guide
├── 📖 PROJECT_STRUCTURE.md             # This file
└── .gitignore                          # Root git ignore

```

## File Descriptions

### Core Scripts

**process_population.py**
- Main Python script for data processing
- Downloads/loads WorldPop population data
- Calculates population-weighted centroids
- Exports GeoJSON format
- Can generate sample data for testing

**visualize_sample.py**
- Quick preview tool for GeoJSON files
- Prints statistics and summaries
- Creates simple HTML map preview
- Useful for debugging without React

### React Application

**react-map/src/App.js**
- Main React component
- Leaflet map integration
- Data loading and visualization
- Interactive features (popups, layers)

**react-map/src/App.css**
- All styling for the application
- Responsive design
- Legend and popup styles

### Configuration Files

**requirements.txt**
- Python package dependencies
- Versions locked for reproducibility

**package.json**
- Node.js dependencies for React app
- Scripts for running/building

### Setup & Run Scripts

**setup.sh / setup.bat**
- Install Python dependencies
- Install Node.js dependencies
- One-time setup process

**run.sh / run.bat**
- Run complete pipeline
- Process data → Copy files → Start React app
- All-in-one execution

### Documentation

**README.md**
- Main project documentation
- Overview and features
- Technical details

**QUICKSTART.md**
- Get started in minutes
- Minimal steps to run
- Troubleshooting basics

**USAGE.md**
- Detailed usage instructions
- Customization options
- Advanced features
- Data sources

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    1. Data Acquisition                       │
│  WorldPop Website → Download → output/*.tif                  │
│  (or sample data generation)                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    2. Python Processing                      │
│  process_population.py                                       │
│  • Load raster data                                          │
│  • Calculate weighted centroids                              │
│  • Export GeoJSON                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    3. File Transfer                          │
│  output/*.geojson → react-map/public/data/*.geojson         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    4. React Visualization                    │
│  • Load GeoJSON files                                        │
│  • Render on Leaflet map                                     │
│  • Interactive exploration                                   │
└─────────────────────────────────────────────────────────────┘
```

## Component Relationships

```
React App (App.js)
    │
    ├── MapContainer (react-leaflet)
    │   ├── TileLayer (base map)
    │   ├── LayersControl
    │   │   ├── BaseLayer (OpenStreetMap)
    │   │   ├── BaseLayer (Satellite)
    │   │   ├── BaseLayer (Terrain)
    │   │   ├── Overlay (Country Centroids)
    │   │   └── Overlay (Grid Centroids)
    │   │
    │   ├── CircleMarker (for each centroid)
    │   │   └── Popup (info display)
    │   │
    │   └── Legend (custom component)
    │
    └── Header (title/info)
```

## Key Dependencies

### Python
- **rasterio**: Read/write raster data
- **geopandas**: Geographic data operations
- **numpy**: Numerical computations
- **scipy**: Scientific computing
- **shapely**: Geometric operations

### JavaScript/React
- **react**: UI framework
- **react-leaflet**: Map component library
- **leaflet**: Interactive maps
- **react-scripts**: Build tools

## Development Workflow

1. **Setup**: Run `setup.sh` or `setup.bat`
2. **Develop Python**: Edit `process_population.py`
3. **Test Python**: Run `python process_population.py`
4. **Preview Data**: Run `python visualize_sample.py`
5. **Develop React**: Edit `react-map/src/App.js`
6. **Test React**: `cd react-map && npm start`
7. **Build**: `cd react-map && npm build`

## Production Deployment

### Python Backend
- Can be deployed as API service
- Consider using Flask/FastAPI for web endpoint
- Caching of processed results recommended

### React Frontend
- Build: `npm run build`
- Deploy `build/` folder to:
  - Netlify
  - Vercel
  - GitHub Pages
  - AWS S3 + CloudFront
  - Any static hosting

### GeoJSON Data
- Host separately if large files
- Use CDN for better performance
- Consider compression (gzip)

## Scalability Considerations

**For larger datasets:**
- Process by regions/countries separately
- Use PostGIS for spatial database
- Implement tile-based loading
- Add server-side filtering
- Use vector tiles instead of GeoJSON

**For production:**
- Add error handling
- Implement logging
- Add data validation
- Create automated tests
- Set up CI/CD pipeline




