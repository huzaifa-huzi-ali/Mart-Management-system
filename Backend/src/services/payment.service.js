const db = require('../config/db');

class PaymentService {
  async getAllPayments() {
    const result = await db.query('SELECT * FROM Payment ORDER BY payment_id');
    return result.rows;
  }

  async getPaymentById(id) {
    const result = await db.query('SELECT * FROM Payment WHERE payment_id = $1', [id]);
    return result.rows[0];
  }

  async createPayment(data) {
    const { amount, method, order_id } = data;
    const result = await db.query(
      'INSERT INTO Payment (amount, method, order_id) VALUES ($1, $2, $3) RETURNING payment_id',
      [amount, method, order_id ?? null]
    );

    return { payment_id: result.rows[0].payment_id, amount, method, order_id: order_id ?? null };
  }

  async updatePayment(id, data) {
    const { amount, method, order_id } = data;
    const result = await db.query(
      'UPDATE Payment SET amount = $1, method = $2, order_id = $3 WHERE payment_id = $4',
      [amount, method, order_id ?? null, id]
    );
    return result.rowCount > 0;
  }

  async deletePayment(id) {
    const result = await db.query('DELETE FROM Payment WHERE payment_id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = new PaymentService();
