import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api.js';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Sends: { name, email, password } to POST /register [cite: 153]
      const data = await registerUser({ name, email, password });
      
      // Response: { "message": "User created successfully" }
      if (data) {
        navigate('/login');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageWrap flex items-center justify-center min-h-screen">
      <div className="card authCard bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 w-full max-w-md">
        <h1 className="pageTitle text-2xl font-bold mb-6 text-center">Register</h1>
        <form className="form flex flex-col gap-4" onSubmit={onSubmit}>
          <label className="label flex flex-col gap-1">
            Name
            <input
              className="input p-2 bg-gray-900 rounded border border-gray-700 outline-none focus:border-blue-500"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="label flex flex-col gap-1">
            Email
            <input
              className="input p-2 bg-gray-900 rounded border border-gray-700 outline-none focus:border-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="label flex flex-col gap-1">
            Password
            <input
              className="input p-2 bg-gray-900 rounded border border-gray-700 outline-none focus:border-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="errorText text-red-400 text-sm">{error}</div>}

          <button 
            className="button bg-blue-600 hover:bg-blue-700 transition p-2 rounded font-bold mt-2" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="authFooter mt-6 text-center text-sm text-gray-400">
          <span>Already have an account? </span>
          <Link to="/login" className="link text-blue-400 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}