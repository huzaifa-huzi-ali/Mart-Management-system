const supplierService = require('../services/supplier.service');

// GET all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const data = await supplierService.getAllSuppliers();
    res.json({ message: 'Suppliers fetched successfully', data });
  } catch (err) {
    console.error('Supplier fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET supplier by ID
exports.getSupplierById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const data = await supplierService.getSupplierById(id);
    if (!data) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier fetched successfully', data });
  } catch (err) {
    console.error('Supplier fetch by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE supplier
exports.createSupplier = async (req, res) => {
  const { name, contact, phone } = req.body;
  if (!name) return res.status(400).json({ message: 'Supplier name is required' });

  try {
    const data = await supplierService.createSupplier({ name, contact, phone });
    res.status(201).json({
      message: 'Supplier created successfully',
      data
    });
  } catch (err) {
    console.error('Supplier create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE supplier
exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, contact, phone } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (!name) return res.status(400).json({ message: 'Supplier name is required' });

  try {
    const success = await supplierService.updateSupplier(id, { name, contact, phone });
    if (!success) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier updated successfully' });
  } catch (err) {
    console.error('Supplier update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE supplier
exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const success = await supplierService.deleteSupplier(id);
    if (!success) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error('Supplier delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
