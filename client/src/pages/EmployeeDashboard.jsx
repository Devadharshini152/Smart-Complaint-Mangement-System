// EmployeeDashboard.jsx - PROFESSIONAL UI WITH STATUS FILTER
import React, { useEffect, useState } from "react";

export default function EmployeeDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Filter state
  const employeeName = localStorage.getItem("employeeName") || "Employee";
  const department = localStorage.getItem("employeeDepartment") || "Unknown";

  // ✅ Fetch complaints
  const fetchComplaints = async () => {
    if (!department) return;
    try {
      const res = await fetch(`http://localhost:5000/employees/complaints/${department}`);
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
  }, [department]);

  // ✅ Update complaint status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) fetchComplaints();
      else alert(data.message || "Failed to update status");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending": return "#E53935";
      case "In Progress": return "#FFB300";
      case "Resolved": return "#4CAF50";
      default: return "#757575";
    }
  };

  // ✅ Filter complaints based on selected status
  const filteredComplaints =
    statusFilter === "All"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  return (
    <div style={layout}>
      {/* Sidebar */}
      <aside style={sidebar}>
        <div style={sidebarHeader}>
          <h2 style={{ color: "#fff" }}>Employee Panel</h2>
          <p style={{ color: "#E0E0E0" }}>{employeeName}</p>
          <p style={{ color: "#E0E0E0" }}>Dept: {department}</p>
        </div>

        {/* ✅ Filter Section */}
        <div style={filterSection}>
          <h3 style={filterTitle}>Filter by Status</h3>
          <button
            style={{
              ...filterButton,
              background: statusFilter === "All" ? "#fff" : "transparent",
              color: statusFilter === "All" ? "#4B0082" : "#fff",
            }}
            onClick={() => setStatusFilter("All")}
          >
            📁 All ({complaints.length})
          </button>

          <button
            style={{
              ...filterButton,
              background: statusFilter === "Pending" ? "#fff" : "transparent",
              color: statusFilter === "Pending" ? "#E53935" : "#fff",
            }}
            onClick={() => setStatusFilter("Pending")}
          >
            ⏳ Pending ({complaints.filter(c => c.status === "Pending").length})
          </button>

          <button
            style={{
              ...filterButton,
              background: statusFilter === "In Progress" ? "#fff" : "transparent",
              color: statusFilter === "In Progress" ? "#FFB300" : "#fff",
            }}
            onClick={() => setStatusFilter("In Progress")}
          >
            🔧 In Progress ({complaints.filter(c => c.status === "In Progress").length})
          </button>

          <button
            style={{
              ...filterButton,
              background: statusFilter === "Resolved" ? "#fff" : "transparent",
              color: statusFilter === "Resolved" ? "#4CAF50" : "#fff",
            }}
            onClick={() => setStatusFilter("Resolved")}
          >
            ✅ Resolved ({complaints.filter(c => c.status === "Resolved").length})
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={main}>
        <header style={header}>
          <h2>
            {statusFilter === "All" ? "Department Complaints" : `${statusFilter} Complaints`}
          </h2>
          <p>Total: {filteredComplaints.length}</p>
        </header>

        {filteredComplaints.length === 0 ? (
          <p style={noComplaintText}>🎉 No complaints in this category 🎉</p>
        ) : (
          <div style={complaintsGrid}>
            {filteredComplaints.map((c) => (
              <div key={c._id} style={{ ...complaintCard, borderLeftColor: statusColor(c.status) }}>
                <div style={cardHeader}>
                  <h4 style={cardTitle}>{c.title}</h4>
                  <span style={{ ...statusBadge, background: statusColor(c.status) }}>
                    {c.status}
                  </span>
                </div>

                <p style={detailText}><strong>Filed By:</strong> {c.citizenUsername}</p>
                <p style={{ ...detailText, marginBottom: '20px' }}>
                  <strong>Description:</strong> {c.description}
                </p>

                <div style={actionContainer}>
                  {c.location && (
                    <div style={actionItem}>
                      <span style={actionLabel}>📍 Location:</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${c.location}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={locationLinkStyle}
                      >
                        View on Map
                      </a>
                    </div>
                  )}
                  {c.image && (
                    <div style={actionItem}>
                      <span style={actionLabel}>🖼️ Image:</span>
                      <a
                        href={`http://localhost:5000/uploads/${c.image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={imageLinkStyle}
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>

                <div style={statusUpdateContainer}>
                  <label style={{ fontWeight: "700", color: '#4B0082' }}>Update Status:</label>
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c._id, e.target.value)}
                    style={selectStyle}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================== */
/* STYLES */
/* ========================== */
const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#F4F4F9",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const sidebar = {
  width: "260px",
  background: "#4B0082",
  color: "#fff",
  padding: "20px",
  position: "sticky",
  top: 0,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
};

const sidebarHeader = { marginBottom: "40px" };

const filterSection = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const filterTitle = {
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "10px",
  borderBottom: "1px solid rgba(255,255,255,0.3)",
  paddingBottom: "5px",
};

const filterButton = {
  padding: "10px 15px",
  fontSize: "15px",
  fontWeight: "600",
  textAlign: "left",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: "transparent",
  transition: "all 0.2s ease",
};

const main = { flex: 1, padding: "30px" };

const header = {
  background: "#4B0082",
  color: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const noComplaintText = {
  textAlign: "center",
  marginTop: "30px",
  fontSize: "20px",
  color: "#4CAF50",
  fontWeight: "600",
  padding: "20px",
  backgroundColor: "#E8F5E9",
  borderRadius: "10px",
};

const complaintsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
  gap: "30px",
};

const complaintCard = {
  background: "#FFFFFF",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
  borderLeft: "8px solid",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
  paddingBottom: "10px",
};

const cardTitle = {
  fontSize: "22px",
  fontWeight: "800",
  color: "#333",
  margin: 0,
};

const statusBadge = {
  color: "#fff",
  padding: "8px 18px",
  borderRadius: "4px",
  fontWeight: "700",
  fontSize: "16px",
  textAlign: "center",
  textTransform: "uppercase",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

const detailText = {
  fontSize: "16px",
  lineHeight: 1.6,
  marginBottom: "5px",
  color: "#444",
};

const actionContainer = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "10px",
  padding: "15px 0",
  borderTop: "1px solid #F0F0F0",
  borderBottom: "1px solid #F0F0F0",
  marginBottom: "20px",
};

const actionItem = {
  display: "flex",
  alignItems: "center",
  fontSize: "15px",
  color: "#666",
};

const actionLabel = {
  marginRight: "8px",
  fontWeight: "700",
  color: "#4B0082",
  minWidth: "100px",
};

const linkBaseStyle = {
  textDecoration: "none",
  fontWeight: "600",
  transition: "color 0.2s ease",
  fontSize: "15px",
};

const imageLinkStyle = {
  ...linkBaseStyle,
  color: "#4a3aff",
  borderBottom: "2px solid transparent",
};

const locationLinkStyle = {
  ...linkBaseStyle,
  color: "#007bff",
  borderBottom: "2px solid transparent",
  cursor: "pointer",
};

const statusUpdateContainer = {
  marginTop: "15px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  paddingTop: "15px",
  borderTop: "1px dashed #D1C4E9",
};

const selectStyle = {
  padding: "10px 16px",
  borderRadius: "6px",
  border: "1px solid #D1C4E9",
  fontWeight: "600",
  background: "#FFFFFF",
  cursor: "pointer",
  color: "#4B0082",
  fontSize: "16px",
  minWidth: "150px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};
