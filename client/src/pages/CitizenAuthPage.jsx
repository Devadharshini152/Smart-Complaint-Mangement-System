// client/src/pages/CitizenAuthPage.jsx
import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

export default function CitizenAuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Password validation regex
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, include 1 uppercase, 1 number, and 1 special character."
      );
      return;
    }

    setError("");
    alert("Login Successful ✅");
    // here you can navigate or call API
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url("/images/citizen-auth-bg.jpg")`, // make sure this file exists
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "30px",
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#007bff" }}>
          Citizen Authentication
        </h2>

        <form
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          onSubmit={handleLogin}
        >
          <div style={inputWrapper}>
            <FaUser style={iconStyle} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputWrapper}>
            <FaLock style={iconStyle} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "0.9rem", textAlign: "center" }}>
              {error}
            </p>
          )}

          <button style={buttonStyle} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

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
