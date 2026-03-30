import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Helper to attach the JWT token to requests [cite: 150, 177]
const authHeaders = (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {})

// 1️⃣ Auth Endpoints 
export const loginUser = async ({ email, password }) => {
  const res = await api.post('/login', { email, password })
  return res.data
}

export const registerUser = async ({ name, email, password }) => {
  const res = await api.post('/register', { name, email, password })
  return res.data
}

// 2️⃣ Machine Learning Layer [cite: 109, 217]
// Logic: UI -> /predict -> Flask -> ML Service -> Return hours
export const predictTask = async (taskData, token) => {
  const res = await api.post('/predict', taskData, authHeaders(token))
  return res.data
}

// 3️⃣ Task Management [cite: 112, 217]
export const saveTask = async (taskData, token) => {
  const res = await api.post('/tasks', taskData, authHeaders(token))
  return res.data
}

export const getTasks = async (token) => {
  const res = await api.get('/tasks', authHeaders(token))
  return res.data
}

export const deleteTask = async (taskId, token) => {
  const res = await api.delete(`/tasks/${taskId}`, authHeaders(token))
  return res.data
}

// 4️⃣ Fixed Commitments [cite: 193, 217]
export const addFixedCommitment = async (payload, token) => {
  const res = await api.post('/fixed-commitments', payload, authHeaders(token))
  return res.data
}

export const getFixedCommitments = async (token) => {
  const res = await api.get('/fixed-commitments', authHeaders(token))
  return res.data
}

// 5️⃣ Scheduler Execution [cite: 114, 217]
// Logic: UI -> /generate-schedule -> Flask -> Process -> Store/Return JSON
export const generateSchedule = async (data, token) => {
  const res = await api.post('/generate-schedule', data, authHeaders(token))
  return res.data
}