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
`;
const LeftBox = styled.div``;

const RightBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
`;

const Title = styled.h1`
  color: white;
`;

const SotialMediaContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
 
`;

const SocialMediaIcon = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.primaryColor};
  &:hover{
    cursor: pointer;
    color: ${(props) => props.theme.secondaryColor};
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
  letter-spacing: 2px;
  font-size: ${(props) => props.theme.fontsm};
  margin: 0;
  @media (max-width: 768px) {
    text-align: center;
  }
`;
const Footer = () => {
    const { t, i18n } = useTranslation();
  return (
    <Section isArabic={i18n.language === "ar"}>
      <UpperBox>
        <LeftBox>
          <Logo />
        </LeftBox>
        <RightBox>
          <Title>{t('footerFindUs')}</Title>
          <SotialMediaContainer isArabic={i18n.language === "ar"}>
            <Link to="#">
              <SocialMediaIcon>
                <FaFacebook />
              </SocialMediaIcon>
            </Link>
            <Link to="#">
              <SocialMediaIcon>
                <FaInstagram />
              </SocialMediaIcon>
            </Link>
          </SotialMediaContainer>
        </RightBox>
      </UpperBox>
      <LowerBox>
      <FooterText>
        {t('footerAllRightsReserved')}
        <Link to="/privacy policy">{t('footerPrivacyAndPolicy')}</Link> 
        <Link to="/terms and conditions">{t('footerTermsOfUse')}</Link>
      </FooterText>
      </LowerBox>
    </Section>
  );
};

export default Footer;
