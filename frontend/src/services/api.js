import axios from 'axios';

// Using 127.0.0.1 to match your Flask terminal exactly
const API_BASE_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically add JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const loginUser = async (credentials) => {
  const res = await api.post('/login', credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post('/register', userData);
  return res.data;
};
export const getTasks = async () => {
  const res = await api.get('/tasks');
  return res.data;
};

export const predictTaskTime = async (taskData) => {
  // This calls your Flask ML route
  const res = await api.post('/tasks/predict', taskData);
  return res.data;
};

export const saveTask = async (taskData) => {
  const res = await api.post('/tasks', taskData);
  return res.data;
};
// We'll add predictTask and others here later!
export default api;