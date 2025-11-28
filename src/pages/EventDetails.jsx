import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const userId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const resOrg = await API.get(`/events/organized/${userId}`);
      const organizedEvent = resOrg.data.organized_events.find(
        (e) => e.id === parseInt(id, 10)
      );

      if (organizedEvent) {
        organizedEvent.role = "organizer";
        setEvent(organizedEvent);
        fetchInvitedUsers(organizedEvent.id);
        return;
      }

      const resInv = await API.get(`/events/invited/${userId}`);
      const invitedEvent = resInv.data.invited_events.find(
        (e) => e.id === parseInt(id, 10)
      );

      if (invitedEvent) {
        invitedEvent.role = "attendee";
        setEvent(invitedEvent);
        fetchInvitedUsers(invitedEvent.id);
        return;
      }

      alert("Event not found");
      navigate("/events");
    } catch (err) {
      console.error("Error fetching event:", err.response?.data || err);
      alert("Failed to load event");
      navigate("/events");
    }
  };

  const fetchInvitedUsers = async (eventId) => {
    try {
      const res = await API.get(`/events/${eventId}/invitations`);
      setEvent((prev) => ({
        ...prev,
        invitedUsers: res.data.map((inv) => inv.user_email || inv.user_id),
      }));
    } catch (err) {
      console.error("Error fetching invitations:", err.response?.data || err);
      setEvent((prev) => ({ ...prev, invitedUsers: [] }));
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;

    try {
      const res = await API.post("/invite", {
        event_id: event.id,
        email: inviteEmail,
      });
      setInviteMessage(res.data.message);
      setInviteEmail("");
      fetchInvitedUsers(event.id);
    } catch (err) {
      setInviteMessage(err.response?.data?.error || "Failed to invite user");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await API.delete(`/events/${event.id}`);
      navigate("/events");
    } catch (err) {
      console.error("Error deleting event:", err.response?.data || err);
      alert("Failed to delete event");
    }
  };

  if (!event) return <p>Loading event...</p>;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "500px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          padding: "30px",
        }}
      >
        {/* Title */}
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontSize: "28px", fontWeight: "600" }}>
          {event.title}
        </h1>

        {/* Event Info */}
        <div style={{ marginBottom: "20px", color: "#444" }}>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p style={{ marginTop: "10px" }}>{event.description}</p>
          <p style={{ marginTop: "10px" }}>
            <strong>Your Role:</strong>{" "}
            <span style={{
              padding: "3px 8px",
              borderRadius: "8px",
              fontSize: "12px",
              backgroundColor: event.role === "organizer" ? "#6a5acd33" : "#3b82f633",
              color: event.role === "organizer" ? "#6a5acd" : "#3b82f6",
            }}>
              {event.role}
            </span>
          </p>
        </div>

        {/* Invited Users */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "500" }}>Invited Users</h2>
          <ul style={{ padding: "10px", borderRadius: "12px", background: "#f1f5f9", listStyle: "none", maxHeight: "150px", overflowY: "auto" }}>
            {event.invitedUsers?.length > 0 ? (
              event.invitedUsers.map((email, idx) => (
                <li key={idx} style={{ marginBottom: "5px", color: "#555" }}>• {email}</li>
              ))
            ) : (
              <li style={{ color: "#777" }}>No invited users yet.</li>
            )}
          </ul>
        </div>

        {/* Invite Section */}
        {event.role === "organizer" && (
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "500" }}>Invite User</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="email"
                placeholder="Enter user email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{
                  flex: 1,
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
                onClick={handleInvite}
                style={{
                  padding: "10px 15px",
                  background: "linear-gradient(90deg, #6a5acd, #836fff)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
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
                Invite
              </button>
            </div>
            {inviteMessage && <p style={{ color: "green", marginTop: "8px" }}>{inviteMessage}</p>}
          </div>
        )}

        {/* Delete Button */}
        {event.role === "organizer" && (
          <button
            onClick={handleDelete}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: "8px",
              background: "#ef4444",
              color: "#fff",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "10px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Delete Event
          </button>
        )}

        {/* Back Button */}
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
      </div>
    </div>
  );
}
