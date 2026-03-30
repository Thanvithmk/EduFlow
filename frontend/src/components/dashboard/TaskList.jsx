import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../../services/api';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // 🔄 On Page Load: Fetch tasks from Backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(token); // GET /tasks
      setTasks(data); 
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🗑 Delete Task: DELETE /tasks/:id
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to remove this task?")) return;
    
    try {
      await deleteTask(taskId, token);
      // Update local state to reflect deletion
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  if (loading) return <div className="text-gray-400 p-4">Loading tasks...</div>;

  return (
    <div className="overflow-x-auto">
      {error && <p className="text-red-400 mb-2 text-sm">{error}</p>}
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase">
            <th className="py-3 px-4 font-medium">Task Title</th>
            <th className="py-3 px-4 font-medium">Est. Hours</th>
            <th className="py-3 px-4 font-medium">Due (Days)</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id} className="border-b border-gray-800 hover:bg-gray-700/30 transition">
                <td className="py-3 px-4 font-semibold text-blue-100">{task.title}</td>
                <td className="py-3 px-4 text-gray-300">{task.predicted_hours}h</td>
                <td className="py-3 px-4 text-gray-300">{task.days_until_due}</td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-8 text-center text-gray-500 italic">
                No tasks added yet. Get an estimate to start.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}