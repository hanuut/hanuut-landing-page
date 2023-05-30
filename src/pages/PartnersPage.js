import React from 'react'
import styled from "styled-components";
import PartnersImg from "../assets/partnersIllustration.svg";
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
    min-height: 100%;
    flex-direction: column-reverse;
    align-items: flex-start;
  
  }
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
    width: auto;
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
  @media(max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const InputContainer = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.primaryColor};
  margin-bottom: 0.5rem;
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  font-size: ${(props) => props.theme.fontxl};
  background-color: ${(props) => props.theme.body};
  &:focus {
    outline: none;
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

const SmallParagraph = styled.p`
  width: 100%;
  font-size: ${(props) => props.theme.fontmd};
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const PartnersPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <LeftBox>
          <Heading> {t('partnerHeading')}</Heading>
          <SubHeading>{t('partnerSubHeading')}</SubHeading>
          <Paragraph>
          {t('partnerParagraph')}
          </Paragraph>
          <InputContainer>
            <Input type="email" placeholder={t('partnerInputText')} />
            <Button>{t('partnerInputButton')}</Button>
          </InputContainer>
          <SmallParagraph>
          {t('partnerSmallerParagraph')}
          </SmallParagraph>
        </LeftBox>
        <RightBox>
        <PartnersImageContainer src={PartnersImg} isArabic={i18n.language === "ar"} alt=""/>
        </RightBox>
      </Container>
    </Section>
  )
}

export default PartnersPage