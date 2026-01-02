const { poolPromise, sql } = require('../config/db');

class PaymentService {
  async getAllPayments() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.Payment');
    return result.recordset;
  }

  async getPaymentById(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM dbo.Payment WHERE payment_id=@id');
    return result.recordset[0];
  }

  async createPayment(data) {
    const { amount, method, order_id } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('amount', sql.Decimal(10, 2), amount)
      .input('method', sql.VarChar(50), method)
      .input('order_id', sql.Int, order_id)
      .query(`INSERT INTO dbo.Payment (amount, method, order_id)
              VALUES (@amount, @method, @order_id);
              SELECT SCOPE_IDENTITY() AS payment_id;`);
    return { payment_id: result.recordset[0].payment_id, amount, method, order_id };
  }

  async updatePayment(id, data) {
    const { amount, method, order_id } = data;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('method', sql.VarChar(50), method)
      .input('order_id', sql.Int, order_id)
      .query('UPDATE dbo.Payment SET amount=@amount, method=@method, order_id=@order_id WHERE payment_id=@id');
    return result.rowsAffected[0] > 0;
  }

  async deletePayment(id) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM dbo.Payment WHERE payment_id=@id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = new PaymentService();
