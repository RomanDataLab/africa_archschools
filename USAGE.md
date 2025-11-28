# Usage Guide

## Quick Start

### Windows Users

```batch
# Run setup (one time only)
setup.bat

# Run the complete pipeline
run.bat
```

### Linux/Mac Users

```bash
# Make scripts executable
chmod +x setup.sh run.sh

# Run setup (one time only)
./setup.sh

# Run the complete pipeline
./run.sh
```

## Detailed Steps

### 1. Install Dependencies

#### Python Dependencies
```bash
pip install -r requirements.txt
```

Required packages:
- `numpy` - Numerical computing
- `rasterio` - Geospatial raster I/O
- `geopandas` - Geographic data processing
- `pandas` - Data manipulation
- `requests` - HTTP library for downloads
- `scipy` - Scientific computing
- `shapely` - Geometric operations
- `tqdm` - Progress bars

#### React Dependencies
```bash
cd react-map
npm install
```

### 2. Download Population Data

#### Option A: Use WorldPop Data (Recommended)

1. Visit [WorldPop Hub](https://hub.worldpop.org/geodata/summary?id=24777)
2. Download: **Africa 2020 1km Unconstrained UN adjusted**
   - File: `AFR_ppp_2020_1km_Aggregated.tif`
3. Place in: `output/AFR_ppp_2020_1km_Aggregated.tif`

#### Option B: Use Sample Data

The script will automatically generate sample data if no WorldPop file is found. This is useful for:
- Testing the pipeline
- Understanding the output format
- Development purposes

### 3. Process Population Data

```bash
python process_population.py
```

This script will:
1. Load the population raster data
2. Create grid-based centroids (0.5° resolution, ~55km)
3. Create country-level centroids
4. Export as GeoJSON files

**Output files:**
- `output/africa_grid_centroids.geojson`
- `output/africa_country_centroids.geojson`

**Processing time:** 5-30 minutes depending on:
- Computer specs
- Data resolution
- Grid size parameter

### 4. Copy Data to React App

```bash
# Windows
copy output\*.geojson react-map\public\data\

# Linux/Mac
cp output/*.geojson react-map/public/data/
```

### 5. Start Visualization

```bash
cd react-map
npm start
```

The app will open at `http://localhost:3000`

## Customization

### Adjust Grid Size

Edit `process_population.py`:

```python
geojson_grid = generator.create_grid_centroids(
    raster_file, 
    grid_size=0.25,  # Change this (default: 0.5)
    min_population=1000
)
```

Smaller values = more centroids, higher resolution, longer processing time.

### Change Minimum Population Threshold

```python
geojson_grid = generator.create_grid_centroids(
    raster_file, 
    grid_size=0.5,
    min_population=5000  # Change this (default: 1000)
)
```

Higher values = fewer centroids, only populated areas shown.

### Modify Map Appearance

Edit `react-map/src/App.css` to change:
- Colors
- Circle sizes
- Legend position
- Popup styling

Edit `react-map/src/App.js` to change:
- Base map tiles
- Default zoom level
- Color scheme logic
- Circle radius calculation

## Understanding the Output

### Population-Weighted Centroids

A population-weighted centroid is **not** the geographic center of an area. Instead, it represents where the population "mass" is concentrated.

**Example:**
- Country X has 100km² area
- Geographic center: middle of the country
- Population-weighted centroid: shifted toward cities/populated regions

**Calculation:**
```
x_centroid = Σ(x_i × pop_i) / Σ(pop_i)
y_centroid = Σ(y_i × pop_i) / Σ(pop_i)
```

Where:
- `(x_i, y_i)` = coordinates of pixel i
- `pop_i` = population at pixel i

### GeoJSON Structure

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [longitude, latitude]
      },
      "properties": {
        "population": 12500000,
        "name": "Country Name",
        "grid_id": "cell_identifier"
      }
    }
  ]
}
```

## Troubleshooting

### Issue: Python script fails with "File not found"

**Solution:** Download WorldPop data or let script create sample data.

### Issue: React app shows "Using sample data"

**Solution:** 
1. Run Python script first
2. Copy GeoJSON files to `react-map/public/data/`
3. Refresh browser

### Issue: Map doesn't load

**Solution:**
1. Check browser console for errors (F12)
2. Ensure GeoJSON files are valid JSON
3. Check file paths in `App.js`

### Issue: Python out of memory

**Solution:**
1. Use smaller grid size
2. Process regions separately
3. Use lower resolution data
4. Increase system RAM

### Issue: Circles too small/large on map

**Solution:** Adjust radius calculation in `App.js`:

```javascript
const getRadius = (population, isGrid = false) => {
  if (isGrid) {
    return Math.sqrt(population / 50000) + 2;  // Adjust these values
  }
  return Math.sqrt(population / 100000) + 3;
};
```

## Advanced Usage

### Processing Specific Countries

Modify `process_population.py`:

```python
# Filter to specific countries
countries_to_process = ['Nigeria', 'Kenya', 'Egypt']
africa = africa[africa['name'].isin(countries_to_process)]
```

### Using Different Data Sources

The script works with any population raster in GeoTIFF format:
- WorldPop
- LandScan
- GPW (Gridded Population of the World)
- Custom datasets

Just ensure:
- File format: GeoTIFF (.tif)
- CRS: Any (script handles projection)
- NoData values: Properly set

### Exporting to Other Formats

Add to `process_population.py`:

```python
# Export as Shapefile
gdf = gpd.GeoDataFrame.from_features(geojson['features'])
gdf.to_file('output/centroids.shp')

# Export as CSV
import pandas as pd
df = pd.json_normalize(geojson['features'])
df.to_csv('output/centroids.csv', index=False)
```

## Performance Tips

1. **Use appropriate resolution**: 1km data is high-res but large
2. **Larger grid sizes**: Process faster but less detail
3. **Filter by population**: Skip low-population areas
4. **Parallel processing**: Modify script for multiprocessing
5. **Caching**: Script checks for existing downloads

## Data Sources & References

### WorldPop
- Website: https://www.worldpop.org/
- Data portal: https://hub.worldpop.org/
- API docs: https://www.worldpop.org/methods/api

### Alternative Sources
- **LandScan**: https://landscan.ornl.gov/
- **GHSL**: https://ghsl.jrc.ec.europa.eu/
- **GPWv4**: https://sedac.ciesin.columbia.edu/data/collection/gpw-v4

### Citation

If using WorldPop data, please cite:

> Tatem, A.J. (2017). WorldPop, open data for spatial demography. *Scientific Data*, 4, 170004. doi:10.1038/sdata.2017.4

## License

This project: MIT License
WorldPop data: CC BY 4.0 License




