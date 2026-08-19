import React from "react";

const AdminPage = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">RaktMitra Admin Dashboard</h2>
      <div className="row">
        {/* Donor */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Donor</h5>
              <p className="card-text">Manage and view registered blood donors.</p>
              <a href="/admin/donors" className="btn btn-primary">
                View Donors
              </a>
            </div>
          </div>
        </div>

        {/* Patient */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Patient</h5>
              <p className="card-text">Manage patient requests and details.</p>
              <a href="/admin/patients" className="btn btn-success">
                View Patients
              </a>
            </div>
          </div>
        </div>

        {/* Blood Bank */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Blood Bank</h5>
              <p className="card-text">Track and update blood bank availability.</p>
              <a href="/admin/bloodbanks" className="btn btn-danger">
                View Blood Bank
              </a>
            </div>
          </div>
        </div>

        {/* Add Blood Bank */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <h5 className="card-title">Add Blood Bank</h5>
              <p className="card-text">Add a new blood bank to the system.</p>
              <a href="/admin/bankform" className="btn btn-warning text-white">
                Add Blood Bank
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
