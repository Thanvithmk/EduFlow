import React, { useState } from 'react';
import { predictTask } from '../../services/api';

export default function TaskForm({ onPredict }) {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🎯 Initial state based on technical requirements [cite: 161]
  const [formData, setFormData] = useState({
    title: "",
    task_type: "programming",
    subject: "machine_learning",
    complexity: 1,
    size_metric: 1,
    team_size: 1,
    days_until_due: 1
  });

  const handleGetEstimate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ⚠ No title sent here as per documentation 
    const mlFeatures = {
      task_type: formData.task_type,
      subject: formData.subject,
      complexity: Number(formData.complexity),
      size_metric: Number(formData.size_metric),
      team_size: Number(formData.team_size),
      days_until_due: Number(formData.days_until_due)
    };

    try {
      // Sends POST /predict with filtered features [cite: 164]
      const response = await predictTask(mlFeatures, token);
      
      // Pass the result (estimated_hours) and current form data up to Dashboard
      // This allows PredictionResult to have the title when saving later 
      onPredict({
        ...response.data,
        fullTaskDetails: formData 
      });
    } catch (err) {
      setError("Failed to get ML estimate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGetEstimate} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-400">Task Title</label>
        <input
          className="p-2 bg-gray-900 rounded border border-gray-700 outline-none focus:border-blue-500"
          type="text"
          placeholder="e.g., NLP Assignment"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
  {/* Task Type Dropdown */}
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-400">Task Type</label>
    <select 
      className="p-2 bg-gray-900 rounded border border-gray-700 outline-none text-white"
      value={formData.task_type}
      onChange={(e) => setFormData({...formData, task_type: e.target.value})}
    >
      <option value="programming">Programming</option>
      <option value="research">Research</option>
      <option value="presentation">Presentation</option>
      <option value="lab_work">Lab Work</option>
      <option value="exam_preparation">Exam Prep</option>
      <option value="project">Project</option>
    </select>
  </div>

  {/* Subject Dropdown */}
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-400">Subject</label>
    <select 
      className="p-2 bg-gray-900 rounded border border-gray-700 outline-none text-white"
      value={formData.subject}
      onChange={(e) => setFormData({...formData, subject: e.target.value})}
    >
      <option value="machine_learning">Machine Learning</option>
      <option value="data_science">Data Science</option>
      <option value="mathematics">Mathematics</option>
      <option value="computer_science">Computer Science</option>
      <option value="software_engineering">Software Engineering</option>
      <option value="web_development">Web Development</option>
      <option value="database_systems">Database Systems</option>
    </select>
  </div>
</div>

{/* New Row for Numerical Metrics (Optional but recommended based on your data) */}
<div className="grid grid-cols-3 gap-4 mt-4">
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-400">Complexity (1-5)</label>
    <input 
      type="number" min="1" max="5"
      className="p-2 bg-gray-900 rounded border border-gray-700 outline-none text-white"
      value={formData.complexity}
      onChange={(e) => setFormData({...formData, complexity: parseInt(e.target.value)})}
    />
  </div>
  
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-400">Team Size</label>
    <input 
      type="number" min="1"
      className="p-2 bg-gray-900 rounded border border-gray-700 outline-none text-white"
      value={formData.team_size}
      onChange={(e) => setFormData({...formData, team_size: parseInt(e.target.value)})}
    />
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-400">Days Until Due</label>
    <input 
      type="number" min="0"
      className="p-2 bg-gray-900 rounded border border-gray-700 outline-none text-white"
      value={formData.days_until_due}
      onChange={(e) => setFormData({...formData, days_until_due: parseInt(e.target.value)})}
    />
  </div>
</div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-200 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Get AI Estimate"}
      </button>
    </form>
  );
}