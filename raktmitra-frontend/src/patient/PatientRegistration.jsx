import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Image,
} from "react-bootstrap";

const PatientRegistration = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const url = "http://localhost:8080";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    bloodGroup: "",
    gender: "",
    city: "",
    state: "",
  });

  const bloodGroups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];

  // Fetch logged-in user's details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${url}/user/details`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();

          setFormData((prev) => ({
            ...prev,
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.dob ||
      !formData.bloodGroup ||
      !formData.gender ||
      !formData.city ||
      !formData.state
    ) {
      setMessage("Please fill in all required fields.");
      setMessageType("danger");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Send JSON data
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob,
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
      };

      const response = await fetch(`${url}/user/patient/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Patient registration successful!");
        setMessageType("success");

        setTimeout(() => {
          navigate("/submit", {
            state: {
              patient: data.patient || data,
            },
          });
        }, 1000);
      } else {
        setMessage(
          data.message || "Registration failed. Please try again."
        );
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error submitting patient data:", error);

      setMessage("Network error. Please try again.");
      setMessageType("danger");
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow border-0">

        <Card.Header className="bg-danger text-white text-center">
          <h2 className="mb-0">Patient Registration</h2>
        </Card.Header>

        <Card.Body className="p-4">

          {message && (
            <Alert variant={messageType} className="mb-4 text-center">
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            {/* Name + Email */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient Name *</Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Phone + DOB */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>

                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth *</Form.Label>

                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Blood Group + Gender */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Blood Group *</Form.Label>

                  <Form.Select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Blood Group</option>

                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender *</Form.Label>

                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* City + State */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>

                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State *</Form.Label>

                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Image */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Upload Image</Form.Label>

                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="text-center">
                {preview && (
                  <Image
                    src={preview}
                    alt="Preview"
                    fluid
                    rounded
                    style={{
                      maxHeight: "150px",
                      border: "1px solid #ccc",
                    }}
                  />
                )}
              </Col>
            </Row>

            {/* Address */}
            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>

              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit */}
            <div className="text-center mt-4">
              <Button
                type="submit"
                variant="danger"
                size="lg"
                className="px-5"
              >
                Register
              </Button>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PatientRegistration;