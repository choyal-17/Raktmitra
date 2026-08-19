import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Badge,
  Button,
} from "react-bootstrap";
import {
  FaPhoneAlt,
  FaTint,
  FaMapMarkerAlt,
  FaUserAlt,
  FaArrowLeft,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const ViewDonor = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
    const url = "http://localhost:8080" || "http://localhost:8080";
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("token");

    if (!loggedIn || !token) {
      navigate("/login");
      return;
    }

    const fetchDonors = async () => {
      try {
        const response = await fetch(`${url}/admin/donors`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Unable to fetch donors`);
        }

        const data = await response.json();
        setDonors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [navigate]);

  // === DELETE DONOR ===
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${url}/admin/donors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete donor");

      setDonors(donors.filter((donor) => donor.id !== id));
      alert("Donor deleted successfully!");
    } catch (err) {
      alert("Error deleting donor: " + err.message);
    }
  };

  // === TOGGLE STATUS (Active / Inactive) ===
  const handleStatusToggle = async (id, currentStatus) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${url}/admin/donors/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: !currentStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update donor status");

      setDonors(
        donors.map((donor) =>
          donor.id === id ? { ...donor, status: !currentStatus } : donor
        )
      );
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const getInitial = (name) => {
    if (!name) return "D";
    return name.charAt(0).toUpperCase();
  };

  // === LOADING ===
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-2">Loading donors...</p>
      </div>
    );
  }

  // === ERROR ===
  if (error) {
    return (
      <Alert variant="danger" className="m-3 text-center">
        {error}
      </Alert>
    );
  }

  // === MAIN UI ===
  return (
    <Container className="mt-4">
      {/* Back Button */}
      <div className="d-flex justify-content-start mb-3">
        <Button
          variant="outline-danger"
          onClick={() => navigate(-1)}
          className="fw-semibold"
        >
          <FaArrowLeft className="me-2" />
          Back
        </Button>
      </div>

      {/* Title */}
      <h3 className="text-center fw-bold text-danger mb-4">All Donors</h3>

      {donors.length === 0 ? (
        <Alert variant="info" className="text-center">
          No donors found in the system.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {donors.map((donor) => (
            <Col key={donor.id}>
              <Card className="donor-card shadow-lg h-100 border-0 rounded-4">
                {/* Donor Image or Initial */}
                <div className="image-container">
                  {donor.imageUrl ? (
                    <img
                      src={donor.imageUrl}
                      alt="donor"
                      className="donor-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/donor.png";
                      }}
                    />
                  ) : (
                    <div className="donor-initial-circle">
                      {getInitial(donor.name)}
                    </div>
                  )}
                </div>

                {/* Donor Details */}
                <Card.Body className="p-4">
                  <Card.Title className="text-danger fw-bold text-center mb-3">
                    <FaUserAlt className="me-2 text-secondary" />
                    {donor.name || "Anonymous Donor"}
                  </Card.Title>

                  <Card.Text className="text-secondary">
                    <div className="d-flex align-items-center mb-2">
                      <FaTint className="text-danger me-2" />
                      <strong>Blood Group:</strong>{" "}
                      <Badge bg="danger" className="ms-2">
                        {donor.bloodGroup || "N/A"}
                      </Badge>
                    </div>

                    <div className="d-flex align-items-start mb-2">
                      {/* <FaMapMarkerAlt className="text-danger me-2 mt-1" /> */}
                      <div>
                        <strong>Address:</strong> {donor.address || "Unknown"}<br></br>
                        <strong>City:</strong> {donor.city || "Unkonow"}<br></br>
                        <strong>State:</strong> {donor.state}
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <FaPhoneAlt className="text-danger me-2" />
                      <div>
                        <strong>Contact:</strong>{" "}
                        {donor.phone || "Not Provided"}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-3 text-center">
                      <Badge
                        bg={donor.status ? "success" : "secondary"}
                        className="p-2"
                      >
                        {donor.status ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </Card.Text>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant={donor.status ? "outline-secondary" : "outline-success"}
                      size="sm"
                      onClick={() => handleStatusToggle(donor.id, donor.status)}
                    >
                      {donor.status ? (
                        <>
                          <FaTimesCircle className="me-1" /> Deactivate
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="me-1" /> Activate
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(donor.id)}
                    >
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* === Styling === */}
      <style>
        {`
          .donor-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .donor-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
          }

          .image-container {
            height: 150px;
            background-color: #fff5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
            overflow: hidden;
          }

          .donor-image {
            width: 60%;
            height: 100%;
            object-fit: contain;
          }

          .donor-initial-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: #dc3545;
            color: white;
            font-size: 2rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
          }

          .card-title {
            font-size: 1.1rem;
            text-transform: capitalize;
          }

          p, div {
            font-size: 0.95rem;
          }
        `}
      </style>
    </Container>
  );
};

export default ViewDonor;
