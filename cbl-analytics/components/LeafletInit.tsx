'use client';

import { useEffect } from 'react';

// This component handles Leaflet initialization in Next.js
// It fixes the issue with Leaflet's default icons in Next.js
const LeafletInit = () => {
  useEffect(() => {
    // This code runs only on the client side
    const L = require('leaflet');
    
    // Fix Leaflet's default icon paths
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-blue.png',
      iconUrl: '/marker-icon-blue.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  return null;
};

export default LeafletInit;