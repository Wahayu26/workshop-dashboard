import axios from 'axios';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined
  ? process.env.NEXT_PUBLIC_BASE_PATH
  : '/bengkelku';

const defaultBaseURL = `${basePath === '' ? '' : basePath}/api/v1`;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || defaultBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bengkelku_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // If wrapped in transform interceptor: { success, statusCode, data }
    if (response.data && response.data.data !== undefined) {
      return response.data;
    }
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthPage = window.location.pathname.includes('/login');
      if (!isAuthPage) {
        localStorage.removeItem('bengkelku_token');
        localStorage.removeItem('bengkelku_user');
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan saat menghubungi server';
    return Promise.reject(new Error(message));
  },
);

export default api;
