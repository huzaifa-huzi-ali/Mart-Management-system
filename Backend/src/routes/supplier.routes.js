const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Inventory Control','Supplier Relations'), supplierController.getAllSuppliers);
router.post('/', roleMiddleware('Admin','Manager','Supplier Relations'), supplierController.createSupplier);
router.put('/:id', roleMiddleware('Admin','Manager','Supplier Relations'), supplierController.updateSupplier);
router.delete('/:id', roleMiddleware('Admin','Manager','Supplier Relations'), supplierController.deleteSupplier);
module.exports = router;
