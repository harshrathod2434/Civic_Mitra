import React from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import { CityStats } from '../../types';
import 'leaflet/dist/leaflet.css';

interface MaharashtraMapProps {
  cityStats: CityStats[];
}

const MaharashtraMap: React.FC<MaharashtraMapProps> = ({ cityStats }) => {
  // Center of Maharashtra
  const maharashtraCenter: [number, number] = [19.7515, 75.7139];
  
  const getMarkerColor = (resolvedPercentage: number) => {
    if (resolvedPercentage >= 80) return '#22c55e'; // green
    if (resolvedPercentage >= 40) return '#eab308'; // yellow
    return '#ef4444'; // red
  };
  
  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer 
        center={maharashtraCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {cityStats.map((city) => {
          const resolvedPercentage = city.totalIssues > 0 
            ? (city.resolvedIssues / city.totalIssues) * 100 
            : 0;
            
          return (
            <CircleMarker 
              key={city.city} 
              center={city.location}
              radius={20}
              pathOptions={{ 
                fillColor: getMarkerColor(resolvedPercentage),
                color: '#000',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.6
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{city.city}</h3>
                  <p className="mb-1"><strong>Total Issues:</strong> {city.totalIssues}</p>
                  <p className="mb-1"><strong>Resolved:</strong> {city.resolvedIssues}</p>
                  <p className="mb-1"><strong>Resolution Rate:</strong> {resolvedPercentage.toFixed(1)}%</p>
                  
                  <div className="mt-3">
                    <h4 className="font-medium mb-1">Department Breakdown:</h4>
                    <ul className="list-disc pl-5">
                      {Object.entries(city.departmentBreakdown).map(([dept, count]) => (
                        <li key={dept}>{dept}: {count} issues</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MaharashtraMap;