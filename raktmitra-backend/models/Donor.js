const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
    },

    dob: {
      type: Date,
    },

    weight: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    address: {
      type: String,
      trim: true,
    },

    foodPreference: {
      type: String,
      enum: ["vegetarian", "non-vegetarian"],
      default: "vegetarian",
    },

    smokingStatus: {
      type: String,
      enum: ["no", "occasional", "regular"],
      default: "no",
    },

    alcoholConsumption: {
      type: String,
      enum: ["no", "occasional", "regular"],
      default: "no",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    lastDonatedAt: {
      type: Date,
    },

    totalDonations: {
      type: Number,
      default: 0,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donor", donorSchema);