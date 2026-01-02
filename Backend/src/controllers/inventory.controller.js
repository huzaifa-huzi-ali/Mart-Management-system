const inventoryService = require('../services/inventory.service');

// GET all inventory logs
exports.getAllLogs = async (req, res) => {
  try {
    const data = await inventoryService.getAllLogs();
    res.json({
      message: 'Inventory logs fetched successfully',
      data,
    });
  } catch (err) {
    console.error('Inventory logs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE new inventory log
exports.createLog = async (req, res) => {
  const { food_item_id, ingredient_id, user_id, action_type, quantity_change } = req.body;
  if ((!food_item_id && !ingredient_id) || !user_id || !action_type || quantity_change === undefined) {
    return res.status(400).json({ message: 'Item (Food or Ingredient), User, Action, and Quantity required' });
  }

  try {
    const data = await inventoryService.createLog({ food_item_id, ingredient_id, user_id, action_type, quantity_change });
    res.status(201).json({
      message: 'Inventory log created successfully',
      data,
    });
  } catch (err) {
    console.error('Inventory log create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE inventory log
exports.updateLog = async (req, res) => {
  const { id } = req.params;
  const { food_item_id, ingredient_id, user_id, action_type, quantity_change } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if ((!food_item_id && !ingredient_id) || !user_id || !action_type || quantity_change === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const success = await inventoryService.updateLog(id, { food_item_id, ingredient_id, user_id, action_type, quantity_change });
    if (!success) {
      return res.status(404).json({ message: 'Inventory log not found' });
    }
    res.json({ message: 'Inventory log updated successfully' });
  } catch (err) {
    console.error('Inventory log update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE inventory log
exports.deleteLog = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const success = await inventoryService.deleteLog(id);
    if (!success) {
      return res.status(404).json({ message: 'Inventory log not found' });
    }
    res.json({ message: 'Inventory log deleted successfully' });
  } catch (err) {
    console.error('Inventory log delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
