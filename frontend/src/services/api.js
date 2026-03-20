import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

const authHeaders = (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {})

export const loginUser = async ({ email, password }) => {
  const res = await api.post('/login', { email, password })
  return res.data
}

export const registerUser = async ({ name, email, password }) => {
  const res = await api.post('/register', { name, email, password })
  return res.data
}

// ML prediction (backend route is POST /tasks/predict)
export const predictTask = async (taskData, token) => {
  const res = await api.post('/tasks/predict', taskData, authHeaders(token))
  return res.data
}

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

export const addFixedCommitment = async (payload, token) => {
  const res = await api.post('/fixed_commitments', payload, authHeaders(token))
  return res.data
}

export const getFixedCommitments = async (token) => {
  const res = await api.get('/fixed_commitments', authHeaders(token))
  return res.data
}

export const deleteFixedCommitment = async (fixedCommitmentId, token) => {
  const res = await api.delete(
    `/fixed_commitments/${fixedCommitmentId}`,
    authHeaders(token)
  )
  return res.data
}

