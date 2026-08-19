import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);

    const url = "http://localhost:8080" || "http://localhost:8080";
  //  const url = "http://localhost:8080" ;

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("token");

    if (!loggedIn || !token) {
      navigate("/login");
      return;
    }

    const fetchPatient = async () => {
      try {
        const response = await fetch(`${url}/user/patient/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403)
          throw new Error("Forbidden. You do not have access.");
        if (!response.ok) throw new Error("Failed to fetch patient details.");

        const data = await response.json();
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient:", err);
        setError(err.message);
      }
    };

    fetchPatient();
  }, [navigate, id]);

  const handleWhatsApp = () => {
    if (!patient.phone) {
      alert("Patient phone number not available.");
      return;
    }

    const message = `Hello ${patient.name}, I saw your blood requirement on RaktMitra and would like to help.`;
    const whatsappUrl = `https://wa.me/${patient.phone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  if (error)
    return (
      <div className="container py-5">
        <h2 className="text-center text-danger">{error}</h2>
      </div>
    );

  if (!patient)
    return <p className="text-center mt-5">Loading patient info...</p>;

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card shadow border-0 p-4">
        <h2 className="text-danger fw-bold text-center mb-4">
          {patient.name}'s Profile
        </h2>

        <div className="row align-items-center">
          {/* ✅ Image Section */}
          <div className="col-md-5 text-center mb-4">
            {patient.imageUrl ? (
              <img
                src={patient.imageUrl}
                alt={patient.name}
                className="card-img-top"
                style={{
                  height: "300px",
                  width: "70%",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center bg-light text-danger"
                style={{
                  height: "250px",
                  fontSize: "80px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              >
                {patient.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* ✅ Info Section */}
          <div className="col-md-6">
            <p>
              <strong>Gender:</strong> {patient.gender}
            </p>
            <p>
              <strong>Blood Group:</strong> {patient.bloodGroup}
            </p>
            <p>
              <strong>Phone:</strong> {patient.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {patient.address}
            </p>

            {/* ✅ WhatsApp Button */}
            {patient.phone && (
              <button
                className="btn btn-success mt-3"
                onClick={handleWhatsApp}
                style={{ width: "100%", maxWidth: "250px" }}
              >
                 Contact via WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
