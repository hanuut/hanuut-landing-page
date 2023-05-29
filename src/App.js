import React from "react";
import CustomRouter from "./components/CustomRouter";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./config/GlobalStyles";
import { light } from "./config/Themes";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Footer from "./components/Footer";

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const preferredLang = localStorage.getItem("preferredLang");
    if (preferredLang) {
      i18n.changeLanguage(preferredLang);
    }
  }, [i18n]);

  return (
    <div className="App">
      <GlobalStyles />
      <ThemeProvider theme={light}>
        {/* <MainInfos /> */}
        <Navbar />
        <CustomRouter />
        <Footer />
      </ThemeProvider>
    </div>
  );
};

export default App;
