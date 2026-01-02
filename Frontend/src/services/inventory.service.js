import api from "../api/api";

export const getInventoryLogs = () => api.get("/inventory");
export const createInventoryLog = (data) => api.post("/inventory", data);
export const updateInventoryLog = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteInventoryLog = (id) => api.delete(`/inventory/${id}`);
