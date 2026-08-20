// src/App.js
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";

import CustomRouter from "./components/CustomRouter";
import GlobalStyles from "./config/GlobalStyles";
import { light } from "./config/Themes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MinimalFooter from "./components/MinimalFooter";

const App = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const initializeLanguage = () => {
      const savedLang = localStorage.getItem("preferredLanguage");
      if (savedLang) {
        i18n.changeLanguage(savedLang);
        return;
      }

      const browserLang = navigator.language.split("-")[0];
      const supported = ["ar", "en", "fr"];
      // EPIC 2: Changed default fallback from "ar" to "fr" (French)
      const defaultLang = supported.includes(browserLang) ? browserLang : "fr";

      i18n.changeLanguage(defaultLang);
      localStorage.setItem("preferredLanguage", defaultLang);
    };

    initializeLanguage();
  }, [i18n]);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const isShopPage =
    /^\/(@[^/]+|shop\/[^/]+)/.test(location.pathname) ||
    location.pathname.toLowerCase() === "/auraslab";

  return (
    <div className="App">
      <GlobalStyles />
      <ThemeProvider theme={light}>
        <Navbar />
        <CustomRouter />
        {isShopPage ? <MinimalFooter /> : <Footer />}
      </ThemeProvider>
    </div>
  );
};

export default App;
