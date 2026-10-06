const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middleware/auth");

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  bloodGroup: user.bloodGroup,
  city: user.city,
  state: user.state,
  age: user.age,
  gender: user.gender,
  role: user.role,
  isAvailable: user.isAvailable,
});


// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      bloodGroup,
      city,
      state,
      age,
      gender,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !bloodGroup ||
      !city ||
      !state
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bloodGroup,
      city,
      state,
      age,
      gender,
      role: "USER",
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: sanitize(user),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ================= LOGIN =================

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: sanitize(user),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ================= CURRENT USER =================

router.get("/user/details", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ================= UPDATE USER =================

router.put("/update", auth, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "city",
      "state",
      "age",
      "gender",
      "isAvailable",
      "lastDonatedAt",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;