const express = require('express');
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
  cancelOrder,
  createPaymentIntent,
  confirmPayment,
  getOrderStats
} = require('../controllers/orderController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/new', isAuthenticatedUser, newOrder);
router.get('/me', isAuthenticatedUser, myOrders);
router.get('/:id', isAuthenticatedUser, getSingleOrder);
router.put('/:id/cancel', isAuthenticatedUser, cancelOrder);

// Payment routes
router.post('/payment/intent', isAuthenticatedUser, createPaymentIntent);
router.post('/payment/confirm', isAuthenticatedUser, confirmPayment);

// Admin routes
router.get('/', isAuthenticatedUser, authorizeRoles('admin'), allOrders);
router.put('/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrder);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);
router.get('/admin/stats', isAuthenticatedUser, authorizeRoles('admin'), getOrderStats);

module.exports = router;