import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");

  const url = "http://localhost:8080";

  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const token = localStorage.getItem("token");

  const statesOfIndia = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
    "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
    "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
    "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
    "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir",
    "Ladakh","Pondicherry","Chandigarh","Andaman & Nicobar","Daman & Diu",
    "Lakshadweep"
  ];

  useEffect(() => {
    if (!loggedIn || !token) {
      navigate("/login");
    }
  }, [loggedIn, token, navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/user/patients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403) throw new Error("Forbidden");

        if (!response.ok) throw new Error("Failed to fetch patient data.");

        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [token]);

  // APPLY FILTERS
  useEffect(() => {
    let temp = patients;

    if (city)
      temp = temp.filter((p) => p.city?.toLowerCase().includes(city.toLowerCase()));
    if (state)
      temp = temp.filter((p) => p.state?.toLowerCase() === state.toLowerCase());
    if (gender)
      temp = temp.filter((p) => p.gender?.toLowerCase() === gender.toLowerCase());

    setFilteredPatients(temp);
  }, [city, state, gender, patients]);

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
        <p>Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* SAME SINGLE-ROW FILTER AS DONORLIST */}
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

      {/* PATIENT LIST */}
      {filteredPatients.length === 0 ? (
        <p className="text-center text-muted">No patients found.</p>
      ) : (
        <div className="row g-4">
          {filteredPatients.map((patient) => (
            <div key={patient._id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card patient-card h-100 shadow-sm border-0">

                <div className="image-wrapper d-flex justify-content-center align-items-center">
                  {patient.imageUrl ? (
                    <img
                      src={patient.imageUrl}
                      alt={patient.name}
                      className="patient-image"
                    />
                  ) : (
                    <div className="placeholder">
                      {patient.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="card-body text-center">
                  <h5 className="card-title text-danger fw-bold">
                    {patient.name}
                  </h5>
                  <p className="text-muted">
                    <strong>Blood Group:</strong> {patient.bloodGroup}
                  </p>

                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => navigate(`/patient/${patient._id}`)}
                  >
                    View Profile
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSS FOR SINGLE-ROW FILTER */}
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

        .image-wrapper {
          height: 180px;
          background: #f8f9fa;
        }

        .patient-image {
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
  <br />
    </div>
  );
};

export default PatientList;
