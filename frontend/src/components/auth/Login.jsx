import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/api.js'
import { useAuth } from './useAuth.js'

export default function Login() {
  const navigate = useNavigate()
  const { setToken } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      if (!data?.token) {
        setError(data?.message || 'Login failed')
        return
      }
      setToken(data.token)
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pageWrap">
      <div className="card authCard">
        <h1 className="pageTitle">Login</h1>
        <form className="form" onSubmit={onSubmit}>
          <label className="label">
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="label">
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <div className="errorText">{error}</div> : null}

          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="authFooter">
          <span>New here?</span>
          <Link to="/register" className="link">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

