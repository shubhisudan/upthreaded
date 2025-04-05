const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
const { isUser } = require('../middleware/auth');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

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

router.get('/about',(req, res) => {
  res.sendFile(path.join(__dirname, '../html/about.html'));
});

router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/contact.html'));
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
    console.log('Signup attempt for email:', email);
    console.log('Raw password:', password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists');
      return res.status(400).send('Email already registered.');
    }

    console.log('Hashing password with bcrypt');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Generated salt:', salt);
    console.log('Hashed password:', hashedPassword);

    const newUser = new User({
      fullname,
      phone,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    console.log('User saved successfully with hashed password');
    res.redirect('/login');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('An error occurred during registration.');
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    console.log('Attempted password:', password);

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.redirect('/login?message=User not found or invalid credentials');
    }

    console.log('Stored password hash:', user.password);
    console.log('Attempting password comparison with bcrypt.compare');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);

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
    console.error('Login error:', error);
    res.status(500).send('An error occurred during login.');
  }
});

// Redirect any direct access to HTML files to login
router.get('/*.html', (req, res) => {
  if (['/index.html', '/login.html', '/signup.html', '/about.html', '/contact.html'].includes(req.path)) {
    return res.sendFile(path.join(__dirname, '..', 'html', req.path));
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

// Get tailor profile data
router.get('/api/tailor-profile', async (req, res) => {
  try {
    // Check if user is logged in and is a tailor
    if (!req.session.userId || req.session.role !== 'tailor') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tailor = await User.findById(req.session.userId).select('-password');
    if (!tailor) {
      return res.status(404).json({ error: 'Tailor not found' });
    }
    res.json(tailor);
  } catch (error) {
    console.error('Error fetching tailor profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
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

// Update tailor profile route
router.post('/api/tailor-profile', async (req, res) => {
  try {
    // Check if user is logged in and is a tailor
    if (!req.session.userId || req.session.role !== 'tailor') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tailor = await User.findById(req.session.userId);
    if (!tailor) {
      return res.status(404).json({ error: 'Tailor not found' });
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
      const filename = `${tailor._id}-${uniqueSuffix}${path.extname(profilePicture.name)}`;
      const filePath = path.join(uploadPath, filename);

      // Move file to uploads directory
      await profilePicture.mv(filePath);

      // Update profile picture path
      tailor.profilePicture = `/uploads/profile-pictures/${filename}`;
    }

    // Update other fields
    if (req.body.location) tailor.location = req.body.location;
    if (req.body.bio) tailor.bio = req.body.bio;
    if (req.body.specialties) {
      try {
        tailor.specialties = JSON.parse(req.body.specialties);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid specialties format' });
      }
    }
    if (req.body.priceRange) tailor.priceRange = req.body.priceRange;

    await tailor.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating tailor profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add design to tailor profile
router.post('/api/tailor-profile/designs', async (req, res) => {
  try {
    // Check if user is logged in and is a tailor
    if (!req.session.userId || req.session.role !== 'tailor') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tailor = await User.findById(req.session.userId);
    if (!tailor) {
      return res.status(404).json({ error: 'Tailor not found' });
    }

    // Check if design image was uploaded
    if (!req.files || !req.files.designImage) {
      return res.status(400).json({ error: 'Design image is required' });
    }

    const designImage = req.files.designImage;
    const uploadPath = path.join(__dirname, '../public/uploads/design-images');

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${tailor._id}-${uniqueSuffix}${path.extname(designImage.name)}`;
    const filePath = path.join(uploadPath, filename);

    // Move file to uploads directory
    await designImage.mv(filePath);

    // Create new design
    const newDesign = {
      imageUrl: `/uploads/design-images/${filename}`,
      title: req.body.title || 'Untitled Design'
    };

    // Add to tailor's designs
    if (!tailor.designs) {
      tailor.designs = [];
    }
    tailor.designs.push(newDesign);
    await tailor.save();

    res.json({
      message: 'Design added successfully',
      design: newDesign
    });
  } catch (error) {
    console.error('Error adding design:', error);
    res.status(500).json({ error: 'Failed to add design' });
  }
});

// Delete a design from tailor profile
router.delete('/api/tailor-profile/designs/:designId', async (req, res) => {
  try {
    // Check if user is logged in and is a tailor
    if (!req.session.userId || req.session.role !== 'tailor') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tailor = await User.findById(req.session.userId);
    if (!tailor) {
      return res.status(404).json({ error: 'Tailor not found' });
    }

    const designId = req.params.designId;

    // Check if tailor has designs
    if (!tailor.designs || tailor.designs.length === 0) {
      return res.status(404).json({ error: 'No designs found' });
    }

    // Find the design index
    const designIndex = tailor.designs.findIndex(design => design._id.toString() === designId);
    if (designIndex === -1) {
      return res.status(404).json({ error: 'Design not found' });
    }

    // Remove design
    const removedDesign = tailor.designs.splice(designIndex, 1)[0];

    // Try to delete the physical file (but don't fail if it doesn't exist)
    try {
      const filePath = path.join(__dirname, '../public', removedDesign.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting design file:', error);
      // Continue with deletion even if file removal fails
    }

    await tailor.save();
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Error deleting design:', error);
    res.status(500).json({ error: 'Failed to delete design' });
  }
});

// Get tailors matching user request criteria
router.post('/api/match-tailors', isUser, async (req, res) => {
  try {
    const { location, priceRange, description } = req.body;

    // Start with basic query to find tailors
    let query = { role: 'tailor' };

    // Filter by location if provided
    if (location && location.trim() !== '') {
      // Case-insensitive search for location
      query.location = { $regex: new RegExp(location, 'i') };
    }

    // Get all tailors matching the query
    let tailors = await User.find(query)
      .select('fullname location priceRange bio specialties profilePicture designs')
      .lean();

    // If no tailors found with exact location, get all tailors
    if (tailors.length === 0) {
      tailors = await User.find({ role: 'tailor' })
        .select('fullname location priceRange bio specialties profilePicture designs')
        .lean();
    }

    // Add relevance score based on matching criteria
    tailors = tailors.map(tailor => {
      let score = 0;

      // Location match
      if (location && tailor.location && tailor.location.toLowerCase().includes(location.toLowerCase())) {
        score += 3;
      }

      // Price range match
      if (priceRange && tailor.priceRange) {
        // Simple check if the tailor's price range contains any part of the requested range
        if (priceRange === tailor.priceRange) {
          score += 2;
        }
      }

      // Description keywords match with specialties or bio
      if (description && description.trim() !== '') {
        const keywords = description.toLowerCase().split(/\s+/);

        // Check bio for keywords
        if (tailor.bio) {
          const bioLower = tailor.bio.toLowerCase();
          keywords.forEach(keyword => {
            if (keyword.length > 3 && bioLower.includes(keyword)) {
              score += 1;
            }
          });
        }

        // Check specialties for keywords
        if (tailor.specialties && Array.isArray(tailor.specialties)) {
          const specialtiesLower = tailor.specialties.map(s => s.toLowerCase());
          keywords.forEach(keyword => {
            if (keyword.length > 3) {
              specialtiesLower.forEach(specialty => {
                if (specialty.includes(keyword)) {
                  score += 2;
                }
              });
            }
          });
        }
      }

      return {
        ...tailor,
        score
      };
    });

    // Sort by score descending
    tailors.sort((a, b) => b.score - a.score);

    // Return top 5 matches
    res.json(tailors.slice(0, 5));

  } catch (error) {
    console.error('Error matching tailors:', error);
    res.status(500).json({ error: 'Failed to match tailors' });
  }
});

router.post('/api/generate-upcycle-ideas', async (req, res) => {
    try {
        const { clothing, style } = req.body;

        // Prepare prompt for Gemini
        const prompt = `I have ${clothing} and want to transform it into something new in ${style} style. Suggest creative ways to upcycle this clothing item into something new. Include specific steps and what the final result will be.`;

        // Make request to Gemini API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the suggestion from Gemini's response
        const suggestion = response.data.candidates[0].content.parts[0].text;

        res.json({
            success: true,
            suggestion: suggestion
        });

    } catch (error) {
        console.error('Error generating ideas:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to generate upcycling ideas'
        });
    }
});

module.exports = router;
