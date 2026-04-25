import React from "react";
import { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";

// --- 1. IMPORT FONTS FROM THE SRC FOLDER ---
// This ensures Webpack packages them correctly for Netlify
import KOGhorabFile from "../fonts/KOGhorab-Regular.otf";

import ManropeThin from "../fonts/manrope-thin.otf";
import ManropeLight from "../fonts/manrope-light.otf";
import ManropeRegular from "../fonts/manrope-regular.otf";
import ManropeMedium from "../fonts/manrope-medium.otf";
import ManropeSemiBold from "../fonts/manrope-semibold.otf";
import ManropeBold from "../fonts/manrope-bold.otf";
import ManropeExtraBold from "../fonts/manrope-extrabold.otf";

import TajawalExtraLight from "../fonts/Tajawal-ExtraLight.ttf";
import TajawalLight from "../fonts/Tajawal-Light.ttf";
import TajawalRegular from "../fonts/Tajawal-Regular.ttf";
import TajawalMedium from "../fonts/Tajawal-Medium.ttf";
import TajawalBold from "../fonts/Tajawal-Bold.ttf";
import TajawalExtraBold from "../fonts/Tajawal-ExtraBold.ttf";
import TajawalBlack from "../fonts/Tajawal-Black.ttf";

const GlobalStyles = createGlobalStyle`
  /* --- 2. DEFINE @FONT-FACE USING THE IMPORTED VARIABLES --- */
  
  @font-face {
    font-family: 'KOGhorab';
    src: url(${KOGhorabFile}) format('opentype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  /* Manrope Family */
  @font-face { font-family: 'Manrope'; src: url(${ManropeThin}) format('opentype'); font-weight: 100; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url(${ManropeLight}) format('opentype'); font-weight: 300; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url(${ManropeRegular}) format('opentype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url(${ManropeMedium}) format('opentype'); font-weight: 500; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url(${ManropeSemiBold}) format('opentype'); font-weight: 600; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url(${ManropeBold}) format('opentype'); font-weight: 700; font-display: swap; }
  @font-face { font-family: 'Manrope'; src: url(${ManropeExtraBold}) format('opentype'); font-weight: 800; font-display: swap; }

  /* Tajawal Family */
  @font-face { font-family: 'Tajawal'; src: url(${TajawalExtraLight}) format('truetype'); font-weight: 200; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url(${TajawalLight}) format('truetype'); font-weight: 300; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url(${TajawalRegular}) format('truetype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url(${TajawalMedium}) format('truetype'); font-weight: 500; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url(${TajawalBold}) format('truetype'); font-weight: 700; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url(${TajawalExtraBold}) format('truetype'); font-weight: 800; font-display: swap; }
  @font-face { font-family: 'Tajawal'; src: url(${TajawalBlack}) format('truetype'); font-weight: 900; font-display: swap; }

  /* --- 3. DYNAMIC FONT ASSIGNMENT --- */
  :root {
    --font-primary: ${props => props.isArabic ? "'Tajawal', sans-serif" : "'Manrope', sans-serif"};
    --font-title: ${props => props.isArabic ? "'KOGhorab', sans-serif" : "'Manrope', sans-serif"};
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-primary) !important;
    overflow-x: hidden;
    background-color: #fffcf8;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-title) !important;
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