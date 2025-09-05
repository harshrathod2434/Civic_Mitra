import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import MunicipalDashboard from './pages/municipal/MunicipalDashboard';
import GovernmentDashboard from './pages/government/GovernmentDashboard';
import Settings from './pages/Settings';
import './App.css';

// Route component that navigates based on current role
const RoleBasedRoute: React.FC<{ children: React.ReactNode; role?: 'government' | 'municipal' }> = ({ 
  children, 
  role 
}) => {
  const { user } = useAuth();
  
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'government' ? '/government' : '/municipal'} replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/municipal" replace />} />
          
          {/* Municipal Routes */}
          <Route path="/municipal" element={
            <RoleBasedRoute role="municipal">
              <DashboardLayout />
            </RoleBasedRoute>
          }>
            <Route index element={<MunicipalDashboard />} />
            <Route path="issues" element={<MunicipalDashboard />} />
            <Route path="analytics" element={<div>Municipal Analytics</div>} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Government Routes */}
          <Route path="/government" element={
            <RoleBasedRoute role="government">
              <DashboardLayout />
            </RoleBasedRoute>
          }>
            <Route index element={<GovernmentDashboard />} />
            <Route path="issues" element={<div>Government Issues</div>} />
            <Route path="analytics" element={<GovernmentDashboard />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
