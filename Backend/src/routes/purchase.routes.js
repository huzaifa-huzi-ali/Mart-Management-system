const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Inventory Control'), purchaseController.getAllPurchases);
router.post('/', roleMiddleware('Admin','Manager','Inventory Control'), purchaseController.createPurchase);
router.put('/:id', roleMiddleware('Admin','Manager','Inventory Control'), purchaseController.updatePurchase);
router.delete('/:id', roleMiddleware('Admin','Manager','Inventory Control'), purchaseController.deletePurchase);

module.exports = router;
