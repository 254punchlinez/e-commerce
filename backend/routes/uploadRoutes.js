const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const { isAuthenticatedUser } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload single image => /api/upload/image
router.post('/image', isAuthenticatedUser, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Convert buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'ecommerce/products',
      width: 800,
      height: 800,
      crop: 'limit',
      quality: 'auto'
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      image: {
        public_id: result.public_id,
        url: result.secure_url
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload multiple images => /api/upload/images
router.post('/images', isAuthenticatedUser, upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      
      return await cloudinary.uploader.upload(base64Image, {
        folder: 'ecommerce/products',
        width: 800,
        height: 800,
        crop: 'limit',
        quality: 'auto'
      });
    });

    const results = await Promise.all(uploadPromises);

    const images = results.map(result => ({
      public_id: result.public_id,
      url: result.secure_url
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images
    });
  } catch (error) {
    next(error);
  }
});

// Upload avatar => /api/upload/avatar
router.post('/avatar', isAuthenticatedUser, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No avatar file provided'
      });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'ecommerce/avatars',
      width: 300,
      height: 300,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto'
    });

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: {
        public_id: result.public_id,
        url: result.secure_url
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete image => /api/upload/delete/:public_id
router.delete('/delete/:public_id', isAuthenticatedUser, async (req, res, next) => {
  try {
    const { public_id } = req.params;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;