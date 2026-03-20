import React, { useState } from 'react';
import { registerUser } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="auth-card">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Join EduFlow</h2>
          <p className="text-gray-400 mt-2">Get started with AI academic planning</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Full Name</label>
            <input 
              type="text" required className="studysync-input"
              placeholder="Thanvith MK"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <input 
              type="email" required className="studysync-input"
              placeholder="thanvith@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input 
              type="password" required className="studysync-input"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;