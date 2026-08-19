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
  FaTransgender,
  FaBirthdayCake,
  FaArrowLeft,
  FaTrashAlt,
} from "react-icons/fa";

const ViewPatient = () => {
  const [patients, setPatients] = useState([]);
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

    const fetchPatients = async () => {
      try {
        const response = await fetch(`${url}/admin/patients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Unable to fetch patients`);
        }

        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [navigate, url]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/admin/patient/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete patient (Status: ${response.status})`);
      }

      // Remove deleted patient from UI
      setPatients((prev) => prev.filter((p) => p.id !== id));
      alert("Patient deleted successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const getInitial = (name) => {
    if (!name) return "P";
    return name.charAt(0).toUpperCase();
  };

  // Loading State
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-2">Loading patients...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <Alert variant="danger" className="m-3 text-center">
        {error}
      </Alert>
    );
  }

  // Main UI
  return (
    <Container className="mt-4">
      {/* === Back Button === */}
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

      {patients.length === 0 ? (
        <Alert variant="info" className="text-center">
          No patients found in the system.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {patients.map((patient) => (
            <Col key={patient.id}>
              <Card className="patient-card shadow-lg h-100 border-0 rounded-4">
                {/* === Patient Initial Circle === */}
                <div className="image-container">
                  <div className="patient-initial-circle">
                    {getInitial(patient.name)}
                  </div>
                </div>

                {/* === Patient Details === */}
                <Card.Body className="p-4">
                  <Card.Title className="text-danger fw-bold text-center mb-3">
                    <FaUserAlt className="me-2 text-secondary" />
                    {patient.name || "Anonymous Patient"}
                  </Card.Title>

                  <Card.Text className="text-secondary">
                    <div className="d-flex align-items-center mb-2">
                      <FaTint className="text-danger me-2" />
                      <strong>Blood Group:</strong>{" "}
                      <Badge bg="danger" className="ms-2">
                        {patient.bloodGroup || "N/A"}
                      </Badge>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <FaTransgender className="text-danger me-2" />
                      <strong>Gender:</strong> {patient.gender || "N/A"}
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <FaBirthdayCake className="text-danger me-2" />
                      <strong>DOB:</strong> {patient.dob || "N/A"}
                    </div>

                    <div className="d-flex align-items-start mb-2">
                      <FaMapMarkerAlt className="text-danger me-2 mt-1" />
                      <div>
                        <strong>Address:</strong> {patient.address || "Unknown"}
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <FaPhoneAlt className="text-danger me-2" />
                      <div>
                        <strong>Contact:</strong>{" "}
                        {patient.phone || "Not Provided"}
                      </div>
                    </div>
                  </Card.Text>

                  {/* === Delete Button === */}
                  <div className="text-center mt-3">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(patient.id)}
                    >
                      <FaTrashAlt className="me-2" />
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* === CSS Styling === */}
      <style>
        {`
          .patient-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .patient-card:hover {
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

          .patient-initial-circle {
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

export default ViewPatient;
