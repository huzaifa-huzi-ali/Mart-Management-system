import api from "../api/api";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const refreshToken = () => api.post("/auth/refresh-token");
export const logout = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");
