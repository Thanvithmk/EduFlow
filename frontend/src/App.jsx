import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/dashboard';

/**
 * ProtectedRoute: Checks for JWT in localStorage before rendering.
 * Redirects to /login if no token is found.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Navbar is rendered here so it shows up on all protected pages */}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      {/* Applying the background color from your design guidelines */}
      <div className="bg-gray-900 min-h-screen text-white selection:bg-blue-500/30">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Default Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;