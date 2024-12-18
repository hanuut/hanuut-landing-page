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
  margin-bottom: 0.5rem;
  font-size: 4rem;
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
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const Paragraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontxxxl};
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

  return (
    <>
      <Helmet>
        <html />
        <title>{t("appTitle")}</title>
        <meta name="description" content={t("homeHeading")} />
        <meta
          name="keywords"
          content={`${t("appTitle")}, ${t("myHanuutTitle")}, ${t(
            "homeHeading"
          )}, e-commerce, online shop, marketplace`}
        />
        <link rel="canonical" href="https://www.hanuut.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("appTitle"),
            description: t("homeHeading"),
            url: "https://www.hanuut.com",
          })}
        </script>
      </Helmet>
      <Section>
        <Container isArabic={i18n.language === "ar"}>
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
              ></ButtonWithIcon>
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
    <CallToAction /> */}
    </>
  );
};

export default HomePage;
