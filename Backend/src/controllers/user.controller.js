const userService = require('../services/user.service');

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ message: 'Users fetched successfully', data: users });
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }

  try {
    const user = await userService.getUserById(parseInt(id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User fetched successfully', data: user });
  } catch (err) {
    console.error('User fetch by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE user
exports.createUser = async (req, res) => {
  const { full_name, email, password } = req.body;
  if (!full_name || !email || !password) return res.status(400).json({ message: 'Name, email, password required' });

  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully', data: result });
  } catch (err) {
    console.error('User create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }

  try {
    const updated = await userService.updateUser(parseInt(id), req.body);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('User update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid User ID' });
  }

  try {
    const deleted = await userService.deleteUser(parseInt(id));
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('User delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
