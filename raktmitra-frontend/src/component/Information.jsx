import React, { useEffect } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaHeartbeat,
  FaUserCheck,
  FaBan,
  FaNotesMedical,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaClock,
  FaHeart,
  FaSyringe,
  FaStethoscope,
  FaUtensils,
  FaWater,
  FaBed,
  FaDumbbell,
  FaTint,
  FaShieldAlt,
  FaAmbulance,
} from "react-icons/fa";

const Information = () => {
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  return (
    <div>
      {/* Inline CSS for animations and custom effects */}
      <style>
        {`
          .info-card {
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .info-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
          }

          .hero-section {
            background: linear-gradient(90deg, #ffe6e6, #fff5f5);
            overflow: hidden;
          }

          li {
            font-size: 0.95rem;
            line-height: 1.6;
          }

          .step-number {
            width: 40px;
            height: 40px;
            background: #dc3545;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
          }

          .blood-type-badge {
            font-size: 0.8rem;
            margin: 2px;
          }

          .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="hero-section py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold text-danger mb-4">
               
                 RaktMitra <h2>वो दोस्ती जो ज़िंदगी बचाए</h2>
              </h1>
              <p className="lead text-dark mb-4">
                Your comprehensive resource for safe and effective blood donation. 
                Learn everything from eligibility criteria to post-donation care.
              </p>
              <Badge bg="danger" className="fs-6 p-3 mb-3">
                 One Donation Can Save Up to 3 Lives 
              </Badge>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="mb-5">
        {/* ===== Quick Stats ===== */}
        <Row className="mb-5" data-aos="fade-up">
          <Col>
            <Card className="stat-card border-0 shadow">
              <Card.Body className="text-center py-4">
                <Row>
                  <Col md={3}>
                    <h3 className="fw-bold">1200+</h3>
                    <p className="mb-0">Blood Donations Needed Daily</p>
                  </Col>
                  <Col md={3}>
                    <h3 className="fw-bold">1 in 7</h3>
                    <p className="mb-0">Patients Need Transfusion</p>
                  </Col>
                  <Col md={3}>
                    <h3 className="fw-bold">15 mins</h3>
                    <p className="mb-0">Average Donation Time</p>
                  </Col>
                  <Col md={3}>
                    <h3 className="fw-bold">3 Lives</h3>
                    <p className="mb-0">Saved Per Donation</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Eligibility & Restrictions ===== */}
        <Row className="g-4">
          <Col md={6} data-aos="fade-up">
            <Card className="shadow-lg border-0 h-100 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="text-success fw-bold">
                  <FaUserCheck className="me-2" /> Who Can Donate
                </Card.Title>
                <ul className="mt-3">
                  <li>Age: <strong>18–65 years</strong> (16-17 with parental consent in some regions)</li>
                  <li>Weight: <strong>Above 50 kg</strong> (110 lbs)</li>
                  <li>Hemoglobin: <strong>12.5 g/dl or more</strong> for women, <strong>13.0 g/dl</strong> for men</li>
                  <li>Pulse: Regular, between <strong>60–100 bpm</strong></li>
                  <li>Blood Pressure: Systolic <strong>100–140 mm Hg</strong>, Diastolic <strong>60–90 mm Hg</strong></li>
                  <li>Temperature: Normal (not exceeding 37.5°C/99.5°F)</li>
                  <li>Donation Frequency: <strong>Every 3 months</strong> (men), <strong>Every 4 months</strong> (women)</li>
                  <li>Last donation should be at least <strong>56 days</strong> ago</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} data-aos="fade-up" data-aos-delay="100">
            <Card className="shadow-lg border-0 h-100 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="text-danger fw-bold">
                  <FaBan className="me-2" /> Temporary & Permanent Deferrals
                </Card.Title>
                <ul className="mt-3">
                  <li><strong>Permanent Deferrals:</strong> HIV/AIDS, Hepatitis B/C, Creutzfeldt-Jakob disease</li>
                  <li><strong>1 Year Deferral:</strong> Tattoos/piercings, acupuncture, major surgery</li>
                  <li><strong>6 Month Deferral:</strong> Pregnancy, malaria treatment, organ transplant</li>
                  <li><strong>3 Month Deferral:</strong> Travel to malaria-endemic areas</li>
                  <li><strong>1 Week Deferral:</strong> Dental procedures, minor illnesses</li>
                  <li><strong>24 Hour Deferral:</strong> After alcohol consumption</li>
                  <li><strong>Other Restrictions:</strong> Cancer, heart disease, bleeding disorders</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Blood Types Information ===== */}
        <Row className="mt-5">
          <Col data-aos="fade-up" data-aos-delay="200">
            <Card className="shadow-lg border-0 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="fw-bold text-danger">
                  <FaTint className="me-2" /> Blood Types & Compatibility
                </Card.Title>
                <Row className="mt-4">
                  <Col md={6}>
                    <h6 className="fw-bold">Most Needed Blood Types:</h6>
                    <div>
                      <Badge bg="danger" className="blood-type-badge">O+ (38%)</Badge>
                      <Badge bg="danger" className="blood-type-badge">A+ (34%)</Badge>
                      <Badge bg="danger" className="blood-type-badge">B+ (9%)</Badge>
                      <Badge bg="danger" className="blood-type-badge">O- (7%)</Badge>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold">Universal Donors/Recipients:</h6>
                    <ul className="list-unstyled">
                      <li>🩸 <strong>O-</strong>: Universal Red Cell Donor</li>
                      <li>🩸 <strong>AB+</strong>: Universal Plasma Donor</li>
                      <li>🩸 <strong>AB-</strong>: Rare (1% of population)</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Step-by-Step Donation Process ===== */}
        <Row className="mt-5">
          <Col data-aos="fade-up" data-aos-delay="300">
            <Card className="shadow-lg border-0 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="fw-bold text-primary">
                  <FaClock className="me-2" /> Step-by-Step Donation Process
                </Card.Title>
                <div className="mt-4">
                  {[
                    { step: "1", title: "Registration", desc: "Complete donor form with personal and health information", icon: "", time: "10 mins" },
                    { step: "2", title: "Health Screening", desc: "Confidential interview about health history and travel", icon: "", time: "15 mins" },
                    { step: "3", title: "Mini Physical", desc: "Check pulse, blood pressure, hemoglobin level", icon: "", time: "5 mins" },
                    { step: "4", title: "Blood Donation", desc: "Actual donation takes 8-10 minutes", icon: "", time: "10 mins" },
                    { step: "5", title: "Recovery & Refreshments", desc: "Rest for 10-15 minutes with snacks and drinks", icon: "", time: "15 mins" },
                  ].map((item, index) => (
                    <div key={index} className="d-flex align-items-start mb-4">
                      <div className="step-number">{item.step}</div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">
                          {item.icon} {item.title} <small className="text-muted">({item.time})</small>
                        </h6>
                        <p className="text-muted mb-0">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Before & After Donation Tips ===== */}
        <Row className="mt-5 g-4">
          <Col md={6} data-aos="fade-up" data-aos-delay="400">
            <Card className="shadow-lg border-0 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="fw-bold text-success">
                  <FaUtensils className="me-2" /> Before Donation Preparation
                </Card.Title>
                <ul className="mt-3">
                  <li>Drink <strong>extra 500ml water</strong> 2 hours before</li>
                  <li>Eat a <strong>healthy, iron-rich meal</strong> 3-4 hours before donation</li>
                  <li>Avoid <strong>fatty foods</strong> for 24 hours before donation</li>
                  <li>Get <strong>adequate sleep</strong> the night before</li>
                  <li>Wear <strong>comfortable clothing</strong> with loose sleeves</li>
                  <li>Bring <strong>photo ID</strong> and list of current medications</li>
                  <li>Avoid <strong>strenuous exercise</strong> immediately before</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} data-aos="fade-up" data-aos-delay="500">
            <Card className="shadow-lg border-0 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="fw-bold text-info">
                  <FaBed className="me-2" /> After Donation Care
                </Card.Title>
                <ul className="mt-3">
                  <li>Drink <strong>plenty of fluids</strong> for 24-48 hours</li>
                  <li>Keep the <strong>bandage on for 4-5 hours</strong></li>
                  <li>Avoid <strong>heavy lifting</strong> for 24 hours</li>
                  <li>No <strong>smoking or alcohol</strong> for 24 hours</li>
                  <li>Eat <strong>iron-rich foods</strong> for the next few weeks</li>
                  <li>If feeling dizzy, <strong>lie down with feet elevated</strong></li>
                  <li>Wait <strong>30 minutes</strong> before driving</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Health Benefits ===== */}
        <Row className="mt-5">
          <Col data-aos="fade-up" data-aos-delay="600">
            <Card className="shadow-lg border-0 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="fw-bold text-warning">
                  <FaHeart className="me-2" /> Health Benefits of Blood Donation
                </Card.Title>
                <Row className="mt-4">
                  <Col md={6}>
                    <h6 className="fw-bold text-success">Physical Benefits:</h6>
                    <ul>
                      <li>Reduces risk of <strong>heart disease</strong> by 30%</li>
                      <li>Burns approximately <strong>650 calories</strong> per donation</li>
                      <li>Stimulates production of <strong>new blood cells</strong></li>
                      <li>Lowers <strong>blood viscosity</strong></li>
                      <li>Free <strong>health screening</strong> included</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold text-primary">Psychological Benefits:</h6>
                    <ul>
                      <li>Sense of <strong>personal satisfaction</strong></li>
                      <li>Reduces <strong>stress and anxiety</strong></li>
                      <li>Improves <strong>emotional well-being</strong></li>
                      <li>Strengthens <strong>community connection</strong></li>
                      <li>Provides <strong>purpose and meaning</strong></li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Common Myths vs Facts ===== */}
        <Row className="mt-5">
          <Col data-aos="fade-up" data-aos-delay="700">
            <Card className="shadow-lg border-0 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="fw-bold text-danger">
                  <FaShieldAlt className="me-2" /> Myths vs Facts About Blood Donation
                </Card.Title>
                <Row className="mt-4">
                  <Col md={6}>
                    <h6 className="fw-bold text-danger">Common Myths:</h6>
                    <ul>
                      <li>"Donating blood is painful and dangerous"</li>
                      <li>"I can get infected during donation"</li>
                      <li>"I'm too old/young to donate"</li>
                      <li>"It will make me weak for weeks"</li>
                      <li>"Vegetarians can't donate blood"</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold text-success">The Facts:</h6>
                    <ul>
                      <li>Only slight pinch, <strong>extremely safe</strong> process</li>
                      <li><strong>Sterile, single-use</strong> equipment only</li>
                      <li>Age 18-65 with <strong>good health</strong> can donate</li>
                      <li>Body replaces blood in <strong>24-48 hours</strong></li>
                      <li>Vegetarians can donate with <strong>proper iron levels</strong></li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Emergency Preparedness ===== */}
        <Row className="mt-5">
          <Col data-aos="fade-up" data-aos-delay="800">
            <Card className="shadow-lg border-0 rounded-4 info-card">
              <Card.Body>
                <Card.Title className="fw-bold text-info">
                  <FaAmbulance className="me-2" /> When is Blood Most Needed?
                </Card.Title>
                <Row className="mt-4 text-center">
                  <Col md={3} className="mb-3">
                    <div className="p-3 border rounded bg-light">
                     
                      <h6>Accident Victims</h6>
                      <small className="text-muted">Can need 5-100 units</small>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="p-3 border rounded bg-light">
                     
                      <h6>Surgery Patients</h6>
                      <small className="text-muted">Heart surgery: 2-8 units</small>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="p-3 border rounded bg-light">
                     
                      <h6>Cancer Patients</h6>
                      <small className="text-muted">Chemotherapy support</small>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="p-3 border rounded bg-light">
                     
                      <h6>Chronic Illness</h6>
                      <small className="text-muted">Regular transfusions</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== Doctor's Note ===== */}
        <Row className="mt-5">
          <Col data-aos="fade-up" data-aos-delay="900">
            <Card className="border-0 shadow bg-light rounded-4 info-card">
              <Card.Body className="text-center py-5">
                <blockquote className="blockquote mb-0">
                  <FaHeartbeat className="text-danger display-4 mb-3" />
                  <p className="mb-3 fst-italic text-secondary fs-5">
                    "Blood donation is the most precious gift one can give to another human being. 
                    It's not just about saving lives today, but about giving someone a chance at tomorrow. 
                    Your single donation creates a ripple effect of hope across our community."
                  </p>
                  
                </blockquote>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ===== Footer Section ===== */}
      <footer
        className="text-dark pt-5 pb-3 mt-5"
        style={{
          background: "linear-gradient(90deg, #f5f7fa, #c3cfe2)",
        }}
        data-aos="fade-up"
      >
        <Container>
          <Row>
            <Col md={4} className="mb-4" data-aos="fade-up">
              <h4 className="fw-bold text-danger">RaktMitra</h4>
              <p className="small text-muted">
                RaktMitra connects donors and recipients through a secure and compassionate platform. 
                Together, we save lives and build a healthier community. Join us in making a difference.
              </p>
            </Col>

            <Col md={4} className="mb-4" data-aos="fade-up" data-aos-delay="100">
              <h5 className="fw-bold text-danger">Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-dark text-decoration-none">Home</a></li>
                <li><a href="/donor-registration" className="text-dark text-decoration-none">Donate Blood</a></li>
                <li><a href="/request" className="text-dark text-decoration-none">Request Blood</a></li>
                
                <li><a href="/info" className="text-dark text-decoration-none">Information</a></li>
              </ul>
            </Col>

            <Col md={4} className="mb-4" data-aos="fade-up" data-aos-delay="200">
              <h5 className="fw-bold text-danger">Contact Us</h5>
              <p className="small mb-1"> Indore, Madhya Pradesh, India</p>
              <p className="small mb-1"> support@raktmitra.org</p>
              <p className="small mb-1"> +91 9755926645</p>

              <div className="d-flex gap-3 mt-2">
                <a href="#" className="text-danger fs-5"><FaFacebook /></a>
                <a href="#" className="text-danger fs-5"><FaTwitter /></a>
                <a href="#" className="text-danger fs-5"><FaInstagram /></a>
              </div>
            </Col>
          </Row>

          <hr />
          <div className="text-center small text-muted" data-aos="fade-up">
            © {new Date().getFullYear()} <strong>RaktMitra</strong>. All rights reserved. | 
            <span className="text-danger">  Donate Blood. Save Lives. </span>
          </div>
        </Container>
      </footer>
      <br /><br />
    </div>
  );
};

export default Information;