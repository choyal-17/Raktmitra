import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const url = "http://localhost:8080";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 8 || formData.password.length > 12) {
      setMessage("Password must be between 8 and 12 characters.");
      return;
    }

    fetch(`${url}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) return res.text().then((text) => Promise.reject(text));
        return res.json();
      })
      .then(() => {
        setMessage("Registration successful!");
        navigate("/login");
      })
      .catch((err) => {
        setMessage("Error: " + err);
      });
  };

  return (
    <div className="container my-4">
      <div
        className="card shadow p-4 rounded-3 mx-auto"
        style={{ maxWidth: "450px", width: "90%" }}
      >
        <h2 className="text-center mb-3 text-danger fw-bold">
          RaktMitra Registration
        </h2>
        <p className="text-center text-muted">वो दोस्ती जो ज़िंदगी बचाए</p>

        {message && (
          <div className="alert alert-info text-center">{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
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

          {/* Email */}
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

          {/* Phone */}
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

          {/* Blood Group */}
          <div className="mb-3">
            <select
              className="form-select"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          {/* City */}
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

          {/* State */}
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

          {/* Age (optional) */}
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              name="age"
              placeholder="Age (optional)"
              value={formData.age}
              onChange={handleChange}
              min={18}
              max={65}
            />
          </div>

          {/* Gender (optional) */}
          <div className="mb-3">
            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender (optional)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={12}
            />
            <small className="text-muted">Password must be 8–12 characters long.</small>
            <span
              className="position-absolute"
              style={{
                top: "25%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="btn btn-danger w-100">
            Register
          </button>
        </form>
      </div>

      <div className="text-center mt-3">
        <small>
          Already have an account?{" "}
          <a href="/login" className="text-danger fw-bold">
            Login
          </a>
        </small>
      </div>
      <br />
    </div>
  );
};

export default Registration;
