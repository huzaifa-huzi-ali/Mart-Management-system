const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const inventoryController = require('../controllers/inventory.controller');

// All routes require authentication
router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Inventory Control'), inventoryController.getAllLogs);
router.post('/', roleMiddleware('Admin','Manager','Inventory Control'), inventoryController.createLog);
router.put('/:id', roleMiddleware('Admin','Manager','Inventory Control'), inventoryController.updateLog);
router.delete('/:id', roleMiddleware('Admin','Manager','Inventory Control'), inventoryController.deleteLog);

module.exports = router;
