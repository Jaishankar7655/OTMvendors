import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./Approuter";
import "./index.css"; // Your global styles if needed
import LoverStrip from "./Components/LoverStrip";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <AppRouter />
      <LoverStrip />
      
    </BrowserRouter>
    <Footer />
  </React.StrictMode>
);
