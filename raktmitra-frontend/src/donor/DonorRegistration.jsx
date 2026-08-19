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
  Spinner,
} from "react-bootstrap";
import { CiTrophy } from "react-icons/ci";

const DonorRegistration = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [loadingEmailCheck, setLoadingEmailCheck] = useState(false);

    const url = "http://localhost:8080" || "http://localhost:8080";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    dob: "",
    weight: "",
    gender: "",
    bloodGroup: "",
    foodPreference: "vegetarian",
    smokingStatus: "no",
    alcoholConsumption: "no",
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
  ];

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
          headers: { Authorization: `Bearer ${token}` },
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
  }, [navigate, url]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "dob",
      "weight",
      "gender",
      "bloodGroup",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setMessage("Please fill in all required fields.");
        setMessageType("danger");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setLoadingEmailCheck(true);
      const emailCheckResponse = await fetch(`${url}/user/check-email?email=${formData.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const emailCheckData = await emailCheckResponse.json();
      setLoadingEmailCheck(false);

      if (emailCheckData.exists) {
        setMessage("Donor already exists with this email.");
        setMessageType("danger");
        return;
      }

      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      if (image) dataToSend.append("image", image);

      const response = await fetch(`${url}/user/register`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        setMessageType("success");
        setTimeout(() => {
          navigate("/submit", { state: { donor: data } });
        }, 1000);
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Network error. Please try again.");
      setMessageType("danger");
      setLoadingEmailCheck(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow border-0">
        <Card.Header className="bg-danger text-white text-center">
          <h2 className="mb-0">Donor Registration</h2>
          <p className="mb-0 mt-2">Join our life-saving community</p>
        </Card.Header>

        <Card.Body className="p-4">
          {message && (
            <Alert variant={messageType} className="mb-4 text-center">
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4 text-center">
              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="Profile Preview"
                    width="120"
                    height="120"
                    className="rounded-circle border shadow-sm"
                  />
                </div>
              )}
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Donor Name *</Form.Label>
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
                    onChange={handleChange}
                    required
                    readOnly={!!formData.email}
                  />
                  {loadingEmailCheck && <Spinner animation="border" size="sm" />}
                </Form.Group>
              </Col>
            </Row>

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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weight *</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

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

            {/* City + State Together */}
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
                  <Form.Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

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
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Food Preference *</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Vegetarian"
                      name="foodPreference"
                      value="vegetarian"
                      checked={formData.foodPreference === "vegetarian"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Non-Vegetarian"
                      name="foodPreference"
                      value="non-vegetarian"
                      checked={formData.foodPreference === "non-vegetarian"}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Smoking Status</Form.Label>
                  <Form.Select
                    name="smokingStatus"
                    value={formData.smokingStatus}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="occasional">Occasional</option>
                    <option value="regular">Regular</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alcohol Consumption</Form.Label>
                  <Form.Select
                    name="alcoholConsumption"
                    value={formData.alcoholConsumption}
                    onChange={handleChange}
                  >
                    <option value="no">No</option>
                    <option value="occasional">Occasional</option>
                    <option value="regular">Regular</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <Button type="submit" variant="danger" size="lg" className="px-5">
                Register
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <br />
    </Container>
  );
};

export default DonorRegistration;
