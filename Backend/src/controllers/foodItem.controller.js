const foodItemService = require('../services/foodItem.service');

// GET all food items
exports.getAllFoodItems = async (req, res) => {
  try {
    const data = await foodItemService.getAllFoodItems();
    res.json({ message: 'Food items fetched successfully', data });
  } catch (err) {
    console.error('FoodItem fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET food item by ID
exports.getFoodItemById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const data = await foodItemService.getFoodItemById(id);
    if (!data) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item fetched successfully', data });
  } catch (err) {
    console.error('FoodItem fetch by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE food item
exports.createFoodItem = async (req, res) => {
  const { name, price, description, category_id, ingredient_ids } = req.body;
  if (!name || price == null) return res.status(400).json({ message: 'Name and price required' });

  try {
    const data = await foodItemService.createFoodItem({ name, price, description, category_id, ingredient_ids });
    res.status(201).json({ message: 'Food item created successfully', data });
  } catch (err) {
    console.error('FoodItem create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE food item
exports.updateFoodItem = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category_id, ingredient_ids } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (!name || price == null) return res.status(400).json({ message: 'Name and price required' });

  try {
    const success = await foodItemService.updateFoodItem(id, { name, price, description, category_id, ingredient_ids });
    if (!success) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item updated successfully' });
  } catch (err) {
    console.error('FoodItem update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE food item
exports.deleteFoodItem = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const success = await foodItemService.deleteFoodItem(id);
    if (!success) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item deleted successfully' });
  } catch (err) {
    console.error('FoodItem delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
