const Product = require('../models/Product');

// Create new product => /api/products (Admin)
exports.newProduct = async (req, res, next) => {
  try {
    req.body.seller = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// Get all products => /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const resultsPerPage = parseInt(req.query.limit) || 8;
    const currentPage = parseInt(req.query.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);

    // Build query object
    let queryObj = { isActive: true };

    // Search functionality
    if (req.query.keyword) {
      queryObj.$text = { $search: req.query.keyword };
    }

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      queryObj.category = {
        $regex: req.query.category,
        $options: 'i'
      };
    }

    // Brand filter
    if (req.query.brand) {
      queryObj.brand = {
        $regex: req.query.brand,
        $options: 'i'
      };
    }

    // Price range filter
    if (req.query.price) {
      const [min, max] = req.query.price.split('-').map(Number);
      queryObj.price = {};
      if (min) queryObj.price.$gte = min;
      if (max) queryObj.price.$lte = max;
    }

    // Rating filter
    if (req.query.ratings) {
      queryObj.ratings = {
        $gte: Number(req.query.ratings)
      };
    }

    // Sort options
    let sortOptions = {};
    switch (req.query.sort) {
      case 'price_low':
        sortOptions = { price: 1 };
        break;
      case 'price_high':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { ratings: -1, numOfReviews: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'popular':
        sortOptions = { numOfReviews: -1, ratings: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(queryObj);

    // Execute query
    const products = await Product.find(queryObj)
      .populate('seller', 'name')
      .sort(sortOptions)
      .limit(resultsPerPage)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage,
      totalPages: Math.ceil(totalProducts / resultsPerPage),
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get single product details => /api/products/:id
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product is not available'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// Update product => /api/products/:id (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product => /api/products/:id (Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Instead of deleting, mark as inactive
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Create new review => /api/products/:id/reviews
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const isReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      // Update existing review
      product.reviews.forEach(review => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      // Add new review
      product.reviews.push(review);
    }

    // Calculate average rating
    product.calculateAverageRating();

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get product reviews => /api/products/:id/reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews
    });
  } catch (error) {
    next(error);
  }
};

// Delete review => /api/products/:productId/reviews/:reviewId
exports.deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    review.remove();
    product.calculateAverageRating();
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get featured products => /api/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true,
      isFeatured: true
    })
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category => /api/products/category/:category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const resultsPerPage = parseInt(req.query.limit) || 12;
    const currentPage = parseInt(req.query.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);

    const queryObj = {
      isActive: true,
      category: {
        $regex: req.params.category,
        $options: 'i'
      }
    };

    const totalProducts = await Product.countDocuments(queryObj);

    const products = await Product.find(queryObj)
      .populate('seller', 'name')
      .sort({ createdAt: -1 })
      .limit(resultsPerPage)
      .skip(skip);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage,
      totalPages: Math.ceil(totalProducts / resultsPerPage),
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get related products => /api/products/:id/related
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await Product.find({
      isActive: true,
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { brand: product.brand },
        { tags: { $in: product.tags } }
      ]
    })
      .populate('seller', 'name')
      .sort({ ratings: -1, numOfReviews: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// Add to wishlist => /api/products/:id/wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = req.user;
    const isInWishlist = user.wishlist.includes(req.params.id);

    if (isInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist',
        inWishlist: false
      });
    } else {
      // Add to wishlist
      user.wishlist.push(req.params.id);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Product added to wishlist',
        inWishlist: true
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get search suggestions => /api/products/search/suggestions
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        suggestions: []
      });
    }

    const products = await Product.find({
      isActive: true,
      $text: { $search: q }
    })
      .select('name category brand')
      .limit(5);

    const suggestions = products.map(product => ({
      name: product.name,
      category: product.category,
      brand: product.brand
    }));

    res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    next(error);
  }
};