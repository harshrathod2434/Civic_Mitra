import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, toggleRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    toggleRole();
    // Navigate to the appropriate dashboard after role change
    const newRole = user.role === 'government' ? 'municipal' : 'government';
    navigate(`/${newRole}`);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {user.role === 'government' ? 'Government Dashboard' : 'Municipal Dashboard'}
        </h1>
        {user.role === 'municipal' && user.city && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {user.city}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">Current View</p>
          <p className="text-sm font-medium text-gray-900">
            {user.role === 'government' ? 'Government' : 'Municipal'}
          </p>
        </div>
        
        <button
          onClick={handleRoleToggle}
          className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>
            Switch to {user.role === 'government' ? 'Municipal' : 'Government'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;
