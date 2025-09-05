import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    
    if (success) {
      // Redirect based on role
      if (email === 'gov@maharashtra.in') {
        navigate('/government');
      } else if (email === 'muni@pune.in') {
        navigate('/municipal');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Civic Issue Dashboard</h2>
          <p className="text-gray-600">Municipal Management System</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="shadow appearance-none border border-gray-300 rounded w-full py-3 px-4 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 w-full transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-black font-semibold mb-3">Demo Credentials:</p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Government:</span>
              <span>gov@maharashtra.in / gov123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Municipal:</span>
              <span>muni@pune.in / muni123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;