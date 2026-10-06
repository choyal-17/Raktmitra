import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= LOGIN =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("Login Response:", data);

      // Backend error
      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      // Backend success
      if (!data.success || !data.token || !data.user) {
        throw new Error(data.message || "Login failed");
      }

      // ================= SAVE LOGIN DATA =================

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "role",
        data.user.role || "USER"
      );

      setMessage("✅ Login successful!");

      // ================= REDIRECT =================

      setTimeout(() => {
        if (data.user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/user/home");
        }
      }, 500);
    } catch (error) {
      console.error("Login Error:", error);

      setMessage(
        error.message || "Server error, please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "80vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="card shadow p-4 login-card position-relative"
        style={{
          width: "350px",
        }}
      >
        <h2 className="text-center text-danger fw-bold mb-3">
          RaktMitra Login
        </h2>

        <p className="text-center text-muted">
          वो दोस्ती जो ज़िंदगी बचाए
        </p>

        {message && (
          <p
            className="text-center mt-2"
            style={{
              color: message.includes("✅")
                ? "green"
                : "red",
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control mb-3"
            placeholder="Email"
            required
          />

          {/* PASSWORD */}

          <div className="position-relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />

            <span
              className="position-absolute"
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#555",
              }}
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER */}

        <div className="text-center mt-3">
          <small>
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-danger fw-bold"
            >
              Register
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;