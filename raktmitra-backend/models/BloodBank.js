const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  city:    { type: String, required: true },
  state:   { type: String, required: true },
  phone:   { type: String },
  address: { type: String },
  email:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('BloodBank', bloodBankSchema);
