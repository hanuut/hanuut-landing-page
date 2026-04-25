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
    const initializeLanguage = () => {
      // 1. Check Storage
      const savedLang = localStorage.getItem("preferredLanguage");
      if (savedLang) {
        i18n.changeLanguage(savedLang);
        return;
      }

      // 2. Fallback to Browser Language
      const browserLang = navigator.language.split("-")[0];
      const supported = ["ar", "en", "fr"];
      const defaultLang = supported.includes(browserLang) ? browserLang : "ar";
      
      i18n.changeLanguage(defaultLang);
      localStorage.setItem("preferredLanguage", defaultLang);
    };

    initializeLanguage();
  }, [i18n]);

  // Apply RTL/LTR to the root HTML tag so it never desyncs
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

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