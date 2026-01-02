import api from "../api/api";

/**
 * Get all food items
 * GET /api/food-items
 */
export const getFoodItems = () => {
  return api.get("/food-items");
};

/**
 * Get single food item by ID
 * GET /api/food-items/:id
 */
export const getFoodItemById = (id) => {
  return api.get(`/food-items/${id}`);
};

/**
 * Create new food item
 * POST /api/food-items
 */
export const createFoodItem = (data) => {
  return api.post("/food-items", data);
};

/**
 * Update food item
 * PUT /api/food-items/:id
 */
export const updateFoodItem = (id, data) => {
  return api.put(`/food-items/${id}`, data);
};

/**
 * Delete food item
 * DELETE /api/food-items/:id
 */
export const deleteFoodItem = (id) => {
  return api.delete(`/food-items/${id}`);
};
