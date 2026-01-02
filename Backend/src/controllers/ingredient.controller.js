const ingredientService = require('../services/ingredient.service');

// GET all ingredients
exports.getAllIngredients = async (req, res) => {
  try {
    const data = await ingredientService.getAllIngredients();
    res.json({ message: 'Ingredients fetched successfully', data });
  } catch (err) {
    console.error('Ingredient fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ingredient by ID
exports.getIngredientById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const data = await ingredientService.getIngredientById(id);
    if (!data) return res.status(404).json({ message: 'Ingredient not found' });
    res.json({ message: 'Ingredient fetched successfully', data });
  } catch (err) {
    console.error('Ingredient fetch by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE ingredient
exports.createIngredient = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Ingredient name required' });

  try {
    const data = await ingredientService.createIngredient({ name, description });
    res.status(201).json({ message: 'Ingredient created successfully', data });
  } catch (err) {
    console.error('Ingredient create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE ingredient
exports.updateIngredient = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (!name) return res.status(400).json({ message: 'Ingredient name required' });

  try {
    const success = await ingredientService.updateIngredient(id, { name, description });
    if (!success) return res.status(404).json({ message: 'Ingredient not found' });
    res.json({ message: 'Ingredient updated successfully' });
  } catch (err) {
    console.error('Ingredient update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE ingredient
exports.deleteIngredient = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const success = await ingredientService.deleteIngredient(id);
    if (!success) return res.status(404).json({ message: 'Ingredient not found' });
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (err) {
    console.error('Ingredient delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
