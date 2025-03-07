'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Store, getFilteredStores } from '../data/stores';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import MarkerClusterGroup with no SSR
const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-cluster'),
  { ssr: false }
);

// Dynamically import Leaflet components with no SSR
const Map = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

// Import useMap hook directly to avoid issues with dynamic import
const useMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMap),
  { ssr: false }
);

// Component to handle map view reset
const ResetMapView = dynamic(
  () => {
    const Component = ({ center, zoom }: { center: LatLngExpression, zoom: number }) => {
      const map = useMap();
      
      useEffect(() => {
        if (map && typeof map.setView === 'function') {
          map.setView(center, zoom);
        }
      }, [center, zoom, map]);
      
      return null;
    };
    return Promise.resolve(Component);
  },
  { ssr: false }
);

// Define map center and zoom level
const DEFAULT_CENTER: LatLngExpression = [30.3753, 69.3451]; // Pakistan center
const DEFAULT_ZOOM = 6;

interface MapContainerProps {
  regionFilter: string | null;
  cityFilter: string | null;
  storeFilter: string | null;
  typeFilter: 'all' | 'census' | 'new';
}

const MapContainer: React.FC<MapContainerProps> = ({
  regionFilter,
  cityFilter,
  storeFilter,
  typeFilter
}) => {
  const [isClient, setIsClient] = useState(false);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);
  const mapRef = useRef<any>(null);
  
  // Icons for different store types
  // Using a ref to store icon instances to ensure they're only created once
  const iconInstancesRef = useRef<{census: any; new: any} | null>(null);
  
  useEffect(() => {
    setIsClient(true);
    // Load store data when component mounts
    import('../data/stores').then(({ loadStoreData, getFilteredStores: getStores }) => {
      loadStoreData().then(() => {
        // Update filtered stores after data is loaded
        const stores = getStores(regionFilter, cityFilter, storeFilter, typeFilter);
        setFilteredStores(stores);
      });
    });
  }, []);

  // Initialize icons on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Import Leaflet dynamically and its CSS
      const L = require('leaflet');
      
      // Fix Leaflet's default icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      
      // Create icon instances
      iconInstancesRef.current = {
        census: new L.Icon({
          iconUrl: '/marker-icon-blue.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        }),
        new: new L.Icon({
          iconUrl: '/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      };
    }
  }, [isClient]);
  
  // Update filtered stores when filters change
  useEffect(() => {
    import('../data/stores').then(({ getFilteredStores: getStores }) => {
      const stores = getStores(regionFilter, cityFilter, storeFilter, typeFilter);
      setFilteredStores(stores);
      
      // If city filter is applied, center map on that city
      if (cityFilter && stores.length > 0) {
        // Find the first store in the filtered city to center on
        const cityStore = stores.find(store => store.city === cityFilter);
        if (cityStore) {
          setMapCenter(cityStore.coords);
          setMapZoom(10); // Zoom in when focusing on a city
        }
      }
    });
  }, [regionFilter, cityFilter, storeFilter, typeFilter]);
  
  // Reset map view to default
  const resetView = () => {
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
  };
  
  // Filter for potential retailers (census stores)
  const showPotentialRetailers = () => {
    setFilteredStores(getFilteredStores(regionFilter, cityFilter, storeFilter, 'census'));
  };
  
  // Filter for current retailers (new stores)
  const showCurrentRetailers = () => {
    setFilteredStores(getFilteredStores(regionFilter, cityFilter, storeFilter, 'new'));
  };

  if (!isClient) {
    return null;
  }
  
  return (
    <div className="map-container w-full h-screen relative overflow-hidden">
      {/* Render the dynamically imported Leaflet components */}
      <Map 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: 'calc(100vh - 64px)', width: '100%' }}
        ref={mapRef}
        className="z-[1] relative"
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        
        {/* Render store markers with clustering */}
        <MarkerClusterGroup chunkedLoading>
          {filteredStores.map((store) => {
            // Only render markers if icons are initialized
            if (!iconInstancesRef.current) return null;
            
            return (
              <Marker 
                key={store.id} 
                position={store.coords}
                icon={store.type === 'census' ? iconInstancesRef.current.census : iconInstancesRef.current.new}
              >
                <Popup>
                  <div>
                    <h3>Store ID: {store.id}</h3>
                    <p>Type: {store.type === 'census' ? 'Potential Retailer' : 'Current Retailer'}</p>
                    {store.region && <p>Region: {store.region}</p>}
                    {store.city && <p>City: {store.city}</p>}
                    <p>Coordinates: {store.coords[0]}, {store.coords[1]}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
        
        {/* Render city circle if city filter is applied */}
        {cityFilter && filteredStores.length > 0 && (
          <Circle 
            center={mapCenter} 
            radius={5000} // 5km radius
            pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue' }}
          />
        )}
        
        <ResetMapView center={mapCenter} zoom={mapZoom} />
      </Map>
      
      {/* Map Controls */}
      <div className="map-controls absolute top-5 right-5 bg-white p-2.5 rounded-lg shadow-[var(--shadow)] z-[1000] flex gap-2.5">
        <button 
          onClick={resetView}
          className="btn btn-secondary text-xs py-1.5 px-3"
        >
          Reset View
        </button>
        <button 
          onClick={showPotentialRetailers}
          className="btn text-xs py-1.5 px-3"
        >
          Potential Retailers
        </button>
        <button 
          onClick={showCurrentRetailers}
          className="btn text-xs py-1.5 px-3"
        >
          Current Retailers
        </button>
      </div>
    </div>
  );
};

export default MapContainer;