const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const auth = require("../middleware/auth");

// ================= EMAIL TRANSPORTER =================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= GENERATE OTP =================

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= SANITIZE USER =================

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
  isEmailVerified: user.isEmailVerified,
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

    // Required fields
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
        success: false,
        message: "Please provide all required fields",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    // OTP valid for 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      bloodGroup,
      city,
      state,
      age,
      gender,
      role: "USER",

      isEmailVerified: false,
      emailOtp: otp,
      emailOtpExpires: otpExpires,
    });

    // Send OTP email
    try {
      await transporter.sendMail({
        from: `"RaktMitra" <${process.env.EMAIL_USER}>`,
        to: normalizedEmail,
        subject: "RaktMitra - Email Verification OTP",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
          ">

            <h2 style="color: #dc3545;">
              Welcome to RaktMitra ❤️
            </h2>

            <p>Hello <strong>${name}</strong>,</p>

            <p>
              Thank you for registering with RaktMitra.
              Please verify your email address using the OTP below:
            </p>

            <div style="
              text-align: center;
              margin: 30px 0;
            ">
              <span style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                background: #f5f5f5;
                padding: 15px 25px;
                border-radius: 8px;
              ">
                ${otp}
              </span>
            </div>

            <p>
              This OTP is valid for <strong>10 minutes</strong>.
            </p>

            <p>
              Please do not share this OTP with anyone.
            </p>

            <br>

            <p>
              Regards,<br>
              <strong>RaktMitra Team</strong>
            </p>

          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      // Delete user if email could not be sent
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        success: false,
        message: "Unable to send verification email. Please try again.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= VERIFY EMAIL =================

router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // OTP missing
    if (!user.emailOtp || !user.emailOtpExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // OTP expired
    if (user.emailOtpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Wrong OTP
    if (user.emailOtp !== otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Verify email
    user.isEmailVerified = true;

    // Remove OTP after successful verification
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= RESEND OTP =================

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    user.emailOtp = otp;
    user.emailOtpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    // Send new OTP
    await transporter.sendMail({
      from: `"RaktMitra" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "RaktMitra - New Verification OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
        ">

          <h2>RaktMitra Email Verification</h2>

          <p>Your new verification OTP is:</p>

          <h1 style="
            letter-spacing: 8px;
            text-align: center;
          ">
            ${otp}
          </h1>

          <p>
            This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <p>
            Please do not share this OTP with anyone.
          </p>

        </div>
      `,
    });

    res.json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to resend OTP",
    });
  }
});

// ================= LOGIN =================

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
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

    // Check email verification
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // Generate JWT
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
    console.error("Login error:", error);

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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;