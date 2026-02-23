const db = require('../config/db');

class SupplierService {
  async getAllSuppliers() {
    const result = await db.query('SELECT * FROM Supplier ORDER BY supplier_id');
    return result.rows;
  }

  async getSupplierById(id) {
    const result = await db.query('SELECT * FROM Supplier WHERE supplier_id = $1', [id]);
    return result.rows[0];
  }

  async createSupplier(data) {
    const { name, contact, phone } = data;
    const result = await db.query(
      `INSERT INTO Supplier (name, contact, phone)
       VALUES ($1, $2, $3)
       RETURNING supplier_id`,
      [name, contact ?? null, phone ?? null]
    );

    return { supplier_id: result.rows[0].supplier_id, name, contact, phone };
  }

  async updateSupplier(id, data) {
    const { name, contact, phone } = data;
    const result = await db.query(
      `UPDATE Supplier
       SET name = $1, contact = $2, phone = $3
       WHERE supplier_id = $4`,
      [name, contact ?? null, phone ?? null, id]
    );

    return result.rowCount > 0;
  }

  async deleteSupplier(id) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `DELETE FROM PurchaseItem
         WHERE purchase_id IN (SELECT purchase_id FROM Purchase WHERE supplier_id = $1)`,
        [id]
      );

      await client.query('DELETE FROM Purchase WHERE supplier_id = $1', [id]);
      const result = await client.query('DELETE FROM Supplier WHERE supplier_id = $1', [id]);

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

module.exports = new SupplierService();
