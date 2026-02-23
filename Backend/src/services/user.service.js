const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers() {
    const result = await db.query(
      'SELECT user_id, full_name, email, phone, status, created_at FROM "User" ORDER BY user_id'
    );
    return result.rows;
  }

  async getUserById(id) {
    const result = await db.query(
      'SELECT user_id, full_name, email, phone, status, created_at FROM "User" WHERE user_id = $1',
      [id]
    );
    return result.rows[0];
  }

  async createUser(userData) {
    const { full_name, email, password, phone, status } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO "User" (full_name, email, password_hash, phone, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id`,
      [full_name, email, hashedPassword, phone ?? null, status ?? true]
    );

    return { user_id: result.rows[0].user_id };
  }

  async updateUser(id, userData) {
    const { full_name, email, password, phone, status } = userData;

    const values = [full_name, email, phone ?? null, status ?? true, id];
    let query = `
      UPDATE "User"
      SET full_name = $1,
          email = $2,
          phone = $3,
          status = $4
    `;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      values.splice(4, 0, hashedPassword);
      query += ', password_hash = $5 WHERE user_id = $6';
    } else {
      query += ' WHERE user_id = $5';
    }

    const result = await db.query(query, values);
    return result.rowCount > 0;
  }

  async deleteUser(id) {
    const result = await db.query('DELETE FROM "User" WHERE user_id = $1', [id]);
    return result.rowCount > 0;
  }

  async getUserByEmail(email) {
    const result = await db.query('SELECT * FROM "User" WHERE email = $1', [email]);
    return result.rows[0];
  }
}

module.exports = new UserService();
