import React from "react";
import styled from "styled-components";
import ButtonWithIcon from "../../components/ButtonWithIcon"
import { Link } from "react-router-dom";
import {
  BlueActionButton,
  BlueTextButton,
} from "../../components/ActionButton";
import Screenshot1 from "../../assets/illustrations/tawsila/1.gif";
import Screenshot2 from "../../assets/illustrations/tawsila/2.gif";
import Screenshot3 from "../../assets/illustrations/tawsila/3.gif";
import Screenshot4 from   "../../assets/illustrations/tawsila/4.gif";
import Screenshot5 from "../../assets/illustrations/tawsila/5.gif";
import Screenshot6 from "../../assets/illustrations/tawsila/6.png";
import Screenshot7 from "../../assets/illustrations/tawsila/7.png";
import AnimationImage  from "../../assets/illustrations/tawsila/phone_animation.gif";
import LogoImage from "../../assets/illustrations/tawsila/app-logo.png";
import DriverImage from "../../assets/illustrations/tawsila/driver_tawsila.png";
import Playstore from "../../assets/playstore.webp";
import Steps from "./components/Steps";
import ScreenshotDisplay from "./components/ScreenshotDisplay";
import { useTranslation } from "react-i18next";

const Section = styled.section`
  min-height: ${(props) => `calc(80vh - ${props.theme.navHeight})`};
  background: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  min-height: ${(props) => `calc(70vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
    min-height: ${(props) => `calc(70vh - ${props.theme.navHeight})`};
    margin-bottom: 2rem;
  }
`;

const HalfBox = styled.div`
  min-height: ${(props) => `calc(70vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width:${props => props.backgroundColor != null ? '100%' : 'auto'};
  background-color: ${props => props.backgroundColor != null ? props.backgroundColor : 'white'};
  @media (max-width: 768px) {
    width: 100%;
  }
`;


const Box = styled.div`
  padding: 50px 0;
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

const SubHeading = styled.h1`
  max-width: 90%;
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: bold;
  margin-bottom : 10px;
  @media (max-width: 768px) {
    width: 100%;
    font-size: ${(props) => props.theme.fontxl};
    text-align: center;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const BenefitsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  width: 70%;
`;

const BenefitCard = styled.div`
  width: ${(props) => props.width != null ? props.width : '50%'} ;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CTAContainer = styled.div`
  text-align: center;
  padding: 50px 0;
  background: ${(props) => props.theme.secondaryColor};
  width: 100%;
  display : flex;
  flex-direction: column;
  align-items: center;
`;

const CTAText = styled.h2`
  margin-bottom: 20px;
  color: ${(props) => props.theme.textColor};
  font-size: ${(props) => props.theme.fontxxxl};
`;

const StepImage = styled.img`
  height: 70vh;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top : 3rem;
`;

const Tawsila = () => {
  const { t, i18n } = useTranslation();
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.tawsila";

  return (
    <Section isArabic={i18n.language === "ar"}>
      <HeroSection>
        <HalfBox>
          {/* <ScreenshotDisplay images={images} /> */}
          <StepImage src={AnimationImage} alt={`Tawsila`} />
        </HalfBox>
        <HalfBox >
          <BlackHeading isArabic={i18n.language === "ar"}>
            {t("hero_headline1")}
          </BlackHeading>
          <Heading isArabic={i18n.language === "ar"}>
            {" "}
            {t("hero_headline2")}
          </Heading>
          <ButtonContainer>
            {" "}
            <Link to={link} name="playsore">
              <ButtonWithIcon
                image={Playstore}
                backgroundColor="#000000"
                text1={t("getItOn")}
                text2={t("googlePlay")}
                className="homeDownloadButton"
              />
            </Link>
            {/* <Link to={"/get-started-with-Tawsila"}>
              {" "}
              <BlueTextButton> {t("learnMore")}</BlueTextButton>
            </Link> */}
          </ButtonContainer>
        </HalfBox>
      </HeroSection>
      <Benefits />
      
      <CTASection />
    </Section>
  );
};

// Benefits component
const Benefits = () => {
  const { t } = useTranslation();
  

  // Sample data
  const customerSteps1 = [
    {
      image: LogoImage,
    },
  ];

  const customerSteps2 = [
    {
      text: t("benefits_riders_title"),
      subtext: t("benefits_riders_description"),
      backGroundColor: (props) => props.theme.secondaryColor,
      textColor: (props) => props.theme.white,
    },
    {
      text: t("howItWorksCustomer_step1") + "\n" + t("howItWorksCustomer_step2") + "\n" + t("howItWorksCustomer_step3"),
    },
  ];


  const driverSteps1 = [
    {
      text: t("howItWorksDriver_step1") + "\n" + t("howItWorksDriver_step2") + "\n" + t("howItWorksDriver_step3"),
    },
    {
      text: t("benefits_drivers_title"),
      subtext: t("benefits_drivers_description"),
      backGroundColor: (props) => props.theme.secondaryColorDark,
      textColor: (props) => props.theme.white,
    },
  ];

  const driverSteps2 = [
    {
      image: DriverImage,
    },
  ];
  
  return (
    <Section>
        <SubHeading >
            {t("benefits_title")}
          </SubHeading>
          <SubHeading>
            {t("benefits_description")}
          </SubHeading>

          <BenefitsContainer>
        
        <BenefitCard width="20%">
        <Steps steps={customerSteps1} />
        </BenefitCard>

        <BenefitCard width="50%">
        <Steps steps={customerSteps2} />
        <Steps steps={driverSteps1} />
        </BenefitCard>

        <BenefitCard  width="20%">
        <Steps steps={driverSteps2} />
        </BenefitCard>

      </BenefitsContainer>

    </Section>
  );
};

// CTA Section component
const CTASection = () => {
  const { t } = useTranslation();
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.tawsila";
  return (
    <CTAContainer>
      <CTAText>{t("ctaReinforcement")}</CTAText>
      <Link to={link} name="playsore">
              <ButtonWithIcon
                image={Playstore}
                backgroundColor="#000000"
                text1={t("getItOn")}
                text2={t("googlePlay")}
                className="homeDownloadButton"
              />
            </Link>
    </CTAContainer>
  );
};

export default Tawsila;
