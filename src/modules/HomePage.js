import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import ConsumerHero from "./HomePage/components/ConsumerHero";
import ServicesGrid from "./HomePage/components/ServicesGrid";
import { light } from "../config/Themes";

// Reuse existing styled components to maintain the "Old Look"
const PageWrapper = styled.main`
  width: 100%;
  background-color: #fdf4e3; /* Soft Ivory */
  min-height: 100vh;
`;

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // SEO Updated for "Hanuut Express" (The Company)
  const seoContent = {
    title: t("companyName") + " | " + t("hub_headline"),
    description: t("hub_subheadline"),
  };

  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <title>{seoContent.title}</title>
        <meta name="description" content={seoContent.description} />
      </Helmet>

      <ThemeProvider theme={light}>
        <PageWrapper>
          {/* 1. The Hub Hero: "The Digital Infrastructure" */}
          <ConsumerHero />

          {/* 2. The Split Grid: E'SUUQ vs My Hanuut */}
          <ServicesGrid />
        </PageWrapper>
      </ThemeProvider>
    </>
  );
};

export default HomePage;