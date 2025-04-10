const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const { isAuthenticated } = require('../middleware/auth');

// Get designs for the current user
router.get('/user', isAuthenticated, async (req, res) => {
    try {
        const designs = await Design.find({ userId: req.user._id })
            .select('_id title images')
            .sort({ createdAt: -1 });
        res.json(designs);
    } catch (error) {
        console.error('Error fetching user designs:', error);
        res.status(500).json({ error: 'Failed to fetch designs' });
    }
});

module.exports = router; 