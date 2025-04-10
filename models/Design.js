const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Design'
    },
    images: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Design = mongoose.model('Design', designSchema);

module.exports = Design; 