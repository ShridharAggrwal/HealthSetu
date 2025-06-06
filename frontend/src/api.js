import axios from 'axios';

// Use environment variables for the base URL
const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api' 
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;