import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { MAPBOX_ACCESS_TOKEN } from './config';
import { schoolsData } from './data';
import { 
    africaOutlineCoordinates, 
    madagascarCoordinates, 
    canaryIslandsCoordinates,
    caboVerdeCoordinates,
    madeiraCoordinates,
    seychellesCoordinates,
    mauritiusCoordinates 
} from './africa-outline';
import type { Feature, FeatureCollection, Point, Polygon, MultiPolygon } from 'geojson';

interface SchoolProperties {
    institution: string;
    city: string;
    country: string;
    website: string;
}

// Convert schools data to GeoJSON
function schoolsToGeoJSON(schools: typeof schoolsData): FeatureCollection<Point, SchoolProperties> {
    return {
        type: 'FeatureCollection',
        features: schools.map((school, index) => ({
            type: 'Feature',
            id: index,
            properties: {
                institution: school.Institution,
                city: school.City,
                country: school.Country,
                website: school.Website
            },
            geometry: {
                type: 'Point',
                coordinates: [school.Longitude, school.Latitude]
            }
        }))
    };
}

// Create Voronoi polygons using Turf.js
function createVoronoiPolygons(
    geojson: FeatureCollection<Point, SchoolProperties>,
    clipPolygon?: Feature<Polygon | MultiPolygon>
): FeatureCollection<Polygon, SchoolProperties & { cellId: number }> | null {
    try {
        console.log('Creating Voronoi diagram for', geojson.features.length, 'points');
        console.log('Sample point:', geojson.features[0]);
        
        // Use buffer polygon's bounding box as Voronoi frame if available
        let bbox: [number, number, number, number];
        
        if (clipPolygon) {
            // Get bounding box from the buffer polygon
            const bufferBbox = turf.bbox(clipPolygon);
            bbox = bufferBbox as [number, number, number, number];
            console.log('Using buffer zone bounding box as Voronoi frame:', bbox);
        } else {
            // Fallback: Africa bounds extended westward to cover Cabo Verde and Madeira
            bbox = [-27, -40, 60, 40];
            console.log('Using default bounding box:', bbox);
        }
        
        // Test if turf.voronoi exists
        console.log('turf.voronoi type:', typeof turf.voronoi);
        console.log('Available turf methods:', Object.keys(turf).filter(k => k.toLowerCase().includes('voronoi')));
        
        // Create Voronoi diagram
        console.log('Calling turf.voronoi...');
        const voronoi = turf.voronoi(geojson, { bbox });
        
        console.log('Voronoi result:', voronoi);
        console.log('Voronoi type:', voronoi?.type);
        console.log('Voronoi features length:', voronoi?.features?.length);
        
        if (!voronoi || !voronoi.features || voronoi.features.length === 0) {
            console.error('❌ No Voronoi features created');
            console.error('Voronoi object:', voronoi);
            return null;
        }
        
        console.log('✅ Voronoi features created:', voronoi.features.length);
        console.log('First Voronoi feature:', voronoi.features[0]);
        
        // Filter out any null or invalid features and add properties
        const validFeatures: Feature<Polygon, SchoolProperties & { cellId: number }>[] = [];
        
        voronoi.features.forEach((feature, index) => {
            // Check if feature and geometry are valid
            if (!feature || !feature.geometry || !feature.geometry.coordinates) {
                console.warn(`Skipping invalid feature at index ${index}`);
                return;
            }
            
            // Get the corresponding original feature
            const originalFeature = geojson.features[index];
            if (!originalFeature) {
                console.warn(`No original feature found for index ${index}`);
                return;
            }
            
            // Create new feature with combined properties
            validFeatures.push({
                type: 'Feature',
                id: index,
                properties: {
                    ...originalFeature.properties,
                    cellId: index
                },
                geometry: feature.geometry
            } as Feature<Polygon, SchoolProperties & { cellId: number }>);
        });
        
        console.log(`Valid Voronoi features: ${validFeatures.length} out of ${voronoi.features.length}`);
        
        // Clip Voronoi cells by buffer polygon if provided
        let finalFeatures = validFeatures;
        
        if (clipPolygon) {
            console.log('Clipping Voronoi cells to buffer zone...');
            const clippedFeatures: Feature<Polygon, SchoolProperties & { cellId: number }>[] = [];
            
            validFeatures.forEach((feature, index) => {
                try {
                    // Intersect each Voronoi cell with the clip polygon
                    const intersection = turf.intersect(
                        turf.featureCollection([feature, clipPolygon])
                    );
                    
                    if (intersection && intersection.geometry) {
                        // Keep the properties from the original feature
                        clippedFeatures.push({
                            type: 'Feature',
                            id: feature.id,
                            properties: feature.properties,
                            geometry: intersection.geometry as Polygon['type'] extends 'Polygon' ? Polygon : never
                        } as Feature<Polygon, SchoolProperties & { cellId: number }>);
                    }
                } catch (error) {
                    console.warn(`Could not clip Voronoi cell ${index}:`, error);
                    // Keep original if clipping fails
                    clippedFeatures.push(feature);
                }
            });
            
            console.log(`Clipped Voronoi cells: ${clippedFeatures.length} cells retained`);
            finalFeatures = clippedFeatures;
        }
        
        const voronoiWithProps: FeatureCollection<Polygon, SchoolProperties & { cellId: number }> = {
            type: 'FeatureCollection',
            features: finalFeatures
        };
        
        return voronoiWithProps;
    } catch (error) {
        console.error('Error creating Voronoi diagram:', error);
        return null;
    }
}

