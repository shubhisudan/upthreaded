const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');

//landing page route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/index.html'));
});

// Signup page route
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/signup.html'));
});

//login route
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/login.html'));
});

// Profile page route
router.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/profile.html'));
});

// Orders page route
router.get('/orders.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/orders.html'));
});

// Logout route
router.get('/logout', (req, res) => {
  // TODO: Implement proper session cleanup
  res.redirect('/login');
});

//signup route
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

module.exports = router;
