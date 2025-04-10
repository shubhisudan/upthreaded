const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const Design = require('../models/Design');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'df0jikbzb',
    api_key: '259449875815954',
    api_secret: '-zJhaaLKLcmboY5RI-0ww8jHdgY',
    secure: true
});

// Connect to MongoDB
mongoose.connect(process.env.ATLAS_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        migrateDesigns();
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });

async function migrateDesigns() {
    try {
        // Find all designs with local URLs
        const designs = await Design.find({ imageUrl: { $regex: '^/uploads/' } });
        console.log(`Found ${designs.length} designs to migrate`);

        for (const design of designs) {
            try {
                // Get the local file path
                const filePath = path.join(__dirname, '..', 'public', design.imageUrl);

                if (fs.existsSync(filePath)) {
                    console.log(`Uploading ${filePath} to Cloudinary...`);

                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(filePath, {
                        folder: 'upthreaded/design-images',
                        public_id: `${design.userId}-${Date.now()}`
                    });

                    // Update the design with Cloudinary URL
                    design.imageUrl = result.secure_url;
                    await design.save();
                    console.log(`Updated design ${design._id} with Cloudinary URL: ${result.secure_url}`);

                    // Delete the local file
                    fs.unlinkSync(filePath);
                    console.log(`Deleted local file: ${filePath}`);
                } else {
                    console.log(`File not found: ${filePath}`);
                }
            } catch (error) {
                console.error(`Error migrating design ${design._id}:`, error);
            }
        }

        console.log('Migration completed');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
} 