const db = require('../config/db');

class FoodItemService {
  async getAllFoodItems() {
    const result = await db.query(`
      SELECT
        f.food_item_id,
        f.name,
        f.price,
        f.description,
        MAX(c.category_id) AS category_id,
        MAX(c.name) AS category_name,
        string_agg(i.ingredient_id::text, ',') AS ingredient_ids_str,
        string_agg(i.name, ', ') AS ingredients
      FROM FoodItem f
      LEFT JOIN FoodItemCategory fic ON f.food_item_id = fic.food_item_id
      LEFT JOIN Category c ON fic.category_id = c.category_id
      LEFT JOIN FoodItemIngredient fii ON f.food_item_id = fii.food_item_id
      LEFT JOIN Ingredient i ON fii.ingredient_id = i.ingredient_id
      GROUP BY f.food_item_id, f.name, f.price, f.description
      ORDER BY f.food_item_id
    `);

    return result.rows;
  }

  async getFoodItemById(id) {
    const result = await db.query(
      'SELECT food_item_id, name, price, description FROM FoodItem WHERE food_item_id = $1',
      [id]
    );
    return result.rows[0];
  }

  async createFoodItem(data) {
    const { name, price, description, category_id, ingredient_ids } = data;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO FoodItem (name, price, description)
         VALUES ($1, $2, $3)
         RETURNING food_item_id`,
        [name, price, description ?? null]
      );

      const foodItemId = result.rows[0].food_item_id;

      if (category_id) {
        await client.query(
          'INSERT INTO FoodItemCategory (food_item_id, category_id) VALUES ($1, $2)',
          [foodItemId, category_id]
        );
      }

      if (ingredient_ids && ingredient_ids.length > 0) {
        const uniqueIngIds = [...new Set(ingredient_ids)];
        for (const ingId of uniqueIngIds) {
          await client.query(
            `INSERT INTO FoodItemIngredient (food_item_id, ingredient_id, quantity_required)
             VALUES ($1, $2, $3)`,
            [foodItemId, ingId, 1]
          );
        }
      }

      await client.query('COMMIT');
      return { food_item_id: foodItemId, name, price, description };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async updateFoodItem(id, data) {
    const { name, price, description, category_id, ingredient_ids } = data;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      await client.query(
        `UPDATE FoodItem
         SET name = $1, price = $2, description = $3
         WHERE food_item_id = $4`,
        [name, price, description ?? null, id]
      );

      if (category_id !== undefined) {
        await client.query('DELETE FROM FoodItemCategory WHERE food_item_id = $1', [id]);
        if (category_id) {
          await client.query(
            'INSERT INTO FoodItemCategory (food_item_id, category_id) VALUES ($1, $2)',
            [id, category_id]
          );
        }
      }

      if (ingredient_ids !== undefined) {
        await client.query('DELETE FROM FoodItemIngredient WHERE food_item_id = $1', [id]);

        if (ingredient_ids.length > 0) {
          const uniqueIngIds = [...new Set(ingredient_ids)];
          for (const ingId of uniqueIngIds) {
            await client.query(
              `INSERT INTO FoodItemIngredient (food_item_id, ingredient_id, quantity_required)
               VALUES ($1, $2, $3)`,
              [id, ingId, 1]
            );
          }
        }
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteFoodItem(id) {
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM ItemUnit WHERE food_item_id = $1', [id]);
      await client.query('DELETE FROM FoodItemCategory WHERE food_item_id = $1', [id]);
      await client.query('DELETE FROM FoodItemIngredient WHERE food_item_id = $1', [id]);
      await client.query('DELETE FROM PurchaseItem WHERE food_item_id = $1', [id]);
      await client.query('DELETE FROM OrderItem WHERE food_item_id = $1', [id]);

      const result = await client.query('DELETE FROM FoodItem WHERE food_item_id = $1', [id]);

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return false;
      }

      await client.query('COMMIT');
      return true;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new FoodItemService();
