const { poolPromise, sql } = require('../config/db');

class InventoryService {
  async getAllLogs() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          l.log_id, 
          l.ingredient_id, 
          i.name AS ingredient_name,
          l.user_id, 
          u.full_name AS user_name,
          l.action_type, 
          l.quantity_change, 
          l.timestamp 
        FROM dbo.InventoryLog l
        LEFT JOIN dbo.Ingredient i ON l.ingredient_id = i.ingredient_id
        LEFT JOIN dbo.[User] u ON l.user_id = u.user_id
      `);
    return result.recordset;
  }

  async createLog(data) {
    const { ingredient_id, user_id, action_type, quantity_change } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('ingredient_id', sql.Int, ingredient_id || null)
      .input('user_id', sql.Int, user_id)
      .input('action_type', sql.VarChar(50), action_type)
      .input('quantity_change', sql.Decimal(10, 2), quantity_change)
      .query(`INSERT INTO dbo.InventoryLog (ingredient_id, user_id, action_type, quantity_change)
              VALUES (@ingredient_id, @user_id, @action_type, @quantity_change);
              SELECT SCOPE_IDENTITY() AS log_id;`);
    return { log_id: result.recordset[0].log_id, ingredient_id, user_id, action_type, quantity_change };
  }

  async updateLog(id, data) {
    const { ingredient_id, user_id, action_type, quantity_change } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('ingredient_id', sql.Int, ingredient_id || null)
      .input('user_id', sql.Int, user_id)
      .input('action_type', sql.VarChar(50), action_type)
      .input('quantity_change', sql.Decimal(10, 2), quantity_change)
      .query(`UPDATE dbo.InventoryLog
              SET ingredient_id=@ingredient_id, user_id=@user_id, action_type=@action_type, quantity_change=@quantity_change
              WHERE log_id=@id`);
    return result.rowsAffected[0] > 0;
  }

  async deleteLog(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM dbo.InventoryLog WHERE log_id=@id`);
    return result.rowsAffected[0] > 0;
  }
}

module.exports = new InventoryService();
