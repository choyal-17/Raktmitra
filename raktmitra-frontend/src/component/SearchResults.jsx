import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState(""); 
  const [gender, setGender] = useState("");

  
  const url =
    process.env.NODE_ENV === "production"
      ? "http://localhost:8080"
      : "http://localhost:8080";

  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const token = localStorage.getItem("token");

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "Donor";
  const bloodGroup = queryParams.get("bloodGroup") || "";

  
  useEffect(() => {
    if (!loggedIn || !token) {
      navigate("/login");
    }
  }, [loggedIn, token, navigate]);

  
  useEffect(() => {
    if (!bloodGroup || !token) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams({
          type,
          bloodGroup,
          city,
          state: stateName,
          gender,
        });

        const response = await fetch(
          `${url}/user/search?${query.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchResults();
  }, [bloodGroup, type, city, stateName, gender, token, url]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* ---------------- FILTER BAR ---------------- */}
      <div className="filter-bar mb-4">
        <div className="filter-row">
          <input
            type="text"
            className="form-control"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="text"
            className="form-control"
            placeholder="State"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />

          <select
            className="form-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* ---------------- RESULTS ---------------- */}
      {results.length === 0 ? (
        <p className="text-center text-muted">
          No {type.toLowerCase()} found.
        </p>
      ) : (
        <div className="row g-4">
          {results.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-4 col-sm-6">
              <div className="card donor-card h-100 shadow-sm border-0">
                <div className="image-wrapper">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="donor-image"
                    />
                  ) : (
                    <div className="placeholder">
                      {item.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="card-body text-center">
                  <h5 className="fw-bold text-danger">{item.name}</h5>

                  <p className="text-muted mb-2">
                    <strong>Blood Group:</strong> {item.bloodGroup}
                  </p>

                  {type === "Donor" ? (
                    <p className="text-muted">
                      <strong>Address:</strong> {item.address}
                    </p>
                  ) : (
                    <p className="text-muted">
                      <strong>Hospital:</strong> {item.hospital}
                    </p>
                  )}

                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() =>
                      navigate(
                        type === "Donor"
                          ? `/donor/${item.id}`
                          : `/patient/${item.id}`
                      )
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
    </div>
  );
};

export default SearchResults;
