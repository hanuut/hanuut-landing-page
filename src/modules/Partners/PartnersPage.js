import React from "react";
import styled from "styled-components";
import PartnersImg from "../../assets/partnersIllustration.svg";
import BackgroundImage from "../../assets/background.png";
import { useTranslation } from "react-i18next";
// import { ActionButton } from "../../components/ActionButton";
// import JoinUs from "./components/JoinUs";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import PartnersValues from "./components/PartnersValues";
import Windows from "../../assets/windows.svg";
import Playstore from "../../assets/playstore.png";

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

const PartnersContainer = styled.div`
  padding: 3rem 0;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
  justify-content: flex-start;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
  }
`;
const UpperBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
    min-height: 100%;
    flex-direction: column-reverse;
    align-items: flex-start;
    margin-top: 1rem;
  }
`;
const ButtonsRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 1.5rem;
`;
const RightBox = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;
const PartnersImageContainer = styled.img`
  max-width: 100%;
  object-fit: cover;
  @media (max-width: 768px) {
    width: ${(props) => (props.hide ? "0" : "100%")};
  }
`;
const LeftBox = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
`;
const LowerBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: center;
  }
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  .shopLinkWrapper {
    width: 30%;
    @media (max-width: 768px) {
      width: 100%;
    }
  }
`;

const Heading = styled.h1`
  width: 100%;
  margin-bottom: 0.5rem;
  font-size: 4rem;
  font-weight: 900;
  text-transform: uppercase;
  color: ${(props) => props.theme.orangeColor};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
  span {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const SubHeading = styled.h2`
  width: 99%;
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 1rem;
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

const PartnersPage = () => {
  const { t, i18n } = useTranslation();
  const myHanuutDownloadLinkWindows =
    process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;
  const myHanuutDownloadLink =
    process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;
  const handleDownloadPlay = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLink);
  };
  const handleDownloadWindows = (e) => {
    e.preventDefault();
    window.open(myHanuutDownloadLinkWindows);
  };

  return (
    <Section>
      <PartnersContainer>
        <UpperBox isArabic={i18n.language === "ar"}>
          <LeftBox>
            <Heading> {t("partnerHeadingBoost")}</Heading>
            <Heading>
              {" "}
              <span>{t("partnerHeading")}</span>
            </Heading>
            <SubHeading>{t("partnerSubHeading")}</SubHeading>
            <Paragraph>{t("partnerParagraph")}</Paragraph>
            <ButtonsRow>
              <ButtonWithIcon
                image={Playstore}
                backgroundColor="#000000"
                text1={t("getItOn")}
                text2={t("googlePlay")}
                className="homeDownloadButton"
                onClick={(e) => handleDownloadPlay(e)}
              ></ButtonWithIcon>

              <ButtonWithIcon
                image={Windows}
                backgroundColor="#000000"
                text1={t("getItOn")}
                text2={"Windows"}
                className="homeDownloadButton"
                onClick={(e) => handleDownloadWindows(e)}
              ></ButtonWithIcon>
            </ButtonsRow>
          </LeftBox>
          <RightBox>
            <PartnersImageContainer
              src={PartnersImg}
              isArabic={i18n.language === "ar"}
              alt="Partners"
            />
          </RightBox>
        </UpperBox>
        <PartnersValues />
        {/* <LowerBox isArabic={i18n.language === "ar"}></LowerBox> */}
      </PartnersContainer>
    </Section>
  );
};

export default PartnersPage;
