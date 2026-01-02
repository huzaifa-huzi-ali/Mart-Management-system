const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Chef','Inventory Control','Marketing','Supplier Relations'), unitController.getAllUnits);
router.get('/:id', roleMiddleware('Admin','Manager','Chef','Inventory Control'), unitController.getUnitById);
router.post('/', roleMiddleware('Admin','Manager','Chef'), unitController.createUnit);
router.put('/:id', roleMiddleware('Admin','Manager','Chef'), unitController.updateUnit);
router.delete('/:id', roleMiddleware('Admin','Manager','Chef'), unitController.deleteUnit);

module.exports = router;
