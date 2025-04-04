const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
const { isUser } = require('../middleware/auth');
const fs = require('fs');

// Public routes
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/index.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/signup.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/login.html'));
});

// Protected routes
router.get('/user.html', isUser, (req, res) => {
  res.sendFile(path.join(__dirname, '../html/user.html'));
});

router.get('/profile', isUser, (req, res) => {
  res.sendFile(path.join(__dirname, '../html/profile.html'));
});

router.get('/orders', isUser, (req, res) => {
  res.sendFile(path.join(__dirname, '../html/orders.html'));
});

router.get('/imagegen', isUser, (req, res) => {
  res.sendFile(path.join(__dirname, '../html/imagegen.html'));
});

// Tailor routes
router.get('/tailor', (req, res) => {
  if (req.session.userId && req.session.role === 'tailor') {
    res.sendFile(path.join(__dirname, '../html/tailor.html'));
  } else {
    res.redirect('/login');
  }
});

// Tailor dashboard routes
router.get('/tailor-dashboard/profile.html', (req, res) => {
  if (req.session.userId && req.session.role === 'tailor') {
    res.sendFile(path.join(__dirname, '../html/tailor-dashboard/profile.html'));
  } else {
    res.redirect('/login');
  }
});

router.get('/tailor-dashboard/requests.html', (req, res) => {
  if (req.session.userId && req.session.role === 'tailor') {
    res.sendFile(path.join(__dirname, '../html/tailor-dashboard/requests.html'));
  } else {
    res.redirect('/login');
  }
});

router.get('/tailor-dashboard/orders.html', (req, res) => {
  if (req.session.userId && req.session.role === 'tailor') {
    res.sendFile(path.join(__dirname, '../html/tailor-dashboard/orders.html'));
  } else {
    res.redirect('/login');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

// Signup route
router.post('/register', async (req, res) => {
  try {
    const { fullname, phone, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      phone,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during registration.');
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/login?message=User not found or invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.redirect('/login?message=User not found or invalid credentials');
    }

    // Set session
    req.session.userId = user._id;
    req.session.role = user.role;

    if (user.role === 'tailor') {
      return res.sendFile(path.join(__dirname, '../html/tailor.html'));
    } else if (user.role === 'user') {
      return res.sendFile(path.join(__dirname, '../html/user.html'));
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during login.');
  }
});

// Redirect any direct access to HTML files to login
router.get('/*.html', (req, res) => {
  if (['/index.html', '/login.html', '/signup.html'].includes(req.path)) {
    return res.sendFile(path.join(__dirname, '..', req.path));
  }
  res.redirect('/login');
});

// Get user profile data
router.get('/api/profile', isUser, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching profile data' });
  }
});

// Update profile route
router.post('/api/profile', isUser, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      const profilePicture = req.files.profilePicture;
      const uploadPath = path.join(__dirname, '../public/uploads/profile-pictures');

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `${user._id}-${uniqueSuffix}${path.extname(profilePicture.name)}`;
      const filePath = path.join(uploadPath, filename);

      // Move file to uploads directory
      await profilePicture.mv(filePath);

      // Update profile picture path
      user.profilePicture = `/uploads/profile-pictures/${filename}`;
    }

    // Update other fields
    if (req.body.location) user.location = req.body.location;
    if (req.body.bio) user.bio = req.body.bio;

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
