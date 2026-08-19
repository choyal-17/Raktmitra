const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    requester:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    bloodGroup:  {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    units:       { type: Number, required: true, min: 1 },
    hospital:    { type: String, required: true },
    city:        { type: String, required: true },
    state:       { type: String, required: true },
    contactPhone: { type: String, required: true },
    urgency:     { type: String, enum: ['Normal', 'Urgent', 'Critical'], default: 'Normal' },
    status:      { type: String, enum: ['Open', 'Fulfilled', 'Closed'], default: 'Open' },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
