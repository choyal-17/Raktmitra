const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    password:  { type: String, required: true },
    phone:     { type: String, required: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    city:      { type: String, required: true },
    state:     { type: String, required: true },
    age:       { type: Number },
    gender:    { type: String, enum: ['Male', 'Female', 'Other'] },
    isAvailable:    { type: Boolean, default: true },   // willing to donate
    lastDonatedAt:  { type: Date },
    totalDonations: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
