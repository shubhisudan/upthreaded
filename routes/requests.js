const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const Design = require('../models/Design');
const { isAuthenticated, isUser } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

// Create a new request
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        console.log('User:', req.user);

        const { tailorId, message, location, priceRange, description } = req.body;

        // Validate required fields
        if (!tailorId || !location || !priceRange || !description) {
            console.error('Missing required fields:', { tailorId, location, priceRange, description });
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'Please provide all required information'
            });
        }

        // Validate tailor exists
        try {
            const tailor = await User.findById(tailorId);
            if (!tailor) {
                console.error('Tailor not found:', tailorId);
                return res.status(404).json({
                    error: 'Tailor not found',
                    details: 'The specified tailor does not exist'
                });
            }
        } catch (error) {
            console.error('Error validating tailor:', error);
            return res.status(500).json({
                error: 'Error validating tailor',
                details: error.message
            });
        }

        let uploadedImages = [];

        // Handle image uploads if any
        if (req.files && req.files.images) {
            try {
                const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
                console.log('Processing images:', images.length);

                for (const image of images) {
                    try {
                        console.log('Uploading image to Cloudinary:', image.name);
                        const result = await cloudinary.uploader.upload(image.tempFilePath, {
                            folder: 'upthreaded/requests'
                        });
                        uploadedImages.push(result.secure_url);
                        console.log('Image uploaded successfully:', result.secure_url);
                    } catch (uploadError) {
                        console.error('Error uploading image to Cloudinary:', uploadError);
                        continue;
                    }
                }
            } catch (error) {
                console.error('Error processing images:', error);
            }
        }

        try {
            console.log('Creating request with data:', {
                customer: req.user._id,
                tailor: tailorId,
                location,
                priceRange,
                description,
                imagesCount: uploadedImages.length
            });

            const request = new Request({
                customer: req.user._id,
                tailor: tailorId,
                location,
                priceRange,
                description,
                images: uploadedImages,
                message: message || ''
            });

            const savedRequest = await request.save();
            console.log('Request saved successfully:', savedRequest._id);

            // Populate the request with user details
            const populatedRequest = await Request.findById(savedRequest._id)
                .populate('customer', 'fullname profilePicture')
                .populate('tailor', 'fullname');

            console.log('Request populated successfully');
            res.status(201).json(populatedRequest);
        } catch (dbError) {
            console.error('Database error:', dbError);
            if (dbError.name === 'ValidationError') {
                return res.status(400).json({
                    error: 'Validation error',
                    details: Object.values(dbError.errors).map(err => err.message)
                });
            }
            throw dbError;
        }
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({
            error: 'Failed to create request',
            details: error.message
        });
    }
});

// Get requests for a tailor
router.get('/tailor/:tailorId', async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized', details: 'Please log in to continue' });
        }

        // Check if the requested tailor ID matches the logged-in user's ID
        if (req.params.tailorId !== req.session.userId) {
            return res.status(403).json({ error: 'Forbidden', details: 'You can only view your own requests' });
        }

        const { status } = req.query;
        const query = { tailor: req.params.tailorId };

        if (status && status !== 'all') {
            query.status = status;
        }

        const requests = await Request.find(query)
            .populate('customer', 'fullname profilePicture')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests', details: error.message });
    }
});

// Update request status
router.put('/:requestId/status', async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized', details: 'Please log in to continue' });
        }

        const { status } = req.body;
        const request = await Request.findById(req.params.requestId);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        // Check if the request belongs to the logged-in tailor
        if (request.tailor.toString() !== req.session.userId) {
            return res.status(403).json({ error: 'Forbidden', details: 'You can only update your own requests' });
        }

        request.status = status;
        await request.save();

        res.json(request);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ error: 'Failed to update request status', details: error.message });
    }
});

// Get requests for a user
router.get('/user', isUser, async (req, res) => {
    try {
        const { page = 1, status = 'all' } = req.query;
        const pageSize = 10; // Number of requests per page
        const skip = (page - 1) * pageSize;

        // Build query
        const query = { customer: req.user._id };
        if (status && status !== 'all') {
            query.status = status;
        }

        // Get total count for pagination
        const totalRequests = await Request.countDocuments(query);
        const totalPages = Math.ceil(totalRequests / pageSize);

        // Fetch requests with pagination
        const requests = await Request.find(query)
            .populate('tailor', 'fullname profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);

        res.json({
            requests,
            totalPages,
            currentPage: parseInt(page),
            totalRequests
        });
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({
            error: 'Failed to fetch requests',
            details: error.message
        });
    }
});

module.exports = router; 