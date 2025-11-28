# Africa Population Centroids - React Visualization

Interactive map visualization for population-weighted centroids across Africa.

## Features

- 🗺️ Interactive Leaflet map
- 📍 Population-weighted centroids display
- 🎨 Color-coded by population size
- 📊 Dynamic circle sizes based on population
- 🔀 Multiple base layer options (OpenStreetMap, Satellite, Terrain)
- 🎯 Layer controls for grid vs country centroids
- 📱 Responsive design
- 💡 Interactive popups with detailed information

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm build
```

Creates optimized production build in `build/` folder.

## Usage

### With Real Data

1. Process population data using Python script (see parent README)
2. Place GeoJSON files in `public/data/`:
   - `africa_grid_centroids.geojson`
   - `africa_country_centroids.geojson`
3. Start the app: `npm start`

### With Sample Data

The app includes sample data and will automatically use it if GeoJSON files are not found.

## Map Controls

- **Zoom**: Mouse wheel or +/- buttons
- **Pan**: Click and drag
- **Base Layer**: Select from layer control (top right)
- **Overlays**: Toggle grid/country centroids
- **Info**: Click any circle for details

## Customization

### Change Colors

Edit `src/App.js` - `getColor()` function:

```javascript
const getColor = (population) => {
  if (population > 50000000) return '#d73027';
  // ... modify thresholds and colors
};
```

### Adjust Circle Sizes

Edit `src/App.js` - `getRadius()` function:

```javascript
const getRadius = (population, isGrid = false) => {
  return Math.sqrt(population / 50000) + 2;
};
```

### Change Initial View

Edit `src/App.js` - MapContainer props:

```javascript
<MapContainer
  center={[0, 20]}  // [latitude, longitude]
  zoom={4}          // zoom level
  ...
>
```

### Modify Styling

Edit `src/App.css` for:
- Header appearance
- Legend styling
- Popup design
- Mobile responsiveness

## Dependencies

- **react**: UI framework
- **react-leaflet**: React bindings for Leaflet
- **leaflet**: Interactive map library
- **react-scripts**: Build tooling

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## Troubleshooting

### Map not loading
- Check browser console (F12)
- Verify GeoJSON files exist in `public/data/`
- Clear browser cache

### Markers not showing
- Verify GeoJSON format is correct
- Check console for JavaScript errors
- Ensure coordinates are [longitude, latitude] format

### Performance issues
- Reduce number of centroids in Python processing
- Increase `min_population` threshold
- Use grid centroids only (disable country layer)

## License

MIT




