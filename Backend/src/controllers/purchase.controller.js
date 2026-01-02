const purchaseService = require('../services/purchase.service');

// GET all purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const data = await purchaseService.getAllPurchases();
    res.json({ message: 'Purchases fetched successfully', data });
  } catch (err) {
    console.error('Purchase fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET purchase by ID
exports.getPurchaseById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const data = await purchaseService.getPurchaseById(id);
    if (!data) return res.status(404).json({ message: 'Purchase not found' });
    res.json({ message: 'Purchase fetched successfully', data });
  } catch (err) {
    console.error('Purchase fetch by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE purchase
exports.createPurchase = async (req, res) => {
  const { supplier_id, purchase_date, total_amount, ingredient_id, quantity } = req.body;
  if (!supplier_id || !purchase_date || total_amount === undefined) 
    return res.status(400).json({ message: 'All fields required' });

  try {
    const data = await purchaseService.createPurchase({ supplier_id, purchase_date, total_amount, ingredient_id, quantity });
    res.status(201).json({
      message: 'Purchase created successfully',
      data,
    });
  } catch (err) {
    console.error('Purchase create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE purchase
exports.updatePurchase = async (req, res) => {
  const { id } = req.params;
  const { supplier_id, purchase_date, total_amount } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (!supplier_id || !purchase_date || total_amount === undefined) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const success = await purchaseService.updatePurchase(id, { supplier_id, purchase_date, total_amount });
    if (!success) return res.status(404).json({ message: 'Purchase not found' });
    res.json({ message: 'Purchase updated successfully' });
  } catch (err) {
    console.error('Purchase update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE purchase
exports.deletePurchase = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const success = await purchaseService.deletePurchase(id);
    if (!success) return res.status(404).json({ message: 'Purchase not found' });
    res.json({ message: 'Purchase deleted successfully' });
  } catch (err) {
    console.error('Purchase delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
