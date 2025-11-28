import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage (token, userId, etc.)
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Redirect to login
    navigate("/login");
  };

  return (
    <header
      style={{
        background: "linear-gradient(90deg, #6a5acd, #836fff)",
        padding: "15px 30px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate("/events")}>
        EventPlanner
      </h2>
      <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "#6a5acd",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
