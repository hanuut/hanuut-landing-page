import React from "react";
import styled from "styled-components";
import Convenience from "../../assets/convenience.svg";
import Pricing from "../../assets/pricing.svg";
import Support from "../../assets/support.svg";
import { useTranslation } from "react-i18next";

const Section = styled.div`
  background-color: ${(props) => props.theme.body};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 80%;
  padding: 3rem 0;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  color: ${(props) => props.theme.text};
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    width: 90%;
    flex-direction: row;
    align-items: flex-start;
    gap: 2rem;
    flex-wrap: wrap;
  }
`;

const ValueCard = styled.div`
width: 27%;
padding: 1.25rem;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
border: 1px solid rgba(${(props) => props.theme.bodyRgba}, 0.5);
border-radius: 0.5rem;
box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
transform: translateY(0);
animation: fade-in 1s ease forwards;

@keyframes fade-in {
from {
opacity: 0;
transform: translateY(1rem);
}
to {
opacity: 1;
transform: translateY(0);
box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
}
}

@media (max-width: 768px) {
width: 90%;
padding: 0.75rem;
}
`;

const ValueCardHeader = styled.div`
width: 100%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin-bottom: 0.5rem;

@media (max-width: row;
align-items: center;
justify-content: flex-start;
gap: 1rem;
margin-bottom: 0.25rem;
`;

const ValueImage = styled.img`
width: 80%;

@media (max-width: 768px) {
width: 60%;
margin-right: 0.5rem;
}
`;

const ValueHeading = styled.h2`
font-size: ${(props) => props.theme.fontxxl};
margin-bottom: 1rem;
color: ${(props) => props.theme.primaryColor};

@media (max-width: 768px) {
font-size: ${(props) => props.theme.fontxl};
margin-bottom: 0.5rem;
}
`;

const ValueText = styled.p`
font-size: ${(props) => props.theme.fontmd};
text-align: center;

@media (max-width: 768px) {
font-size: ${(props) => props.theme.fontsm};
text-align: left;
}
`;

const Values = () => {
  const { t, i18n } = useTranslation();
  return (
    <Section>
      <Container isArabic={i18n.language === "ar"}>
        <ValueCard>
          <ValueCardHeader>
            <ValueImage src={Convenience}></ValueImage>
            <ValueHeading>{t("valuesConvenienceTitle")}</ValueHeading>
          </ValueCardHeader>
          <ValueText>{t("valuesConvenienceText")}</ValueText>
        </ValueCard>
        <ValueCard>
          <ValueCardHeader>
            <ValueImage src={Support}></ValueImage>
            <ValueHeading>{t("valuesTrustTitle")}</ValueHeading>
          </ValueCardHeader>
          <ValueText>{t("valuesTrustText")}</ValueText>
        </ValueCard>
        <ValueCard>
          <ValueCardHeader>
            <ValueImage src={Pricing}></ValueImage>
            <ValueHeading>{t("valuesPricingTitle")}</ValueHeading>
          </ValueCardHeader>
          <ValueText>{t("valuesPricingText")}</ValueText>
        </ValueCard>
      </Container>
    </Section>
  );
};

export default Values;
