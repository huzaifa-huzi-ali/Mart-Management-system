const express = require('express');
const router = express.Router();
const foodItemController = require('../controllers/foodItem.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Chef','Inventory Control','Cashier','Waiter','Staff','Marketing','Supplier Relations'), foodItemController.getAllFoodItems);
router.post('/', roleMiddleware('Admin','Manager','Chef','Cashier'), foodItemController.createFoodItem);
router.put('/:id', roleMiddleware('Admin','Manager','Chef','Cashier'), foodItemController.updateFoodItem);
router.delete('/:id', roleMiddleware('Admin','Manager','Chef','Cashier'), foodItemController.deleteFoodItem);

module.exports = router;
