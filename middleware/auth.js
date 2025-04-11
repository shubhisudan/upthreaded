const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
    try {
        // Check if user is logged in
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized', details: 'Please log in to continue' });
        }

        // Find and attach user to request
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized', details: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
};

const isUser = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized', details: 'Please log in to continue' });
        }

        // Find and check user role
        const user = await User.findById(req.session.userId);
        if (!user || user.role !== 'user') {
            return res.status(403).json({ error: 'Forbidden', details: 'Access denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('User authentication error:', error);
        res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
};

const isTailor = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized', details: 'Please log in to continue' });
        }

        // Find and check user role
        const user = await User.findById(req.session.userId);
        if (!user || user.role !== 'tailor') {
            return res.status(403).json({ error: 'Forbidden', details: 'Access denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Tailor authentication error:', error);
        res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
};

module.exports = {
    isAuthenticated,
    isUser,
    isTailor
}; 