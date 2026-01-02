const { poolPromise, sql } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async login(email, password) {
    const pool = await poolPromise;
    const userResult = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT user_id, full_name, email, password_hash, status FROM [User] WHERE email = @email');

    if (userResult.recordset.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = userResult.recordset[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.status) {
      throw new Error('User account is inactive');
    }

    const roleResult = await pool.request()
      .input('user_id', sql.Int, user.user_id)
      .query(`
        SELECT r.role_name
        FROM UserRole ur
        JOIN Role r ON ur.role_id = r.role_id
        WHERE ur.user_id = @user_id
      `);

    const roles = roleResult.recordset.map(r => r.role_name);

    const token = jwt.sign(
      { userId: user.user_id, roles },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, user: { id: user.user_id, name: user.full_name, email: user.email, roles } };
  }
}

module.exports = new AuthService();
