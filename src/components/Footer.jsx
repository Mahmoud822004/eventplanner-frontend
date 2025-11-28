import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#f5f5f5",
        padding: "15px",
        textAlign: "center",
        color: "#555",
        fontSize: "14px",
        borderTop: "1px solid #ddd",
      }}
    >
      © {new Date().getFullYear()} EventPlanner. All rights reserved.
    </footer>
  );
}
