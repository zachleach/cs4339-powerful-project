import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  // TODO: enable credentials for session cookies
  // withCredentials: true,
});

export default api;
