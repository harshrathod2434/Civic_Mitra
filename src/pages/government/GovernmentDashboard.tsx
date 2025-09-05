import React from 'react';
import { ISSUES, generateCityStats, getCategoryStats } from '../../data/mockData';
import MaharashtraMap from '../../components/Map/MaharashtraMap';
import AnalyticsCharts from '../../components/Charts/AnalyticsCharts';

const GovernmentDashboard: React.FC = () => {
  const cityStats = generateCityStats();
  const categoryStats = getCategoryStats();
  
  return (
    <div className="space-y-6 bg-white min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Maharashtra Government Dashboard</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">State Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black text-white p-4 rounded-lg">
            <h3 className="text-lg font-medium opacity-75">Total Issues</h3>
            <p className="text-3xl font-bold">{ISSUES.length}</p>
          </div>
          
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-600">In Progress</h3>
            <p className="text-3xl font-bold text-black">
              {ISSUES.filter(i => i.status === 'In Progress').length}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-600">Resolved</h3>
            <p className="text-3xl font-bold text-black">
              {ISSUES.filter(i => i.status === 'Resolved').length}
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-600">High Priority</h3>
            <p className="text-3xl font-bold text-black">
              {ISSUES.filter(i => i.priority === 'High' || i.priority === 'Very High').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Category Overview */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">Category Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{category}</h3>
              <p className="text-2xl font-bold text-black">{stats.total}</p>
              <div className="text-xs text-gray-500 mt-1">
                {stats.byStatus['Resolved']} resolved
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">Maharashtra Map</h2>
          <MaharashtraMap cityStats={cityStats} />
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-black">City Statistics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Issues</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Resolved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Resolution Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cityStats.map((city) => {
                  const resolutionRate = city.totalIssues > 0 
                    ? (city.resolvedIssues / city.totalIssues) * 100 
                    : 0;
                    
                  return (
                    <tr key={city.city} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{city.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{city.totalIssues}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{city.resolvedIssues}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{resolutionRate.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-black">Analytics</h2>
        <AnalyticsCharts issues={ISSUES} cityStats={cityStats} />
      </div>
    </div>
  );
};

export default GovernmentDashboard;