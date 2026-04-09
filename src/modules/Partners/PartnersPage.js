import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Seo from "../../components/Seo";
// Import the new components
import PartnersHero from "./components/PartnersHero";
import PartnersValues from "./components/PartnersValues";
import CtaSection from "./components/CtaSection";
// --- REPLACE THIS LINE ---
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

  return (
    <>
      <Seo 
        title={t("seo_partners_title")}
        description={t("seo_partners_desc")}
        url="https://hanuut.com/partners"
        customSchema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "My Hanuut",
          "operatingSystem": "Android, Windows",
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "DZD"
          },
          "description": t("seo_partners_desc")
        }}
      />

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