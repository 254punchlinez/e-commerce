# Modern MERN Stack Ecommerce Website

A full-featured ecommerce platform built with MongoDB, Express.js, React, and Node.js. This project includes user authentication, product management, shopping cart, order processing, payment integration, and admin dashboard.

## 🚀 Features

### User Features
- **Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Password reset functionality
  - Profile management

- **Product Catalog**
  - Browse products with pagination
  - Advanced search and filtering
  - Product categories and subcategories
  - Product reviews and ratings
  - Wishlist functionality
  - Related products

- **Shopping Experience**
  - Add to cart functionality
  - Cart management (update quantities, remove items)
  - Secure checkout process
  - Multiple address management
  - Order tracking
  - Order history

- **Payment Integration**
  - Stripe payment processing
  - Secure payment handling
  - Payment confirmation

### Admin Features
- **Dashboard**
  - Sales analytics and statistics
  - User management
  - Order management
  - Revenue tracking

- **Product Management**
  - Add, edit, delete products
  - Bulk image upload
  - Inventory management
  - Category management

- **Order Management**
  - View all orders
  - Update order status
  - Tracking information
  - Order analytics

- **User Management**
  - View all users
  - User role management
  - User statistics

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **Multer** - File upload handling

### Frontend
- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Stripe.js** - Payment integration

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Compression** - Response compression
- **Input Validation** - Data validation

## 📁 Project Structure

```
mern-ecommerce/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   └── store.js
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── assets/
│   ├── package.json
│   └── tailwind.config.js
└── package.json
```

## ⚡ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mern-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   npm run install-server
   
   # Install frontend dependencies
   npm run install-client
   ```

3. **Environment Setup**
   
   Copy the environment file and update with your credentials:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Update the following variables in `backend/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   PORT=5000
   NODE_ENV=development
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Stripe Payment
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/me/update` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders/new` - Create order
- `GET /api/orders/me` - Get user orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (Admin)

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔧 Configuration

### MongoDB Setup
1. **Local MongoDB**: Install MongoDB locally or use MongoDB Atlas
2. **Connection**: Update `MONGO_URI` in `.env` file

### Cloudinary Setup (Image Upload)
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Update environment variables

### Stripe Setup (Payment)
1. Create account at [Stripe](https://stripe.com/)
2. Get your publishable and secret keys
3. Update environment variables

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Update CORS origins for production
3. Set `NODE_ENV=production`

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Configure API base URL for production

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 📚 Learning Resources

### MERN Stack
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Additional Technologies
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Stripe Documentation](https://stripe.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React community for amazing libraries
- MongoDB for the flexible database
- Stripe for secure payment processing
- Cloudinary for image management
- All contributors and supporters

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

---

**Happy Coding! 🚀**