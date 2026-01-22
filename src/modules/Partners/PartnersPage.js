import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

// Import the new components
import PartnersHero from "./components/PartnersHero";
import PartnersValues from "./components/PartnersValues";
import CtaSection from "./components/CtaSection";
import FeaturesBento from "./components/FeaturesBento";

// --- Main Page Container ---
const PageWrapper = styled.main`
  width: 100%;
  /* 
     FIX: Removed padding-top so the dark background 
     extends behind the transparent navbar.
  */
  padding-top: 0; 
  position: relative;
  z-index: 1;
`;

const PartnersPage = () => {
  const { t, i18n } = useTranslation();

  const seoContent = {
    title: t("partnersPage_seo_title"),
    description: t("partnersPage_seo_description"),
    keywords: t("partnersPage_seo_keywords"),
  };

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{seoContent.title}</title>
        <meta name="description" content={seoContent.description} />
        <meta name="keywords" content={seoContent.keywords} />
        <link rel="canonical" href="https://www.hanuut.com/partners" />
      </Helmet>

      <PageWrapper>
        <PartnersHero />
        <FeaturesBento />
        <PartnersValues />
        <CtaSection />
      </PageWrapper>
    </>
  );
};

export default PartnersPage;