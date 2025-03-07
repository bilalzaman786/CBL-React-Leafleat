import { Store } from '../types/store';

interface RawStoreData {
  store_code: string;
  latitude: string;
  longitude: string;
}

export const processStoreData = (rawData: string): Store[] => {
  // Parse data
  const lines = rawData.split('\n').filter(line => line.trim());
  
  // Skip the header line
  const dataLines = lines.slice(1);
  
  // Convert raw data to structured format
  const storeData: RawStoreData[] = dataLines
    .filter(line => {
      const values = line.split('\t');
      return values.length >= 3 && values[0] && values[1] && values[2];
    })
    .map(line => {
      const [store_code, latitude, longitude] = line.split('\t');
      return {
        store_code,
        latitude,
        longitude
      };
    });

  // Calculate the split ratio
  const totalStores = storeData.length;
  const currentRetailersCount = Math.ceil(totalStores * 0.6); // 60% current retailers

  // Convert to Store format with type assignment
  const stores: Store[] = storeData.map((store, index) => ({
    id: store.store_code,
    coords: [parseFloat(store.latitude), parseFloat(store.longitude)] as [number, number], // Coordinates in [lat, lng] format for Leaflet
    type: index < currentRetailersCount ? 'new' : 'census', // First 60% as current retailers
    region: '', // These can be added later if needed
    city: ''
  }));

  return stores;
};