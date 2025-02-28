import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import HomeCarousel from "../components/Carousel";
import HomeIllustration1 from "../assets/screenshot1.webp";
import HomeIllustration2 from "../assets/screenshot2.webp";
import HomeIllustration3 from "../assets/screenshot3.webp";
import Playstore from "../assets/playstore.webp";
import { Link } from "react-router-dom";
import AboutUs from "./Sections/AboutUs";
import HowItWorks from "./Sections/HowItWorks";
import ButtonWithIcon from "../components/ButtonWithIcon";
import BackgroundImage from "../assets/background.webp";
import { Helmet } from "react-helmet";
// import Testimonials from "./Sections/Testimonials";
// import Partners from "./Partners/Partners";
// import CallToAction from "./Sections/CallToAction";

const Section = styled.div`
  min-height: ${(props) => `calc(80vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BackgroundImage});
  background-size: 100%;
  gap: 2rem;
  background-position: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

const RightBox = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    padding: 45% 0;
  }
`;

const LeftBox = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const Heading = styled.h1`
  width: 100%;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  color: ${(props) => props.theme.primaryColor};
  font-weight: 900;
  text-transform: uppercase;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const SubHeading = styled.h2`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const Paragraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontxl};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const SmallParagraph = styled.p`
  margin-top: 0.3rem;
  width: 100%;
  font-size: ${(props) => props.theme.fontmd};
  opacity: 0.75;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const link = process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK;
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === "ar";

  // SEO content based on language
  const seoContent = {
    ar: {
      title: "حانووت - سوقك المحلي الآمن",
      description: "تسوق من متاجر محلية موثوقة مع تتبع للطلبات وعروض حصرية. تجنب عمليات النصب الإلكتروني عبر منصة آمنة تجمع كل احتياجاتك اليومية.",
      keywords: "تسوق آمن, حانوت ,hanuut, hanout, hanot , متاجر محلية, منصة موثوقة, توصيل طلبات, عروض حصرية, سوق إلكتروني, حانووت",
      schema: {
        name: "حانووت - سوقك المحلي الآمن",
        description: "منصة تسوق آمنة تربطك بمتاجر محلية موثوقة مع تتبع حي للطلبات وعروض حصرية."
      }
    },
    en: {
      title: "Hanuut - Your Safe Local Marketplace",
      description: "Shop from trusted local stores with order tracking and exclusive offers. Avoid online scams through a secure platform that brings together all your daily needs.",
      keywords: "safe shopping, hanuut, hanout, hanot, local stores, trusted platform, order delivery, exclusive offers, e-marketplace",
      schema: {
        name: "Hanuut - Your Safe Local Marketplace",
        description: "A secure shopping platform connecting you with trusted local stores with live order tracking and exclusive offers."
      }
    },
    fr: {
      title: "Hanuut - Votre Marché Local Sécurisé",
      description: "Achetez auprès de magasins locaux de confiance avec suivi des commandes et offres exclusives. Évitez les arnaques en ligne grâce à une plateforme sécurisée qui rassemble tous vos besoins quotidiens.",
      keywords: "achats sécurisés, hanuut, hanout, hanot, magasins locaux, plateforme fiable, livraison de commandes, offres exclusives, marché électronique",
      schema: {
        name: "Hanuut - Votre Marché Local Sécurisé",
        description: "Une plateforme d'achat sécurisée vous connectant à des magasins locaux de confiance avec suivi des commandes en direct et offres exclusives."
      }
    }
  };

  // Default to Arabic if the language is not supported
  const activeSeoContent = seoContent[currentLanguage] || seoContent.ar;

  return (
    <>
      <Helmet>
        <html lang={currentLanguage} />
        <title>{activeSeoContent.title}</title>
        <meta name="description" content={activeSeoContent.description} />
        <meta name="keywords" content={activeSeoContent.keywords} />
        <link rel="canonical" href="https://www.hanuut.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": activeSeoContent.schema.name,
            "description": activeSeoContent.schema.description,
            "url": "https://www.hanuut.com",
            "inLanguage": currentLanguage
          })}
        </script>
      </Helmet>
      
      <Section>
        <Container isArabic={isArabic}>
          <LeftBox>
            <Heading>{t("homeHeading")}</Heading>
            <SubHeading>{t("homeSubHeading")}</SubHeading>
            <Paragraph>{t("homeParagraph")}</Paragraph>
            <Link to={link} name="playsore">
              <ButtonWithIcon
                image={Playstore}
                backgroundColor="#000000"
                text1={t("getItOn")}
                text2={t("googlePlay")}
                className="homeDownloadButton"
              />
            </Link>
            <SmallParagraph>{t("homeSmallerParagraph")}</SmallParagraph>
          </LeftBox>
          <RightBox>
            <HomeCarousel
              images={[HomeIllustration1, HomeIllustration2, HomeIllustration3]}
            />
          </RightBox>
        </Container>
      </Section>
      <AboutUs />
      <HowItWorks />
      {/* 
      <Testimonials />
      <Partners /> 
      <CallToAction /> 
      */}
    </>
  );
};

export default HomePage;