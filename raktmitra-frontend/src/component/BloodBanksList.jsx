import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert, Container, Row, Col, Form } from "react-bootstrap";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

const BloodBanksList = () => {
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const url = "http://localhost:8080" || "http://localhost:8080";

  const statesOfIndia = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
    "Jammu and Kashmir","Ladakh","Pondicherry","Chandigarh","Andaman & Nicobar",
    "Daman & Diu","Lakshadweep"
  ];

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`${url}/banks`);
        if (!response.ok) throw new Error(`Error ${response.status}: Unable to fetch banks`);
        const data = await response.json();
        setBanks(data);
        setFilteredBanks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBanks();
  }, []);

  // Apply filters
  useEffect(() => {
    let temp = banks;
    if (city) temp = temp.filter((b) => b.city?.toLowerCase().includes(city.toLowerCase()));
    if (state) temp = temp.filter((b) => b.state?.toLowerCase() === state.toLowerCase());
    setFilteredBanks(temp);
  }, [city, state, banks]);

  if (loading) return (
    <div className="text-center mt-5">
      <Spinner animation="border" variant="danger" />
      <p className="mt-2">Loading blood banks...</p>
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="m-3 text-center">
      {error}
    </Alert>
  );

  return (
    <Container className="my-4">

      {/* === Filter Bar (Responsive) === */}
      <div className="filter-bar shadow-sm mb-4 bg-white rounded p-2">
        <Form>
          <Row className="g-2 d-flex align-items-center flex-wrap">
            <Col xs={12} sm={6} md={6} className="mb-2 mb-sm-0">
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Col>
            <Col xs={12} sm={6} md={6}>
              <Form.Select value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select State</option>
                {statesOfIndia.map((st, index) => (
                  <option key={index} value={st}>{st}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </div>

      {/* === Blood Banks List === */}
      {filteredBanks.length === 0 ? (
        <p className="text-center text-muted">No blood banks found.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {filteredBanks.map((bank, index) => (
            <Col key={bank.id} data-aos="zoom-in" data-aos-delay={index * 100}>
              <Card className="bloodbank-card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="image-container">
                  <img
                    src={bank.imageUrl || "/bank.png"}
                    alt={bank.bankName}
                    className="bank-image"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/bank.png"; }}
                  />
                </div>

                <Card.Body className="p-3 bg-light">
                  <Card.Title className="text-danger fw-bold text-center mb-2">
                    {bank.bankName || "Unnamed Blood Bank"}
                  </Card.Title>
                  <Card.Text className="text-secondary">
                    <div className="d-flex align-items-start mb-2">
                      <FaMapMarkerAlt className="text-danger me-2 mt-1" />
                      <div><strong>Location:</strong> {`${bank.city || "Unknown"}, ${bank.state || ""}`}</div>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaPhoneAlt className="text-danger me-2" />
                      <div><strong>Contact:</strong> {bank.phone || "N/A"}</div>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* === Styles === */}
      <style>{`
        .filter-bar {
          position: sticky;
          top: 70px;
          z-index: 1000;
        }
        .bloodbank-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #fff;
          height: 270px;
        }
        .bloodbank-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 18px rgba(220, 53, 69, 0.25);
        }
        .image-container {
          height: 110px;
          background: linear-gradient(135deg, #fff0f0, #ffe5e5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bank-image {
          width: 60%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .bloodbank-card:hover .bank-image {
          transform: scale(1.05);
        }
      `}</style>
      <br />
    </Container>
  );
};

export default BloodBanksList;
