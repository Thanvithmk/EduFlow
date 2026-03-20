import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const value = useMemo(() => {
    return {
      token,
      setToken,
      logout: () => setToken(null),
    }
  }, [token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

