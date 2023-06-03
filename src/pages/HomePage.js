import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import HomeCarousel from "../components/Carousel";
import HomeIllustration1 from "../assets/screenshot1.jpeg";
import HomeIllustration2 from "../assets/screenshot2.jpg";
import HomeIllustration3 from "../assets/screenshot3.jpg";
import { Link } from "react-router-dom";
// import AboutUs from "./Sections/AboutUs";
// import HowItWorks from "./Sections/HowItWorks";
// import Testimonials from "./Sections/Testimonials";
// import Partners from "./Sections/Partners";
// import CallToAction from "./Sections/CallToAction";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
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
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Heading = styled.h1`
  width: 80%;
  margin-bottom: 0.5rem;
  font-size: ${(props) => props.theme.fontLargest};
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
  font-size: ${(props) => props.theme.fontxl};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primaryColor};
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: ${(props) => props.theme.actionButtonPadding};
  font-size: ${(props) => props.theme.fontxl};
  cursor: pointer;
  transition: all 0.5s ease;
  margin-bottom: 0.5rem;

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
  }
`;

const SmallParagraph = styled.p`
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
  const link = "https://docs.google.com/forms/d/e/1FAIpQLScDMEL5ruTmJNRXrlzKOaMq6637CfDqwr7RUxk2aFdlxdI-NA/viewform";

  return (<>
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <LeftBox>
          <Heading>{t("homeHeading")}</Heading>
          <SubHeading>{t("homeSubHeading")}</SubHeading>
          <Paragraph>{t("homeParagraph")}</Paragraph>
          <Link to={link}>
            <Button>{t("homeInputButton")}</Button>
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
    {/* <AboutUs />

    <HowItWorks />

    <Testimonials />
    <Partners /> 
    <CallToAction />*/}
    </>
  );
};

export default HomePage;
