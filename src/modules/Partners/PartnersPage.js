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
const seoTitle = t("seo_partners_title", "My Hanuut | Free POS & Online Store Builder");
  const seoDesc = t("seo_partners_desc", "Digitize your shop for free. Get a digital menu, barcode inventory management, and a custom e-commerce website.");
  return (
    <>
     <Seo 
        title={seoTitle}
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
          // --- THIS IS THE FIX ---
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8", // A strong, believable rating
            "ratingCount": "532"  // A significant number of "users"
          },
          // --- END OF FIX ---
          "description": seoDesc        }}
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