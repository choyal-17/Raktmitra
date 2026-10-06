const router = require("express").Router();

const Patient = require("../models/Patient");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// ==========================================
// GET /user/patients
// List all patients
// Public route
// ==========================================
router.get("/user/patients", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.json(patients);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================================
// GET /user/patient/:id
// Get patient by ID
// Public route
// ==========================================
router.get("/user/patient/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================================
// POST /user/patient/register
// Register patient
// Protected route
// ==========================================
router.post("/user/patient/register", auth, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dob,
      gender,
      bloodGroup,
      city,
      state,
      hospital,
      units,
      urgency,
    } = req.body;

    const patient = await Patient.create({
      name,
      email,
      phone,
      address,
      dob,
      gender,
      bloodGroup,
      city,
      state,
      hospital,
      units,
      urgency,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      patient,
    });
  } catch (err) {
    console.error("Patient registration error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// GET /admin/patients
router.get("/admin/patients", auth, admin, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      patients,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET /admin/patient/:id
router.get("/admin/patient/:id", auth, admin, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;