const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String },
  phone:      { type: String, required: true },
  bloodGroup: { type: String, required: true, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
  city:       { type: String, required: true },
  state:      { type: String, required: true },
  hospital:   { type: String },
  units:      { type: Number, default: 1 },
  urgency:    { type: String, enum: ['Normal','Urgent','Critical'], default: 'Normal' },
  status:     { type: String, enum: ['Open','Fulfilled','Closed'], default: 'Open' },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
