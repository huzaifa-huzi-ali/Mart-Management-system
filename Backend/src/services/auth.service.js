const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async login(email, password) {
    const userResult = await db.query(
      'SELECT user_id, full_name, email, password_hash, status FROM "User" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.status) {
      throw new Error('User account is inactive');
    }

    const roleResult = await db.query(
      `SELECT r.role_name
       FROM UserRole ur
       JOIN Role r ON ur.role_id = r.role_id
       WHERE ur.user_id = $1`,
      [user.user_id]
    );

    const roles = roleResult.rows.map((r) => r.role_name);

    const token = jwt.sign(
      { userId: user.user_id, roles },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return { token, user: { id: user.user_id, name: user.full_name, email: user.email, roles } };
  }
}

module.exports = new AuthService();
