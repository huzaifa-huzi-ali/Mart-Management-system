const orderService = require('../services/order.service');

// GET all orders
exports.getAllOrders = async (req, res) => {
  try {
    const data = await orderService.getAllOrders();
    res.json({
      message: 'Orders fetched successfully',
      data,
    });
  } catch (err) {
    console.error('Order fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET order by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const data = await orderService.getOrderById(id);
    if (!data) return res.status(404).json({ message: 'Order not found' });

    res.json({
      message: 'Order fetched successfully',
      data,
    });
  } catch (err) {
    console.error('Order fetch by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE new order
exports.createOrder = async (req, res) => {
  const { order_type, total_amount, food_item_id, quantity } = req.body;
  if (!order_type || total_amount === undefined) {
    return res.status(400).json({ message: 'Order type and total amount are required' });
  }

  try {
    const data = await orderService.createOrder({ order_type, total_amount, food_item_id, quantity });
    res.status(201).json({
      message: 'Order created successfully',
      data,
    });
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE order
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { order_type, total_amount } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (!order_type || total_amount === undefined) {
    return res.status(400).json({ message: 'Order type and total amount are required' });
  }

  try {
    const success = await orderService.updateOrder(id, { order_type, total_amount });
    if (!success) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const success = await orderService.deleteOrder(id);
    if (!success) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Order delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
