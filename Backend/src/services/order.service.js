const { poolPromise, sql } = require('../config/db');

class OrderService {
  async getAllOrders() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT order_id, order_date, order_type, total_amount FROM dbo.[Order]`);
    return result.recordset;
  }

  async getOrderById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT order_id, order_date, order_type, total_amount FROM dbo.[Order] WHERE order_id=@id`);
    return result.recordset[0];
  }

  async createOrder(data) {
    const { order_type, total_amount, food_item_id, quantity } = data;
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);
        const result = await request
          .input('order_type', sql.VarChar(20), order_type)
          .input('total_amount', sql.Decimal(10, 2), total_amount)
          .query(`INSERT INTO dbo.[Order] (order_type, total_amount, order_date)
                  VALUES (@order_type, @total_amount, GETDATE());
                  SELECT SCOPE_IDENTITY() AS order_id;`);
        
        const orderId = result.recordset[0].order_id;

        if (food_item_id && quantity) {
             const qty = parseFloat(quantity);
             const price = parseFloat(total_amount) / qty;
             const fid = parseInt(food_item_id);

             await request
                .input('oid', sql.Int, orderId)
                .input('fid', sql.Int, fid)
                .input('qty', sql.Int, qty)
                .input('price', sql.Decimal(10, 2), price)
                .query(`
                  INSERT INTO dbo.OrderItem (order_id, food_item_id, quantity, price_at_time)
                  VALUES (@oid, @fid, @qty, @price)
                `);

             // Deduct Ingredients from Stock
             const ingredientsRes = await new sql.Request(transaction)
                .input('fid', sql.Int, fid)
                .query('SELECT ingredient_id, quantity_required FROM FoodItemIngredient WHERE food_item_id = @fid');
             
             for (const ing of ingredientsRes.recordset) {
                 const totalQty = qty * ing.quantity_required;
                 const ingId = ing.ingredient_id;
                 
                 const stockCheck = await new sql.Request(transaction)
                    .input('iid', sql.Int, ingId)
                    .query('SELECT * FROM dbo.Stock WHERE ingredient_id = @iid');

                 if (stockCheck.recordset.length > 0) {
                     await new sql.Request(transaction)
                        .input('qty', sql.Decimal(10, 2), totalQty)
                        .input('iid', sql.Int, ingId)
                        .query('UPDATE dbo.Stock SET quantity_available = quantity_available - @qty, last_updated = GETDATE() WHERE ingredient_id = @iid');
                 } else {
                     await new sql.Request(transaction)
                        .input('iid', sql.Int, ingId)
                        .input('qty', sql.Decimal(10, 2), totalQty)
                        .query('INSERT INTO dbo.Stock (ingredient_id, quantity_available, last_updated) VALUES (@iid, -@qty, GETDATE())');
                 }
             }
        }

        await transaction.commit();
        return { order_id: orderId, order_type, total_amount };
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
  }

  async updateOrder(id, data) {
    const { order_type, total_amount } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('order_type', sql.VarChar(20), order_type)
      .input('total_amount', sql.Decimal(10, 2), total_amount)
      .query(`UPDATE dbo.[Order]
              SET order_type=@order_type, total_amount=@total_amount
              WHERE order_id=@id`);
    return result.rowsAffected[0] > 0;
  }

  async deleteOrder(id) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        // Delete dependencies
        await request.query(`DELETE FROM dbo.Payment WHERE order_id=@id`);
        await request.query(`DELETE FROM dbo.OrderItem WHERE order_id=@id`);
        
        // Delete Order
        const result = await request.query(`DELETE FROM dbo.[Order] WHERE order_id=@id`);

        if (result.rowsAffected[0] === 0) {
             await transaction.rollback();
             return false;
        }

        await transaction.commit();
        return true;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
  }
}

module.exports = new OrderService();
