//AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Admin login successful!");
        localStorage.setItem("isAdmin", "true");
        navigate("/admin-dashboard");
      } else {
        alert(data.message || "❌ Invalid credentials");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      alert("Server error");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Admin Login</h2>
        <form style={form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={input}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            required
          />
          <button
            type="submit"
            style={btn}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

/* 🎨 Styles */
const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url("/images/background.png")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  //background: "linear-gradient(135deg, #9463c9ff, #f8f8f8ff)", // Beautiful purple-blue gradient
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "20px",
};

const card = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(15px)",
  padding: "40px 30px",
  borderRadius: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
  width: "100%",
  maxWidth: "400px",
  textAlign: "center",
  color: "#fff",
};

const title = {
  fontSize: "2rem",
  fontWeight: "800",
  marginBottom: "30px",
  color: "#000000ff",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "rgba(255,255,255,0.25)",
  color: "#000000ff",
  fontSize: "16px",
  outline: "none",
  textAlign: "left",
};

const btn = {
  padding: "14px",
  background: "linear-gradient(135deg, #7B1FA2, #9C27B0)",
  color: "#050000ff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "16px",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 20px rgba(123,31,162,0.4)",
};
