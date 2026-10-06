const router = require("express").Router();

const BloodRequest = require("../models/BloodRequest");
const auth = require("../middleware/auth");

// ================= GET ALL REQUESTS =================

// GET /api/requests?bloodGroup=O+&city=Indore&status=Open&page=1
router.get("/", async (req, res) => {
  try {
    const {
      bloodGroup,
      city,
      state,
      status = "Open",
      urgency,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    if (city) {
      filter.city = new RegExp(city, "i");
    }

    if (state) {
      filter.state = new RegExp(state, "i");
    }

    if (urgency) {
      filter.urgency = urgency;
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const requests = await BloodRequest.find(filter)
      .populate("requester", "name phone city")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await BloodRequest.countDocuments(filter);

    res.json({
      success: true,
      requests,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    console.error("Get requests error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= MY REQUESTS =================

// GET /api/requests/my/requests
router.get("/my/requests", auth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      requester: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (err) {
    console.error("Get my requests error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= GET SINGLE REQUEST =================

// GET /api/requests/:id
router.get("/:id", async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate("requester", "name phone city state");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.json({
      success: true,
      request,
    });
  } catch (err) {
    console.error("Get request error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= CREATE REQUEST =================

// POST /api/requests
router.post("/", auth, async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      units,
      hospital,
      city,
      state,
      contactPhone,
      urgency,
      description,
    } = req.body;

    if (
      !patientName ||
      !bloodGroup ||
      !units ||
      !hospital ||
      !city ||
      !state ||
      !contactPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const request = await BloodRequest.create({
      requester: req.user._id,
      patientName,
      bloodGroup,
      units,
      hospital,
      city,
      state,
      contactPhone,
      urgency,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      request,
    });
  } catch (err) {
    console.error("Create request error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= UPDATE OWN REQUEST =================

// PUT /api/requests/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (
      request.requester.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const allowedFields = [
      "patientName",
      "units",
      "hospital",
      "city",
      "state",
      "contactPhone",
      "urgency",
      "description",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        request[field] = req.body[field];
      }
    });

    await request.save();

    res.json({
      success: true,
      message: "Blood request updated successfully",
      request,
    });
  } catch (err) {
    console.error("Update request error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= DELETE OWN REQUEST =================

// DELETE /api/requests/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (
      request.requester.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (err) {
    console.error("Delete request error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;