const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Admin only routes
router.get('/', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.get('/stats', isAuthenticatedUser, authorizeRoles('admin'), getUserStats);
router.get('/:id', isAuthenticatedUser, authorizeRoles('admin'), getUserDetails);
router.put('/:id', isAuthenticatedUser, authorizeRoles('admin'), updateUser);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;