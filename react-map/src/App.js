import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const { BaseLayer, Overlay } = LayersControl;

function App() {
  const [gridCentroids, setGridCentroids] = useState(null);
  const [countryCentroids, setCountryCentroids] = useState(null);
  const [clusterCentroids, setClusterCentroids] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load GeoJSON data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load grid centroids
        try {
          const gridResponse = await fetch('/data/africa_grid_centroids.geojson');
          if (gridResponse.ok) {
            const gridData = await gridResponse.json();
            setGridCentroids(gridData);
          }
        } catch (e) {
          console.log('Grid data not available:', e);
        }

        // Try to load country centroids
        try {
          const countryResponse = await fetch('/data/africa_country_centroids.geojson');
          if (countryResponse.ok) {
            const countryData = await countryResponse.json();
            setCountryCentroids(countryData);
          }
        } catch (e) {
          console.log('Country data not available:', e);
        }

        // Try to load population cluster centroids (10M+ people)
        try {
          const clusterResponse = await fetch('/data/africa_population_clusters.geojson');
          if (clusterResponse.ok) {
            const clusterData = await clusterResponse.json();
            setClusterCentroids(clusterData);
          }
        } catch (e) {
          console.log('Cluster data not available:', e);
        }

        // If no data loaded, use sample data
        if (!gridCentroids && !countryCentroids && !clusterCentroids) {
          setClusterCentroids(getSampleClusterData());
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setCountryCentroids(getSampleData());
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate sample cluster data if actual data is not available
  const getSampleClusterData = () => {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [31.2357, 30.0444] },
          properties: { name: 'Cairo Cluster', population: 25000000, cluster_id: 1, density_per_km2: 5000 }
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [3.3792, 6.5244] },
          properties: { name: 'Lagos Cluster', population: 20000000, cluster_id: 2, density_per_km2: 4500 }
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [15.3136, -4.3276] },
          properties: { name: 'Kinshasa Cluster', population: 15000000, cluster_id: 3, density_per_km2: 3500 }
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [28.0473, -26.2041] },
          properties: { name: 'Johannesburg Cluster', population: 12000000, cluster_id: 4, density_per_km2: 3000 }
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [32.5599, 15.5007] },
          properties: { name: 'Khartoum Cluster', population: 10500000, cluster_id: 5, density_per_km2: 2800 }
        }
      ]
    };
  };

  // Calculate radius based on population
  const getRadius = (population, isGrid = false) => {
    if (isGrid) {
      // For grid centroids, smaller base radius
      return Math.sqrt(population / 50000) + 2;
    }
    // For country centroids, larger radius
    return Math.sqrt(population / 100000) + 3;
  };

  // Get color based on population
  const getColor = (population) => {
    if (population > 50000000) return '#d73027';
    if (population > 20000000) return '#fc8d59';
    if (population > 10000000) return '#fee090';
    if (population > 5000000) return '#e0f3f8';
    if (population > 1000000) return '#91bfdb';
    return '#4575b4';
  };

  // Format population number
  const formatPopulation = (pop) => {
    if (pop >= 1000000) {
      return `${(pop / 1000000).toFixed(2)}M`;
    }
    if (pop >= 1000) {
      return `${(pop / 1000).toFixed(0)}K`;
    }
    return pop.toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading population data...</h2>
        <p>Calculating centroids from WorldPop data</p>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Africa Population Clusters (>10M People)</h1>
        <p>Data source: <a href="https://www.worldpop.org/" target="_blank" rel="noopener noreferrer">WorldPop</a> | 
           Centroids represent centers of population clusters, not country centers</p>
      </div>

      <MapContainer
        center={[0, 20]}
        zoom={4}
        style={{ height: 'calc(100vh - 80px)', width: '100%' }}
        className="map-container"
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
          <BaseLayer name="Terrain">
            <TileLayer
              attribution='Map tiles by Stamen Design, CC BY 3.0'
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          {clusterCentroids && (
            <Overlay checked name="Population Clusters (>10M)">
              <>
                {clusterCentroids.features.map((feature, idx) => {
                  const [lon, lat] = feature.geometry.coordinates;
                  const pop = feature.properties.population || 0;
                  const density = feature.properties.density_per_km2 || 0;
                  
                  return (
                    <CircleMarker
                      key={`cluster-${idx}`}
                      center={[lat, lon]}
                      radius={getRadius(pop, false) * 1.5}
                      fillColor={getColor(pop)}
                      fillOpacity={0.8}
                      color="#fff"
                      weight={3}
                    >
                      <Popup>
                        <div className="popup-content">
                          <h3>{feature.properties.name || 'Population Cluster'}</h3>
                          <p><strong>Cluster ID:</strong> #{feature.properties.cluster_id}</p>
                          <p><strong>Population:</strong> {formatPopulation(pop)}</p>
                          <p><strong>Density:</strong> {density.toFixed(0)} people/km²</p>
                          <p><strong>Coordinates:</strong> {lat.toFixed(4)}, {lon.toFixed(4)}</p>
                          {feature.properties.area_km2 && (
                            <p><strong>Area:</strong> {formatPopulation(feature.properties.area_km2)} km²</p>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </>
            </Overlay>
          )}

          {countryCentroids && (
            <Overlay name="Country Centroids">
              <>
                {countryCentroids.features.map((feature, idx) => {
                  const [lon, lat] = feature.geometry.coordinates;
                  const pop = feature.properties.population || 0;
                  
                  return (
                    <CircleMarker
                      key={`country-${idx}`}
                      center={[lat, lon]}
                      radius={getRadius(pop, false)}
                      fillColor={getColor(pop)}
                      fillOpacity={0.6}
                      color="#fff"
                      weight={2}
                    >
                      <Popup>
                        <div className="popup-content">
                          <h3>{feature.properties.name || 'Unknown'}</h3>
                          <p><strong>Population:</strong> {formatPopulation(pop)}</p>
                          <p><strong>Coordinates:</strong> {lat.toFixed(4)}, {lon.toFixed(4)}</p>
                          {feature.properties.iso_a3 && (
                            <p><strong>ISO Code:</strong> {feature.properties.iso_a3}</p>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </>
            </Overlay>
          )}

          {gridCentroids && (
            <Overlay name="Grid Centroids">
              <>
                {gridCentroids.features.map((feature, idx) => {
                  const [lon, lat] = feature.geometry.coordinates;
                  const pop = feature.properties.population || 0;
                  
                  return (
                    <CircleMarker
                      key={`grid-${idx}`}
                      center={[lat, lon]}
                      radius={getRadius(pop, true)}
                      fillColor={getColor(pop)}
                      fillOpacity={0.6}
                      color="#333"
                      weight={1}
                    >
                      <Popup>
                        <div className="popup-content">
                          <h3>Grid Cell {feature.properties.grid_id}</h3>
                          <p><strong>Population:</strong> {formatPopulation(pop)}</p>
                          <p><strong>Coordinates:</strong> {lat.toFixed(4)}, {lon.toFixed(4)}</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </>
            </Overlay>
          )}
        </LayersControl>

        <div className="legend">
          <h4>Population</h4>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#d73027' }}></span>
            <span>&gt; 50M</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#fc8d59' }}></span>
            <span>20M - 50M</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#fee090' }}></span>
            <span>10M - 20M</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#e0f3f8' }}></span>
            <span>5M - 10M</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#91bfdb' }}></span>
            <span>1M - 5M</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#4575b4' }}></span>
            <span>&lt; 1M</span>
          </div>
        </div>
      </MapContainer>

      {error && (
        <div className="error-message">
          <p>⚠️ Using sample data. Run Python script to generate actual centroids.</p>
        </div>
      )}
    </div>
  );
}

export default App;

