import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaUserCircle, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function CitizenRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:5000/citizens/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Registration failed" });
      } else {
        setMessage({ type: "success", text: data.message });
        setFormData({
          name: "",
          phone: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server error: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const globalStyles = `
    input::placeholder {
      color: rgba(255, 255, 255, 0.8);
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          backgroundImage: `url("/images/citizen-bg.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "420px",
            padding: "40px 35px",
            background: "linear-gradient(145deg, #f5f5f5ff, #180303ff)",
            borderRadius: "20px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
            color: "white",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              fontWeight: "800",
              fontSize: "2rem",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Citizen Registration
          </h2>

          {message.text && (
            <div
              style={{
                marginBottom: "15px",
                padding: "12px",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: "600",
                color: message.type === "success" ? "#155724" : "#721c24",
                backgroundColor:
                  message.type === "success" ? "#d4edda" : "#f8d7da",
                border: `1px solid ${
                  message.type === "success" ? "#c3e6cb" : "#f5c6cb"
                }`,
              }}
            >
              {message.text}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {/* Name */}
            <div style={inputWrapper}>
              <FaUser style={iconStyle} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Phone */}
            <div style={inputWrapper}>
              <FaPhone style={iconStyle} />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div style={inputWrapper}>
              <FaEnvelope style={iconStyle} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Username */}
            <div style={inputWrapper}>
              <FaUserCircle style={iconStyle} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={inputWrapper}>
              <FaLock style={iconStyle} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <span
                style={eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div style={inputWrapper}>
              <FaLock style={iconStyle} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <span
                style={eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px",
                border: "none",
                borderRadius: "12px",
                background: "linear-gradient(90deg, #BA68C8, #7B1FA2)",
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                marginTop: "10px",
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => !loading && (e.target.style.transform = "scale(1)")}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p
              style={{
                textAlign: "center",
                marginTop: "15px",
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Already have an account?{" "}
              <span
                style={{
                  color: "#FFD700",
                  fontWeight: "700",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

/* 🎨 Styles */
const inputWrapper = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const iconStyle = {
  position: "absolute",
  left: "14px",
  color: "rgba(255,255,255,0.9)",
  fontSize: "1.2rem",
};

const inputStyle = {
  width: "100%",
  padding: "14px 45px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.5)",
  background: "rgba(0,0,0,0.4)",
  color: "#ffffff",
  fontWeight: "500",
  fontSize: "1rem",
  transition: "all 0.3s ease",
  outline: "none",
};

const eyeIcon = {
  position: "absolute",
  right: "14px",
  color: "rgba(255,255,255,0.9)",
  fontSize: "1.2rem",
  cursor: "pointer",
};
