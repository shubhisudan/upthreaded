const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
const { isUser } = require('../middleware/auth');

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

module.exports = router;
