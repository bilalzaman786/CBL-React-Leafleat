// Define TypeScript interface for store data
export interface Store {
  id: string;
  coords: [number, number]; // [latitude, longitude]
  type: "census" | "new";
  region?: string;
  city?: string;
}

// Store data state
let storeData: Store[] = [];
let regions: string[] = [];
let cities: string[] = [];

// Function to load store data
export async function loadStoreData() {
  try {
    const response = await fetch('/api/stores');
    const data = await response.json();
    
    if (data.stores) {
      storeData = data.stores;
      // Extract unique regions and cities for filters
      regions = Array.from(new Set(storeData.map(store => store.region).filter(Boolean)));
      cities = Array.from(new Set(storeData.map(store => store.city).filter(Boolean)));
    }
  } catch (error) {
    console.error('Error loading store data:', error);
  }
}

// Export regions and cities
export { regions, cities };

// Helper function to get stores by filter
export const getFilteredStores = (
  regionFilter: string | null,
  cityFilter: string | null,
  storeFilter: string | null,
  typeFilter: "all" | "census" | "new" = "all"
): Store[] => {
  // If no filters are applied, return all stores
  if (!regionFilter && !cityFilter && !storeFilter && typeFilter === "all") {
    return storeData;
  }

  return storeData.filter(store => {
    // Filter by type
    if (typeFilter !== "all" && store.type !== typeFilter) return false;
    
    // Filter by region
    if (regionFilter && store.region !== regionFilter) return false;
    
    // Filter by city
    if (cityFilter && store.city !== cityFilter) return false;
    
    // Filter by store ID
    if (storeFilter && !store.id.includes(storeFilter)) return false;
    
    return true;
  });
};