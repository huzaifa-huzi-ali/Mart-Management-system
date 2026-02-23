const db = require('../config/db');

class OrderService {
  async getAllOrders() {
    const result = await db.query('SELECT order_id, order_date, order_type, total_amount FROM "Order" ORDER BY order_id');
    return result.rows;
  }

  async getOrderById(id) {
    const result = await db.query(
      'SELECT order_id, order_date, order_type, total_amount FROM "Order" WHERE order_id = $1',
      [id]
    );
    return result.rows[0];
  }

  async createOrder(data) {
    const { order_type, total_amount, food_item_id, quantity } = data;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const insertOrder = await client.query(
        `INSERT INTO "Order" (order_type, total_amount, order_date)
         VALUES ($1, $2, NOW())
         RETURNING order_id`,
        [order_type, total_amount]
      );

      const orderId = insertOrder.rows[0].order_id;

      if (food_item_id && quantity) {
        const qty = Number(quantity);
        const price = Number(total_amount) / qty;
        const foodItemId = Number(food_item_id);

        await client.query(
          `INSERT INTO OrderItem (order_id, food_item_id, quantity, price_at_time)
           VALUES ($1, $2, $3, $4)`,
          [orderId, foodItemId, qty, price]
        );

        const ingredientsRes = await client.query(
          'SELECT ingredient_id, quantity_required FROM FoodItemIngredient WHERE food_item_id = $1',
          [foodItemId]
        );

        for (const ing of ingredientsRes.rows) {
          const totalQty = qty * Number(ing.quantity_required);
          const ingId = ing.ingredient_id;

          const stockCheck = await client.query('SELECT 1 FROM Stock WHERE ingredient_id = $1', [ingId]);

          if (stockCheck.rows.length > 0) {
            await client.query(
              `UPDATE Stock
               SET quantity_available = quantity_available - $1,
                   last_updated = NOW()
               WHERE ingredient_id = $2`,
              [totalQty, ingId]
            );
          } else {
            await client.query(
              `INSERT INTO Stock (ingredient_id, quantity_available, last_updated)
               VALUES ($1, $2, NOW())`,
              [ingId, -totalQty]
            );
          }
        }
      }

      await client.query('COMMIT');
      return { order_id: orderId, order_type, total_amount };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async updateOrder(id, data) {
    const { order_type, total_amount } = data;
    const result = await db.query(
      `UPDATE "Order"
       SET order_type = $1, total_amount = $2
       WHERE order_id = $3`,
      [order_type, total_amount, id]
    );

    return result.rowCount > 0;
  }

  async deleteOrder(id) {
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM OrderPayment WHERE order_id = $1', [id]);
      await client.query('DELETE FROM Payment WHERE order_id = $1', [id]);
      await client.query('DELETE FROM OrderItem WHERE order_id = $1', [id]);

      const result = await client.query('DELETE FROM "Order" WHERE order_id = $1', [id]);

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

module.exports = new OrderService();
