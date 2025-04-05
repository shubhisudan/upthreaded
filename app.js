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

// Create Express app
const app = express();

// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/UpThreaded", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => { console.log('Connected to MongoDB'); })
//   .catch((err) => { console.error('Could not connect to MongoDB', err); });
require('dotenv').config();
const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}));

// Serve static files from public directory only
app.use(express.static(path.join(__dirname, 'public')));

// Mount the router before static file serving for html directory
app.use('/', indexRouter);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Route to handle profile picture upload
app.post('/api/tailor-profile', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming session contains user ID
    const imagePath = `/uploads/${req.file.filename}`; // Path where image is saved

    // Update user profile with image path
    await User.findByIdAndUpdate(userId, { profilePicture: imagePath });

    console.log(`Profile picture updated for user ${userId}: ${imagePath}`); // Log for verification

    res.status(200).send('Profile picture updated');
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).send('Failed to update profile picture');
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

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
