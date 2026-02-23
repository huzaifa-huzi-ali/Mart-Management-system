const db = require('../config/db');

class StockService {
  async getAllStock() {
    const result = await db.query(`
      SELECT s.stock_id, s.ingredient_id, i.name AS ingredient_name, s.quantity_available, s.last_updated
      FROM Stock s
      JOIN Ingredient i ON s.ingredient_id = i.ingredient_id
      ORDER BY s.stock_id
    `);
    return result.rows;
  }

  async getStockById(id) {
    const result = await db.query(
      `SELECT s.stock_id, s.ingredient_id, i.name AS ingredient_name, s.quantity_available, s.last_updated
       FROM Stock s
       JOIN Ingredient i ON s.ingredient_id = i.ingredient_id
       WHERE s.stock_id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async createStock(data) {
    const ingredientId = data.ingredient_id ?? data.food_item_id;
    const { quantity_available } = data;

    const check = await db.query('SELECT 1 FROM Stock WHERE ingredient_id = $1', [ingredientId]);
    if (check.rows.length > 0) {
      throw new Error('Stock already exists for this item');
    }

    const result = await db.query(
      `INSERT INTO Stock (ingredient_id, quantity_available, last_updated)
       VALUES ($1, $2, NOW())
       RETURNING stock_id`,
      [ingredientId, quantity_available]
    );

    return { stock_id: result.rows[0].stock_id };
  }

  async updateStock(id, data) {
    const { quantity_available } = data;
    const result = await db.query(
      `UPDATE Stock
       SET quantity_available = $1, last_updated = NOW()
       WHERE stock_id = $2`,
      [quantity_available, id]
    );
    return result.rowCount > 0;
  }

  async deleteStock(id) {
    const result = await db.query('DELETE FROM Stock WHERE stock_id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new StockService();
