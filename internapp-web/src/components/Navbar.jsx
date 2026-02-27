import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, roleValue, logout } = useAuth();
  const navigate = useNavigate();

  const baseLinkStyle = {
    textDecoration: "none",
    transition: "0.2s ease",
  };

  const linkStyle = ({ isActive }) => ({
    ...baseLinkStyle,
    fontWeight: isActive ? "600" : "500",
    color: isActive ? "#38bdf8" : "#e2e8f0",
  });

  // ✅ Role bazlı ilan linki
  const internshipsLink =
    isAuth && roleValue === "Company" ? "/company/internships" : "/internships";

  const internshipsText =
    isAuth && roleValue === "Company" ? "İlanlarım" : "İlanlar";

  return (
    <nav style={navStyle}>
      {/* LOGO */}
      <NavLink to="/" style={logoStyle}>
        Intern<span style={{ color: "#38bdf8" }}>App</span>
      </NavLink>

      <div style={menuContainer}>
        {/* ✅ PUBLIC / ROLE-BASED */}
        <NavLink to={internshipsLink} style={linkStyle}>
          {internshipsText}
        </NavLink>

        {/* AUTH YOK */}
        {!isAuth && (
          <>
            <NavLink to="/login" style={linkStyle}>
              Giriş
            </NavLink>

            <NavLink to="/register" style={registerButton}>
              Başla
            </NavLink>
          </>
        )}

        {/* COMPANY */}
        {isAuth && roleValue === "Company" && (
          <>
            <NavLink to="/company/dashboard" style={linkStyle}>
              Panel
            </NavLink>

            <NavLink to="/company/profile" style={linkStyle}>
              Şirket Profili
            </NavLink>

            <NavLink to="/company/create-internship" style={linkStyle}>
              İlan Oluştur
            </NavLink>

            <NavLink to="/company/applications" style={linkStyle}>
              Başvurular
            </NavLink>

            <LogoutButton logout={logout} navigate={navigate} />
          </>
        )}

        {/* STUDENT */}
        {isAuth && roleValue === "User" && (
          <>
            <NavLink to="/student/applications" style={linkStyle}>
              Başvurularım
            </NavLink>

            <NavLink to="/student/profile" style={linkStyle}>
              Profilim
            </NavLink>

            <LogoutButton logout={logout} navigate={navigate} />
          </>
        )}
      </div>
    </nav>
  );
}

function LogoutButton({ logout, navigate }) {
  return (
    <button
      onClick={() => {
        logout();
        navigate("/");
      }}
      style={logoutStyle}
      onMouseOver={(e) => (e.target.style.background = "#1e293b")}
      onMouseOut={(e) => (e.target.style.background = "transparent")}
    >
      Çıkış
    </button>
  );
}

/* ---------- STYLES ---------- */

const navStyle = {
  padding: "18px 60px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#0f172a",
  borderBottom: "1px solid #1e293b",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const logoStyle = {
  fontSize: "22px",
  fontWeight: "700",
  letterSpacing: "1px",
  textDecoration: "none",
  color: "#ffffff",
  transition: "0.2s ease",
};

const menuContainer = {
  display: "flex",
  gap: "26px",
  alignItems: "center",
};

const registerButton = {
  background: "#38bdf8",
  padding: "8px 16px",
  borderRadius: "8px",
  color: "#0f172a",
  fontWeight: "600",
  textDecoration: "none",
  transition: "0.2s ease",
};

const logoutStyle = {
  background: "transparent",
  border: "1px solid #38bdf8",
  color: "#38bdf8",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "0.2s ease",
};