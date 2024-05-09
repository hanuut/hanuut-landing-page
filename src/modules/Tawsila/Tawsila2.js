import React from "react";
import styled from "styled-components";
import Background from "../../assets/blueBackground.png";
import {
  BlueActionButton,
  BlueTextButton,
} from "../../components/ActionButton";
import Screenshot1 from "../../assets/screen1.jpg";
import Screenshot2 from "../../assets/screen2.jpg";
import Screenshot3 from "../../assets/screen3.jpg";
import Screenshot4 from "../../assets/screen4.jpg";
import Screenshot5 from "../../assets/screen5.jpg";
import RegisterTawsila from "../../assets/registerTawsila.svg";
import Approved from "../../assets/approvedTawsila.svg";

import Steps from "./components/Steps";
import Accepted from "../../assets/acceptTawsila.svg";

import ScreenshotDisplay from "./components/ScreenshotDisplay";
import { Link } from "react-router-dom";
import Tawsila from "./Tawsila";
import { useTranslation } from "react-i18next";

const Section = styled.section`
  min-height: ${(props) => `calc(80vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${Background});
  background-size: 100%;
  background-position: center;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  width: 100%;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const HeroSection = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 90%;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
    min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
    margin-bottom: 2rem;
  }
`;
const BecomeDriverSection = styled.div`
  position: relative;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 90%;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
  }
`;

const HalfBox = styled.div`
  width: 48%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Box = styled.div`
  margin-top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;
const Content = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
  @media (max-width: 768px) {
    min-height: 40vh;
    justify-content: center;
    padding: 1rem;
    border-radius: ${(props) => props.theme.bigRadius};
    position: absolute;
    width: 100%;
    transition: all 0.2s ease;
    backdrop-filter: blur(1px);
    background: rgb(255, 255, 255);
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.9) 50%,
      rgba(255, 255, 255, 0.2) 100%
    );
  }
`;
const Iluustration = styled.img`
  max-height: 60vh;
  object-fit: fill;
  @media (max-width: 768px) {
    max-height: 50vh;
  }
`;

const BlackHeading = styled.h1`
  line-height: ${(props) => (props.isArabic ? "1.1" : "1")};
  max-width: 60%;
  font-size: 7rem;
  color: ${(props) => props.theme.textColor};
  font-weight: 900;
  text-transform: uppercase;
  @media (max-width: 768px) {
    max-width: 100%;
    font-size: ${(props) => props.theme.fontLargest};
  }
`;

const Heading = styled(BlackHeading)`
  color: ${(props) => props.theme.secondaryColor};
  margin-bottom: 1rem;
`;
const SectionHeading = styled(BlackHeading)`
  font-size: ${(props) => props.theme.fontLargest};
  color: ${(props) => props.theme.secondaryColor};
  max-width: 100%;
`;

const SubHeading = styled.p`
  max-width: 90%;
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: 400;
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Tawsila2 = () => {
  const { t, i18n } = useTranslation();
  const images = [
    Screenshot1,
    Screenshot2,
    Screenshot3,
    Screenshot4,
    Screenshot5,
  ];

  const handleBecomeDriver = () => {
    const element = document.getElementById("registerSubscribeRequest");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Section isArabic={i18n.language === "ar"}>
      <HeroSection>
        <HalfBox>
          <ScreenshotDisplay images={images} />
        </HalfBox>
        <HalfBox>
          <BlackHeading isArabic={i18n.language === "ar"}>
            {t("tawsilaHeading2")}
          </BlackHeading>
          <Heading isArabic={i18n.language === "ar"}>
            {" "}
            {t("tawsilaSubHeading2")}
          </Heading>
          <ButtonContainer>
            {" "}
            <BlueActionButton onClick={handleBecomeDriver}>
              {" "}
              {t("becomeDriver")}
            </BlueActionButton>
            {/* <Link to={"/get-started-with-Tawsila"}>
              {" "}
              <BlueTextButton> {t("learnMore")}</BlueTextButton>
            </Link> */}
          </ButtonContainer>
        </HalfBox>
      </HeroSection>
      <Steps />
      <BecomeDriverSection>
        <Box>
          <Content>
            {" "}
            <SectionHeading>{t("subscribeRequest")}</SectionHeading>
            <SubHeading>{t("subscribeRequestText")}</SubHeading>
            <BlueActionButton onClick={handleBecomeDriver}>
              {" "}
              {t("becomeDriver")}
            </BlueActionButton>
          </Content>
          <Iluustration src={RegisterTawsila} />
        </Box>
        <Box>
          <Iluustration src={Accepted} />
          <Content>
            {" "}
            <SectionHeading>{t("confirmation")}</SectionHeading>
            <SubHeading>{t("confirmationText")}</SubHeading>
            {/* <Link to={"/get-started-with-Tawsila"}>
              {" "}
              <BlueTextButton> {t("learnMore")}</BlueTextButton>
            </Link> */}
          </Content>
        </Box>
        <Box>
          <Content>
            <SectionHeading>{t("validation")}</SectionHeading>
            <SubHeading>{t("validationText")}</SubHeading>
            <ButtonContainer> </ButtonContainer>
          </Content>
          <Iluustration src={Approved} />
        </Box>
      </BecomeDriverSection>{" "}
      <Box id="registerSubscribeRequest">

        <Tawsila />
      </Box>
    </Section>
  );
};

export default Tawsila2;
