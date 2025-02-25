import styled from "styled-components";
import AboutUsIllutstration from "../../assets/aboutUs.webp";
import MissionIllustration from "../../assets/mission.svg";
import { useTranslation } from "react-i18next";
import BackgroundImage from "../../assets/background.webp";
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
  overflow-x: hidden;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
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
    flex-direction: column;
    align-items: flex-start;
  }
`;
const RightBox = styled.div`
  width: 50%;
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
  margin-top: 0.5rem;
  align-self: start;
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
      ? `-15px 15px rgba(${props.theme.primaryColorRgba}, 0.5)`
      : `15px 15px rgba(${props.theme.primaryColorRgba}, 0.5)`};
  transition: all 0.5s ease;
  .missionText {
    font-size: ${(props) => props.theme.fontxxxl};
    padding-left: ${(props) => (props.isArabic ? "0" : "2rem")};
    padding-right: ${(props) => (props.isArabic ? "2rem" : "0")};
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    max-width: 100%;
    padding: 0.7rem 0.4rem;
    box-shadow: ${(props) =>
      props.isArabic
        ? `-10px 10px rgba(${props.theme.primaryColorRgba}, 0.75)`
        : `10px 10px rgba(${props.theme.primaryColorRgba}, 0.75)`};
    .missionText {
      font-size: ${(props) => props.theme.fontlg};
      padding-left: ${(props) => (props.isArabic ? "0" : "1rem")};
      padding-right: ${(props) => (props.isArabic ? "1rem" : "0")};
    }
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
    @media (max-width: 768px) {
      font-size: ${(props) => props.theme.fontxl};
    }
  }
  @media (max-width: 768px) {
    gap: 0.5rem;
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
  border-radius: 10px;
  justify-content: flex-start;
  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
  }
`;
const AboutUsIllutstrationContainer = styled.img`
  max-height: 60vh;
  align-self: ${(props) => (props.isArabic ? "flex-end" : "center")};
  @media (max-width: 768px) {
    align-self: center;
    width: auto;
  }
`;

const AboutTitle = styled.h1`
  color: ${(props) => props.theme.primaryColor};
  font-weight: bold;
      font-size: 5rem;
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const AboutText = styled.p`
  font-size: ${(props) => props.theme.fontxxl};
  color: ${(props) => props.theme.text};
  line-height: 1.5;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

function AboutUs() {
  const { t, i18n } = useTranslation();
  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <LeftBox>
          <AboutUsIllutstrationContainer
            src={AboutUsIllutstration}
            isArabic={i18n.language === "ar"}
            alt="hanuut"
            loading="lazy"
          />
        </LeftBox>
        <RightBox>
          <AboutTitle>{t("appTitle")}</AboutTitle>
          <MissionContainer isArabic={i18n.language === "ar"}>
            <MissionHeaderContainer>
              <MissionIllutstrationContainer
                src={MissionIllustration}
                alt="mission"
                loading="lazy"
              />
               <AboutText className="missionText">
              {t("aboutUsMissionText")}
               </AboutText>
            </MissionHeaderContainer>
          </MissionContainer>
        </RightBox>
      </Container>
      {/* <AboutTitle>{t("aboutUsValues")}</AboutTitle>
      <Values /> */}
    </Section>
  );
}

export default AboutUs;
