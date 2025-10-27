import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterComplaintPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => alert("Unable to fetch location")
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const citizenUsername = localStorage.getItem("username");

    const formData = new FormData();
    formData.append("citizenUsername", citizenUsername);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("department", department);
    formData.append("location", location);
    if (image) formData.append("image", image);

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ Fixed URL here
      const res = await fetch("http://localhost:5000/complaints/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data.message || "This complaint has already been registered.",
        });
        setShowModal(true);
      } else {
        setMessage({
          type: "success",
          text: "✅ Complaint submitted successfully!",
        });
        setTitle("");
        setDescription("");
        setDepartment("");
        setLocation("");
        setImage(null);
        setTimeout(() => navigate("/dashboard", { state: { refresh: true } }), 1000);
      }
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setMessage({
        type: "error",
        text: "❌ Something went wrong. Please try again.",
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h2 style={titleText}>📝 Register New Complaint</h2>
        <p style={subtitleText}>Fill out the details below to submit your complaint.</p>

        <form onSubmit={handleSubmit} style={form}>
          <input
            type="text"
            placeholder="Complaint Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={input}
            required
          />

          <textarea
            placeholder="Describe your complaint in detail"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={textarea}
            required
          />

          <input
            type="text"
            placeholder="Department (e.g., Water Supply, Roads)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={input}
            required
          />

          {/* 📍 Location Section */}
          <div style={locationRow}>
            <input
              type="text"
              placeholder="Enter location or use GPS"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ ...input, flex: 1 }}
            />
            <button type="button" onClick={handleUseMyLocation} style={locationBtn}>
              📍 Use My Location
            </button>
          </div>

          {/* 📸 File Upload */}
          <label style={fileLabel}>
            Upload Image (optional):
            <input type="file" onChange={(e) => setImage(e.target.files[0])} style={fileInput} />
          </label>

          {/* Action Buttons */}
          <div style={buttonRow}>
            <button
              type="button"
              onClick={() => navigate("/dashboard", { state: { refresh: true } })}
              style={cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" style={submitBtn} disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>

      {/* ⚠️ Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{ marginBottom: "15px" }}>
              ⚠️ {message.type === "error" ? "Duplicate or Error" : "Message"}
            </h3>
            <p style={{ marginBottom: "20px" }}>{message.text}</p>
            <button onClick={closeModal} style={modalBtn}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== 🎨 Styles ==================== */

const pageWrapper = {
  backgroundImage: `url("/images/citizen-bg.png")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
};

const card = {
  width: "100%",
  maxWidth: "550px",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  padding: "40px 35px",
  borderRadius: "20px",
  boxShadow: "0px 15px 30px rgba(0,0,0,0.25)",
  animation: "fadeIn 0.6s ease-in-out",
};

const titleText = {
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "800",
  marginBottom: "8px",
  color: "#4B0082",
};

const subtitleText = {
  textAlign: "center",
  color: "#555",
  marginBottom: "30px",
  fontSize: "1rem",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const input = {
  padding: "14px",
  borderRadius: "8px",
  border: "1.5px solid #ccc",
  fontSize: "1rem",
  outline: "none",
  transition: "border 0.2s ease",
};

const textarea = {
  ...input,
  minHeight: "120px",
  resize: "none",
};

const locationRow = {
  display: "flex",
  gap: "10px",
};

const locationBtn = {
  padding: "14px 18px",
  background: "linear-gradient(90deg, #6A0DAD, #8A2BE2)",
  color: "white",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  transition: "transform 0.2s ease",
};

const fileLabel = {
  fontWeight: "600",
  color: "#444",
  marginBottom: "5px",
};

const fileInput = {
  marginTop: "8px",
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "10px",
};

const cancelBtn = {
  padding: "12px 20px",
  background: "#ccc",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const submitBtn = {
  padding: "12px 20px",
  background: "linear-gradient(90deg, #6A0DAD, #8A2BE2)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "700",
  cursor: "pointer",
  transition: "background 0.3s ease, transform 0.2s ease",
};

/* 🎯 Modal */
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  textAlign: "center",
  width: "400px",
  boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
};

const modalBtn = {
  padding: "10px 20px",
  background: "#6A0DAD",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};
