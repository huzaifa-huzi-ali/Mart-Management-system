const { poolPromise, sql } = require('../config/db');

class PurchaseService {
  async getAllPurchases() {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
            p.purchase_id, 
            s.name AS supplier_name, 
            p.purchase_date, 
            p.total_amount,
            STRING_AGG(COALESCE(i.name, fi.name, 'Unknown'), ', ') AS items
        FROM dbo.Purchase p
        JOIN dbo.Supplier s ON p.supplier_id = s.supplier_id
        LEFT JOIN dbo.PurchaseItem pi ON p.purchase_id = pi.purchase_id
        LEFT JOIN dbo.Ingredient i ON pi.ingredient_id = i.ingredient_id
        LEFT JOIN dbo.FoodItem fi ON pi.food_item_id = fi.food_item_id
        GROUP BY p.purchase_id, s.name, p.purchase_date, p.total_amount
      `);
    return result.recordset;
  }

  async getPurchaseById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT p.purchase_id, s.name AS supplier_name, p.purchase_date, p.total_amount
              FROM dbo.Purchase p
              JOIN dbo.Supplier s ON p.supplier_id = s.supplier_id
              WHERE p.purchase_id=@id`);
    return result.recordset[0];
  }

  async createPurchase(data) {
    const { supplier_id, purchase_date, total_amount, ingredient_id, quantity } = data;
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);
        const result = await request
          .input('supplier_id', sql.Int, supplier_id)
          .input('purchase_date', sql.Date, purchase_date)
          .input('total_amount', sql.Decimal(10, 2), total_amount)
          .query(`INSERT INTO dbo.Purchase (supplier_id, purchase_date, total_amount)
                  VALUES (@supplier_id, @purchase_date, @total_amount);
                  SELECT SCOPE_IDENTITY() AS purchase_id;`);
        
        const purchaseId = result.recordset[0].purchase_id;

        if (ingredient_id && quantity) {
             const qty = parseFloat(quantity);
             const unitPrice = parseFloat(total_amount) / qty;
             const iid = parseInt(ingredient_id);

             // Insert PurchaseItem
             await new sql.Request(transaction)
                .input('pid', sql.Int, purchaseId)
                .input('iid', sql.Int, iid)
                .input('qty', sql.Int, qty)
                .input('price', sql.Decimal(10, 2), unitPrice)
                .query(`
                  INSERT INTO dbo.PurchaseItem (purchase_id, ingredient_id, quantity, unit_price)
                  VALUES (@pid, @iid, @qty, @price)
                `);

             // Update Stock (Add or Create)
             const request2 = new sql.Request(transaction);
             const stockCheck = await request2
                .input('iid', sql.Int, iid)
                .query(`SELECT * FROM dbo.Stock WHERE ingredient_id = @iid`);
             
             const request3 = new sql.Request(transaction);
             if (stockCheck.recordset.length > 0) {
                 await request3
                    .input('qty', sql.Int, qty)
                    .input('iid', sql.Int, iid)
                    .query(`
                      UPDATE dbo.Stock 
                      SET quantity_available = quantity_available + @qty, last_updated = GETDATE()
                      WHERE ingredient_id = @iid
                    `);
             } else {
                 await request3
                    .input('iid', sql.Int, iid)
                    .input('qty', sql.Int, qty)
                    .query(`
                      INSERT INTO dbo.Stock (ingredient_id, quantity_available, last_updated)
                      VALUES (@iid, @qty, GETDATE())
                    `);
             }
        }

        await transaction.commit();
        return { purchase_id: purchaseId, supplier_id, purchase_date, total_amount };
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
  }

  async updatePurchase(id, data) {
    const { supplier_id, purchase_date, total_amount } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('supplier_id', sql.Int, supplier_id)
      .input('purchase_date', sql.Date, purchase_date)
      .input('total_amount', sql.Decimal(10, 2), total_amount)
      .query(`UPDATE dbo.Purchase 
              SET supplier_id=@supplier_id, purchase_date=@purchase_date, total_amount=@total_amount
              WHERE purchase_id=@id`);
    return result.rowsAffected[0] > 0;
  }

  async deletePurchase(id) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        // Delete dependencies
        await request.query(`DELETE FROM dbo.PurchaseItem WHERE purchase_id=@id`);
        
        // Delete Purchase
        const result = await request.query(`DELETE FROM dbo.Purchase WHERE purchase_id=@id`);

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

module.exports = new PurchaseService();
