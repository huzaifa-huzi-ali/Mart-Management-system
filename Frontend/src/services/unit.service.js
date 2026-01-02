import api from "../api/api";

export const getUnits = () => api.get("/unit");
export const getUnit = (id) => api.get(`/unit/${id}`);
export const createUnit = (data) => api.post("/unit", data);
export const updateUnit = (id, data) => api.put(`/unit/${id}`, data);
export const deleteUnit = (id) => api.delete(`/unit/${id}`);
