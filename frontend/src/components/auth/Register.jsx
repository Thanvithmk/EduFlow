import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/api.js'

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const data = await registerUser({ name, email, password })
      if (data?.message) setSuccess(data.message)
      navigate('/login')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pageWrap">
      <div className="card authCard">
        <h1 className="pageTitle">Register</h1>
        <form className="form" onSubmit={onSubmit}>
          <label className="label">
            Name
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </label>
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
              autoComplete="new-password"
              required
            />
          </label>

          {error ? <div className="errorText">{error}</div> : null}
          {success ? <div className="successText">{success}</div> : null}

          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="authFooter">
          <span>Already have an account?</span>
          <Link to="/login" className="link">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

