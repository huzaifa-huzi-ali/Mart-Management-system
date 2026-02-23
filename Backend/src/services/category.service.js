const db = require('../config/db');

class CategoryService {
  async getAllCategories() {
    const result = await db.query('SELECT * FROM Category ORDER BY category_id');
    return result.rows;
  }

  async getCategoryById(id) {
    const result = await db.query('SELECT * FROM Category WHERE category_id = $1', [id]);
    return result.rows[0];
  }

  async createCategory(data) {
    const { name, description } = data;
    const result = await db.query(
      'INSERT INTO Category (name, description) VALUES ($1, $2) RETURNING category_id',
      [name, description ?? null]
    );
    return { category_id: result.rows[0].category_id, name, description };
  }

  async updateCategory(id, data) {
    const { name, description } = data;
    const result = await db.query(
      'UPDATE Category SET name = $1, description = $2 WHERE category_id = $3',
      [name, description ?? null, id]
    );
    return result.rowCount > 0;
  }

  async deleteCategory(id) {
    const result = await db.query('DELETE FROM Category WHERE category_id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new CategoryService();
