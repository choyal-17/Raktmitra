import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const BloodBanks = () => {
  const [banks, setBanks] = useState([]);
  const navigate = useNavigate();
    const url = "http://localhost:8080" || "http://localhost:8080";
  // === Fetch all banks ===
  const fetchBanks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/admin/banks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // include JWT here
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBanks(data);
      } else {
        alert(`Failed to fetch banks! (${response.status})`);
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching banks!");
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // === Delete bank ===
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Bank deleted successfully!");
        setBanks((prevBanks) => prevBanks.filter((bank) => bank.id !== id));
      } else {
        alert(`Failed to delete bank! (${response.status})`);
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting bank!");
    }
  };

  // === Edit bank ===
  const handleEdit = (id) => {
    navigate(`/admin/edit-bank/${id}`);
  };

  return (
    <div className="container mt-5">
      {/* Back Button */}
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



      <div className="row">
        {banks.length === 0 ? (
          <p className="text-center text-muted">No banks found.</p>
        ) : (
          banks.map((bank) => (
            <div key={bank.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100 border-0 rounded-3">
                <div className="card-body">
                  <h5 className="card-title text-danger fw-bold">
                    {bank.bankName}
                  </h5>
                  <p className="card-text text-secondary">
                    {bank.address}, {bank.city}, {bank.state} - {bank.pincode}
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-sm btn-warning px-3"
                      onClick={() => handleEdit(bank.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger px-3"
                      onClick={() => handleDelete(bank.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inline styling for hover effect */}
      <style>
        {`
          .card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card:hover {
            transform: translateY(-6px);
            box-shadow: 0 8px 18px rgba(220, 53, 69, 0.3);
          }
        `}
      </style>
    </div>
  );
};

export default BloodBanks;
