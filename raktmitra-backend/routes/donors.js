const router = require("express").Router();

const Donor = require("../models/Donor");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// ==========================================
// GET /user/donor - list all donors
// Public route
// ==========================================
router.get("/user/donor", async (req, res) => {
  try {
    const { bloodGroup, city, state } = req.query;

    const filter = {};

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    if (city) {
      filter.city = new RegExp(city, "i");
    }

    if (state) {
      filter.state = new RegExp(state, "i");
    }

    const donors = await Donor.find(filter).sort({ createdAt: -1 });

    res.json(donors);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================================
// GET /user/donor/:id
// Get donor by ID or email
// Public route
// ==========================================
router.get("/user/donor/:id", async (req, res) => {
  try {
    const value = req.params.id;

    const donor = await Donor.findOne({
      $or: [
        {
          _id: /^[a-f\d]{24}$/i.test(value) ? value : null,
        },
        {
          email: value,
        },
      ],
    });

    if (!donor) {
      return res.status(404).json({
        message: "Donor not found",
      });
    }

    res.json(donor);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================================
// GET /user/check-email
// Check donor email
// Public route
// ==========================================
router.get("/user/check-email", async (req, res) => {
  try {
    const { email } = req.query;

    const donor = await Donor.findOne({ email });

    res.json({
      exists: !!donor,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================================
// POST /user/register
// Register as donor
// Protected route
// ==========================================
router.post("/user/register", auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      dob,
      age,
      weight,
      gender,
      bloodGroup,
      foodPreference,
      smokingStatus,
      alcoholConsumption,
    } = req.body;

    const existing = await Donor.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already registered as donor",
      });
    }

    const donor = await Donor.create({
      name,
      email,
      phone,
      address,
      city,
      state,
      dob,
      age,
      weight,
      gender,
      bloodGroup,
      foodPreference,
      smokingStatus,
      alcoholConsumption,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Donor registered successfully",
      donor,
    });
  } catch (err) {
    console.error("Donor registration error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// GET /admin/donors
router.get("/admin/donors", auth, admin, async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      donors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET /admin/donors/:id
router.get("/admin/donors/:id", auth, admin, async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.json({
      success: true,
      donor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE /admin/delete/:id
router.delete("/admin/delete/:id", auth, admin, async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found",
      });
    }

    res.json({
      success: true,
      message: "Donor deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;