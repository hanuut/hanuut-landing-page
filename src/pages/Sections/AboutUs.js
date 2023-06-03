import styled from "styled-components";
import AboutUsIllutstration from "../../assets/aboutUs.svg";
import MissionIllustration from "../../assets/mission.svg";
import Values from "./Values";
import { useTranslation } from "react-i18next";
const Section = styled.div`
  min-height: 50vh;
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const Container = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    width: 90%;
    align-items: flex-start;
  }
`;
const RightBox = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MissionContainer = styled.div`
  margin-top: 2rem;
  align-self: end;
  max-width: 90%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${(props) => props.theme.body};
  padding: 1.5rem 1rem;
  border-radius: ${(props) => props.theme.defaultRadius};
  border: 1px solid rgba(${(props) => props.theme.primaryColorRgba}, 0.75);
  box-shadow: ${(props) =>
    props.isArabic
      ? `-15px 15px rgba(${props.theme.primaryColorRgba}, 0.75)`
      : `15px 15px rgba(${props.theme.primaryColorRgba}, 0.75)`};
  transition: all 0.5s ease;
  .missionText {
    font-size: ${(props) => props.theme.fontxl};
    padding-left: ${(props) => (props.isArabic ? "0" : "2rem")};
    padding-right: ${(props) => (props.isArabic ? "2rem" : "0")};
  }
`;

const MissionHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  .mission {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;
const MissionIllutstrationContainer = styled.img`
  max-width: 15%;
  background-color: ${(props) => props.theme.body};
  object-fit: fill;
  @media (max-width: 768px) {
    width: auto;
  }
`;

const LeftBox = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const AboutUsIllutstrationContainer = styled.img`
  max-width: 95%;
  object-fit: cover;
  @media (max-width: 768px) {
    width: auto;
  }
`;

const AboutTitle = styled.h1`
  color: ${(props) => props.theme.primaryColor};
  font-weight: bold;
`;

const AboutText = styled.p`
  font-size: ${(props) => props.theme.fontxxl};
  color: ${(props) => props.theme.text};
  line-height: 1.5;
`;

function AboutUs() {
  const { t, i18n } = useTranslation();
  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <LeftBox>
          <AboutUsIllutstrationContainer src={AboutUsIllutstration} />
        </LeftBox>
        <RightBox>
          <AboutTitle>{t("aboutUsHeading")}</AboutTitle>
          <AboutText>{t("aboutUsText")}</AboutText>
          <MissionContainer isArabic={i18n.language === "ar"}>
            <MissionHeaderContainer>
              <MissionIllutstrationContainer src={MissionIllustration} />
              <AboutTitle className="mission">
                {t("aboutUsMissionTitle")}
              </AboutTitle>
            </MissionHeaderContainer>
            <AboutText className="missionText">
              {t("aboutUsMissionText")}
            </AboutText>
          </MissionContainer>
        </RightBox>
      </Container>
      <AboutTitle>{t("aboutUsValues")}</AboutTitle>
      <Values />
    </Section>
  );
}

export default AboutUs;
