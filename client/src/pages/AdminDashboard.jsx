//AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("add"); // 'add' | 'list' | 'complaints' | 'remove'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Employee form state (Add Employee) ---
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  // --- Fetched data ---
  const [employees, setEmployees] = useState([]);
  const [complaints, setComplaints] = useState([]);

  // Cache for citizen details
  const [citizenCache, setCitizenCache] = useState({});

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data || []);
    } catch (err) {
      console.error("fetchEmployees error:", err);
      setError("Could not load employees.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/complaints/all");
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      setComplaints(data || []);

      data
        .map((c) => c.citizenUsername)
        .filter(Boolean)
        .forEach((uname) => fetchCitizenIfNeeded(uname));
    } catch (err) {
      console.error("fetchComplaints error:", err);
      setError("Could not load complaints.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch citizen details if not cached
  const fetchCitizenIfNeeded = async (uname) => {
    if (!uname || citizenCache[uname]) return;
    try {
      const res = await fetch(`http://localhost:5000/citizens/${encodeURIComponent(uname)}`);
      if (!res.ok) return;
      const data = await res.json();
      setCitizenCache((prev) => ({ ...prev, [uname]: data }));
    } catch (err) {
      console.error("fetchCitizenIfNeeded error:", err);
    }
  };

  // Add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!name || !username || !password || !department) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/employees/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, department }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add employee");

      alert("Employee added successfully ✅");
      setName(""); setUsername(""); setPassword(""); setDepartment("");
      await fetchEmployees();
      setActiveTab("list");
    } catch (err) {
      console.error("handleAddEmployee error:", err);
      setError(err.message || "Could not add employee.");
    } finally {
      setLoading(false);
    }
  };

  // Remove employee
  const handleRemoveEmployee = async (id, empUsername) => {
    if (!window.confirm(`Remove employee "${empUsername}"?`)) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/employees/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete employee");
      alert("Employee removed ✅");
      await fetchEmployees();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not remove employee.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list" || activeTab === "remove") fetchEmployees();
    if (activeTab === "complaints") fetchComplaints();
    // eslint-disable-next-line
  }, [activeTab]);

  const enrichedComplaints = useMemo(() => {
    return complaints.map((c) => {
      const citizen = citizenCache[c.citizenUsername];
      return {
        ...c,
        citizenName: citizen?.name || c.citizenUsername || "Unknown",
        citizenPhone: citizen?.phone || "Not available",
        citizenEmail: citizen?.email || "Not available",
      };
    });
  }, [complaints, citizenCache]);

  return (
    <div style={own}>
      <div style={container}>
        {/* Top Bar */}
        <div style={topBar}>
          <div>Admin Dashboard</div>
          <div>Logged in as: Admin</div>
        </div>

        <div style={layout}>
          {/* Sidebar */}
          <aside style={sidebar}>
            <button style={sidebarBtn(activeTab === "add")} onClick={() => setActiveTab("add")}>➕ Add Employee</button>
            <button style={sidebarBtn(activeTab === "list")} onClick={() => setActiveTab("list")}>👥 Registered Employees</button>
            <button style={sidebarBtn(activeTab === "complaints")} onClick={() => setActiveTab("complaints")}>📋 Complaints</button>
            <button style={sidebarBtn(activeTab === "remove")} onClick={() => setActiveTab("remove")}>🗑️ Remove Employee</button>
          </aside>

          {/* Main Content */}
          <main style={main}>
            {loading && <div style={{ padding: 12, color: "#555" }}>Loading...</div>}
            {error && <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>}

            {/* ADD EMPLOYEE */}
            {activeTab === "add" && (
              <section>
                <h3>Add New Employee</h3>
                <form onSubmit={handleAddEmployee} style={formStyle}>
                  <input style={inputStyle} placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
                  <input style={inputStyle} placeholder="Department" value={department} onChange={(e)=>setDepartment(e.target.value)} required />
                  <input style={inputStyle} placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
                  <input style={inputStyle} placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                  <div style={{ display: "flex", gap: 12 }}>
                    <button style={btnPrimary} disabled={loading}>Add Employee</button>
                    <button type="button" style={btnSecondary} onClick={()=>{setName(""); setUsername(""); setPassword(""); setDepartment("");}}>Reset</button>
                  </div>
                </form>
              </section>
            )}

            {/* REGISTERED EMPLOYEES */}
            {activeTab === "list" && (
              <section>
                <h3>Registered Employees ({employees.length})</h3>
                {employees.length === 0 ? <p>No employees found.</p> :
                  <div style={grid}>{employees.map(emp => (
                    <div key={emp._id} style={employeeCard}>
                      <p><strong>Name:</strong> {emp.name}</p>
                      <p><strong>Username:</strong> {emp.username}</p>
                      <p><strong>Department:</strong> {emp.department}</p>
                    </div>
                  ))}</div>
                }
              </section>
            )}

            {/* COMPLAINTS */}
            {activeTab === "complaints" && (
              <section>
                {/* 🔹 DEBUG: show raw complaints JSON */}

                <h3>Registered Complaints ({complaints.length})</h3>
                {complaints.length === 0 ? <p>No complaints found.</p> :
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {enrichedComplaints.map(comp => (
                      <div key={comp._id} style={{...complaintCard, borderLeftColor: statusColor(comp.status)}}>
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                          <h4>{comp.title}</h4>
                          <span style={{color: statusColor(comp.status), fontWeight:600}}>{comp.status}</span>
                        </div>
                        <p><strong>Description:</strong> {comp.description}</p>
                        <p><strong>Department:</strong> {comp.department}</p>
                        <p><strong>Location:</strong> {comp.location || "Not provided"}</p>
                        {comp.image && <p><strong>Image:</strong> <a href={`http://localhost:5000/uploads/${comp.image}`} target="_blank" rel="noopener noreferrer">View</a></p>}
                        <div style={{marginTop:8,fontSize:13,color:"#444"}}><strong>Citizen:</strong> {comp.citizenName} | <strong>Phone:</strong> {comp.citizenPhone} | <strong>Email:</strong> {comp.citizenEmail}</div>
                        <div style={{marginTop:4,fontSize:12,color:"#666"}}>Filed on: {new Date(comp.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                }
              </section>
            )}

            {/* REMOVE EMPLOYEE */}
            {activeTab === "remove" && (
              <section>
                <h3>Remove Employee</h3>
                {employees.length === 0 ? <p>No employees to remove.</p> :
                  <div style={grid}>{employees.map(emp => (
                    <div key={emp._id} style={employeeCard}>
                      <p><strong>Name:</strong> {emp.name}</p>
                      <p><strong>Username:</strong> {emp.username}</p>
                      <p><strong>Department:</strong> {emp.department}</p>
                      <button style={btnDanger} onClick={()=>handleRemoveEmployee(emp._id, emp.username)} disabled={loading}>Remove</button>
                    </div>
                  ))}</div>
                }
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Styles
========================= */

const own = {
  background: "#f4f6f8",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const container = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  background: "#fff",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  background: "#4B0082",
  color: "#fff",
  fontWeight: 600,
  fontSize: 18,
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const layout = {
  display: "flex",
  flex: 1,
  height: "calc(100vh - 64px)",
};

// const sidebar = {
//   width: 240,
//   display: "flex",
//   flexDirection: "column",
//   background: "#2E1A47",
//   color: "#fff",
//   padding: "24px 12px",
//   gap: 12,
// };
const sidebar = {
  width: "240",
  background: "#2E1A47",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  position: "sticky",
  top: 0,
  height: "100vh",
};

const sidebarBtn = (active) => ({
  padding: "12px 16px",
  background: active ? "#4B0082" : "transparent",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  textAlign: "left",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: 8,
});

const main = {
  flex: 1,
  padding: 24,
  overflowY: "auto",
  background: "#f4f6f8",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 12,
  maxWidth: 520,
};

const inputStyle = {
  padding: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
  outline: "none",
  fontSize: 14,
};

const btnPrimary = {
  padding: "10px 16px",
  borderRadius: 6,
  border: "none",
  background: "#4B0082",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary = {
  padding: "10px 16px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};

const btnDanger = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "none",
  background: "#E53935",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
};

const employeeCard = {
  padding: 16,
  borderRadius: 8,
  background: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const complaintCard = {
  padding: 16,
  borderRadius: 8,
  background: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  borderLeft: "4px solid #8E24AA",
};

const statusColor = (status) => {
  switch (status) {
    case "Resolved": return "#388E3C";
    case "In Progress": return "#F57C00";
    default: return "#8E24AA";
  }
};
