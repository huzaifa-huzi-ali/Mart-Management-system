const { poolPromise, sql } = require('../config/db');

class CategoryService {
  async getAllCategories() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Category');
    return result.recordset;
  }

  async getCategoryById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM Category WHERE category_id=@id');
    return result.recordset[0];
  }

  async createCategory(data) {
    const { name, description } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar(100), name)
      .input('description', sql.VarChar(255), description)
      .query(`INSERT INTO Category (name, description) VALUES (@name, @description);
              SELECT SCOPE_IDENTITY() AS category_id;`);
    return { category_id: result.recordset[0].category_id, name, description };
  }

  async updateCategory(id, data) {
    const { name, description } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar(100), name)
      .input('description', sql.VarChar(255), description)
      .query(`UPDATE Category SET name=@name, description=@description WHERE category_id=@id`);
    return result.rowsAffected[0] > 0;
  }

  async deleteCategory(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Category WHERE category_id=@id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = new CategoryService();
