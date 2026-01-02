const authService = require('../services/auth.service');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const result = await authService.login(email, password);
    res.json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    if (err.message === 'Invalid credentials' || err.message === 'User account is inactive') {
        return res.status(401).json({ message: err.message });
    }
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
