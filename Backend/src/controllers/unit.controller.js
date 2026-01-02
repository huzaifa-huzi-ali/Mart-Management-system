const unitService = require('../services/unit.service');

// GET all units
exports.getAllUnits = async (req, res) => {
  try {
    const data = await unitService.getAllUnits();
    res.json({ message: 'Units fetched successfully', data });
  } catch (err) {
    console.error('Unit fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET unit by ID
exports.getUnitById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const data = await unitService.getUnitById(id);
    if (!data) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Unit fetched successfully', data });
  } catch (err) {
    console.error('Unit fetch by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE unit
exports.createUnit = async (req, res) => {
  const { name, abbreviation } = req.body;
  if (!name) return res.status(400).json({ message: 'Unit name is required' });

  try {
    const data = await unitService.createUnit({ name, abbreviation });
    res.status(201).json({ message: 'Unit created successfully', data });
  } catch (err) {
    console.error('Unit create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE unit
exports.updateUnit = async (req, res) => {
  const { id } = req.params;
  const { name, abbreviation } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (!name) return res.status(400).json({ message: 'Unit name is required' });

  try {
    const success = await unitService.updateUnit(id, { name, abbreviation });
    if (!success) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Unit updated successfully' });
  } catch (err) {
    console.error('Unit update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE unit
exports.deleteUnit = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const success = await unitService.deleteUnit(id);
    if (!success) return res.status(404).json({ message: 'Unit not found' });
    res.json({ message: 'Unit deleted successfully' });
  } catch (err) {
    console.error('Unit delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
