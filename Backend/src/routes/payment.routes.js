const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Cashier'), paymentController.getAllPayments);
router.post('/', roleMiddleware('Admin','Manager','Cashier'), paymentController.createPayment);
router.put('/:id', roleMiddleware('Admin','Manager','Cashier'), paymentController.updatePayment);
router.delete('/:id', roleMiddleware('Admin','Manager','Cashier'), paymentController.deletePayment);

module.exports = router;
