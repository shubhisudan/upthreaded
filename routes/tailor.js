const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated, isTailor } = require('../middleware/auth');

// Get tailor profile
router.get('/profile', isAuthenticated, isTailor, async (req, res) => {
    try {
        const tailor = await User.findById(req.user._id).select('-password');
        if (!tailor) {
            return res.status(404).json({ error: 'Tailor not found' });
        }
        res.json(tailor);
    } catch (error) {
        console.error('Error fetching tailor profile:', error);
        res.status(500).json({ error: 'Failed to fetch tailor profile' });
    }
});

module.exports = router; 