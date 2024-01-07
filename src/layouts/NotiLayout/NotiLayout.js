import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
// import { NotificationProvider } from "../../context/NotificationContext";


function Default({ children }) {
  return (
    <div>
      <NavBar />
        {children}
      <Footer />
    </div>
  );
}

export default Default;
