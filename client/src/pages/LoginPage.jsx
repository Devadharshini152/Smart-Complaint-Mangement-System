import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUser, FaUserTie } from "react-icons/fa";

export default function LoginPage() {
  const navigate = useNavigate();

  // --- Styles ---
  const mainContainer = {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "hidden",
  };

  const backgroundImage = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url("/images/background.png")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.6)", // dim the image so content stands out
    zIndex: 0,
  };

  const card = {
    position: "relative",
    zIndex: 1,
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(15px)",
    padding: "50px 40px",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    width: "350px",
    textAlign: "center",
    color: "#fff",
  };

  const title = {
    fontSize: "2.5rem",
    fontWeight: "900",
    marginBottom: "40px",
    color: "#fff",
    textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
  };

  const button = {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.2rem",
    fontWeight: "700",
    cursor: "pointer",
    margin: "12px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const adminButton = {
    ...button,
    background: "linear-gradient(135deg, #7B1FA2, #9C27B0)",
    boxShadow: "0 6px 20px rgba(123,31,162,0.4)",
  };

  const citizenButton = {
    ...button,
    background: "linear-gradient(135deg, #FF6F00, #FF9800)",
    boxShadow: "0 6px 20px rgba(255,111,0,0.4)",
  };

  const employeeButton = {
    ...button,
    background: "linear-gradient(135deg, #00BCD4, #00ACC1)",
    boxShadow: "0 6px 20px rgba(0,188,212,0.4)",
  };

  const handleHover = (e) => (e.currentTarget.style.transform = "scale(1.05)");
  const handleLeave = (e) => (e.currentTarget.style.transform = "scale(1)");

  return (
    <div style={mainContainer}>
      <div style={backgroundImage} />
      <div style={card}>
        <h1 style={title}>Smart Complaint Management</h1>

        <button
          style={adminButton}
          onClick={() => navigate("/admin-login")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaUserShield /> Admin
        </button>

        <button
          style={citizenButton}
          onClick={() => navigate("/citizen-login")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaUser /> Citizen
        </button>

        <button
          style={employeeButton}
          onClick={() => navigate("/employee-login")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaUserTie /> Employee
        </button>
      </div>
    </div>
  );
}
