// client/src/pages/CitizenSignInPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

export default function CitizenSignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/citizens/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      navigate("/citizen-dashboard"); // 🚀 redirect to dashboard
    } else {
      setError(data.message || "Invalid username or password");
    }
  };

  return (
    <div style={own}>
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url("/images/login-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "15px",
          boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff" }}>
          Citizen Sign In
        </h2>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Username */}
          <div style={inputWrapper}>
            <FaUser style={iconStyle} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={inputWrapper}>
            <FaLock style={iconStyle} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>Sign In</button>
        </form>
      </div>
    </div>
    </div>
  );
}
const own={
   backgroundImage: `url("/images/purplebackground.png")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  padding: "40px 20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const inputWrapper = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "10px",
  background: "#f9f9f9",
};

const inputStyle = {
  border: "none",
  outline: "none",
  marginLeft: "10px",
  width: "100%",
  fontSize: "1rem",
  background: "transparent",
};

const iconStyle = {
  color: "#555",
  fontSize: "1.2rem",
};

const buttonStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "none",
  background: "#28a745",
  color: "white",
  fontSize: "1.1rem",
  cursor: "pointer",
  marginTop: "10px",
};
