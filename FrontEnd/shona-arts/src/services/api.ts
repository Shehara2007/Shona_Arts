import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shona_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadImage = async (file: File) => {
  const body = new FormData();
  body.append('image', file);
  const { data } = await api.post<{ url: string }>('/uploads', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};
