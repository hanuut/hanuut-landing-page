import React from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import { FaFacebook, FaInstagram } from "react-icons/fa";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Section = styled.div`
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;

const UpperBox = styled.div`
  padding: 1rem 0;
  min-width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow-x: hidden;
  @media (max-width: 768px) {
    padding: 0.8rem 0;
    min-width: 90%;
    justify-content: space-between;
    align-items: flex-start;
  }
`;
const LeftBox = styled.div``;

const RightBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Title = styled.h1`
  color: white;

  line-height: 1;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxl};
  }
`;

const SotialMediaContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const SocialMediaIcon = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.body};
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.primaryColor};
    transform: scale(1.1);
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxl};
  }
`;
const LowerBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
`;

const FooterText = styled.p`
  padding: 0.5rem 0;
  color: ${(props) => props.theme.body};
  letter-spacing: ${(props) => (props.isArabic ? "0" : "2px")};
  font-size: ${(props) => props.theme.fontsm};
  margin: 0;
  .footerLink {
    &:hover {
      color: ${(props) => props.theme.primaryColor};
    }
  }
  @media (max-width: 768px) {
    text-align: center;
    font-size: ${(props) => props.theme.fontxs};
    padding: 0.7rem 0;
  }
`;
const Footer = () => {
  const { t, i18n } = useTranslation();
  const instagramLink = "https://www.instagram.com/hanuut_app/";
  const facebookLink = "https://web.facebook.com/hanuutapp";
  return (
    <Section isArabic={i18n.language === "ar"}>
      <UpperBox>
        <LeftBox>
          <Logo />
        </LeftBox>
        <RightBox>
          <Title>{t("footerFindUs")}</Title>
          <SotialMediaContainer isArabic={i18n.language === "ar"}>
            <Link to={facebookLink}>
              <SocialMediaIcon>
                <FaFacebook />
              </SocialMediaIcon>
            </Link>
            <Link to={instagramLink}>
              <SocialMediaIcon>
                <FaInstagram />
              </SocialMediaIcon>
            </Link>
          </SotialMediaContainer>
        </RightBox>
      </UpperBox>
      <LowerBox>
        <FooterText isArabic={i18n.language === "ar"}>
          {t("footerAllRightsReserved")}
          <Link className="footerLink" to="/privacy_policy">
            {t("footerPrivacyAndPolicy")}
          </Link>
          <Link className="footerLink" to="/terms_and_conditions">
            {t("footerTermsOfUse")}
          </Link>
        </FooterText>
      </LowerBox>
    </Section>
  );
};

export default Footer;
