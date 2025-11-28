import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Events() {
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [invitedEvents, setInvitedEvents] = useState([]);

  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    fetchOrganized();
    fetchInvited();
  }, []);

  const fetchOrganized = async () => {
    try {
      const res = await API.get(`/events/organized/${userId}`);
      setOrganizedEvents(res.data.organized_events || []);
      console.log("Organized Events:", res.data.organized_events);
    } catch (err) {
      console.error("Error fetching organized events:", err.response?.data || err);
    }
  };

  const fetchInvited = async () => {
    try {
      const res = await API.get(`/events/invited/${userId}`);
      setInvitedEvents(res.data.invited_events || []);
      console.log("Invited Events:", res.data.invited_events);
    } catch (err) {
      console.error("Error fetching invited events:", err.response?.data || err);
    }
  };

  return (
<div
  style={{
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
    fontFamily: "Poppins, sans-serif",
    padding: "20px",
  }}
>
  <div
    style={{
      width: "900px",
      maxHeight: "60vh", 
      overflowY: "auto", 
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      padding: "30px",
    }}
  >
        <h1 style={{ textAlign: "center", marginBottom: "25px", fontSize: "28px", fontWeight: "600", color: "#333" }}>
          Your Events
        </h1>

        <button
          onClick={() => navigate("/create-event")}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: "8px",
            background: "linear-gradient(90deg, #6a5acd, #836fff)",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "30px",
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
          Create New Event
        </button>

        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "500", color: "#333" }}>Organized Events</h2>
          <ul style={{ listStyle: "none", padding: "0" }}>
            {organizedEvents.length > 0 ? (
              organizedEvents.map((event) => (
                <li
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  style={{
                    cursor: "pointer",
                    marginBottom: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "#f1f5f9",
                    color: "#6a5acd",
                    fontWeight: "500",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#e0eafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                >
                  {event.title}
                </li>
              ))
            ) : (
              <li style={{ color: "#777" }}>No organized events yet.</li>
            )}
          </ul>
        </div>

        <div>
          <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "500", color: "#333" }}>Invited Events</h2>
          <ul style={{ listStyle: "none", padding: "0" }}>
            {invitedEvents.length > 0 ? (
              invitedEvents.map((event) => (
                <li
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  style={{
                    cursor: "pointer",
                    marginBottom: "8px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "#f1f5f9",
                    color: "#6a5acd",
                    fontWeight: "500",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#e0eafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                >
                  {event.title}
                </li>
              ))
            ) : (
              <li style={{ color: "#777" }}>No invited events yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
