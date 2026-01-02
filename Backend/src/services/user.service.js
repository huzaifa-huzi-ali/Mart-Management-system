const { poolPromise, sql } = require('../config/db');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers() {
    const pool = await poolPromise;
    const result = await pool.request().query(
      'SELECT user_id, full_name, email, phone, status, created_at FROM dbo.[User]'
    );
    return result.recordset;
  }

  async getUserById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT user_id, full_name, email, phone, status, created_at FROM dbo.[User] WHERE user_id=@id');
    return result.recordset[0];
  }

  async createUser(userData) {
    const { full_name, email, password, phone, status } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const pool = await poolPromise;

    const result = await pool.request()
      .input('full_name', sql.VarChar(100), full_name)
      .input('email', sql.VarChar(150), email)
      .input('password_hash', sql.VarChar(255), hashedPassword)
      .input('phone', sql.VarChar(20), phone || null)
      .input('status', sql.Bit, status ?? 1)
      .query(`INSERT INTO dbo.[User] (full_name, email, password_hash, phone, status)
              VALUES (@full_name, @email, @password_hash, @phone, @status);
              SELECT SCOPE_IDENTITY() AS user_id;`);
    
    return { user_id: result.recordset[0].user_id };
  }

  async updateUser(id, userData) {
    const { full_name, email, password, phone, status } = userData;
    const pool = await poolPromise;

    let query = `
      UPDATE dbo.[User]
      SET full_name=@full_name,
          email=@email,
          phone=@phone,
          status=@status
    `;

    const request = pool.request()
      .input('id', sql.Int, id)
      .input('full_name', sql.VarChar(100), full_name)
      .input('email', sql.VarChar(150), email)
      .input('phone', sql.VarChar(20), phone || null)
      .input('status', sql.Bit, status ?? 1);

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password_hash=@password_hash`;
      request.input('password_hash', sql.VarChar(255), hashedPassword);
    }

    query += ` WHERE user_id=@id`;

    const result = await request.query(query);
    return result.rowsAffected[0] > 0;
  }

  async deleteUser(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.[User] WHERE user_id=@id');
    return result.rowsAffected[0] > 0;
  }

  async getUserByEmail(email) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM dbo.[User] WHERE email=@email');
    return result.recordset[0];
  }
}

module.exports = new UserService();
