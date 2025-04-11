const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Request = require('../models/Request');
const { isAuthenticated, isTailor, isUser } = require('../middleware/auth');

// Create order from accepted request
router.post('/from-request/:requestId', isTailor, async (req, res) => {
    try {
        const request = await Request.findById(req.params.requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'accepted') {
            return res.status(400).json({ message: 'Request must be accepted to create an order' });
        }

        if (request.tailorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to create order for this request' });
        }

        const order = new Order({
            requestId: request._id,
            userId: request.userId,
            tailorId: request.tailorId,
            description: request.description,
            priceRange: request.priceRange,
            location: request.location,
            images: request.images
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders for a user
router.get('/user', async (req, res) => {
    try {
        console.log('Session:', req.session);
        console.log('User ID from session:', req.session?.userId);

        // Check if user is logged in
        if (!req.session?.userId) {
            console.log('No user ID in session');
            return res.status(401).json({ error: 'Unauthorized', details: 'Please log in to continue' });
        }

        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        // Build query
        const query = { userId: req.session.userId };
        if (status && status !== 'all') {
            query.status = status;
        }

        console.log('Query:', query);

        // Get total count for pagination
        const total = await Order.countDocuments(query);
        console.log('Total orders:', total);

        // Fetch orders with pagination
        const orders = await Order.find(query)
            .populate('tailorId', 'fullname profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        console.log('Fetched orders:', orders.length);

        res.json({
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ 
            error: 'Failed to fetch orders',
            details: error.message 
        });
    }
});

// Get all orders for a tailor
router.get('/tailor/:tailorId', isAuthenticated, isTailor, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const query = { tailorId: req.params.tailorId };
        if (status && status !== 'all') {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('userId', 'fullname profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error fetching tailor orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update order status
router.patch('/:orderId/status', isAuthenticated, isTailor, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if the tailor is authorized to update this order
        if (order.tailorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this order' });
        }

        // Validate the new status
        const validStatuses = ['in-progress', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status',
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        // Update order status
        order.status = status;
        order.updatedAt = new Date();
        await order.save();

        // Return the updated order
        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            error: 'Failed to update order status',
            message: error.message 
        });
    }
});

// Get order details
router.get('/:orderId', isAuthenticated, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('userId', 'fullname profilePicture')
            .populate('tailorId', 'fullname profilePicture');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.userId._id.toString() !== req.user._id.toString() && 
            order.tailorId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 