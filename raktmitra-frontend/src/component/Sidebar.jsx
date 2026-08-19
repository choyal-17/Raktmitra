import React from "react";
import { Nav } from "react-bootstrap";
import {
  FaHome,
  FaHandHoldingHeart,
  FaUserFriends,
  FaHospital,
  FaInfoCircle,
  FaBars
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* ---------- INLINE CSS FOR SIDEBAR + MOBILE NAV ---------- */}
      <style>
        {`
          /* Desktop Sidebar */
          .sidebar-desktop {
            transition: width 0.3s ease;
          }

          /* Hide mobile nav by default */
          .sidebar-mobile {
            display: none;
          }

          /* Mobile UI */
          @media (max-width: 768px) {
            .sidebar-desktop {
              display: none !important;
            }

            .sidebar-mobile {
              display: block;
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              background: #dc3545; /* Danger color */
              z-index: 10000;
              border-top: 2px solid rgba(255, 255, 255, 0.3);
            }

            .sidebar-mobile a {
              padding: 6px 10px;
              color: white !important;
            }
          }
        `}
      </style>

      {/* ------------ DESKTOP SIDEBAR ------------ */}
      <div
        className="sidebar-desktop bg-danger text-white p-3 vh-100 position-fixed"
        style={{ width: isOpen ? "220px" : "60px" }}
      >
        {/* Toggle Button */}
        <div
          className="d-flex justify-content-between align-items-center mb-4"
          style={{ cursor: "pointer" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="fw-bold">{isOpen ? "RaktMitra" : "RM"}</span>
          <FaBars />
        </div>

        {/* Navigation Items */}
        <Nav className="flex-column">
          <Nav.Link href="/" className="text-white d-flex align-items-center mb-3">
            <FaHome className="me-2" />
            {isOpen && "Home"}
          </Nav.Link>

          <Nav.Link href="/blood_donor" className="text-white d-flex align-items-center mb-3">
            <FaHandHoldingHeart className="me-2" />
            {isOpen && "Donors"}
          </Nav.Link>

          <Nav.Link href="/patients" className="text-white d-flex align-items-center mb-3">
            <FaUserFriends className="me-2" />
            {isOpen && "Patients"}
          </Nav.Link>

          <Nav.Link href="/bloodbanks" className="text-white d-flex align-items-center mb-3">
            <FaHospital className="me-2" />
            {isOpen && "Blood Banks"}
          </Nav.Link>

          <Nav.Link href="/info" className="text-white d-flex align-items-center mb-3">
            <FaInfoCircle className="me-2" />
            {isOpen && "Information"}
          </Nav.Link>
        </Nav>
      </div>

      {/* ------------ MOBILE BOTTOM NAV ------------ */}
      <div className="sidebar-mobile bg-danger text-white">
        <Nav className="d-flex justify-content-around align-items-center py-2">

          <Nav.Link href="/" className="text-white">
            <FaHome size={22} />
          </Nav.Link>

          <Nav.Link href="/blood_donor" className="text-white">
            <FaHandHoldingHeart size={22} />
          </Nav.Link>

          <Nav.Link href="/patients" className="text-white">
            <FaUserFriends size={22} />
          </Nav.Link>

          <Nav.Link href="/bloodbanks" className="text-white">
            <FaHospital size={22} />
          </Nav.Link>

          <Nav.Link href="/info" className="text-white">
            <FaInfoCircle size={22} />
          </Nav.Link>

        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
