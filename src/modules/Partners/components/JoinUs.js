import React, { useState } from "react";
import styled from "styled-components";
import PartnersForm from "./PartnersForm";
import Steps from "./Steps";
import { useTranslation } from "react-i18next";
// import HanuutLogo from "";
const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  justify-content: center;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const JoinUsContainer = styled.div`
  min-height: 60vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.defaultRadius};
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 100%;
    padding: 0;
  }
`;
const Title = styled.h2`

  align-self: start;
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: bold;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    margin-top: 2rem;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const PartnerFormContainer = styled.div`
  border-radius: ${(props) =>
    props.isArabic ? "10px 0 0 10px" : "0 10px 10px 0"};
  padding: 3rem;
  min-height: 60vh;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(${(props) => props.theme.bodyRgba}, 0.4);

  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    border-radius: ${(props) => props.theme.defaultRadius}
      ${(props) => props.theme.defaultRadius} 0 0;
  }
`;
const StepsContainer = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  border-radius: ${(props) =>
    props.isArabic ? " 0 10px 10px 0" : " 10px 0 0 10px"};
  min-height: 60vh;
  padding: 3rem;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(${(props) => props.theme.bodyRgba}, 0.6);
  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem 0;
    border-radius: 0 0 ${(props) => props.theme.defaultRadius}
      ${(props) => props.theme.defaultRadius};
  }
`;

const JoinUs = () => {
  const { t, i18n } = useTranslation();
  const [formStep, setFormStep] = useState(1);
  const setStep = (step) => {
    setFormStep(step);
  };
  return (
    <Section>
      <Title>{t("ourPartners")}</Title>
      <JoinUsContainer>
        <StepsContainer isArabic={i18n.language === "ar"}>
          <Steps />
        </StepsContainer>
        <PartnerFormContainer isArabic={i18n.language === "ar"}>
          <PartnersForm setStep={setStep} />
        </PartnerFormContainer>
      </JoinUsContainer>
    </Section>
  );
};

export default JoinUs;
