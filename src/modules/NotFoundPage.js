
import React from 'react'
import styled from "styled-components";
import Oops from "../assets/404illustration.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    min-height: 100vh;
  }
`;
const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
    min-height: 100%;
  }
`;
const RightBox = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 1rem;
  }
  
`;
const PartnersImageContainer = styled.img`
  max-width: 100%;
  object-fit: cover;
  @media (max-width: 768px) {
    width: auto;
  }
`;
const LeftBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SubHeading = styled.h2`
  font-size: ${(props) => props.theme.fontxxxl};
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const Paragraph = styled.p`
  font-size: ${(props) => props.theme.fontxl};
  margin-bottom: 1rem;
  @media(max-width: 768px) {
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

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
  }
`;



const NotFoundPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <Section>
    <Container isArabic={i18n.language === "ar"}>
      <LeftBox>
        <SubHeading>{t('404Title')}</SubHeading>
        <Paragraph>
        {t('404Text')}
        </Paragraph>
        <Link to="/">
        <Button> {t('404Button')} </Button>
      </Link>
      </LeftBox>
      <RightBox>
      <PartnersImageContainer src={Oops} isArabic={i18n.language === "ar"} alt=""/>
      </RightBox>
    </Container>
  </Section>
  );
};

export default NotFoundPage;

