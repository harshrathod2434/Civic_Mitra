import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Issue, Category } from '../../types';
import { ISSUES, CITY_LOCATIONS } from '../../data/mockData';
import CategorySelector from '../../components/CategorySelector';
import IssueMap from '../../components/Map/IssueMap';
import IssueList from './IssueList';

const MunicipalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [issues, setIssues] = useState<Issue[]>(ISSUES);
  
  // Filter issues based on user's city and selected category
  useEffect(() => {
    if (!user?.city) return;
    
    let filtered = issues.filter(issue => issue.city === user.city);
    
    if (selectedCategory) {
      filtered = filtered.filter(issue => issue.category === selectedCategory);
    }
    
    setFilteredIssues(filtered);
  }, [user, selectedCategory, issues]);
  
  const handleSelectCategory = (category: Category) => {
    // If the same category is clicked, deselect it
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
  };
  
  const handleUpdateStatus = (issueId: number, newStatus: Issue['status'], proofPhoto?: string) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === issueId 
          ? { ...issue, status: newStatus, ...(proofPhoto ? { proofPhoto } : {}) }
          : issue
      )
    );
  };
  
  if (!user?.city) return <div className="flex items-center justify-center h-64 text-black">Loading...</div>;
  
  const cityLocation = CITY_LOCATIONS[user.city] || [18.5204, 73.8567]; // Default to Pune
  const totalIssues = issues.filter(issue => issue.city === user.city).length;
  const resolvedIssues = issues.filter(issue => issue.city === user.city && issue.status === 'Resolved').length;
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">{user.city} Municipal Dashboard</h1>
          <div className="flex space-x-4">
            <div className="text-right bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600">Total Issues</div>
              <div className="text-2xl font-bold text-black">{totalIssues}</div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-600 text-white p-4 rounded-lg">
            <div className="text-sm opacity-90">Resolved</div>
            <div className="text-2xl font-bold">{resolvedIssues}</div>
            <div className="text-xs opacity-90">
              {totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0}% completion
            </div>
          </div>
          
          <div className="bg-orange-500 text-white p-4 rounded-lg">
            <div className="text-sm opacity-90">Pending</div>
            <div className="text-2xl font-bold">
              {issues.filter(issue => issue.city === user.city && issue.status === 'Pending').length}
            </div>
          </div>
          
          <div className="bg-blue-600 text-white p-4 rounded-lg">
            <div className="text-sm opacity-90">In Progress</div>
            <div className="text-2xl font-bold">
              {issues.filter(issue => issue.city === user.city && issue.status === 'In Progress').length}
            </div>
          </div>
          
          <div className="bg-red-600 text-white p-4 rounded-lg">
            <div className="text-sm opacity-90">High Priority</div>
            <div className="text-2xl font-bold">
              {issues.filter(issue => issue.city === user.city && (issue.priority === 'High' || issue.priority === 'Very High')).length}
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Selector */}
      <CategorySelector 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleSelectCategory}
        onClearSelection={handleClearSelection}
        userCity={user.city}
      />
      
      {/* Main Content */}
      <div className="space-y-6">
        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Issues Map</h2>
          </div>
          <div className="h-[500px] w-full">
            <IssueMap 
              issues={filteredIssues} 
              center={cityLocation as [number, number]}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </div>

        {/* Issues List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Issues</h2>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredIssues.length, 200)} of {filteredIssues.length} issues
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <IssueList 
              issues={filteredIssues} 
              onUpdateStatus={handleUpdateStatus} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunicipalDashboard;