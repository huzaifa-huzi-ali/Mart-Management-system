import api from "../api/api";

export const getDashboardStats = () => api.get("/reports/dashboard-stats");
