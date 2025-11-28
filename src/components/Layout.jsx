import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  
  const hideHeaderFooterRoutes = [ "/login", "/signup","/"];

  const hide = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {!hide && <Header />}

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {children}
      </div>

        {!hide && <Footer />}
    </div>
  );
}
