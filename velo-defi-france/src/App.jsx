import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import EventList from './components/EventList';
import MapComponent from './components/MapContainer';
import { events as allEvents } from './data/events';
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    level: '',
    type: '',
    terrain: ''
  });

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Filter by Level
      if (filters.level && event.level !== filters.level) return false;

      // Filter by Type
      // Note: "Randonnée / Tourisme" maps to "Randonnée / Tourisme" in data or check partial match
      if (filters.type) {
        if (filters.type === "Randonnée / Tourisme" && !event.type.includes("Randonnée")) return false;
        // Simplistic match if exact match fails, but data has "Randonnée / Tourisme" exactly from what I recalled, 
        // wait, let's check mock data. Mock data has "Randonnée / Tourisme" (id 6). 
        // But just in case, let's do exact match first.
        if (filters.type !== event.type && !event.type.includes(filters.type)) return false;
      }

      // Filter by Terrain
      if (filters.terrain && event.terrain !== filters.terrain) return false;

      return true;
    });
  }, [filters]);

  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Filters filters={filters} onFilterChange={setFilters} />
        <EventList events={filteredEvents} />
        <MapComponent events={filteredEvents} />
      </div>
    </div>
  );
}

export default App;
