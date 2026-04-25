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
    // FIX: Use the exact same key you use in LanguagesDropDown.js
    const preferredLang = localStorage.getItem("preferredLanguage");
    
    if (preferredLang && i18n.language !== preferredLang) {
      i18n.changeLanguage(preferredLang);
    }

    // Force HTML document to respect the single source of truth globally
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";

  }, [i18n, i18n.language]);

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