// Create Africa buffer zone (200 miles ≈ 321.87 km)
function createAfricaBuffer(): Feature<Polygon | MultiPolygon> | null {
    try {
        console.log('Creating Africa 200-mile buffer zone...');
        
        // Create main Africa polygon
        const africaPolygon = turf.polygon([africaOutlineCoordinates]);
        
        // Create island polygons
        const madagascar = turf.polygon([madagascarCoordinates]);
        const canaryIslands = turf.polygon([canaryIslandsCoordinates]);
        const caboVerde = turf.polygon([caboVerdeCoordinates]);
        const madeira = turf.polygon([madeiraCoordinates]);
        const seychelles = turf.polygon([seychellesCoordinates]);
        const mauritius = turf.polygon([mauritiusCoordinates]);
        
        // Combine all polygons
        const allPolygons = turf.featureCollection([
            africaPolygon,
            madagascar,
            canaryIslands,
            caboVerde,
            madeira,
            seychelles,
            mauritius
        ]);
        
        // Create buffer: 200 miles = 321.87 km
        const bufferDistance = 321.87; // km
        console.log(`Creating ${bufferDistance}km (200 mile) buffer...`);
        
        const buffered = turf.buffer(allPolygons, bufferDistance, { units: 'kilometers' });
        
        if (!buffered) {
            console.error('Failed to create buffer');
            return null;
        }
        
        console.log('Buffer created, unifying and simplifying...');
        
        // Union all buffered features into one
        let unified: Feature<Polygon | MultiPolygon>;
        
        if (buffered.type === 'FeatureCollection' && buffered.features.length > 0) {
            // Start with first feature
            unified = buffered.features[0] as Feature<Polygon | MultiPolygon>;
            
            // Union with remaining features
            for (let i = 1; i < buffered.features.length; i++) {
                const feature = buffered.features[i] as Feature<Polygon | MultiPolygon>;
                try {
                    const unionResult = turf.union(turf.featureCollection([unified, feature]));
                    if (unionResult) {
                        unified = unionResult as Feature<Polygon | MultiPolygon>;
                    }
                } catch (e) {
                    console.warn(`Could not union feature ${i}:`, e);
                }
            }
        } else if (buffered.type === 'Feature') {
            unified = buffered as Feature<Polygon | MultiPolygon>;
        } else {
            console.error('Unexpected buffer result type');
            return null;
        }
        
        // Simplify the unified buffer to reduce complexity
        const simplified = turf.simplify(unified, { tolerance: 1.0, highQuality: false });
        
        console.log('✅ Unified 200-mile buffer created and simplified');
        console.log('Buffer geometry type:', simplified.geometry.type);
        
        return simplified as Feature<Polygon | MultiPolygon>;
    } catch (error) {
        console.error('Error creating Africa buffer:', error);
        return null;
    }
}

// Update status message
function updateStatus(message: string, type: 'loading' | 'success' | 'error') {
    const statusEl = document.getElementById('voronoi-status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `status-${type}`;
    }
}

