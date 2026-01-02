const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Cashier'), orderController.getAllOrders);
router.post('/', roleMiddleware('Admin','Manager','Cashier'), orderController.createOrder);
router.put('/:id', roleMiddleware('Admin','Manager','Cashier'), orderController.updateOrder);
router.delete('/:id', roleMiddleware('Admin','Manager','Cashier'), orderController.deleteOrder);

module.exports = router;
