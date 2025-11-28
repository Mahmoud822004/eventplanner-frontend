import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Events() {
  const [organizedEvents, setOrganizedEvents] = useState([]);
  const [invitedEvents, setInvitedEvents] = useState([]);

  // NEW: Search + Filter states
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

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
    } catch (err) {
      console.error("Error fetching organized events:", err.response?.data || err);
    }
  };

  const fetchInvited = async () => {
    try {
      const res = await API.get(`/events/invited/${userId}`);
      setInvitedEvents(res.data.invited_events || []);
    } catch (err) {
      console.error("Error fetching invited events:", err.response?.data || err);
    }
  };

  // 🔍 NEW: Filter function (applied live)
  const applyFilters = (events) => {
    return events.filter((event) => {
      const matchSearch = event.title.toLowerCase().includes(search.toLowerCase());

      const matchDate =
        filterDate === "" || event.date.startsWith(filterDate);

      const matchLocation =
        filterLocation === "" ||
        event.location.toLowerCase().includes(filterLocation.toLowerCase());

      return matchSearch && matchDate && matchLocation;
    });
  };

  const filteredOrganized = applyFilters(organizedEvents);
  const filteredInvited = applyFilters(invitedEvents);

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
        <h1
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontSize: "28px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          Your Events
        </h1>

        {/* 🔍 NEW: Search + Filters */}
        <div
          style={{
            marginBottom: "25px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Filter by location..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            style={inputStyle}
          />
        </div>

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
          <h2 style={sectionTitle}>Organized Events</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredOrganized.length > 0 ? (
              filteredOrganized.map((event) => (
                <li
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  style={eventItem}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#e0eafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#f1f5f9")
                  }
                >
                  {event.title}
                </li>
              ))
            ) : (
              <li style={{ color: "#777" }}>No organized events found.</li>
            )}
          </ul>
        </div>

        <div>
          <h2 style={sectionTitle}>Invited Events</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredInvited.length > 0 ? (
              filteredInvited.map((event) => (
                <li
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                  style={eventItem}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#e0eafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#f1f5f9")
                  }
                >
                  {event.title}
                </li>
              ))
            ) : (
              <li style={{ color: "#777" }}>No invited events found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const sectionTitle = {
  marginBottom: "10px",
  fontSize: "18px",
  fontWeight: "500",
  color: "#333",
};

const eventItem = {
  cursor: "pointer",
  marginBottom: "8px",
  padding: "8px 12px",
  borderRadius: "8px",
  background: "#f1f5f9",
  color: "#6a5acd",
  fontWeight: "500",
  transition: "background 0.2s",
};
