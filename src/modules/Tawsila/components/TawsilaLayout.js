import React from "react";
import { ThemeProvider } from "styled-components";
import { tawsilaTheme } from "../../../config/Themes";
import TawsilaPreFooter from "./TawsilaPreFooter";

const TawsilaLayout = ({ children }) => {
  return (
    <ThemeProvider theme={tawsilaTheme}>
      {/* Page Content */}
      <div style={{ minHeight: "100vh", backgroundColor: tawsilaTheme.body }}>
        {children}
      </div>
      {/* Global Tawsila Call to Action */}
      <TawsilaPreFooter />
    </ThemeProvider>
  );
};

export default TawsilaLayout;