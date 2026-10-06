import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const DonorList = () => {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");

  const url = "http://localhost:8080";

  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const token = localStorage.getItem("token");

  const statesOfIndia = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Pondicherry",
    "Chandigarh",
    "Andaman & Nicobar",
    "Daman & Diu",
    "Lakshadweep",
  ];

  // Check login
  useEffect(() => {
    if (!loggedIn || !token) {
      navigate("/login");
    }
  }, [loggedIn, token, navigate]);

  // Fetch donors
  useEffect(() => {
    if (!token) return;

    const fetchDonors = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${url}/user/donor`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch donor data.");
        }

        console.log("Donor List Response:", data);

        // Backend may return either array or { donors: [] }
        const donorList = Array.isArray(data)
          ? data
          : data.donors || [];

        setDonors(donorList);
        setFilteredDonors(donorList);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [token]);

  // Filter donors
  useEffect(() => {
    let temp = [...donors];

    if (city) {
      temp = temp.filter((d) =>
        d.city?.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (state) {
      temp = temp.filter(
        (d) => d.state?.toLowerCase() === state.toLowerCase()
      );
    }

    if (gender) {
      temp = temp.filter(
        (d) => d.gender?.toLowerCase() === gender.toLowerCase()
      );
    }

    setFilteredDonors(temp);
  }, [city, state, gender, donors]);

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">{error}</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" variant="danger" />
        <p>Loading donors...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* Filter Bar */}
      <div className="filter-bar shadow-sm mb-4 bg-white rounded p-2">
        <div className="d-flex filter-row gap-2 justify-content-between">

          <input
            type="text"
            className="form-control"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <select
            className="form-select"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">State</option>

            {statesOfIndia.map((st, index) => (
              <option key={index} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

        </div>
      </div>

      {/* Donor Cards */}
      {filteredDonors.length === 0 ? (
        <p className="text-center text-muted">
          No donors found.
        </p>
      ) : (
        <div className="row g-4">

          {filteredDonors.map((donor) => (
            <div
              key={donor._id}
              className="col-lg-3 col-md-4 col-sm-6"
            >
              <div className="card donor-card h-100 shadow-sm border-0">

                <div className="image-wrapper d-flex justify-content-center align-items-center">

                  {donor.imageUrl ? (
                    <img
                      src={donor.imageUrl}
                      alt={donor.name}
                      className="donor-image"
                    />
                  ) : (
                    <div className="placeholder">
                      {donor.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                </div>

                <div className="card-body text-center">

                  <h5 className="card-title text-danger fw-bold">
                    {donor.name}
                  </h5>

                  <p className="text-muted">
                    <strong>Blood:</strong> {donor.bloodGroup}
                  </p>

                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() =>
                      navigate(`/donor/${donor._id}`)
                    }
                  >
                    View Profile
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* CSS */}
      <style>{`
        .filter-row {
          display: flex;
          flex-wrap: nowrap;
        }

        .filter-bar .form-control,
        .filter-bar .form-select {
          min-width: 0;
        }

        @media (max-width: 576px) {
          .filter-row {
            overflow-x: auto;
            white-space: nowrap;
          }

          .filter-bar .form-control,
          .filter-bar .form-select {
            flex-basis: 32%;
            font-size: 14px;
            padding: 6px;
          }
        }

        .donor-card {
          border-radius: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .donor-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .image-wrapper {
          height: 180px;
          background: #f8f9fa;
        }

        .donor-image {
          width: 60%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }

        .placeholder {
          width: 60%;
          height: 150px;
          font-size: 80px;
          font-weight: 700;
          color: #dc3545;
          background: #f8d7da;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

    </div>
  );
};

export default DonorList;