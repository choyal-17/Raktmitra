import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  return (
    <div>
      {/* Inline CSS for animations and custom effects */}
      <style>
        {`
          .custom-card {
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .custom-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
          }

          .certificate-img:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }

         

          .floating-btn {
            position: fixed;
            bottom: 60px;
            right: 25px;
            background-color: #dc3545;
            color: white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 1.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transition: 0.3s;
            z-index: 1000;
          }
          .floating-btn:hover {
            transform: scale(1.1);
            background-color: #b52a36;
          }

          .hero-section {
            background: linear-gradient(90deg, #ffe6e6, #fff5f5);
            overflow: hidden;
          }
        `}
      </style>

      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center py-5">
        <div className="container" data-aos="fade-up">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start p-4">
              <h1 className="fw-bold display-4 text-danger">
                Donate Blood, Save Lives 
              </h1>
              <p className="lead text-dark">
                One pint of blood can make a world of difference. Be a hero
                today!
              </p>
              <div className="mt-4">
                <a href="/donor-registration" className="btn btn-danger btn-lg me-3 shadow-sm">
                  Donate Blood
                </a>
                <a href="/patient-registration" className="btn btn-outline-danger btn-lg shadow-sm">
                  Request Blood
                </a>
              </div>
            </div>
            <div className="col-md-6 text-center mt-4 mt-md-0" data-aos="zoom-in">
              <img
                src="/bloodbanner1.jpg"
                alt="Blood Donation"
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: "420px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Blood */}
      <section className="py-5" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="fw-bold mb-4 text-danger">Why Donate Blood?</h2>
          <div className="row g-4">
            {[
              { title: "Save Lives", text: "Every donation can save up to 3 lives. Be someone's hero!" },
              { title: "Community Support", text: "Your contribution helps hospitals and patients in emergencies." },
              { title: "Stay Healthy", text: "Blood donation improves heart health and regenerates new cells." },
            ].map((item, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="card shadow border-0 custom-card h-100">
                  <div className="card-body">
                    <h5 className="card-title text-danger">{item.title}</h5>
                    <p className="card-text text-muted">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-5 bg-light" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="fw-bold mb-4 text-danger">Did You Know?</h2>
          <div className="row">
            {[
              { number: "1200+", label: "People need blood daily" },
              { number: "1 in 7", label: "Hospital patients need transfusion" },
              { number: "3 Lives", label: "Saved by a single donor" },
            ].map((stat, idx) => (
              <div className="col-md-4 mb-3" key={idx}>
                <h3 className="text-danger fw-bold display-5">{stat.number}</h3>
                <p className="text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="fw-bold mb-5 text-danger">What Donors Say</h2>
          <div className="row g-4">
            {[
              { msg: "Donating blood was one of the best feelings! So proud to help." },
              { msg: "RaktMitra made the process so simple and quick." },
              { msg: "Knowing my donation saved lives keeps me motivated." },
            ].map((t, i) => (
              <div className="col-md-4" key={i}>
                <div className="card border-0 shadow-lg p-4 h-100 custom-card">
                  <p className="text-muted fst-italic">“{t.msg}”</p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate */}
      <section className="py-5" data-aos="zoom-in">
        <div className="container text-center">
          <h2 className="fw-bold mb-3 text-danger">Donor Appreciation Certificate</h2>
          <p className="text-muted">
            Every donor receives a certificate as a token of gratitude for their life-saving contribution.
          </p>
          <img
            src="/certificate.png"
            alt="Certificate"
            className="img-fluid shadow-lg rounded certificate-img"
            style={{ maxWidth: "200px" }}
          />
        </div>
      </section>

      {/* Floating Button */}
      <a href="/donor-registration" className="floating-btn">
        <i className="bi bi-heart-fill"></i>
      </a>
          
      {/* Footer */}
      <footer
        className="text-dark pt-5 pb-3 mt-5"
        style={{ background: "linear-gradient(90deg, #f5f7fa, #c3cfe2)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h4 className="fw-bold text-danger"> RaktMitra</h4>
              <p className="small text-muted">
                A platform that connects donors with those in need. Join our community and save lives.
              </p>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold text-danger">Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-dark text-decoration-none">Home</a></li>
                <li><a href="/donor-registration" className="text-dark text-decoration-none">Donate Blood</a></li>
                <li><a href="/request" className="text-dark text-decoration-none">Request Blood</a></li>
                <li><a href="/info" className="text-dark text-decoration-none">Information</a></li>
              </ul>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold text-danger">Contact Us</h5>
              <p className="small mb-1"> Indore, Madhya Pradesh, India</p>
              <p className="small mb-1">support@raktmitra.org</p>
              <p className="small"> +91 97XXXXXX45</p>
              <div className="d-flex gap-3 mt-2">
                <a href="#" className="text-danger fs-5"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-danger fs-5"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-danger fs-5"><i className="bi bi-instagram"></i></a>
              </div>
            </div>
          </div>

          <hr />
          <div className="text-center small text-muted">
            © {new Date().getFullYear()} RaktMitra. All rights reserved.
          </div>
        </div>
      </footer>
      <br /><br />
    </div>
  );
};

export default Home;
