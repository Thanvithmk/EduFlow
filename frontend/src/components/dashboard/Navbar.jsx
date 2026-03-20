import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'

export default function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  const scrollToFixed = () => {
    const el = document.getElementById('fixed-commitments')
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className="navBar">
      <div className="navInner">
        <div className="brand" onClick={() => navigate('/dashboard')}>
          StudySync
        </div>
        <nav className="navLinks" aria-label="Primary">
          <button className="navLinkButton" type="button" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="navLinkButton" type="button" onClick={scrollToFixed}>
            Fixed Commitments
          </button>
          <button className="navLinkButton navLogout" type="button" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}

