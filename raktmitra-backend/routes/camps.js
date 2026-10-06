const router = require("express").Router();
const BloodCamp = require("../models/BloodCamp");
const auth = require("../middleware/auth");

// ================= GET ALL CAMPS =================

// GET /api/camps?city=Indore&upcoming=true
router.get("/", async (req, res) => {
  try {
    const {
      city,
      state,
      upcoming,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (city) {
      filter.city = new RegExp(city, "i");
    }

    if (state) {
      filter.state = new RegExp(state, "i");
    }

    if (upcoming === "true") {
      filter.date = { $gte: new Date() };
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const camps = await BloodCamp.find(filter)
      .populate("organizer", "name phone email")
      .sort({ date: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await BloodCamp.countDocuments(filter);

    res.json({
      success: true,
      camps,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    console.error("Get camps error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= GET SINGLE CAMP =================

// GET /api/camps/:id
router.get("/:id", async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id)
      .populate("organizer", "name phone email")
      .populate("registeredDonors", "name bloodGroup city");

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    res.json({
      success: true,
      camp,
    });
  } catch (err) {
    console.error("Get camp error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= CREATE CAMP =================

// POST /api/camps
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      venue,
      city,
      state,
      date,
      startTime,
      endTime,
      contactPhone,
      targetUnits,
    } = req.body;

    if (
      !title ||
      !venue ||
      !city ||
      !state ||
      !date ||
      !startTime ||
      !endTime ||
      !contactPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const camp = await BloodCamp.create({
      organizer: req.user._id,
      title,
      description,
      venue,
      city,
      state,
      date,
      startTime,
      endTime,
      contactPhone,
      targetUnits,
    });

    res.status(201).json({
      success: true,
      message: "Blood camp created successfully",
      camp,
    });
  } catch (err) {
    console.error("Create camp error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= REGISTER FOR CAMP =================

// POST /api/camps/:id/register
router.post("/:id/register", auth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    const alreadyRegistered = camp.registeredDonors.some(
      (donorId) => donorId.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this camp",
      });
    }

    camp.registeredDonors.push(req.user._id);

    await camp.save();

    res.json({
      success: true,
      message: "Registered successfully",
      registeredCount: camp.registeredDonors.length,
    });
  } catch (err) {
    console.error("Camp registration error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= UNREGISTER FROM CAMP =================

// DELETE /api/camps/:id/register
router.delete("/:id/register", auth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    const oldCount = camp.registeredDonors.length;

    camp.registeredDonors = camp.registeredDonors.filter(
      (donorId) => donorId.toString() !== req.user._id.toString()
    );

    if (camp.registeredDonors.length === oldCount) {
      return res.status(400).json({
        success: false,
        message: "You are not registered for this camp",
      });
    }

    await camp.save();

    res.json({
      success: true,
      message: "Unregistered successfully",
      registeredCount: camp.registeredDonors.length,
    });
  } catch (err) {
    console.error("Camp unregister error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= DELETE OWN CAMP =================

// DELETE /api/camps/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);

    if (!camp) {
      return res.status(404).json({
        success: false,
        message: "Camp not found",
      });
    }

    if (camp.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this camp",
      });
    }

    await camp.deleteOne();

    res.json({
      success: true,
      message: "Camp deleted successfully",
    });
  } catch (err) {
    console.error("Delete camp error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;