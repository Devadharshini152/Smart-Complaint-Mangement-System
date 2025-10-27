// client/src/pages/EmployeeLoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/employees/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, department }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Employee login successful!");
        localStorage.setItem("isEmployee", "true");
        localStorage.setItem("employeeDepartment", data.employee.department);
        localStorage.setItem("employeeName", data.employee.name);
        navigate("/employee-dashboard");
      } else {
        alert(data.message || "❌ Invalid credentials");
      }
    } catch (err) {
      console.error("Employee login error:", err);
      alert("Server error");
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={loginCard}>
        <h2 style={title}>👨‍💼 Employee Login</h2>
        <p style={subtitle}>Access your department’s complaint dashboard</p>

        <form onSubmit={handleSubmit} style={form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            required
          />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={input}
            required
          />

          <button type="submit" style={button}>
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

/* 🎨 Styles – Polished & Professional */

const pageWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundImage: `url("/images/citizen-bg.png")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "40px 20px",
};

const loginCard = {
  width: "100%",
  maxWidth: "420px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(12px)",
  padding: "45px 35px",
  borderRadius: "20px",
  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.25)",
  textAlign: "center",
  animation: "fadeIn 0.5s ease-in-out",
};

const title = {
  fontSize: "2rem",
  fontWeight: "800",
  color: "#4B0082",
  marginBottom: "8px",
};

const subtitle = {
  fontSize: "1rem",
  color: "#555",
  marginBottom: "35px",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const input = {
  padding: "14px",
  borderRadius: "8px",
  border: "1.8px solid #C7B9FF",
  fontSize: "16px",
  outline: "none",
  background: "#f9f9ff",
  transition: "border 0.3s ease, box-shadow 0.3s ease",
};

const button = {
  padding: "14px",
  background: "linear-gradient(90deg, #6A0DAD, #8A2BE2)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

