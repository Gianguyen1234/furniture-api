const express = require('express');
const { listUsers, editUser, deleteUser, registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only routes
router.get('/users', authMiddleware, roleMiddleware('admin'), listUsers); // List all users
router.put('/users/:id', authMiddleware, roleMiddleware('admin'), editUser); // Edit user
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser); // Delete user

module.exports = router;
