import React, { useState, useEffect } from 'react';
import { getTasks, predictTaskTime, saveTask } from '../../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', priority: 'Medium', complexity: 'Medium' });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await predictTaskTime(formData);
      setPrediction(result.estimated_time); // Matches your Flask response
    } catch (err) {
      alert("ML Prediction failed. Make sure your model is loaded!");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveTask({ ...formData, estimated_time: prediction });
      setFormData({ title: '', priority: 'Medium', complexity: 'Medium' });
      setPrediction(null);
      fetchTasks();
    } catch (err) {
      alert("Failed to save task");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">StudySync Dashboard</h1>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="text-gray-400 hover:text-red-500 transition"
        >
          Logout
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Task Form */}
        <div className="auth-card h-fit">
          <h3 className="text-xl font-semibold mb-6">New Task</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <input 
              className="studysync-input" placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <select 
              className="studysync-input"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
            
            <button 
              type="button" onClick={handlePredict}
              className="w-full py-2 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-500/10 transition"
            >
              {loading ? 'Analyzing...' : 'Predict Time with AI'}
            </button>

            {prediction && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
                <p className="text-sm text-gray-400">AI Estimate</p>
                <p className="text-2xl font-bold text-blue-400">{prediction} Hours</p>
              </div>
            )}

            <button disabled={!prediction} className="btn-primary">Add Task</button>
          </form>
        </div>

        {/* Right: Task List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold mb-6">Your Academic Tasks</h3>
          {tasks.map(task => (
            <div key={task.id} className="bg-gray-800/40 p-5 rounded-2xl border border-gray-700 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">{task.title}</h4>
                <p className="text-gray-400 text-sm">{task.priority} Priority • {task.estimated_time}h estimated</p>
              </div>
              <div className="px-3 py-1 bg-gray-700 rounded-lg text-xs font-mono text-blue-400">
                PENDING
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;