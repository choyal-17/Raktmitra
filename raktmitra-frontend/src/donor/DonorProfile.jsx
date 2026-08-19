import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DonorRegistration from "./DonorRegistration";

const DonorProfile = () => {
  const location = useLocation();
  const donorState = location.state?.donor;
    const url = "http://localhost:8080" || "http://localhost:8080";
//    const url = "http://localhost:8080" ;

  const [donor, setDonor] = useState(donorState || null);
  const [loading, setLoading] = useState(true);
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    const checkDonorEmail = async () => {
      try {
        const email = localStorage.getItem("Email");

        if (!email) {
          // Email not in local storage → show registration form
          setEmailExists(false);
          setLoading(false);
          return;
        }

        // ✅ Make API call to check if donor exists
        const response = await fetch(`${url}/user/donor/${email}`);

        if (response.ok) {
          const data = await response.json();
          setDonor(data);
          setEmailExists(true);
        } else if (response.status === 404) {
          // Donor not found
          setEmailExists(false);
        } else {
          console.error("Server error:", response.status);
          setEmailExists(false);
        }
      } catch (error) {
        console.error("Error fetching donor email:", error);
        setEmailExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkDonorEmail();
  }, []);

  // ⏳ Loading
  if (loading) {
    return <p className="text-center mt-10">Checking donor status...</p>;
  }

  // ❌ Donor not found → show registration form
  if (!emailExists) {
    return (
      <div className="mt-10">
        
        <DonorRegistration />
      </div>
    );
  }

  // ✅ Donor exists → show profile
  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
        Donor Profile
      </h2>

      <div className="text-center mb-4">
        {donor.profileImageUrl && (
          <img
            src={`${url}/uploads/${donor.profileImageUrl}`}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto border-2 border-red-500"
          />
        )}
      </div>

      <p><strong>Name:</strong> {donor.name}</p>
      <p><strong>Email:</strong> {donor.email}</p>
      <p><strong>Phone:</strong> {donor.phone}</p>
      <p><strong>City:</strong> {donor.city}</p>
      <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
      <p><strong>Gender:</strong> {donor.gender}</p>
      <p><strong>Age:</strong> {donor.age}</p>
    </div>
  );
};

export default DonorProfile;
