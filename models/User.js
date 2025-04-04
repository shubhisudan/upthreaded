const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'tailor'],
    default: 'user'
  },
  // Additional profile fields
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: '/images/default-profile.png'
  },
  specialties: {
    type: [String],
    default: []
  },
  priceRange: {
    type: String,
    default: ''
  },
  designs: {
    type: [{
      imageUrl: String,
      title: String
    }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

