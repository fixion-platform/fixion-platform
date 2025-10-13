// import api from "../lib/apiClient";

// const tokenKey = import.meta.env.VITE_TOKEN_STORAGE_KEY;
// const refreshKey = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY;

// export const AuthAPI = {
//   login: (payload) =>
//     api.post("/auth/login", payload).then((r) => {
//       const { accessToken, refreshToken, user } = r.data || {};
//       if (accessToken) localStorage.setItem(tokenKey, accessToken);
//       if (refreshToken) localStorage.setItem(refreshKey, refreshToken);
//       return { user, accessToken, refreshToken };
//     }),

//   signup: (payload) =>
//     api.post("/auth/register", payload).then((r) => {
//       const { accessToken, refreshToken, user } = r.data || {};
//       if (accessToken) localStorage.setItem(tokenKey, accessToken);
//       if (refreshToken) localStorage.setItem(refreshKey, refreshToken);
//       return { user, accessToken, refreshToken };
//     }),

//   me: () => api.get("/auth/me").then((r) => r.data),

//   logout: () => {
//     localStorage.removeItem(tokenKey);
//     localStorage.removeItem(refreshKey);
//   },
// };
// src/api/auth.js
import api from "../lib/apiClient";

const tokenKey = import.meta.env.VITE_TOKEN_STORAGE_KEY;
const refreshKey = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY;

export const AuthAPI = {
  login: (payload) =>
    api.post("/auth/login", payload).then((r) => {
      const { accessToken, refreshToken, user } = r.data || {};
      if (accessToken) localStorage.setItem(tokenKey, accessToken);
      if (refreshToken) localStorage.setItem(refreshKey, refreshToken);
      return { user, accessToken, refreshToken };
    }),

  signup: (payload) =>
    api.post("/auth/register", payload).then((r) => {
      const { accessToken, refreshToken, user } = r.data || {};
      if (accessToken) localStorage.setItem(tokenKey, accessToken);
      if (refreshToken) localStorage.setItem(refreshKey, refreshToken);
      return { user, accessToken, refreshToken };
    }),

  me: () => api.get("/auth/me").then((r) => r.data),

  logout: () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshKey);
  },
};
