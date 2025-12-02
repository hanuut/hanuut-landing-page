import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

// Import the new components we will create next
import PartnersHero from "./components/PartnersHero";
import PartnersValues from "./components/PartnersValues";
import FeaturesSection from "./components/FeaturesSection";
import CtaSection from "./components/CtaSection";
import FeaturesBento from "./components/FeaturesBento";

// --- Main Page Container ---
const PageWrapper = styled.main`
  width: 100%;
`;

const PartnersPage = () => {
  const { t, i18n } = useTranslation();

  // SEO content remains simple and effective
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
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: seoContent.title,
            description: seoContent.description,
            url: "https://www.hanuut.com/partners",
            inLanguage: i18n.language,
          })}
        </script>
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
