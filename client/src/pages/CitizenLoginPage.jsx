import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function CitizenLoginPage() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Citizen Portal</h1>
        <p style={subheadingStyle}>Access your account or create a new one</p>

        <div style={buttonContainer}>
          {/* ✅ Sign In (➡️ goes to citizen-register like original) */}
          <button
            style={loginButton}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => navigate("/citizen-register")}
          >
            <FaSignInAlt style={iconStyle} /> Sign In
          </button>

          {/* ✅ Sign Up (➡️ goes to citizen-signup like original) */}
          <button
            style={signupButton}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onClick={() => navigate("/citizen-signup")}
          >
            <FaUserPlus style={iconStyle} /> Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 Styles */
const containerStyle = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  //background: "linear-gradient(135deg, #f4f3f5ff, #8e2de2)", // purple gradient background
  backgroundImage: `url("/images/citizen-bg.png")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "20px",
};


const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "50px 40px",
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(12px)",
  borderRadius: "20px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
  textAlign: "center",
  color: "#fff",
};

const headingStyle = {
  fontSize: "2.5rem",
  fontWeight: "800",
  marginBottom: "10px",
};

const subheadingStyle = {
  fontSize: "1.1rem",
  opacity: "0.9",
  marginBottom: "40px",
};

const buttonContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const baseButton = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "12px",
  fontSize: "1.2rem",
  fontWeight: "700",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
};

const loginButton = {
  ...baseButton,
  background: "linear-gradient(135deg, #4A00E0, #8E2DE2)", // deep purple
  color: "#fff",
};

const signupButton = {
  ...baseButton,
  background: "linear-gradient(135deg, #FF9800, #FF6F00)", // orange gradient
  color: "#fff",
};

const iconStyle = {
  marginRight: "12px",
  fontSize: "1.4rem",
};
