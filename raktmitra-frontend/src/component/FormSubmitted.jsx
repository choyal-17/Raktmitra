import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

const FormSubmitted = ({ onReset }) => {
  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  return (
    <Container
      className="d-flex justify-content-center align-items-center vh-70"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card
            className="shadow-lg text-center p-2 border-0 rounded-4"
            data-aos="zoom-in"
          >
            <Card.Body>
              <div data-aos="fade-down">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
                  alt="Success"
                  width="100"
                  className="mb-3"
                />
              </div>
              <h2 className="text-success fw-bold mb-3" data-aos="fade-up">
                Form Submitted Successfully!
              </h2>
              <p className="text-muted" data-aos="fade-up" data-aos-delay="200">
                Thank you for submitting your information. 
              </p>
              {onReset && (
                <Button
                  variant="primary"
                  className="mt-3"
                  data-aos="fade-up"
                  data-aos-delay="400"
                  onClick={onReset}
                >
                  Submit Another Response
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormSubmitted;
