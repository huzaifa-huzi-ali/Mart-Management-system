import api from "../api/api";

export const getStocks = () => api.get("/stock");
export const getStock = (id) => api.get(`/stock/${id}`);
export const createStock = (data) => api.post("/stock", data);
export const updateStock = (id, data) => api.put(`/stock/${id}`, data);
export const deleteStock = (id) => api.delete(`/stock/${id}`);
