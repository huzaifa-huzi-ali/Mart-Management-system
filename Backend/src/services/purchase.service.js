const db = require('../config/db');

class PurchaseService {
  async getAllPurchases() {
    const result = await db.query(`
      SELECT
        p.purchase_id,
        s.name AS supplier_name,
        p.purchase_date,
        p.total_amount,
        COALESCE(string_agg(fi.name, ', '), '') AS items
      FROM Purchase p
      JOIN Supplier s ON p.supplier_id = s.supplier_id
      LEFT JOIN PurchaseItem pi ON p.purchase_id = pi.purchase_id
      LEFT JOIN FoodItem fi ON pi.food_item_id = fi.food_item_id
      GROUP BY p.purchase_id, s.name, p.purchase_date, p.total_amount
      ORDER BY p.purchase_id
    `);

    return result.rows;
  }

  async getPurchaseById(id) {
    const result = await db.query(
      `SELECT p.purchase_id, s.name AS supplier_name, p.purchase_date, p.total_amount
       FROM Purchase p
       JOIN Supplier s ON p.supplier_id = s.supplier_id
       WHERE p.purchase_id = $1`,
      [id]
    );

    return result.rows[0];
  }

  async createPurchase(data) {
    const { supplier_id, purchase_date, total_amount, ingredient_id, food_item_id, quantity } = data;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const purchaseResult = await client.query(
        `INSERT INTO Purchase (supplier_id, purchase_date, total_amount)
         VALUES ($1, $2, $3)
         RETURNING purchase_id`,
        [supplier_id, purchase_date, total_amount]
      );

      const purchaseId = purchaseResult.rows[0].purchase_id;

      if (quantity) {
        const qty = Number(quantity);
        const unitPrice = Number(total_amount) / qty;
        const itemId = food_item_id ?? ingredient_id ?? null;

        if (itemId) {
          await client.query(
            `INSERT INTO PurchaseItem (purchase_id, food_item_id, quantity, unit_price)
             VALUES ($1, $2, $3, $4)`,
            [purchaseId, itemId, qty, unitPrice]
          );
        }

        if (ingredient_id) {
          const stockCheck = await client.query('SELECT 1 FROM Stock WHERE ingredient_id = $1', [ingredient_id]);

          if (stockCheck.rows.length > 0) {
            await client.query(
              `UPDATE Stock
               SET quantity_available = quantity_available + $1,
                   last_updated = NOW()
               WHERE ingredient_id = $2`,
              [qty, ingredient_id]
            );
          } else {
            await client.query(
              `INSERT INTO Stock (ingredient_id, quantity_available, last_updated)
               VALUES ($1, $2, NOW())`,
              [ingredient_id, qty]
            );
          }
        } else if (food_item_id) {
          const recipeRows = await client.query(
            'SELECT ingredient_id, quantity_required FROM FoodItemIngredient WHERE food_item_id = $1',
            [food_item_id]
          );

          for (const recipe of recipeRows.rows) {
            const ingQty = qty * Number(recipe.quantity_required);
            const stockCheck = await client.query('SELECT 1 FROM Stock WHERE ingredient_id = $1', [recipe.ingredient_id]);

            if (stockCheck.rows.length > 0) {
              await client.query(
                `UPDATE Stock
                 SET quantity_available = quantity_available + $1,
                     last_updated = NOW()
                 WHERE ingredient_id = $2`,
                [ingQty, recipe.ingredient_id]
              );
            } else {
              await client.query(
                `INSERT INTO Stock (ingredient_id, quantity_available, last_updated)
                 VALUES ($1, $2, NOW())`,
                [recipe.ingredient_id, ingQty]
              );
            }
          }
        }
      }

      await client.query('COMMIT');
      return { purchase_id: purchaseId, supplier_id, purchase_date, total_amount };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async updatePurchase(id, data) {
    const { supplier_id, purchase_date, total_amount } = data;
    const result = await db.query(
      `UPDATE Purchase
       SET supplier_id = $1, purchase_date = $2, total_amount = $3
       WHERE purchase_id = $4`,
      [supplier_id, purchase_date, total_amount, id]
    );

    return result.rowCount > 0;
  }

  async deletePurchase(id) {
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM PurchaseItem WHERE purchase_id = $1', [id]);
      const result = await client.query('DELETE FROM Purchase WHERE purchase_id = $1', [id]);

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

module.exports = new PurchaseService();
