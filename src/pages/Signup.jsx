import { useState } from "react";
import API from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/signup", form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Signup failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          width: "350px",
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Create Account</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6a5acd")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          <input
            name="email"
            placeholder="Email Address"
            type="email"
            onChange={handleChange}
            required
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6a5acd")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6a5acd")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />

          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg, #6a5acd, #836fff)",
              color: "white",
              border: "none",
              padding: "10px 0",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "transform 0.2s, opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.03)";
              e.target.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.opacity = "1";
            }}
          >
            Sign Up
          </button>

          <p style={{ fontSize: "13px", color: "#666" }}>
            Already have an account?{" "}
            <span
              style={{
                color: "#6a5acd",
                fontWeight: "500",
                cursor: "pointer",
              }}
              onClick={() => (window.location.href = "/login")}
            >
              Log in
            </span>
          </p>
        </form>

        <p style={{ marginTop: "15px", color: message.includes("failed") ? "red" : "green" }}>
          {message}
        </p>
      </div>
    </div>
  );
}
