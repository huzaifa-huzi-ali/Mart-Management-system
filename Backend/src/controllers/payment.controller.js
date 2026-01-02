const paymentService = require('../services/payment.service');

// GET all payments
exports.getAllPayments = async (req, res) => {
  try {
    const data = await paymentService.getAllPayments();
    res.json({ message: 'Payments fetched successfully', data });
  } catch (err) {
    console.error('Payment fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET payment by ID
exports.getPaymentById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const data = await paymentService.getPaymentById(id);
    if (!data) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment fetched successfully', data });
  } catch (err) {
    console.error('Payment fetch by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE payment
exports.createPayment = async (req, res) => {
  const { amount, method, order_id } = req.body;
  if (amount === undefined || !method) return res.status(400).json({ message: 'Amount and method required' });

  try {
    const data = await paymentService.createPayment({ amount, method, order_id });
    res.status(201).json({
      message: 'Payment created successfully',
      data
    });
  } catch (err) {
    console.error('Payment create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE payment
exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, method, order_id } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (amount === undefined || !method) return res.status(400).json({ message: 'Amount and method required' });

  try {
    const success = await paymentService.updatePayment(id, { amount, method, order_id });
    if (!success) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    console.error('Payment update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE payment
exports.deletePayment = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const success = await paymentService.deletePayment(id);
    if (!success) return res.status(404).json({ message: 'Payment not found' });
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Payment delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
