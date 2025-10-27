// client/src/pages/CitizenSignUpPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

export default function CitizenSignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/citizens/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("username", data.citizen.username);
        localStorage.setItem("name", data.citizen.name);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={cardContainer}>
        <h1 style={title}>Citizen Login</h1>
        <p style={subtitle}>Access your dashboard to register and track complaints</p>

        <form onSubmit={handleSignUp} style={formStyle}>
          {/* Username */}
          <div style={inputGroup}>
            <FaUser style={icon} />
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={input}
              required
            />
          </div>

          {/* Password */}
          <div style={inputGroup}>
            <FaLock style={icon} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={input}
              required
            />
          </div>

          <button type="submit" style={button}>
            Sign In
          </button>
        </form>

        <div style={footerText}>
          <p>Don't have an account? <span style={link}>Register on the citizen app</span></p>
        </div>
      </div>
    </div>
  );
}

/* ========================= STYLES ========================= */

const pageWrapper = {
  backgroundImage: `url("/images/citizen-bg.png")`, // ✅ Your background stays here
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const cardContainer = {
  width: "100%",
  maxWidth: "420px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(8px)",
  padding: "40px 35px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const title = {
  fontSize: "2rem",
  fontWeight: "800",
  color: "#4B0082",
  marginBottom: "10px",
};

const subtitle = {
  fontSize: "1rem",
  color: "#555",
  marginBottom: "30px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroup = {
  display: "flex",
  alignItems: "center",
  border: "1.5px solid #ccc",
  borderRadius: "8px",
  padding: "12px 15px",
  background: "#fdfdfd",
  transition: "border-color 0.2s ease",
};

const icon = {
  color: "#4B0082",
  fontSize: "1.2rem",
  marginRight: "10px",
};

const input = {
  border: "none",
  outline: "none",
  flex: 1,
  fontSize: "1rem",
  background: "transparent",
};

const button = {
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(90deg, #6A0DAD, #8A2BE2)",
  color: "white",
  fontSize: "1.1rem",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px",
  transition: "background 0.3s ease, transform 0.2s ease",
};

const footerText = {
  marginTop: "25px",
  fontSize: "0.95rem",
  color: "#555",
};

const link = {
  color: "#4B0082",
  fontWeight: "700",
  cursor: "pointer",
  textDecoration: "underline",
};
