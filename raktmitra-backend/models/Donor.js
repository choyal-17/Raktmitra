const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  phone:      { type: String, required: true },
  bloodGroup: { type: String, required: true, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
  city:       { type: String, required: true },
  state:      { type: String, required: true },
  age:        { type: Number },
  gender:     { type: String, enum: ['Male','Female','Other'] },
  address:    { type: String },
  isAvailable: { type: Boolean, default: true },
  lastDonatedAt: { type: Date },
  totalDonations: { type: Number, default: 0 },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);
