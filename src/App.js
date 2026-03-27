import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // <-- Import useLocation
import { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";

import CustomRouter from "./components/CustomRouter";
import GlobalStyles from "./config/GlobalStyles";
import { light } from "./config/Themes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MinimalFooter from "./components/MinimalFooter"; // <-- Import MinimalFooter

const App = () => {
  const { i18n } = useTranslation();
  const location = useLocation(); // <-- Get location object

  useEffect(() => {
    const preferredLang = localStorage.getItem("preferredLang");
    if (preferredLang) {
      i18n.changeLanguage(preferredLang);
    }
  }, [i18n]);

  // --- Logic to determine which footer to show ---
  const isShopPage = /^\/(@[^/]+|shop\/[^/]+)/.test(location.pathname);

  return (
    <div className="App">
      <GlobalStyles />
      <ThemeProvider theme={light}>
        <Navbar />
        <CustomRouter />
        {/* --- Conditional Rendering of the Footer --- */}
        {isShopPage ? <MinimalFooter /> : <Footer />}
      </ThemeProvider>
    </div>
  );
};

export default App;