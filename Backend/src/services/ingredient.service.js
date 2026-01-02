const { poolPromise, sql } = require('../config/db');

class IngredientService {
  async getAllIngredients() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Ingredient');
    return result.recordset;
  }

  async getIngredientById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM dbo.Ingredient WHERE ingredient_id=@id');
    return result.recordset[0];
  }

  async createIngredient(data) {
    const { name, description } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar(150), name)
      .input('description', sql.VarChar(255), description || null)
      .query(`INSERT INTO dbo.Ingredient (name, description) VALUES (@name, @description);
              SELECT SCOPE_IDENTITY() AS ingredient_id;`);
    return { ingredient_id: result.recordset[0].ingredient_id, name, description };
  }

  async updateIngredient(id, data) {
    const { name, description } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar(150), name)
      .input('description', sql.VarChar(255), description || null)
      .query('UPDATE dbo.Ingredient SET name=@name, description=@description WHERE ingredient_id=@id');
    return result.rowsAffected[0] > 0;
  }

  async deleteIngredient(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.Ingredient WHERE ingredient_id=@id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = new IngredientService();
