import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import Navbar from './Navbar.jsx'

export default function ProtectedLayout({ children }) {
  const { token } = useAuth()

  if (!token) return <Navigate to="/login" replace />

  return (
    <div className="appRoot">
      <Navbar />
      <main className="contentWrap">{children}</main>
    </div>
  )
}

