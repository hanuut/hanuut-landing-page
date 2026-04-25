import React from "react";
import { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";

const GlobalStyles = createGlobalStyle`
  /* 1. LOAD LOCAL FONTS FROM PUBLIC FOLDER */
  @font-face {
    font-family: 'KOGhorab';
    src: url('/fonts/KOGhorab-Regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  /* Manrope */
  @font-face { font-family: 'Manrope'; src: url('/fonts/manrope-thin.otf') format('opentype'); font-weight: 100; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url('/fonts/manrope-light.otf') format('opentype'); font-weight: 300; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url('/fonts/manrope-regular.otf') format('opentype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url('/fonts/manrope-medium.otf') format('opentype'); font-weight: 500; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url('/fonts/manrope-semibold.otf') format('opentype'); font-weight: 600; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url('/fonts/manrope-bold.otf') format('opentype'); font-weight: 700; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url('/fonts/manrope-extrabold.otf') format('opentype'); font-weight: 800; font-display: swap; }

  /* Tajawal */
  @font-face { font-family: 'Tajawal'; src: url('/fonts/Tajawal-ExtraLight.ttf') format('truetype'); font-weight: 200; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url('/fonts/Tajawal-Light.ttf') format('truetype'); font-weight: 300; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url('/fonts/Tajawal-Regular.ttf') format('truetype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url('/fonts/Tajawal-Medium.ttf') format('truetype'); font-weight: 500; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url('/fonts/Tajawal-Bold.ttf') format('truetype'); font-weight: 700; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url('/fonts/Tajawal-ExtraBold.ttf') format('truetype'); font-weight: 800; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url('/fonts/Tajawal-Black.ttf') format('truetype'); font-weight: 900; font-display: swap; }

  /* 2. DYNAMIC CSS VARIABLES BASED ON LANGUAGE */
  :root {
    --font-primary: ${props => props.isArabic ? "'Tajawal', sans-serif" : "'Manrope', sans-serif"};
    --font-title: ${props => props.isArabic ? "'KOGhorab', sans-serif" : "'Manrope', sans-serif"};
  }

  /* 3. GLOBAL APPLY (using !important to override old hardcoded inline styles) */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-primary) !important;
    overflow-x: hidden;
    background-color: #fffcf8;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-title) !important;
    margin: 0;
    padding: 0;
    line-height: 1.2;
  }

  a, input, textarea, button, p, span, div, select {
    font-family: var(--font-primary) !important;
  }

  button {
    letter-spacing: ${props => props.isArabic ? "0" : "1px"};
  }
`;

const MyGlobalStyles = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return <GlobalStyles isArabic={isArabic} />;
};

export default MyGlobalStyles;