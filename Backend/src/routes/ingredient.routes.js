const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredient.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', roleMiddleware('Admin','Manager','Chef','Inventory Control','Marketing','Supplier Relations'), ingredientController.getAllIngredients);
router.post('/', roleMiddleware('Admin','Manager','Chef'), ingredientController.createIngredient);
router.put('/:id', roleMiddleware('Admin','Manager','Chef'), ingredientController.updateIngredient);
router.delete('/:id', roleMiddleware('Admin','Manager','Chef'), ingredientController.deleteIngredient);

module.exports = router;
