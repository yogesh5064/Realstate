import axios from 'axios';

const API = axios.create({ baseURL: 'https://realstate-41cq.onrender.com/api' });

// Request bhejne se pehle token check karega
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;