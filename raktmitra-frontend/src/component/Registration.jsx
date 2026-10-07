import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = "http://localhost:8080";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    bloodGroup: "",
    city: "",
    state: "",
    age: "",
    gender: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Password validation
    if (
      formData.password.length < 8 ||
      formData.password.length > 12
    ) {
      setMessage(
        "Password must be between 8 and 12 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const email = formData.email
        .trim()
        .toLowerCase();

      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),

            email: email,

            phone: formData.phone.trim(),

            password: formData.password,

            bloodGroup: formData.bloodGroup,

            city: formData.city.trim(),

            state: formData.state.trim(),

            age: formData.age
              ? Number(formData.age)
              : undefined,

            gender:
              formData.gender || undefined,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Registration Response:",
        data
      );

      // =================================================
      // ERROR RESPONSE
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Registration failed"
        );
      }

      // =================================================
      // OTP SENT SUCCESSFULLY
      // =================================================

      if (
        data.success &&
        data.emailVerificationRequired
      ) {
        setMessage(
          "✅ OTP sent to your email. Please verify your email."
        );

        setTimeout(() => {
          navigate("/verify-email", {
            state: {
              email: email,
            },
          });
        }, 800);

        return;
      }

      setMessage(
        data.message ||
          "Registration failed"
      );

    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      setMessage(
        error.message ||
          "Server error. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="container my-4">

      <div
        className="card shadow p-4 rounded-3 mx-auto"
        style={{
          maxWidth: "450px",
          width: "90%",
        }}
      >

        <h2 className="text-center mb-3 text-danger fw-bold">
          RaktMitra Registration
        </h2>

        <p className="text-center text-muted">
          वो दोस्ती जो ज़िंदगी बचाए
        </p>

        {/* MESSAGE */}

        {message && (
          <div className="alert alert-info text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PHONE */}

          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* BLOOD GROUP */}

          <div className="mb-3">
            <select
              className="form-select"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Blood Group
              </option>

              {[
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
              ].map((bg) => (
                <option
                  key={bg}
                  value={bg}
                >
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* CITY */}

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          {/* STATE */}

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          {/* AGE */}

          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              name="age"
              placeholder="Age (optional)"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="65"
            />
          </div>

          {/* GENDER */}

          <div className="mb-3">
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">
                Select Gender (optional)
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* PASSWORD */}

          <div className="mb-3 position-relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              className="form-control"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={12}
            />

            <small className="text-muted">
              Password must be 8–12 characters long.
            </small>

            <span
              className="position-absolute"
              style={{
                top: "20px",
                right: "10px",
                cursor: "pointer",
                color: "#555",
              }}
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>

          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading
              ? "Sending OTP..."
              : "Register"}
          </button>

        </form>
      </div>

      {/* LOGIN LINK */}

      <div className="text-center mt-3">
        <small>
          Already have an account?{" "}

          <a
            href="/login"
            className="text-danger fw-bold"
          >
            Login
          </a>
        </small>
      </div>

      <br />

    </div>
  );
};

export default Registration;