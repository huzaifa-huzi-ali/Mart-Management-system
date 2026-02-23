const db = require('../config/db');

class InventoryService {
  async getAllLogs() {
    const result = await db.query(`
      SELECT
        l.log_id,
        l.ingredient_id,
        i.name AS ingredient_name,
        l.user_id,
        u.full_name AS user_name,
        l.action_type,
        l.quantity_change,
        l."timestamp"
      FROM InventoryLog l
      LEFT JOIN Ingredient i ON l.ingredient_id = i.ingredient_id
      LEFT JOIN "User" u ON l.user_id = u.user_id
      ORDER BY l.log_id DESC
    `);
    return result.rows;
  }

  async createLog(data) {
    const { ingredient_id, food_item_id, user_id, action_type, quantity_change } = data;
    const resolvedIngredientId = ingredient_id ?? food_item_id ?? null;

    const result = await db.query(
      `INSERT INTO InventoryLog (ingredient_id, user_id, action_type, quantity_change)
       VALUES ($1, $2, $3, $4)
       RETURNING log_id`,
      [resolvedIngredientId, user_id, action_type, quantity_change]
    );

    return {
      log_id: result.rows[0].log_id,
      ingredient_id: resolvedIngredientId,
      user_id,
      action_type,
      quantity_change,
    };
  }

  async updateLog(id, data) {
    const { ingredient_id, food_item_id, user_id, action_type, quantity_change } = data;
    const resolvedIngredientId = ingredient_id ?? food_item_id ?? null;

    const result = await db.query(
      `UPDATE InventoryLog
       SET ingredient_id = $1, user_id = $2, action_type = $3, quantity_change = $4
       WHERE log_id = $5`,
      [resolvedIngredientId, user_id, action_type, quantity_change, id]
    );

    return result.rowCount > 0;
  }

  async deleteLog(id) {
    const result = await db.query('DELETE FROM InventoryLog WHERE log_id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new InventoryService();
