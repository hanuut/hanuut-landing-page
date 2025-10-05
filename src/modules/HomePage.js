import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Playstore from "../assets/playstore.webp";
import { Link } from "react-router-dom";
import AboutUs from "./Sections/AboutUs";
import HowItWorks from "./Sections/HowItWorks";
import ButtonWithIcon from "../components/ButtonWithIcon";
import { Helmet } from "react-helmet";

import HanuutIllustration from "../assets/illustrations/home_animation_en.gif";
import HanuutIllustrationAr from "../assets/illustrations/home_animation_ar.gif";

const Section = styled.div`
   min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 90%; 
  margin: 0 auto; 
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
   flex-direction: column-reverse;
    gap: 3rem; 
    width: 90%;
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
    padding: 0;
  }
`;

const LeftBox = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2rem;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const Heading = styled.h1`
  font-size: 3rem; 
  color: ${(props) => props.theme.primaryColor};
  font-weight: 700; 
  text-transform: none; 
  line-height: 1.2; 
  width: 100%;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxxl};
  }
`;

const SubHeading = styled.h2`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxl};
  margin-bottom: 0.5rem;
font-weight: 500;
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

const IllustrationContainer = styled.img`
  width: 60%; // Make it take the full width of the RightBox
  height: auto; // Let the height adjust automatically to maintain aspect ratio
  max-width: 500px; // Optional: constrain the max size on desktop
`;

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const link = process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK;
  const currentLanguage = i18n.language;
  const isArabic = currentLanguage === "ar";

  const seoContent = {
    ar: {
      title: "حانووت | حانوتك في جيبك",
      description: "تطبيق حانووت يجمعلك كامل حوانت حومتك في مكان واحد. تسوق من متاجر موثوقة تعرفها، مع تتبع مباشر لطلبيتك. التسوق المحلي، بكل بساطة.",
      keywords: "حانوت, تطبيق حانوت, تسوق الجزائر, متاجر محلية, توصيل طلبات, قضيان, حوانت",
      schema: {
        name: "حانووت - حانوتك في جيبك",
        description: "تطبيق يربطك بمتاجر حيك الموثوقة في الجزائر لتسوق سهل وآمن."
      }
    },
    en: {
      title: "Hanuut | Your Local Shop, Online",
      description: "The Hanuut app brings all your neighborhood stores to you. Shop from verified local businesses you already trust, with live order tracking. Local shopping, made simple.",
      keywords: "hanuut, hanuut app, shop local algeria, trusted stores, local delivery, online grocery algeria",
      schema: {
        name: "Hanuut - Your Local Shop, Online",
        description: "An app that connects you with your trusted neighborhood stores in Algeria for simple, safe shopping."
      }
    },
    fr: {
      title: "Hanuut | Votre Commerce de Quartier, en Ligne",
      description: "L'application Hanuut rassemble les commerces de votre quartier. Achetez auprès des magasins locaux vérifiés que vous connaissez, avec suivi de commande en direct. Le shopping local, en toute simplicité.",
      keywords: "hanuut, app hanuut, commerce local algérie, magasins de confiance, livraison locale, courses en ligne algérie",
      schema: {
        name: "Hanuut - Votre Commerce de Quartier, en Ligne",
        description: "Une application qui vous connecte à vos commerces de quartier de confiance en Algérie pour un shopping simple et sécurisé."
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
       
          <RightBox>
           <IllustrationContainer src={isArabic ? HanuutIllustrationAr : HanuutIllustration} alt="Hanuut" />
          </RightBox>
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
        </Container>
      </Section>

      <HowItWorks />
      <AboutUs />
    </>
  );
};

export default HomePage;