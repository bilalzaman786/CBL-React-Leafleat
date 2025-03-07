'use client';

import { useState, useEffect } from 'react';
import { regions, cities } from '../data/stores';

interface FilterBarProps {
  onRegionChange: (region: string | null) => void;
  onCityChange: (city: string | null) => void;
  onStoreChange: (store: string | null) => void;
  regionFilter: string | null;
  cityFilter: string | null;
  storeFilter: string | null;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onRegionChange,
  onCityChange,
  onStoreChange,
  regionFilter,
  cityFilter,
  storeFilter
}) => {
  // Available cities based on selected region
  const [availableCities, setAvailableCities] = useState<string[]>(cities);

  // Update available cities when region changes
  useEffect(() => {
    if (regionFilter) {
      // If a region is selected, filter cities to only show those in the selected region
      // In a real app, this would be based on actual data relationships
      const filteredCities = cities.filter(city => {
        // This is a simplified example - in a real app, you would have a proper relationship
        // between regions and cities
        if (regionFilter === 'Sindh') return ['Karachi'].includes(city);
        if (regionFilter === 'Punjab') return ['Lahore'].includes(city);
        if (regionFilter === 'Federal') return ['Islamabad'].includes(city);
        return true;
      });
      setAvailableCities(filteredCities);
      
      // If current city is not in the filtered list, reset city filter
      if (cityFilter && !filteredCities.includes(cityFilter)) {
        onCityChange(null);
      }
    } else {
      // If no region selected, show all cities
      setAvailableCities(cities);
    }
  }, [regionFilter, cityFilter, onCityChange]);

  // Handle region change
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onRegionChange(value === '' ? null : value);
  };

  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onCityChange(value === '' ? null : value);
  };

  // Handle store ID input change
  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    onStoreChange(value === '' ? null : value);
  };

  return (
    <div className="filter-bar bg-white backdrop-blur-md p-4 border-t border-[var(--border-color)] z-[1000]">
      <div className="filter-group flex gap-3 justify-center items-center">
        <input
          type="text"
          id="region-filter"
          className="filter-input w-[200px] p-2 border border-[var(--border-color)] rounded-md bg-[var(--input-bg)] text-[var(--text-color)] text-sm"
          placeholder="Enter Region"
          value={regionFilter || ''}
          onChange={(e) => onRegionChange(e.target.value || null)}
        />
        <input
          type="text"
          id="city-filter"
          className="filter-input w-[200px] p-2 border border-[var(--border-color)] rounded-md bg-[var(--input-bg)] text-[var(--text-color)] text-sm"
          placeholder="Enter City"
          value={cityFilter || ''}
          onChange={(e) => onCityChange(e.target.value || null)}
        />
        <input
          type="text"
          id="store-filter"
          className="filter-input w-[200px] p-2 border border-[var(--border-color)] rounded-md bg-[var(--input-bg)] text-[var(--text-color)] text-sm"
          placeholder="Search Store"
          value={storeFilter || ''}
          onChange={handleStoreChange}
        />
      </div>
    </div>
  );
};

export default FilterBar;