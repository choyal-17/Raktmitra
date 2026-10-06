import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DonorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donor, setDonor] = useState(null);
  const [error, setError] = useState(null);

  const url = "http://localhost:8080";

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("token");

    // Check login
    if (!loggedIn || !token) {
      navigate("/login");
      return;
    }

    // Check donor ID
    if (!id || id === "undefined" || id === "null") {
      setError("Donor ID is missing");
      return;
    }

    const fetchDonor = async () => {
      try {
        setError(null);

        const response = await fetch(`${url}/user/donor/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Donor Details Response:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch donor details"
          );
        }

        // Backend response:
        // { success: true, donor: {...} }
        setDonor(data.donor || data);
      } catch (err) {
        console.error("Error fetching donor:", err);
        setError(err.message || "Failed to fetch donor details");
      }
    };

    fetchDonor();
  }, [navigate, id]);

  // Loading
  if (!donor && !error) {
    return (
      <p className="text-center mt-5">
        Loading donor info...
      </p>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">{error}</h2>

        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
    );
  }

  // WhatsApp
  const handleWhatsApp = () => {
    if (!donor.phone) {
      alert("Phone number not available for this donor.");
      return;
    }

    const message = `Hello ${donor.name}, I found your profile on RaktMitra. I need blood of your group (${donor.bloodGroup}). Can we connect? 🙏`;

    const encodedMessage = encodeURIComponent(message);

    let phone = donor.phone.toString().trim();

    // Remove +, spaces, brackets, hyphens etc.
    phone = phone.replace(/[^0-9]/g, "");

    // Indian 10 digit number
    if (phone.length === 10) {
      phone = "91" + phone;
    }

    const waUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    window.location.href = waUrl;
  };

  return (
    <div className="container py-4">

      {/* Back Button */}
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Donor Card */}
      <div className="card shadow border-0 p-4">

        <h2 className="text-danger fw-bold text-center mb-4">
          {donor.name}'s Profile
        </h2>

        <div className="row align-items-center">

          {/* Image */}
          <div className="col-md-5 text-center mb-4">

            {donor.imageUrl ? (
              <img
                src={donor.imageUrl}
                alt={donor.name}
                className="card-img-top"
                style={{
                  height: "300px",
                  width: "70%",
                  borderRadius: "8px",
                  margin: "10px auto 0",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center bg-light text-danger"
                style={{
                  height: "250px",
                  width: "70%",
                  margin: "10px auto 0",
                  fontSize: "80px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                {donor.name?.charAt(0).toUpperCase()}
              </div>
            )}

          </div>

          {/* Details */}
          <div className="col-md-7">

            <div className="mb-3">

              <p>
                <strong>Gender:</strong>{" "}
                {donor.gender || "N/A"}
              </p>

              <p>
                <strong>Blood Group:</strong>{" "}
                {donor.bloodGroup || "N/A"}
              </p>

              <p>
                <strong>Contact:</strong>{" "}
                {donor.phone || "N/A"}
              </p>

              <p>
                <strong>Date of Birth:</strong>{" "}
                {donor.dob
                  ? new Date(donor.dob).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {donor.address || "N/A"}
                {donor.city ? `, ${donor.city}` : ""}
                {donor.state ? `, ${donor.state}` : ""}
              </p>

              <p>
                <strong>Food Preference:</strong>{" "}
                {donor.foodPreference || "N/A"}
              </p>

              <p>
                <strong>Alcohol Consumption:</strong>{" "}
                {donor.alcoholConsumption || "N/A"}
              </p>

              <p>
                <strong>Smoking Status:</strong>{" "}
                {donor.smokingStatus || "N/A"}
              </p>

            </div>

            {/* WhatsApp Button */}
            <button
              className="btn btn-success d-flex align-items-center gap-2 px-4"
              onClick={handleWhatsApp}
            >
              <i className="bi bi-whatsapp fs-5"></i>
              Contact via WhatsApp
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDetails;