const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Chef','Inventory Control'), stockController.getAllStock);
router.get('/:id', roleMiddleware('Admin','Manager','Inventory Control'), stockController.getStockById);
router.post('/', roleMiddleware('Admin','Manager','Inventory Control'), stockController.createStock);
router.put('/:id', roleMiddleware('Admin','Manager','Inventory Control'), stockController.updateStock);
router.delete('/:id', roleMiddleware('Admin','Manager','Inventory Control'), stockController.deleteStock);

module.exports = router;
