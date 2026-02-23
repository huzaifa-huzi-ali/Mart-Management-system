const db = require('../config/db');

class IngredientService {
  async getAllIngredients() {
    const result = await db.query('SELECT * FROM Ingredient ORDER BY ingredient_id');
    return result.rows;
  }

  async getIngredientById(id) {
    const result = await db.query('SELECT * FROM Ingredient WHERE ingredient_id = $1', [id]);
    return result.rows[0];
  }

  async createIngredient(data) {
    const { name, description } = data;
    const result = await db.query(
      'INSERT INTO Ingredient (name, description) VALUES ($1, $2) RETURNING ingredient_id',
      [name, description ?? null]
    );
    return { ingredient_id: result.rows[0].ingredient_id, name, description };
  }

  async updateIngredient(id, data) {
    const { name, description } = data;
    const result = await db.query(
      'UPDATE Ingredient SET name = $1, description = $2 WHERE ingredient_id = $3',
      [name, description ?? null, id]
    );
    return result.rowCount > 0;
  }

  async deleteIngredient(id) {
    const result = await db.query('DELETE FROM Ingredient WHERE ingredient_id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new IngredientService();
