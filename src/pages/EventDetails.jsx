import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [invitationId, setInvitationId] = useState(null);

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
        fetchUserInvitation(invitedEvent.id);
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

  // Fetch all invitations for this event (with user info)
  const fetchInvitedUsers = async (eventId) => {
    try {
      const res = await API.get(`/events/${eventId}/attendees`);
      const invitations = res.data;

      setEvent((prev) => ({
        ...prev,
        invitedUsersFull: invitations,
        invitedUsers: invitations.map((inv) => inv.user?.name || inv.user_id),
        goingUsers: invitations
          .filter((inv) => inv.status === "going")
          .map((inv) => inv.user?.name || inv.user_id),
      }));
    } catch (err) {
      console.error("Error fetching invitations:", err.response?.data || err);
      setEvent((prev) => ({
        ...prev,
        invitedUsersFull: [],
        invitedUsers: [],
        goingUsers: [],
      }));
    }
  };

  // Fetch current user's invitation to get ID and status
  const fetchUserInvitation = async (eventId) => {
    try {
      const res = await API.get(`/events/${eventId}/attendees`);
      const invitation = res.data.find((inv) => inv.user_id === userId);
      if (invitation) {
        setInvitationId(invitation.id);
        setRsvpStatus(invitation.status);
      }
    } catch (err) {
      console.error("Error fetching user invitation:", err.response?.data || err);
    }
  };

  const updateRSVP = async (status) => {
    try {
      await API.put(`/rsvp/${invitationId}`, { status });
      setRsvpStatus(status);
      alert("RSVP updated!");
      fetchInvitedUsers(event.id); // Refresh lists after RSVP change
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to update RSVP");
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
          width: "990px",
          maxHeight: "70vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          padding: "30px",
        }}
      >
        {/* Title */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
            fontSize: "28px",
            fontWeight: "600",
          }}
        >
          {event.title}
        </h1>

        {/* Event Info */}
        <div style={{ marginBottom: "20px", color: "#444" }}>
          <p>
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {event.time}
          </p>
          <p>
            <strong>Location:</strong> {event.location}
          </p>
          <p style={{ marginTop: "10px" }}>{event.description}</p>
          <p style={{ marginTop: "10px" }}>
            <strong>Your Role:</strong>{" "}
            <span
              style={{
                padding: "3px 8px",
                borderRadius: "8px",
                fontSize: "12px",
                backgroundColor:
                  event.role === "organizer" ? "#6a5acd33" : "#3b82f633",
                color: event.role === "organizer" ? "#6a5acd" : "#3b82f6",
              }}
            >
              {event.role}
            </span>
          </p>
        </div>

        {/* RSVP Section for Attendees */}
        {event.role === "attendee" && invitationId && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Your RSVP Status:</h3>
            <select
              value={rsvpStatus}
              onChange={(e) => updateRSVP(e.target.value)}
              style={{ padding: "10px", borderRadius: "8px", fontSize: "16px" }}
            >
              <option value="">Select</option>
              <option value="going">Going</option>
              <option value="maybe">Maybe</option>
              <option value="not_going">Not Going</option>
            </select>
          </div>
        )}

        {/* Invited Users */}
        {event.role === "organizer" && (
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "500" }}>
              Invited Users
            </h2>
            <ul
              style={{
                padding: "10px",
                borderRadius: "12px",
                background: "#f1f5f9",
                listStyle: "none",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {event.invitedUsers?.length > 0 ? (
                event.invitedUsers.map((name, idx) => (
                  <li key={idx} style={{ marginBottom: "5px", color: "#555" }}>
                    • {name}
                  </li>
                ))
              ) : (
                <li style={{ color: "#777" }}>No invited users yet.</li>
              )}
            </ul>

            {/* Going Users */}
            {event.goingUsers && (
              <div style={{ marginTop: "15px" }}>
                <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "500" }}>
                  Going Users
                </h2>
                <ul
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    background: "#e6f4ea",
                    listStyle: "none",
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {event.goingUsers.length > 0 ? (
                    event.goingUsers.map((name, idx) => (
                      <li key={idx} style={{ marginBottom: "5px", color: "#2e7d32" }}>
                        • {name}
                      </li>
                    ))
                  ) : (
                    <li style={{ color: "#777" }}>No users are going yet.</li>
                  )}
                </ul>
              </div>
            )}

            {/* Invite Section */}
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
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
                }}
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
                }}
              >
                Invite
              </button>
            </div>
            {inviteMessage && (
              <p style={{ color: "green", marginTop: "8px" }}>{inviteMessage}</p>
            )}
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
            }}
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
          }}
        >
          Back to Events
        </button>
      </div>
    </div>
  );
}
