const mongoose = require('mongoose');
const Request = require('../models/Request');
const Order = require('../models/Order');
require('dotenv').config();

async function migrateRequestsToOrders() {
    try {
        // Connect to MongoDB Atlas
        const MONGODB_URI = process.env.ATLAS_URI;
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB Atlas');

        // Find all accepted requests
        const acceptedRequests = await Request.find({ status: 'accepted' });

        console.log(`Found ${acceptedRequests.length} accepted requests to migrate`);

        // Create orders for each accepted request
        for (const request of acceptedRequests) {
            try {
                // Check if order already exists for this request
                const existingOrder = await Order.findOne({ requestId: request._id });
                if (existingOrder) {
                    console.log(`Order already exists for request ${request._id}, skipping...`);
                    continue;
                }

                // Create new order
                const order = new Order({
                    requestId: request._id,
                    userId: request.customer,
                    tailorId: request.tailor,
                    description: request.description,
                    priceRange: request.priceRange,
                    location: request.location,
                    images: request.images,
                    status: 'in-progress', // Set initial status
                    createdAt: request.createdAt,
                    updatedAt: new Date()
                });

                // Save the order
                await order.save();
                console.log(`Created order for request ${request._id}`);

            } catch (error) {
                console.error(`Error processing request ${request._id}:`, error);
            }
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the migration
migrateRequestsToOrders(); 