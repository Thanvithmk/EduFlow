import './App.css'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from './components/auth/AuthContext.jsx'
import Login from './components/auth/Login.jsx'
import Register from './components/auth/Register.jsx'
import ProtectedLayout from './components/dashboard/ProtectedLayout.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
