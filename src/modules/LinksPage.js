import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import BackgroundImage from "../assets/background.webp";
import MyHanuutLogo from "../assets/myHanuutLogo2.webp";
import HanuutCustomerLogo from "../assets/hanuutLogo.webp";
import { Link } from "react-router-dom";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${BackgroundImage});
  background-size: 100%;
  gap: 2rem;
  background-position: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Container = styled.div`
  width: 80%;
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  color: ${(props) => props.theme.text};
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;

const Heading = styled.h1`
  width: 100%;
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 4rem;
  color: ${(props) => props.theme.primaryColor};
  font-weight: 900;
  @media (max-width: 768px) {
    width: 90%;
    font-size: 2rem;
  }
`;
const ValueCard = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  background-color: rgba(${(props) => props.theme.bodyRgba}, 1);
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 2rem 3rem;
  box-shadow: 0 2px 4px rgba(${(props) => props.theme.textRgba}, 0.2);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(5px);
  width: 500px;
  @media (max-width: 768px) {
    width: 94%;
    padding: ${(props) => props.theme.actionButtonPadding};
  }

  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 8px rgba(${(props) => props.theme.textRgba}, 0.3);
  }
`;

const CardHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
`;

const Icon = styled.img`
  width: 7rem;
  height: 7rem;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: 900;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
    font-weight: bold;
  }
`;

const CardDescription = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 400;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const LinksPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <Heading>{t("linksPageTitle")}</Heading>
        <Link to="/">
          {" "}
          <ValueCard isArabic={i18n.language === "ar"}>
            <Icon src={HanuutCustomerLogo} alt="app-logo"></Icon>
            <CardHeading>
              <Title>{t("linksPageHanuutTitle")}</Title>
              <CardDescription>{t("linksPageHanuutText")}</CardDescription>
            </CardHeading>
          </ValueCard>
        </Link>
        <Link to="/partners">
          {" "}
          <ValueCard isArabic={i18n.language === "ar"}>
            <Icon src={MyHanuutLogo} alt="app-logo"></Icon>
            <CardHeading>
              <Title>{t("linksPageMyHanuutTitle")}</Title>
              <CardDescription>{t("linksPageMyHanuutText")}</CardDescription>
            </CardHeading>
          </ValueCard>
        </Link>
      </Container>
    </Section>
  );
};

export default LinksPage;
