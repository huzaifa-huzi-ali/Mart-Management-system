import api from "../api/api";

export const login = (data) => api.post("/auth/login", data);
