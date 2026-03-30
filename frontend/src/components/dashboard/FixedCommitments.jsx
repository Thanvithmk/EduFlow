import React, { useState, useEffect } from 'react';
import { addFixedCommitment, getFixedCommitments } from '../../services/api';

export default function FixedCommitments() {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    type: "academic"
  });

  // Fixed fetch function without citation tags
  const fetchCommitments = async () => {
    try {
      const data = await getFixedCommitments(token);
      setCommitments(data);
    } catch (err) {
      console.error("Failed to load commitments");
    }
  };

  useEffect(() => {
    fetchCommitments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFixedCommitment(formData, token);
      setFormData({ title: "", start_time: "", end_time: "", type: "academic" });
      fetchCommitments();
    } catch (err) {
      alert("Failed to add commitment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 text-white">
      <form onSubmit={handleSubmit} className="space-y-3 pb-4 border-b border-gray-700">
        <input
          className="w-full p-2 bg-gray-900 rounded border border-gray-700 text-sm outline-none focus:border-teal-500 text-white"
          placeholder="Commitment Title (e.g. Gym)"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            className="p-2 bg-gray-900 rounded border border-gray-700 text-sm text-white"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            required
          />
          <input
            type="time"
            className="p-2 bg-gray-900 rounded border border-gray-700 text-sm text-white"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            required
          />
        </div>
        <select
          className="w-full p-2 bg-gray-900 rounded border border-gray-700 text-sm text-white"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="academic">Academic (Classes)</option>
          <option value="personal">Personal</option>
          <option value="health">Health (Gym/Meals)</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Commitment"}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto max-h-[200px] space-y-2 pr-2">
        {commitments.length > 0 ? (
          commitments.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-700/30 rounded border border-gray-700/50">
              <div>
                <p className="text-sm font-semibold text-teal-100">{item.title}</p>
                <p className="text-[10px] text-gray-400">{item.start_time} - {item.end_time}</p>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-600 uppercase">
                {item.type}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-xs py-4 italic">No fixed commitments added.</p>
        )}
      </div>
    </div>
  );
}