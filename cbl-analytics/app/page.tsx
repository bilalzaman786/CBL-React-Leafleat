'use client';

import { useState } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import MapContainer from '../components/MapContainer';

export default function Home() {
  // State for filters
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [storeFilter, setStoreFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'census' | 'new'>('all');

  return (
    <div>
      <Header title="CBL Analytics" />
      
      <div className="container w-full grid grid-cols-1 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-6 bg-[var(--card-bg)] p-8 rounded-xl shadow-[var(--shadow)] border border-[var(--border-color)] max-w-[1920px] mx-auto">
        <div className="map-container">
          <MapContainer 
            regionFilter={regionFilter}
            cityFilter={cityFilter}
            storeFilter={storeFilter}
            typeFilter={typeFilter}
          />
          <FilterBar 
            onRegionChange={setRegionFilter}
            onCityChange={setCityFilter}
            onStoreChange={setStoreFilter}
            regionFilter={regionFilter}
            cityFilter={cityFilter}
            storeFilter={storeFilter}
          />
        </div>
        
        <div className="panel flex flex-col gap-5">
          <div className="stats-card">
            <h3>Analytics Overview</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span>Total Stores</span>
                <span>78</span>
              </div>
              <div className="stat-item">
                <span>Active Regions</span>
                <span>5</span>
              </div>
              <div className="stat-item">
                <span>Total Coverage</span>
                <span>85%</span>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-box">
              <h4>Store Performance</h4>
              <p>Filter by store metrics and KPIs</p>
            </div>
            <div className="filter-box">
              <h4>Customer Insights</h4>
              <p>Filter by customer behavior and demographics</p>
            </div>
            <div className="filter-box">
              <h4>Inventory Status</h4>
              <p>Filter by stock levels and product categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
