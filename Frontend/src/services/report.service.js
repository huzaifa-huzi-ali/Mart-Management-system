import api from "../api/api";

export const getDashboardStats = () => api.get("/reports/dashboard-stats");
export const getSalesReport = () => api.get("/reports/sales");
export const getInventoryReport = () => api.get("/reports/inventory");
export const getPurchaseReport = () => api.get("/reports/purchases");
export const getRevenueReport = () => api.get("/reports/revenue");
