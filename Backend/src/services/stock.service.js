const { poolPromise, sql } = require('../config/db');

class StockService {
  async getAllStock() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT s.stock_id, s.ingredient_id, i.name as ingredient_name, s.quantity_available, s.last_updated 
      FROM dbo.Stock s
      JOIN dbo.Ingredient i ON s.ingredient_id = i.ingredient_id
    `);
    return result.recordset;
  }

  async getStockById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT s.stock_id, s.ingredient_id, i.name as ingredient_name, s.quantity_available, s.last_updated 
        FROM dbo.Stock s
        JOIN dbo.Ingredient i ON s.ingredient_id = i.ingredient_id
        WHERE s.stock_id = @id
      `);
    return result.recordset[0];
  }

  async createStock(data) {
    const { ingredient_id, quantity_available } = data;
    const pool = await poolPromise;
    
    // Check if stock already exists
    const check = await pool.request()
        .input('ingredient_id', sql.Int, ingredient_id)
        .query('SELECT * FROM dbo.Stock WHERE ingredient_id = @ingredient_id');
    
    if (check.recordset.length > 0) {
        throw new Error('Stock already exists for this item');
    }

    const result = await pool.request()
      .input('ingredient_id', sql.Int, ingredient_id)
      .input('quantity_available', sql.Decimal(10, 2), quantity_available)
      .query(`
        INSERT INTO dbo.Stock (ingredient_id, quantity_available, last_updated) 
        VALUES (@ingredient_id, @quantity_available, GETDATE());
        SELECT SCOPE_IDENTITY() AS stock_id;
      `);
    return { stock_id: result.recordset[0].stock_id };
  }

  async updateStock(id, data) {
    const { quantity_available } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('quantity_available', sql.Decimal(10, 2), quantity_available)
      .query(`
        UPDATE dbo.Stock 
        SET quantity_available = @quantity_available, last_updated = GETDATE()
        WHERE stock_id = @id
      `);
    return result.rowsAffected[0] > 0;
  }

  async deleteStock(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.Stock WHERE stock_id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = new StockService();
