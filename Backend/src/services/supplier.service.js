const { poolPromise, sql } = require('../config/db');

class SupplierService {
  async getAllSuppliers() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Supplier');
    return result.recordset;
  }

  async getSupplierById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM dbo.Supplier WHERE supplier_id=@id');
    return result.recordset[0];
  }

  async createSupplier(data) {
    const { name, contact, phone } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name', sql.VarChar(150), name)
      .input('contact', sql.VarChar(100), contact || null)
      .input('phone', sql.VarChar(20), phone || null)
      .query(`INSERT INTO dbo.Supplier (name, contact, phone)
              VALUES (@name, @contact, @phone);
              SELECT SCOPE_IDENTITY() AS supplier_id;`);
    return { supplier_id: result.recordset[0].supplier_id, name, contact, phone };
  }

  async updateSupplier(id, data) {
    const { name, contact, phone } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar(150), name)
      .input('contact', sql.VarChar(100), contact || null)
      .input('phone', sql.VarChar(20), phone || null)
      .query(`UPDATE dbo.Supplier 
              SET name=@name, contact=@contact, phone=@phone
              WHERE supplier_id=@id`);
    return result.rowsAffected[0] > 0;
  }

  async deleteSupplier(id) {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        // Delete dependencies
        // 1. Purchase Items linked to Purchases of this Supplier
        await request.query(`
            DELETE FROM dbo.PurchaseItem 
            WHERE purchase_id IN (SELECT purchase_id FROM dbo.Purchase WHERE supplier_id=@id)
        `);
        
        // 2. Purchases of this Supplier
        await request.query('DELETE FROM dbo.Purchase WHERE supplier_id=@id');

        // 3. FoodItem Links
        await request.query('DELETE FROM dbo.FoodItemSupplier WHERE supplier_id=@id');

        // 4. Supplier
        const result = await request.query('DELETE FROM dbo.Supplier WHERE supplier_id=@id');

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

module.exports = new SupplierService();
