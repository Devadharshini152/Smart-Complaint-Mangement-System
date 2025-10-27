import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployeeLoginPage from "./pages/EmployeeLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CitizenLoginPage from "./pages/CitizenLoginPage";
import CitizenSignInPage from "./pages/CitizenSignInPage";
import CitizenAuthPage from "./pages/CitizenAuthPage";
import CitizenRegisterPage from "./pages/CitizenRegisterPage";
import CitizenSignUpPage from "./pages/CitizenSignupPage";
import CitizenDashboard from "./pages/CitizenDashboard";
import RegisterComplaintPage from "./pages/RegisterComplaintPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Redirect root path to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/employee-login" element={<EmployeeLoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />   {/* ✅ FIXED */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* ✅ ADDED */}
      <Route path="/citizen-login" element={<CitizenLoginPage />} />
      <Route path="/citizen-signin" element={<CitizenSignInPage />} />
      <Route path="/citizen-auth" element={<CitizenAuthPage />} />
      <Route path="/citizen-register" element={<CitizenRegisterPage />} />
      <Route path="/citizen-signup" element={<CitizenSignUpPage />} />
      <Route path="/dashboard" element={<CitizenDashboard />} />
      <Route path="/register-complaint" element={<RegisterComplaintPage />} />
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
    </Routes>
  );
}

export default App;
