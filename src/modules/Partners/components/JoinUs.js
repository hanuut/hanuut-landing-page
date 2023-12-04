import React, { useState } from "react";
import styled from "styled-components";
import PartnersForm from "./PartnersForm";
import Steps from "./Steps";
import { useTranslation } from "react-i18next";
const Section = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
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
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(7px);
  border-radius: ${(props) => props.theme.defaultRadius};
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    width: 100%;
    padding: 0;
  }
`;

const PartnerFormContainer = styled.div`
  border-radius: ${(props) => (props.isArabic ? "10px 0 0 10px" : "0 10px 10px 0")};
  padding: 3rem;
  min-height: 60vh;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(${(props) => props.theme.primaryColorRgba}, 0.15);
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    border-radius: ${(props) => props.theme.defaultRadius}
      ${(props) => props.theme.defaultRadius} 0 0;
  }
`;
const StepsContainer = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  min-height: 60vh;
  padding: 3rem;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem 0;
  }
`;

const JoinUs = () => {
  const { t, i18n } = useTranslation();
  const [formStep, setFormStep] = useState(0);
  const setStep = (step) => {
    setFormStep(step);
  };
  return (
    <Section>
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
