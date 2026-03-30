import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔐 Standard Logout: Remove the JWT token and redirect to login
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center shadow-md">
      {/* 🔹 Left Side: Branding */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
          <span className="text-white font-black text-xl tracking-tighter">SS</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">StudySync</h1>
          <p className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">AI Scheduler</p>
        </div>
      </div>

      {/* 🔹 Right Side: Actions & User Info */}
      <div className="flex items-center gap-4">
        {/* Navigation links for future scalability (e.g., Analytics) */}
        <div className="hidden md:flex items-center gap-6 mr-4 border-r border-gray-700 pr-6">
          <button className="text-sm font-medium text-white">Dashboard</button>
          <button className="text-sm font-medium text-gray-400 hover:text-white transition">Analytics</button>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-800/50 px-4 py-2 rounded-lg text-sm font-bold transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}