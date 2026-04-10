import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import ConsumerHero from "./HomePage/components/ConsumerHero";
import ServicesGrid from "./HomePage/components/ServicesGrid";
import { light } from "../config/Themes";
import Seo from "../components/Seo";

// Reuse existing styled components to maintain the "Old Look"
const PageWrapper = styled.main`
  width: 100%;
  background-color: #fdf4e3; /* Soft Ivory */
  min-height: 100vh;
`;

const HomePage = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Seo 
        title={t("seo_home_title")}
        description={t("seo_home_desc")}
        url="https://hanuut.com/"
        customSchema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Hanuut",
          "logo": "https://hanuut.com/static/hanuut.png",
          "url": "https://hanuut.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://hanuut.com/esuuq?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />

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