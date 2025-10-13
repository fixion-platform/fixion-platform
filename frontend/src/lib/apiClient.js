import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://fixion.up.railway.app",
  withCredentials: false, // set true only if backend uses cookies
});

// Attach access token on every request
api.interceptors.request.use((config) => {
  const tokenKey = import.meta.env.VITE_TOKEN_STORAGE_KEY;
  const token = localStorage.getItem(tokenKey);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → refresh once, then retry original request
let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error?.response?.status;

    if (status === 401 && !original._retry) {
      original._retry = true;
      const tokenKey = import.meta.env.VITE_TOKEN_STORAGE_KEY;
      const refreshKey = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY;
      const refresh = localStorage.getItem(refreshKey);
      if (!refresh) throw error;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refreshToken: refresh }
          );
          localStorage.setItem(tokenKey, data?.accessToken ?? "");
          queue.forEach((fn) => fn(data.accessToken));
          queue = [];
          return api(original);
        } catch (e) {
          queue = [];
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(refreshKey);
          throw e;
        } finally {
          isRefreshing = false;
        }
      }

      // wait for the ongoing refresh to finish
      return new Promise((resolve) => {
        queue.push((newToken) => {
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
          resolve(api(original));
        });
      });
    }

    throw error;
  }
);

export default api;
