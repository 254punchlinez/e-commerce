const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: {
      name: String,
      value: String
    }
  }],
  shippingInfo: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  },
  paymentInfo: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['card', 'paypal', 'stripe', 'cash_on_delivery'],
      default: 'stripe'
    }
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    enum: [
      'Processing',
      'Confirmed',
      'Shipped',
      'Delivered',
      'Cancelled',
      'Returned',
      'Refunded'
    ],
    default: 'Processing'
  },
  orderNotes: {
    type: String,
    maxLength: [500, 'Order notes cannot exceed 500 characters']
  },
  trackingNumber: {
    type: String
  },
  shippingCarrier: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  couponCode: {
    type: String
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  refundReason: {
    type: String
  },
  invoice: {
    number: String,
    url: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ 'paymentInfo.id': 1 });

// Add status to history when order status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      updatedBy: this.user
    });
  }
  
  // Auto-generate invoice number if not exists
  if (!this.invoice.number && this.orderStatus === 'Confirmed') {
    this.invoice.number = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  
  next();
});

// Calculate total price
orderSchema.methods.calculateTotalPrice = function() {
  this.itemsPrice = this.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice - this.discount;
  return this.totalPrice;
};

// Get order summary
orderSchema.methods.getOrderSummary = function() {
  return {
    orderId: this._id,
    orderStatus: this.orderStatus,
    totalItems: this.orderItems.reduce((total, item) => total + item.quantity, 0),
    totalPrice: this.totalPrice,
    createdAt: this.createdAt,
    estimatedDelivery: this.estimatedDelivery
  };
};

module.exports = mongoose.model('Order', orderSchema);