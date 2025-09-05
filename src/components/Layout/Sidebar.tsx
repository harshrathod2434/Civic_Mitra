import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  role: 'government' | 'municipal';
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isCollapsed, onToggle }) => {
  const { toggleRole } = useAuth();
  const navigate = useNavigate();
  
  const baseUrl = role === 'government' ? '/government' : '/municipal';
  
  const handleRoleToggle = () => {
    toggleRole();
    // Navigate to the appropriate dashboard after role change
    const newRole = role === 'government' ? 'municipal' : 'government';
    navigate(`/${newRole}`);
  };
  
  return (
    <div className={`bg-black text-white min-h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} p-4 relative`}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute top-4 right-2 p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
      >
        {isCollapsed ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        )}
      </button>
      
      <div className={`text-xl font-bold mb-8 border-b border-gray-700 pb-4 ${isCollapsed ? 'text-center' : ''}`}>
        {isCollapsed ? 'CM' : 'Civic Mitra'}
      </div>
      
      {/* Role Toggle Section */}
      <div className={`mb-6 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        <div className={`text-sm font-medium mb-2 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? 'View' : 'Current View'}
        </div>
        <button
          onClick={handleRoleToggle}
          className={`w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-3 rounded transition duration-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          title={isCollapsed ? `Switch to ${role === 'government' ? 'Municipal' : 'Government'}` : undefined}
        >
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {role === 'government' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              )}
            </svg>
            {!isCollapsed && (
              <span className="text-sm">
                {role === 'government' ? 'Government' : 'Municipal'}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          )}
        </button>
      </div>
      
      <nav className="space-y-2">
        <NavLink 
          to={`${baseUrl}`} 
          className={({ isActive }) => 
            `flex items-center py-2.5 px-4 rounded transition duration-200 ${isActive ? 'bg-white text-black' : 'hover:bg-gray-800'} ${isCollapsed ? 'justify-center' : ''}`
          }
          end
          title={isCollapsed ? 'Dashboard' : undefined}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
          </svg>
          {!isCollapsed && <span className="ml-3">Dashboard</span>}
        </NavLink>
        
        <NavLink 
          to={`${baseUrl}/settings`} 
          className={({ isActive }) => 
            `flex items-center py-2.5 px-4 rounded transition duration-200 ${isActive ? 'bg-white text-black' : 'hover:bg-gray-800'} ${isCollapsed ? 'justify-center' : ''}`
          }
          title={isCollapsed ? 'Settings' : undefined}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {!isCollapsed && <span className="ml-3">Settings</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;