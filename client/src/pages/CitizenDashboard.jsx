import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const location = useLocation();

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await fetch(`http://localhost:5000/complaints/${username}`);
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 5000);
    return () => clearInterval(interval);
  }, [location]);

  // Delete complaint
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this complaint?")) return;
    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete complaint");
      fetchComplaints();
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  const mapLink = (loc) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;

  const filteredComplaints =
    filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div style={layout}>
      {/* Sidebar */}
      <aside style={sidebar}>
        <div style={sidebarHeader}>
          <h3>Citizen Panel</h3>
        </div>
        <button style={sidebarBtn} onClick={() => navigate("/")}>
          🏠 Dashboard
        </button>
        <button style={sidebarBtn} onClick={() => navigate("/register-complaint")}>
          + Register Complaint
        </button>
      </aside>

      {/* Main Content */}
      <div style={main}>
        <div style={header}>
          <div>
            <h2 style={{ color: "#fff" }}>Welcome, {username}</h2>
            <p style={{ color: "#fff" }}>Total Complaints: {complaints.length}</p>
          </div>
          <div>
            <button style={registerBtn} onClick={() => navigate("/register-complaint")}>
              + Register Complaint
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={filterContainer}>
          {["All", "Pending", "In Progress", "Resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...filterBtn,
                background: filter === f ? "#4B0082" : "#E1E1E1",
                color: filter === f ? "#fff" : "#333",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Complaints Grid */}
        <div style={complaintsGrid}>
          {filteredComplaints.length === 0 ? (
            <p style={{ textAlign: "center", gridColumn: "1/-1" }}>
              No complaints to show.
            </p>
          ) : (
            filteredComplaints.map((c) => (
              <div key={c._id} style={complaintCard}>
                <div style={cardHeader}>
                  <h4>{c.title}</h4>
                  <span style={{ ...statusBadge, background: statusColor(c.status) }}>
                    {c.status}
                  </span>
                </div>
                <p><strong>Description:</strong> {c.description}</p>
                <p><strong>Department:</strong> {c.department}</p>
                <p>
                  <strong>Location:</strong>{" "}
                  {c.location ? (
                    <a href={mapLink(c.location)} target="_blank" rel="noopener noreferrer">
                      {c.location}
                    </a>
                  ) : (
                    "Not Provided"
                  )}
                </p>
                {c.image && (
                  <img
                    src={`http://localhost:5000/uploads/${c.image}`}
                    alt="Complaint"
                    style={complaintImage}
                  />
                )}
                <p style={submittedAt}>
                  Submitted: {new Date(c.createdAt).toLocaleString()}
                </p>
                <button style={removeBtn} onClick={() => handleRemove(c._id)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================== */
/* Styles */
/* ========================== */
const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#f4f6f8",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const sidebar = {
  width: "220px",
  background: "#4B0082",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  position: "sticky",
  top: 0,
  height: "100vh",
};

const sidebarHeader = {
  marginBottom: "20px",
};

const sidebarBtn = {
  padding: "12px 15px",
  marginBottom: "10px",
  border: "none",
  borderRadius: "8px",
  background: "#6A1B9A",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  textAlign: "left",
};

const main = {
  flex: 1,
  padding: "30px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  background: "#4B0082",
  padding: "20px",
  borderRadius: "12px",
};

const registerBtn = {
  padding: "10px 20px",
  background: "#fff",
  color: "#4B0082",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const filterContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const filterBtn = {
  padding: "8px 15px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.2s",
};

const complaintsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const complaintCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
};

const complaintImage = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  margin: "10px 0",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const statusBadge = {
  color: "#fff",
  padding: "5px 10px",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: "0.85rem",
};

const submittedAt = {
  fontSize: "0.8rem",
  color: "#777",
  marginTop: "8px",
};

const removeBtn = {
  marginTop: "10px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#E53935",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#BA68C8";
    case "In Progress":
      return "#7E57C2";
    case "Resolved":
      return "#4CAF50";
    default:
      return "#555";
  }
};
