import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./Navbar.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    searchType: "Donor",
    bloodGroup: "",
  });

  useEffect(() => {
    // Load user data on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data");
      }
    }
  }, []);

  const handleLogout = () => {
    try {
      // 1. Clear Local Storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      // 2. Manual Bootstrap Cleanup 
      // This removes the grey overlay and restores scrolling to the page
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      // 3. Update React State
      setUser(null);

      // 4. Redirect
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bloodGroup.trim()) {
      alert("Please enter a blood group to search.");
      return;
    }
    navigate(
      `/search?type=${formData.searchType}&bloodGroup=${encodeURIComponent(
        formData.bloodGroup.trim()
      )}`
    );
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light shadow-sm"
        style={{ background: "linear-gradient(90deg, #f5f7fa, #c3cfe2)" }}
      >
        <div className="container-fluid px-3">
          {/* Brand */}
          <div className="d-flex flex-column" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <p className="navbar-brand fw-bold text-danger fs-4 mb-0">
              RaktMitra
            </p>
            <small className="text-danger" style={{ marginTop: "-5px", fontSize: "0.75rem" }}>
              वो दोस्ती जो ज़िंदगी बचाए
            </small>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="ms-auto d-flex flex-column flex-lg-row align-items-lg-center gap-2 mt-3 mt-lg-0">
              
              {/* Search Form */}
              <form className="d-flex align-items-center" onSubmit={handleSubmit}>
                <select
                  className="form-select form-select-sm me-2"
                  style={{ width: "110px" }}
                  name="searchType"
                  value={formData.searchType}
                  onChange={handleChange}
                >
                  <option value="Donor">Donor</option>
                  <option value="Patient">Patient</option>
                </select>

                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Blood Group (e.g. A+)"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                />

                <button className="btn btn-outline-danger btn-sm ms-2" type="submit">
                  <FaSearch />
                </button>
              </form>

              {/* User Section */}
              {user ? (
                <div className="dropdown ms-lg-3 mt-2 mt-lg-0">
                  <button
                    className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                    data-bs-toggle="dropdown"
                    style={{ width: 40, height: 40 }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                    <li className="dropdown-item-text fw-bold text-secondary border-bottom mb-1">
                      Hi, {user.name}
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger py-2"
                        data-bs-toggle="modal"
                        data-bs-target="#logoutModal"
                        onClick={handleLogout}
                      >
                        
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link className="btn btn-outline-danger btn-sm ms-lg-2" to="/login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {/* <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirm Logout</h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                data-bs-dismiss="modal" 
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body text-center py-4">
              <h5 className="mb-0">Are you sure you want to log out?</h5>
              <p className="text-muted small mt-2">You will need to login again to access your profile.</p>
            </div>

            <div className="modal-footer justify-content-center border-0">
              <button 
                type="button" 
                className="btn btn-light px-4" 
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Navbar;