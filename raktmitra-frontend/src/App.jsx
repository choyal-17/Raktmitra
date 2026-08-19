import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./component/Navbar.jsx";
import Home from "./component/Home.jsx";
import DonorList from "./donor/DonorList.jsx";
import DonorDetails from "./donor/DonorDetails.jsx";
import Login from "./component/Login.jsx";
import Registration from "./component/Registration.jsx";
import Sidebar from "./component/Sidebar.jsx";
import Information from "./component/Information.jsx";
import AdminPage from "./admin/AdminPage.jsx";
import DonorRegistration from "./donor/DonorRegistration.jsx";
import DonorProfile from "./donor/DonorProfile.jsx";
import BankForm from "./admin/BankForm.jsx";
import BloodBanks from "./admin/BloodBanks.jsx";
import BloodBanksList from "./component/BloodBanksList.jsx";
import ViewDonors from "./admin/ViewDonor.jsx";
import PatientRegistration from "./patient/PatientRegistration.jsx";
import PatientList from "./patient/PatientList.jsx";
import ViewPatients from "./admin/ViewPatients.jsx";  
import PatientDetails from "./patient/PatientDetails.jsx";
import { Form } from "react-bootstrap";
import FormSubmitted from "./component/FormSubmitted.jsx";
import SearchResults from "./component/SearchResults.jsx";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const role = localStorage.getItem("role"); // "ADMIN" or "USER"
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const showSidebar = !isLoggedIn || role === "USER";
   useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      {/* Navbar */}
      <div className="fixed-top w-100">
        <Navbar />
      </div>

      {/* Space for fixed navbar */}
      <br />
      <br />
      <br />

  <div style={{ display: "flex" }}>
        
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
        )}

        {/* MAIN CONTENT */}
        <div
          className="flex-grow-1 p-3"
          style={{
            marginLeft: isMobile
              ? "0px" // 🚀 FIX: No blank space on mobile
              : showSidebar
              ? isSidebarOpen
                ? "220px"
                : "60px"
              : "0px",
            transition: "margin-left 0.3s ease",
            paddingBottom: isMobile ? "70px" : "0px", // space for bottom nav
          }}
        >

          <Routes>
            {/* ---------- ADMIN ROUTES ---------- */}
            <Route
              path="/admin"
              element={
                isLoggedIn && role === "ADMIN" ? (
                  <AdminPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/bankform"
              element={
                isLoggedIn && role === "ADMIN" ? (
                  <BankForm />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/bloodbanks"
              element={
                isLoggedIn && role === "ADMIN" ? (
                  <BloodBanks />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/donors"
              element={
                isLoggedIn && role === "ADMIN" ? (
                  <ViewDonors />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
             <Route
              path="/admin/patients"
              element={
                isLoggedIn && role === "ADMIN" ? (
                  <ViewPatients />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* ---------- PUBLIC ROUTES ---------- */}
             <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/info" element={<Information />} />
            <Route path="/bloodbanks" element={<BloodBanksList />} />

            {/* ---------- USER ROUTES (protected) ---------- */}

             <Route
              path="/search"
              element={
                isLoggedIn && role === "USER" ? (
                  <SearchResults />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/user/home"
              element={
                isLoggedIn && role === "USER" ? (
                  <Home />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            
            <Route
              path="/blood_donor"
              element={
                isLoggedIn && role === "USER" ? (
                  <DonorList />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
             <Route
              path="/submit"
              element={
                isLoggedIn && role === "USER" ? (
                  <FormSubmitted />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/donor/:id"
              element={
                isLoggedIn && role === "USER" ? (
                  <DonorDetails />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/donor-registration"
              element={
                isLoggedIn && role === "USER" ? (
                  <DonorRegistration />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
             <Route
              path="/patient-registration"
              element={
                isLoggedIn && role === "USER" ? (
                  <PatientRegistration />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/patient/:id"
              element={
                isLoggedIn && role === "USER" ? (
                  <PatientDetails />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            <Route
              path="/donor/profile"
              element={
                isLoggedIn && role === "USER" ? (
                  <DonorProfile />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* ---------- FALLBACK ---------- */}
            <Route
              path="*"
              element={
                isLoggedIn ? (
                  role === "ADMIN" ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Navigate to="/user/home" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
