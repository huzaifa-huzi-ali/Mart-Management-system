const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authMiddleware);

// GET all users → Admin & Manager only
router.get('/', roleMiddleware('Admin','Manager'), userController.getAllUsers);

// GET single user by ID → Admin & Manager only
router.get('/:id', roleMiddleware('Admin','Manager'), userController.getUserById);

// CREATE new user → Admin only
router.post('/', roleMiddleware('Admin','Manager'), userController.createUser);

// UPDATE user → Admin only
router.put('/:id', roleMiddleware('Admin','Manager'), userController.updateUser);

// DELETE user → Admin only
router.delete('/:id', roleMiddleware('Admin','Manager'), userController.deleteUser);

module.exports = router;
