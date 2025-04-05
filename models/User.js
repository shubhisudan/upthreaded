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

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log('Comparing passwords in User model');
  console.log('Stored password hash:', this.password);
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log('Password comparison result:', isMatch);
  return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

