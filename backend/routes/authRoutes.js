const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  registerUser,
  loginUser,
  logout,
  getUserProfile,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Name must be between 2 and 30 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const passwordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

// Auth routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);

// Protected routes
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/me/update', isAuthenticatedUser, updateProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword);

// Password reset
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', passwordValidation, resetPassword);

// Address management
router.post('/address/add', isAuthenticatedUser, addAddress);
router.put('/address/:id', isAuthenticatedUser, updateAddress);
router.delete('/address/:id', isAuthenticatedUser, deleteAddress);

module.exports = router;