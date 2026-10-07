import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerify = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    if (otp.length !== 6) {
      setMessage("Please enter a 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/verify-email`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Verification failed"
        );
      }

      setMessage(
        "✅ Email verified successfully!"
      );

      // Go to login

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(
        "Verify Email Error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to verify email."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResend = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setResendLoading(true);

      setMessage("");

      const response = await fetch(
        `${API_URL}/resend-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to resend OTP"
        );
      }

      setMessage(
        "✅ New OTP sent to your email."
      );
    } catch (error) {
      setMessage(
        error.message ||
          "Unable to resend OTP."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "80vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="card shadow p-4"
        style={{
          width: "400px",
        }}
      >
        <h2 className="text-center text-danger fw-bold">
          Verify Email
        </h2>

        <p className="text-center text-muted">
          Enter the OTP sent to your email
        </p>

        {message && (
          <div className="alert alert-info text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleVerify}>
          {/* EMAIL */}

          <div className="mb-3">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          {/* OTP */}

          <div className="mb-3">
            <label className="form-label">
              Verification OTP
            </label>

            <input
              type="text"
              className="form-control text-center"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              maxLength={6}
              required
            />
          </div>

          {/* VERIFY */}

          <button
            type="submit"
            className="btn btn-danger w-100"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>
        </form>

        {/* RESEND */}

        <button
          type="button"
          className="btn btn-outline-danger w-100 mt-3"
          onClick={handleResend}
          disabled={resendLoading}
        >
          {resendLoading
            ? "Sending..."
            : "Resend OTP"}
        </button>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-link text-danger"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;