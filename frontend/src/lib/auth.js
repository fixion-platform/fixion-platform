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
  login: (payload) => {
    const params = new URLSearchParams();
    params.append("username", payload.username);
    params.append("password", payload.password);
    params.append("grant_type", "password"); // optional, for OAuth2 consistency

    return api
      .post("/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((r) => {
        const { access_token, refresh_token, user } = r.data || {};
        if (access_token) localStorage.setItem(tokenKey, access_token);
        if (refresh_token) localStorage.setItem(refreshKey, refresh_token);
        return { user, access_token, refresh_token };
      });
  },

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
