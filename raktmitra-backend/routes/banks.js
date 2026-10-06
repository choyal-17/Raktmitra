const router = require("express").Router();

const BloodBank = require("../models/BloodBank");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// ================= PUBLIC =================

// GET /banks
router.get("/banks", async (req, res) => {
  try {
    const banks = await BloodBank.find().sort({ name: 1 });

    res.json(banks);
  } catch (err) {
    console.error("Get banks error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= ADMIN =================

// GET /admin/banks
router.get("/admin/banks", auth, admin, async (req, res) => {
  try {
    const banks = await BloodBank.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      banks,
    });
  } catch (err) {
    console.error("Get admin banks error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// POST /admin/add
router.post("/admin/add", auth, admin, async (req, res) => {
  try {
    const {
      name,
      city,
      state,
      phone,
      address,
      email,
    } = req.body;

    if (!name || !city || !state || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const bank = await BloodBank.create({
      name,
      city,
      state,
      phone,
      address,
      email,
    });

    res.status(201).json({
      success: true,
      message: "Blood bank added successfully",
      bank,
    });
  } catch (err) {
    console.error("Add bank error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE /admin/delete/:id
router.delete("/admin/delete/:id", auth, admin, async (req, res) => {
  try {
    const bank = await BloodBank.findByIdAndDelete(req.params.id);

    if (!bank) {
      return res.status(404).json({
        success: false,
        message: "Blood bank not found",
      });
    }

    res.json({
      success: true,
      message: "Blood bank deleted successfully",
    });
  } catch (err) {
    console.error("Delete bank error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;