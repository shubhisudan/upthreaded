const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
    // Check if user is logged in
    if (!req.session || !req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

const isUser = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('/login');
    }

    // Check if user has the correct role
    User.findById(req.session.userId)
        .then(user => {
            if (!user || user.role !== 'user') {
                return res.redirect('/login');
            }
            next();
        })
        .catch(err => {
            console.error(err);
            res.redirect('/login');
        });
};

module.exports = {
    isAuthenticated,
    isUser
}; 