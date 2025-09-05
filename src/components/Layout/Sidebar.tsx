import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  role: 'government' | 'municipal';
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isCollapsed, onToggle }) => {
  const { logout } = useAuth();
  
  const baseUrl = role === 'government' ? '/government' : '/municipal';
  
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
      
      <div className={`absolute bottom-0 left-0 ${isCollapsed ? 'w-16' : 'w-64'} p-4`}>
        <button 
          onClick={logout}
          className={`w-full bg-white text-black hover:bg-gray-200 py-2 px-4 rounded transition duration-200 flex items-center ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;