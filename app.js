var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var session = require('express-session');
var fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
var requestRouter = require('./routes/requests');
var designsRouter = require('./routes/designs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'df0jikbzb',
  api_key: '259449875815954',
  api_secret: '-zJhaaLKLcmboY5RI-0ww8jHdgY',
  secure: true
});

// Verify Cloudinary connection
cloudinary.api.ping()
  .then(result => {
    console.log('Cloudinary connection successful:', {
      status: result.status,
      rate_limit_allowed: result.rate_limit_allowed,
      rate_limit_reset_at: result.rate_limit_reset_at,
      rate_limit_remaining: result.rate_limit_remaining
    });
  })
  .catch(error => {
    console.error('Cloudinary connection failed:', error);
  });

// Load environment variables
require('dotenv').config();

// Connect to MongoDB Atlas
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
  })
  .catch(err => {
    console.error('MongoDB Atlas connection error:', err);
    process.exit(1);
  });

// Add mongoose connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB Atlas');
});

// Handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
  });
});

// Create Express app
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session middleware configuration
app.use(session({
  secret: 'your-secret-key', // Change this to a secure secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  abortOnLimit: true
}));

// Serve static files from public directory only
app.use(express.static(path.join(__dirname, 'public')));
app.use('/html', express.static(path.join(__dirname, 'html')));

// Mount the router before static file serving for html directory
app.use('/', indexRouter);
app.use('/api/requests', requestRouter);
app.use('/api/designs', designsRouter);

// Route to handle tailor profile updates
app.post('/api/tailor-profile', async (req, res) => {
  try {
    console.log('Profile update request received');
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.files && req.files.profilePicture ? {
      originalname: req.files.profilePicture.name,
      mimetype: req.files.profilePicture.mimetype,
      size: req.files.profilePicture.size
    } : 'No file uploaded');

    // Validate session and user ID
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: 'User session not found'
      });
    }

    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        details: 'The requested user profile could not be found'
      });
    }

    // Verify user is a tailor
    if (user.role !== 'tailor') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        details: 'Only tailors can update profiles'
      });
    }

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      console.log('Starting Cloudinary upload for profile picture...');
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.files.profilePicture.tempFilePath, {
          folder: 'upthreaded/profile-pictures',
          public_id: `${user._id}-${Date.now()}`,
          resource_type: 'auto'
        });

        console.log('Cloudinary upload successful:', {
          url: result.secure_url,
          public_id: result.public_id,
          folder: result.folder,
          format: result.format,
          bytes: result.bytes
        });

        // Update user profile with Cloudinary URL
        user.profilePicture = result.secure_url;
        await user.save();
        console.log('Profile updated successfully with Cloudinary URL');

        // Clean up temporary file
        if (req.files.profilePicture.tempFilePath) {
          fs.unlinkSync(req.files.profilePicture.tempFilePath);
        }

        return res.json({
          success: true,
          message: 'Profile updated successfully',
          profilePicture: result.secure_url
        });
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload profile picture',
          details: error.message || 'Unknown error occurred during upload'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'No profile picture provided',
        details: 'Please upload a profile picture'
      });
    }
  } catch (error) {
    console.error('Detailed error updating profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      details: error.message || 'Unknown error occurred'
    });
  }
});

// Route to handle design uploads
app.post('/api/tailor-profile/designs', fileUpload(), async (req, res) => {
  try {
    console.log('Design upload request received');
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.files && req.files.designImage ? {
      originalname: req.files.designImage.name,
      mimetype: req.files.designImage.mimetype,
      size: req.files.designImage.size
    } : 'No file uploaded');

    // Validate session and user ID
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: 'User session not found'
      });
    }

    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        details: 'The requested user profile could not be found'
      });
    }

    // Verify user is a tailor
    if (user.role !== 'tailor') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        details: 'Only tailors can upload designs'
      });
    }

    // Handle design image upload
    if (req.files && req.files.designImage) {
      console.log('Starting Cloudinary upload for design...');
      try {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          console.log('Creating upload stream...');
          const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            folder: 'upthreaded/designs',
            public_id: `${user._id}-${Date.now()}`
          }, (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('Cloudinary upload successful:', {
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                bytes: result.bytes
              });
              resolve(result);
            }
          });

          console.log('Sending file buffer to Cloudinary...');
          uploadStream.end(req.files.designImage.data);
        });

        // Create new design document
        const design = new Design({
          tailorId: user._id,
          imageUrl: result.secure_url,
          title: req.body.title || 'Untitled Design',
          description: req.body.description || '',
          price: req.body.price || 0,
          category: req.body.category || 'Other'
        });

        await design.save();
        console.log('Design saved successfully');

        return res.json({
          success: true,
          message: 'Design uploaded successfully',
          design: {
            id: design._id,
            imageUrl: design.imageUrl,
            title: design.title,
            description: design.description,
            price: design.price,
            category: design.category
          }
        });
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload design',
          details: error.message || 'Unknown error occurred during design upload'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'No design image provided',
        details: 'Please upload a design image'
      });
    }
  } catch (error) {
    console.error('Detailed error uploading design:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload design',
      details: error.message || 'Unknown error occurred'
    });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    res.sendFile(path.join(__dirname, 'html', '404.html'));
  } else {
    res.send('Error: ' + err.message);
  }
});

// Start the server
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
