const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Chef','Inventory Control','Marketing','Supplier Relations'), categoryController.getAllCategories);
router.post('/', roleMiddleware('Admin','Manager','Chef'), categoryController.createCategory);
router.put('/:id', roleMiddleware('Admin','Manager','Chef'), categoryController.updateCategory);
router.delete('/:id', roleMiddleware('Admin','Manager','Chef'), categoryController.deleteCategory);

module.exports = router;
