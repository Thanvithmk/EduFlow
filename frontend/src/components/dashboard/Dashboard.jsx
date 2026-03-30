import React, { useState } from 'react';
import Navbar from './Navbar';
import TaskForm from './TaskForm';
import PredictionResult from './PredictionResult';
import TaskList from './TaskList';
import FixedCommitments from './FixedCommitments';


export default function Dashboard() {
  // State to hold the ML prediction results before saving the task 
  const [prediction, setPrediction] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 1️⃣ Navbar - Top Bar [cite: 220] */}
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* 2️⃣ Top Section - Two Column Layout [cite: 225] */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT: Task Input Panel [cite: 226] */}
          <div className="card bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Add Task</h2>
            <TaskForm onPredict={(data) => setPrediction(data)} />
          </div>
          
          {/* RIGHT: Prediction Result Panel [cite: 231] */}
          <div className="card bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-4 text-blue-400">ML Estimate</h2>
            <PredictionResult prediction={prediction} />
          </div>
        </div>

        {/* 3️⃣ Management Section [cite: 232, 237] */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Saved Tasks - Scrollable Table [cite: 234] */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Task List</h2>
            <TaskList />
          </div>

          {/* Fixed Commitments - Constraints [cite: 238] */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-teal-400">Fixed Schedule</h2>
            <FixedCommitments />
          </div>
        </div>

        {/* 4️⃣ Scheduler Section [cite: 239, 240] 
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Generated Plan</h2>
            <ScheduleControls />
          </div>
          <ScheduleDisplay />
        </div>*/}
      </main>
    </div>
  );
}