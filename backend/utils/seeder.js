const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    avatar: {
      public_id: 'default_avatar',
      url: 'https://res.cloudinary.com/demo/image/upload/v1/avatar-admin.png'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    isActive: true,
    phone: '+1234567890',
    addresses: [
      {
        name: 'John Doe',
        phone: '+1234567890',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
        isDefault: true
      }
    ]
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    isActive: true,
    phone: '+1234567891'
  }
];

const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone yet with A17 Pro chip, titanium design, and professional camera system. Features a 6.7-inch Super Retina XDR display with ProMotion technology.',
    price: 1199,
    discountPrice: 1099,
    images: [
      {
        public_id: 'iphone_15_pro_max_1',
        url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop'
      },
      {
        public_id: 'iphone_15_pro_max_2',
        url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop'
      }
    ],
    category: 'Electronics',
    subcategory: 'Smartphones',
    brand: 'Apple',
    stock: 50,
    ratings: 4.8,
    numOfReviews: 127,
    specifications: [
      { name: 'Display', value: '6.7-inch Super Retina XDR' },
      { name: 'Chip', value: 'A17 Pro chip' },
      { name: 'Camera', value: 'Pro camera system' },
      { name: 'Storage', value: '256GB' }
    ],
    tags: ['smartphone', 'apple', 'premium', 'latest'],
    weight: 0.221,
    dimensions: { length: 159.9, width: 76.7, height: 8.25 },
    isFeatured: true,
    isActive: true
  },
  {
    name: 'MacBook Pro 14-inch',
    description: 'Supercharged by M3 chip, featuring incredible performance and all-day battery life. Perfect for professionals and creatives.',
    price: 1999,
    discountPrice: 1799,
    images: [
      {
        public_id: 'macbook_pro_14_1',
        url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop'
      }
    ],
    category: 'Electronics',
    subcategory: 'Laptops',
    brand: 'Apple',
    stock: 25,
    ratings: 4.7,
    numOfReviews: 89,
    specifications: [
      { name: 'Processor', value: 'Apple M3 chip' },
      { name: 'Memory', value: '16GB unified memory' },
      { name: 'Storage', value: '512GB SSD' },
      { name: 'Display', value: '14.2-inch Liquid Retina XDR' }
    ],
    tags: ['laptop', 'apple', 'professional', 'm3'],
    weight: 1.6,
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Nike Air Jordan 1 Retro High',
    description: 'Classic basketball shoe that started it all. Premium leather construction with iconic colorway and superior comfort.',
    price: 170,
    discountPrice: 149,
    images: [
      {
        public_id: 'jordan_1_retro_1',
        url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop'
      }
    ],
    category: 'Fashion',
    subcategory: 'Shoes',
    brand: 'Nike',
    stock: 100,
    ratings: 4.6,
    numOfReviews: 234,
    specifications: [
      { name: 'Material', value: 'Premium Leather' },
      { name: 'Sole', value: 'Rubber outsole' },
      { name: 'Closure', value: 'Lace-up' }
    ],
    tags: ['shoes', 'nike', 'jordan', 'basketball', 'classic'],
    variants: [
      { name: 'Size', value: '8', price: 170, stock: 10 },
      { name: 'Size', value: '9', price: 170, stock: 15 },
      { name: 'Size', value: '10', price: 170, stock: 20 }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with dual noise sensor technology. Premium sound quality with 30-hour battery life.',
    price: 399,
    discountPrice: 329,
    images: [
      {
        public_id: 'sony_headphones_1',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop'
      }
    ],
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'Sony',
    stock: 75,
    ratings: 4.5,
    numOfReviews: 156,
    specifications: [
      { name: 'Battery Life', value: '30 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.2' },
      { name: 'Noise Canceling', value: 'Yes' },
      { name: 'Weight', value: '250g' }
    ],
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    weight: 0.25,
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Samsung 65" QLED 4K Smart TV',
    description: 'Quantum Dot technology delivers vibrant colors and stunning clarity. Smart TV features with built-in streaming apps.',
    price: 1299,
    discountPrice: 1099,
    images: [
      {
        public_id: 'samsung_tv_1',
        url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop'
      }
    ],
    category: 'Electronics',
    subcategory: 'Television',
    brand: 'Samsung',
    stock: 20,
    ratings: 4.4,
    numOfReviews: 78,
    specifications: [
      { name: 'Screen Size', value: '65 inches' },
      { name: 'Resolution', value: '4K UHD' },
      { name: 'Technology', value: 'QLED' },
      { name: 'Smart TV', value: 'Yes' }
    ],
    tags: ['tv', 'samsung', '4k', 'smart-tv', 'qled'],
    weight: 25.5,
    dimensions: { length: 144.6, width: 82.7, height: 8.3 },
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Adidas Ultraboost 22 Running Shoes',
    description: 'Maximum energy return with responsive Boost midsole. Primeknit upper adapts to your foot for ultimate comfort.',
    price: 190,
    discountPrice: 159,
    images: [
      {
        public_id: 'adidas_ultraboost_1',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop'
      }
    ],
    category: 'Fashion',
    subcategory: 'Shoes',
    brand: 'Adidas',
    stock: 80,
    ratings: 4.3,
    numOfReviews: 167,
    specifications: [
      { name: 'Upper', value: 'Primeknit' },
      { name: 'Midsole', value: 'Boost' },
      { name: 'Use', value: 'Running' }
    ],
    tags: ['shoes', 'adidas', 'running', 'boost'],
    variants: [
      { name: 'Size', value: '8', price: 190, stock: 8 },
      { name: 'Size', value: '9', price: 190, stock: 12 },
      { name: 'Size', value: '10', price: 190, stock: 15 }
    ],
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    description: '7 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
    price: 99,
    discountPrice: 79,
    images: [
      {
        public_id: 'instant_pot_1',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop'
      }
    ],
    category: 'Home & Garden',
    subcategory: 'Kitchen Appliances',
    brand: 'Instant Pot',
    stock: 150,
    ratings: 4.7,
    numOfReviews: 892,
    specifications: [
      { name: 'Capacity', value: '6 quart' },
      { name: 'Functions', value: '7-in-1' },
      { name: 'Material', value: 'Stainless Steel' }
    ],
    tags: ['kitchen', 'pressure-cooker', 'appliance', 'cooking'],
    weight: 5.8,
    isFeatured: false,
    isActive: true
  },
  {
    name: 'Dyson V15 Detect Cordless Vacuum',
    description: 'Powerful cordless vacuum with laser dust detection and intelligent suction adjustment.',
    price: 749,
    discountPrice: 649,
    images: [
      {
        public_id: 'dyson_vacuum_1',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop'
      }
    ],
    category: 'Home & Garden',
    subcategory: 'Cleaning',
    brand: 'Dyson',
    stock: 35,
    ratings: 4.6,
    numOfReviews: 203,
    specifications: [
      { name: 'Type', value: 'Cordless' },
      { name: 'Battery Life', value: '60 minutes' },
      { name: 'Dust Detection', value: 'Laser technology' }
    ],
    tags: ['vacuum', 'dyson', 'cordless', 'cleaning'],
    weight: 3.1,
    isFeatured: true,
    isActive: true
  }
];

// Hash passwords
const hashPasswords = async () => {
  for (let user of users) {
    user.password = await bcrypt.hash(user.password, 12);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    
    console.log('Existing data cleared');
    
    // Hash passwords
    await hashPasswords();
    
    // Import users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users imported`);
    
    // Get admin user ID for products
    const adminUser = createdUsers.find(user => user.role === 'admin');
    
    // Add seller to products
    const productsWithSeller = products.map(product => ({
      ...product,
      seller: adminUser._id
    }));
    
    // Import products
    const createdProducts = await Product.insertMany(productsWithSeller);
    console.log(`${createdProducts.length} products imported`);
    
    console.log('Data import completed successfully');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@ecommerce.com / admin123');
    console.log('User: john@example.com / password123');
    
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    
    console.log('All data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}