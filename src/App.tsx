import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/Layout/DashboardLayout';
import MunicipalDashboard from './pages/municipal/MunicipalDashboard';
import GovernmentDashboard from './pages/government/GovernmentDashboard';
import Settings from './pages/Settings';
import './App.css';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'government' | 'municipal' }> = ({ 
  children, 
  role 
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/municipal" replace />
            </ProtectedRoute>
          } />
          
          {/* Municipal Routes */}
          <Route path="/municipal" element={
            <ProtectedRoute role="municipal">
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<MunicipalDashboard />} />
            <Route path="issues" element={<MunicipalDashboard />} />
            <Route path="analytics" element={<div>Municipal Analytics</div>} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Government Routes */}
          <Route path="/government" element={
            <ProtectedRoute role="government">
              <DashboardLayout />
            </ProtectedRoute>
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
