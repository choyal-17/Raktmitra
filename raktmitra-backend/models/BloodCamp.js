const mongoose = require('mongoose');

const bloodCampSchema = new mongoose.Schema(
  {
    organizer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true },
    description: { type: String },
    venue:       { type: String, required: true },
    city:        { type: String, required: true },
    state:       { type: String, required: true },
    date:        { type: Date, required: true },
    startTime:   { type: String, required: true },
    endTime:     { type: String, required: true },
    contactPhone: { type: String, required: true },
    targetUnits: { type: Number },
    registeredDonors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodCamp', bloodCampSchema);
