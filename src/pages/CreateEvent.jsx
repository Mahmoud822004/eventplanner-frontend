import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = parseInt(localStorage.getItem("userId"), 10);
    if (!userId || isNaN(userId)) {
      alert("User not logged in properly! Please log in again.");
      return;
    }

    const payload = {
      ...form,
      date: new Date(form.date).toISOString(),
      organizer_id: userId,
    };

    try {
      const res = await API.post("/events", payload);
      console.log("Event created:", res.data);
      navigate("/events");
    } catch (err) {
      console.error("POST ERROR:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to create event");
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
          width: "400px",
          background: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#333" }}>Create Event</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            name="title"
            placeholder="Title"
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
            type="date"
            name="date"
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
            type="time"
            name="time"
            onChange={handleChange}
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
            name="location"
            placeholder="Location"
            onChange={handleChange}
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

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              minHeight: "80px",
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
              padding: "12px 0",
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
            Create Event
          </button>

             <button
          onClick={() => navigate("/events")}
          style={{
            width: "100%",
            padding: "10px 0",
            borderRadius: "8px",
            background: "#6b7280",
            color: "#fff",
            fontWeight: "500",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          Back to Events
        </button>
        </form>
      </div>
    </div>
  );
}
