const stockService = require('../services/stock.service');

// GET all stock
exports.getAllStock = async (req, res) => {
  try {
    const data = await stockService.getAllStock();
    res.json({ message: 'Stock fetched successfully', data });
  } catch (err) {
    console.error('Stock fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET stock by ID
exports.getStockById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await stockService.getStockById(id);
    if (!data) return res.status(404).json({ message: 'Stock not found' });
    res.json({ message: 'Stock fetched successfully', data });
  } catch (err) {
    console.error('Stock fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE stock
exports.createStock = async (req, res) => {
  const { food_item_id, quantity_available } = req.body;
  if (!food_item_id || quantity_available === undefined) return res.status(400).json({ message: 'Fields required' });

  try {
    const data = await stockService.createStock({ food_item_id, quantity_available });
    res.status(201).json({ message: 'Stock created', data });
  } catch (err) {
    if (err.message === 'Stock already exists for this item') {
        return res.status(400).json({ message: err.message });
    }
    console.error('Stock create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE stock
exports.updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity_available } = req.body;
  
  try {
    const success = await stockService.updateStock(id, { quantity_available });
    if (!success) return res.status(404).json({ message: 'Stock not found' });
    res.json({ message: 'Stock updated' });
  } catch (err) {
    console.error('Stock update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE stock
exports.deleteStock = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await stockService.deleteStock(id);
    if (!success) return res.status(404).json({ message: 'Stock not found' });
    res.json({ message: 'Stock deleted' });
  } catch (err) {
    console.error('Stock delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
