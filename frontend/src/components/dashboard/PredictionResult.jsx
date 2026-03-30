import React, { useState } from 'react';
import { saveTask } from '../../services/api';

export default function PredictionResult({ prediction }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');


  // Handle the "Add to Schedule" button click
  const handleAddToSchedule = async () => {
    if (!prediction || !prediction.fullTaskDetails) return;

    setLoading(true);
    setError(null);

    // 🎯 Constructing the payload exactly as required by your documentation 
    const taskPayload = {
      title: prediction.fullTaskDetails.title,
      task_type: prediction.fullTaskDetails.task_type,
      subject: prediction.fullTaskDetails.subject,
      complexity: Number(prediction.fullTaskDetails.complexity),
      size_metric: Number(prediction.fullTaskDetails.size_metric),
      team_size: Number(prediction.fullTaskDetails.team_size),
      days_until_due: Number(prediction.fullTaskDetails.days_until_due),
      predicted_hours: prediction.estimated_hours // Received from /predict [cite: 168, 179]
    };

    try {
      // Sends POST /tasks with Bearer Token [cite: 175, 177]
      await saveTask(taskPayload, token);
      setSaved(true);
      // Optional: Trigger a refresh of the TaskList here if using global state or a callback
    } catch (err) {
      setError("Failed to save task to schedule.");
    } finally {
      setLoading(false);
    }
  };

  // UI state for when no prediction has been made yet
  if (!prediction) {
    return (
      <div className="text-center py-10 text-gray-500 italic">
        Fill out the task form and click "Get Estimate" to see AI predictions.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 animate-fadeIn">
      <div className="text-center">
        <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Estimated Time</p>
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-6xl font-black text-blue-500">{prediction.estimated_hours}</span>
          <span className="text-xl font-bold text-gray-400">hours</span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700">
        <span className="text-sm text-gray-400">Confidence Level:</span>
        <span className={`text-sm font-bold ${
          prediction.confidence === 'High' ? 'text-green-400' : 
          prediction.confidence === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
        }`}>
          {prediction.confidence}
        </span>
      </div>

      {saved ? (
        <div className="w-full bg-green-900/20 border border-green-800 text-green-400 p-3 rounded-lg text-center font-medium">
          ✓ Task added to list
        </div>
      ) : (
        <button
          onClick={handleAddToSchedule}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add to Schedule"}
        </button>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}