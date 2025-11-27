# 🏛️ African Architecture Schools - Voronoi Map

Interactive map visualization showing **141 architecture schools** across **50 African countries/regions** with Voronoi cell overlays.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RomanDataLab/africa_archschools)

## 🌍 Live Demo

[View Live Map](https://africa-archschools.vercel.app) *(Update this URL after deployment)*

## ✨ Features

- 🗺️ **Interactive Mapbox Map** - Light OpenStreetMap style with smooth navigation
- 📐 **Voronoi Diagram** - Shows nearest school zones (200-mile buffer around Africa)
- 🎯 **Click Interactions** - Popups stay open until closed
- 🌊 **200-Mile Buffer Zone** - Covers Africa, Cabo Verde, Canary Islands, Madeira, Madagascar & more
- 💙 **Smart Voronoi Clipping** - Cells clipped to buffer zone boundaries
- 🔴 **141 Schools** across 50 countries/regions
- 🚀 **Built with TypeScript + Turf.js + Mapbox GL JS**

## 📊 Coverage

The map includes architecture schools from:
- **All 54 African countries** (including island nations)
- **Spanish territories**: Ceuta, Canary Islands
- **Portuguese territory**: Madeira
- **10 schools in Egypt** - most comprehensive coverage
- **Newest addition**: South Sudan (2 schools)

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/RomanDataLab/africa_archschools.git
cd africa_archschools

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool and dev server
- **Mapbox GL JS v3** - Interactive maps with vector tiles
- **Turf.js v7** - Advanced geospatial analysis
- **GeoJSON** - Standard geographic data format

## 📁 Project Structure

```
africa_archschools/
├── src/
│   ├── main.ts              # Main application logic & Voronoi generation
│   ├── config.ts            # Mapbox access token
│   ├── data.ts              # 141 architecture schools data
│   └── africa-outline.ts    # Buffer zone polygon coordinates
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment config
├── African_Architecture_Schools_expanded.csv  # Source data
└── README.md                # This file
```

## 🗺️ How It Works

1. **Buffer Zone Creation**
   - Creates 200-mile buffer around Africa + islands using Turf.js
   - Includes: Continental Africa, Cabo Verde, Canary Islands, Madeira, Madagascar, Seychelles, Mauritius

2. **Voronoi Generation**
   - Uses buffer zone's bounding box as the frame
   - Generates Voronoi cells for 141 schools
   - Clips cells to exact buffer polygon boundaries

3. **Map Rendering**
   - Light OpenStreetMap base layer
   - Gray buffer zone with dashed borders
   - Blue Voronoi cells with hover effects
   - Red school markers with click popups

## 🎨 Customization

### Change Map Style

Edit `src/main.ts`:
```typescript
style: 'mapbox://styles/mapbox/light-v11',
// Options: 'dark-v11', 'streets-v12', 'satellite-v9', 'outdoors-v12'
```

### Adjust Voronoi Colors

Edit the paint properties in `src/main.ts`:
```typescript
'fill-color': 'rgba(100, 150, 255, 0.25)',  // Voronoi cell fill
'line-color': '#6495ED',                     // Voronoi borders
```

### Modify Buffer Distance

Edit `src/main.ts`:
```typescript
const bufferDistance = 321.87; // km (200 miles)
// Change to any distance you need
```

## 📦 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel button at the top of this README.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

## 📊 Data Source

Architecture schools data (141 institutions) compiled from:
- University official websites
- Ministry of Education databases
- Educational directories
- Recent research (2024-2025)

Data includes: Institution name, city, country, website, coordinates (latitude/longitude)

## 🤝 Contributing

Contributions are welcome! If you know of additional architecture schools in Africa:

1. Fork the repository
2. Add school data to `src/data.ts` and `African_Architecture_Schools_expanded.csv`
3. Update the school count in `index.html`
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for educational or commercial purposes.

## 🙏 Acknowledgments

- Mapbox for the excellent mapping platform
- Turf.js for powerful geospatial operations
- All universities and institutions featured on this map

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for African architectural education**