// Initialize the map
function initMap() {
    console.log('Initializing map...');
    
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [20, 0],
        zoom: 3,
        projection: 'mercator'
    });

    // Parse schools data
    const schoolsGeoJSON = schoolsToGeoJSON(schoolsData);
    console.log('Schools GeoJSON features:', schoolsGeoJSON.features.length);
    
    // Update statistics
    const countries = new Set(schoolsData.map(s => s.Country));
    const countryCountEl = document.getElementById('country-count');
    if (countryCountEl) {
        countryCountEl.textContent = countries.size.toString();
    }

    map.on('load', () => {
        console.log('🗺️ Map loaded, creating Africa buffer and Voronoi...');
        console.log('Turf.js loaded:', typeof turf);
        
        // Create Africa buffer zone
        const africaBuffer = createAfricaBuffer();
        let voronoiPolygons: FeatureCollection<Polygon, SchoolProperties & { cellId: number }> | null = null;
        
        if (africaBuffer) {
            console.log('Adding Africa buffer to map...');
            
            // Add Africa buffer layer
            map.addSource('africa-buffer', {
                type: 'geojson',
                data: africaBuffer as any
            });
            
            // Add fill layer for buffer
            map.addLayer({
                id: 'africa-buffer-fill',
                type: 'fill',
                source: 'africa-buffer',
                paint: {
                    'fill-color': '#34495e',
                    'fill-opacity': 0.15
                }
            });
            
            // Add outline for buffer
            map.addLayer({
                id: 'africa-buffer-outline',
                type: 'line',
                source: 'africa-buffer',
                paint: {
                    'line-color': '#2c3e50',
                    'line-width': 2,
                    'line-opacity': 0.8,
                    'line-dasharray': [2, 2]
                }
            });
            
            console.log('✅ Africa buffer added to map');
            
            // Create Voronoi diagram clipped to buffer zone
            console.log('Creating Voronoi with buffer clipping...');
            voronoiPolygons = createVoronoiPolygons(schoolsGeoJSON, africaBuffer);
        } else {
            // Create Voronoi diagram without clipping if buffer failed
            console.log('Creating Voronoi without clipping...');
            voronoiPolygons = createVoronoiPolygons(schoolsGeoJSON);
        }
        
        if (voronoiPolygons && voronoiPolygons.features.length > 0) {
            console.log('✅ Voronoi polygons created successfully!');
            console.log('Features to add:', voronoiPolygons.features.length);
            console.log('Sample feature:', JSON.stringify(voronoiPolygons.features[0], null, 2));
            console.log('Adding to map as source...');
            
            // Add Voronoi polygons layer
            try {
                map.addSource('voronoi', {
                    type: 'geojson',
                    data: voronoiPolygons as any
                });
                console.log('✅ Source added');
            } catch (error) {
                console.error('❌ Error adding source:', error);
                updateStatus('❌ Error adding Voronoi source', 'error');
                return;
            }

            map.addLayer({
                id: 'voronoi-polygons',
                type: 'fill',
                source: 'voronoi',
                paint: {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(100, 150, 255, 0.25)'
                    ],
                    'fill-opacity': 1
                }
            });
            
            console.log('✅ Voronoi fill layer added');

            map.addLayer({
                id: 'voronoi-outline',
                type: 'line',
                source: 'voronoi',
                paint: {
                    'line-color': '#6495ED',
                    'line-width': 2,
                    'line-opacity': 0.9
                }
            });
            
            console.log('✅ Voronoi outline layer added');
            console.log('Map layers:', map.getStyle().layers.map(l => l.id));
            
            updateStatus('✅ Buffer zone & Voronoi loaded', 'success');
            
            // Add hover effect for Voronoi cells
            let hoveredStateId: number | null = null;
            
            map.on('mousemove', 'voronoi-polygons', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                
                if (e.features && e.features.length > 0) {
                    if (hoveredStateId !== null) {
                        map.setFeatureState(
                            { source: 'voronoi', id: hoveredStateId },
                            { hover: false }
                        );
                    }
                    hoveredStateId = e.features[0].properties?.cellId ?? null;
                    if (hoveredStateId !== null) {
                        map.setFeatureState(
                            { source: 'voronoi', id: hoveredStateId },
                            { hover: true }
                        );
                    }
                }
            });

            map.on('mouseleave', 'voronoi-polygons', () => {
                map.getCanvas().style.cursor = '';
                if (hoveredStateId !== null) {
                    map.setFeatureState(
                        { source: 'voronoi', id: hoveredStateId },
                        { hover: false }
                    );
                }
                hoveredStateId = null;
            });

            // Show popup on click for Voronoi cells
            map.on('click', 'voronoi-polygons', (e) => {
                if (e.features && e.features.length > 0) {
                    const props = e.features[0].properties;
                    
                    const popupContent = `
                        <div class="popup-title">${props?.institution}</div>
                        <div class="popup-info">📍 ${props?.city}, ${props?.country}</div>
                        <div class="popup-info" style="margin-top: 8px; padding: 8px; background: #f0f8ff; border-radius: 4px; font-style: italic; color: #555; font-size: 11px;">
                            ℹ️ This area is closest to this school
                        </div>
                        <div class="popup-link">
                            <a href="${props?.website}" target="_blank">🔗 Visit Website</a>
                        </div>
                    `;
                    
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(popupContent)
                        .addTo(map);
                }
            });
        } else {
            console.error('❌ Failed to create Voronoi polygons');
            if (africaBuffer) {
                updateStatus('⚠️ Buffer loaded, Voronoi failed', 'error');
            } else {
                updateStatus('❌ Map features failed', 'error');
            }
        }

        // Add schools as points
        map.addSource('schools', {
            type: 'geojson',
            data: schoolsGeoJSON as any
        });

        map.addLayer({
            id: 'schools-circle',
            type: 'circle',
            source: 'schools',
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    3, 4,
                    8, 8
                ],
                'circle-color': '#FF6384',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0.9
            }
        });

        // Show popup on click for schools
        map.on('click', 'schools-circle', (e) => {
            if (e.features && e.features.length > 0) {
                const coordinates = (e.features[0].geometry as any).coordinates.slice();
                const props = e.features[0].properties;
                
                const popupContent = `
                    <div class="popup-title">${props?.institution}</div>
                    <div class="popup-info">📍 ${props?.city}, ${props?.country}</div>
                    <div class="popup-link">
                        <a href="${props?.website}" target="_blank">🔗 Visit Website</a>
                    </div>
                `;
                
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(popupContent)
                    .addTo(map);
            }
        });

        // Change cursor on hover for schools
        map.on('mouseenter', 'schools-circle', () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'schools-circle', () => {
            map.getCanvas().style.cursor = '';
        });
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
}

// Initialize when DOM is ready
initMap();

