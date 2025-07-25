const express = require('express');
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getFeaturedProducts,
  getProductsByCategory,
  getRelatedProducts,
  addToWishlist,
  getSearchSuggestions
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search/suggestions', getSearchSuggestions);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', optionalAuth, getSingleProduct);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getProductReviews);

// Protected routes (require authentication)
router.post('/:id/reviews', isAuthenticatedUser, createProductReview);
router.post('/:id/wishlist', isAuthenticatedUser, addToWishlist);
router.delete('/:productId/reviews/:reviewId', isAuthenticatedUser, deleteReview);

// Admin routes
router.post('/', isAuthenticatedUser, authorizeRoles('admin'), newProduct);
router.put('/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.delete('/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;