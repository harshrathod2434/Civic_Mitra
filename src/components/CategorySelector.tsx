import React from 'react';
import { Category } from '../types';
import { CATEGORIES, getCategoryStats } from '../data/mockData';

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onClearSelection?: () => void;
  userCity?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  onClearSelection,
  userCity 
}) => {
  const categoryStats = getCategoryStats();
  
  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Pothole':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'Garbage':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case 'Electric Hazard':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Stray cattle':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'Construction Debris':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'Stagnant water':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case 'Burning waste':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Very High': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Issue Categories</h2>
        {selectedCategory && (
          <button
            onClick={() => {
              if (onClearSelection) {
                onClearSelection();
              } else {
                // Fallback: trigger onSelectCategory with current category to deselect
                onSelectCategory(selectedCategory);
              }
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200"
          >
            Clear Selection
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CATEGORIES.map((category) => {
          const stats = categoryStats[category];
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 bg-white text-black hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${isSelected ? 'text-white' : 'text-black'}`}>
                  {getCategoryIcon(category)}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {stats.total} reports
                </span>
              </div>
              
              <h3 className={`font-semibold mb-2 ${isSelected ? 'text-white' : 'text-black'}`}>
                {category}
              </h3>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={isSelected ? 'text-gray-300' : 'text-gray-500'}>Priority:</span>
                  <div className="flex space-x-1">
                    <span className={`${getPriorityColor('Very High')} ${isSelected ? 'text-red-300' : ''}`}>
                      {stats.byPriority['Very High']}
                    </span>
                    <span className={`${getPriorityColor('High')} ${isSelected ? 'text-orange-300' : ''}`}>
                      {stats.byPriority['High']}
                    </span>
                    <span className={`${getPriorityColor('Medium')} ${isSelected ? 'text-yellow-300' : ''}`}>
                      {stats.byPriority['Medium']}
                    </span>
                    <span className={`${getPriorityColor('Low')} ${isSelected ? 'text-green-300' : ''}`}>
                      {stats.byPriority['Low']}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className={isSelected ? 'text-gray-300' : 'text-gray-500'}>Status:</span>
                  <div className="flex space-x-1">
                    <span className={isSelected ? 'text-red-300' : 'text-red-600'}>
                      {stats.byStatus['Pending']}P
                    </span>
                    <span className={isSelected ? 'text-yellow-300' : 'text-yellow-600'}>
                      {stats.byStatus['In Progress']}IP
                    </span>
                    <span className={isSelected ? 'text-green-300' : 'text-green-600'}>
                      {stats.byStatus['Resolved']}R
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {selectedCategory && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-black mb-2">
            {selectedCategory} - Detailed Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Reports:</span>
              <span className="ml-2 font-semibold text-black">{categoryStats[selectedCategory].total}</span>
            </div>
            <div>
              <span className="text-gray-600">Pending:</span>
              <span className="ml-2 font-semibold text-red-600">{categoryStats[selectedCategory].byStatus['Pending']}</span>
            </div>
            <div>
              <span className="text-gray-600">In Progress:</span>
              <span className="ml-2 font-semibold text-yellow-600">{categoryStats[selectedCategory].byStatus['In Progress']}</span>
            </div>
            <div>
              <span className="text-gray-600">Resolved:</span>
              <span className="ml-2 font-semibold text-green-600">{categoryStats[selectedCategory].byStatus['Resolved']}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
