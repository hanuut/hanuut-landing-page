/* eslint-disable */
const { createGlobalStyle } = require("styled-components");
import "@fontsource/ubuntu";
import '@fontsource/ubuntu-condensed';
import '@fontsource/tajawal';
import '@fontsource-variable/cairo';
import { useTranslation } from "react-i18next";


const GlobalStyles = createGlobalStyle`
*,*::before,*::after{
    margin: 0;
    padding: 0;
}

body {
    font-family: ${props => props.isArabic ? "'Cairo Variable', sans-serif" : "'Ubuntu', sans-serif"};
    overflow-x: hidden;
    background-color: #fffcf8;
}
h1, h2, h3, h4, h5, h6{
    font-family: ${props => props.isArabic ? "'Tajawal', sans-serif" : "'Ubuntu', sans-serif"};
    margin: 0;
    padding: 0;
}

a, input, textarea, select{
    color: inherit;
    text-decoration: none;
    font-family: ${props => props.isArabic ? "'Cairo Variable', sans-serif" : "'Ubuntu Condensed', sans-serif"};
}
button{
    font-family: ${props => props.isArabic ? "'Cairo Variable', sans-serif" : "'Ubuntu Condensed', sans-serif"};
    letter-spacing: ${props => props.isArabic ? "0" : "1px"};
}
`
const MyGlobalStyles = () => {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    //
    return <GlobalStyles isArabic={isArabic} />;
  };
  
  export default MyGlobalStyles;