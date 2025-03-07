'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import types
import type { LatLngExpression } from 'leaflet';
import type { Store } from '../data/stores';

// Custom icons for different store types
const createCustomIcon = (iconUrl: string) => {
  return new Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to handle map view reset
function ResetMapView({ center, zoom }: { center: LatLngExpression, zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

interface LeafletMapProps {
  center: LatLngExpression;
  zoom: number;
  filteredStores: Store[];
  mapCenter: LatLngExpression;
  mapZoom: number;
  cityFilter: string | null;
  mapRef: React.RefObject<any>;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  filteredStores,
  mapCenter,
  mapZoom,
  cityFilter,
  mapRef
}) => {
  // Fix Leaflet's default icon paths
  useEffect(() => {
    // This code runs only on the client side
    const L = require('leaflet');
    
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-blue.png',
      iconUrl: '/marker-icon-blue.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Icons for different store types
  const censusIcon = createCustomIcon('/marker-icon-blue.png');
  const newIcon = createCustomIcon('/marker-icon-red.png');

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100vh', width: '100%' }}
      ref={mapRef}
      className="z-[1] relative"
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      
      {/* Render store markers */}
      {filteredStores.map((store) => (
        <Marker 
          key={store.id} 
          position={store.coords}
          icon={store.type === 'census' ? censusIcon : newIcon}
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
      ))}
      
      {/* Render city circle if city filter is applied */}
      {cityFilter && filteredStores.length > 0 && (
        <Circle 
          center={mapCenter} 
          radius={5000} // 5km radius
          pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue' }}
        />
      )}
      
      <ResetMapView center={mapCenter} zoom={mapZoom} />
    </MapContainer>
  );
};

export default LeafletMap;