import React from "react";
import styled from "styled-components";
import SubscribeRequest from "../../../assets/subscribeRequest.svg";
import Approved from "../../../assets/approved.svg";
import IncreasingArrow from "../../../assets/increasingArrow.svg";
import Zero from "../../../assets/zero.svg";
import One from "../../../assets/one.svg";
import Two from "../../../assets/two.svg";
import Three from "../../../assets/three.svg";
import { useTranslation } from "react-i18next";

const StepsContainer = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  width: 100%;
  height: 100%;
  gap: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const StepRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const StepIcon = styled.img`
  width: 6rem;
  @media (max-width: 768px) {
    width: 3rem;
  }
`;

const StepDescription = styled.div`
  width: 70%;
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ${({ className }) => {
    if (className === "step-one") {
      return `
      background-image: url(${Zero}), url(${One});
      `;
    } else if (className === "step-two") {
      return `
      background-image: url(${Zero}), url(${Two});
      `;
    } else if (className === "step-three") {
      return `
      background-image: url(${Zero}), url(${Three});
      `;
    }
  }}
  background-size: contain;
  background-position: ${(props) => (props.isArabic ? "80%, 100%" : "0, 15%")};
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    background-size: 30%;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const StepTitle = styled.h1`
  margin-bottom: 1rem;
  font-size: ${(props) => props.theme.fontxxxl};
  font-weight: 900;
  text-transform: uppercase;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxl};
    margin-bottom: 0.5rem;
  }
`;
const StepText = styled.ul``;

const Steps = () => {
  const { t, i18n } = useTranslation();
  return (
    <StepsContainer isArabic={i18n.language === "ar"}>
      <StepRow>
        <StepIcon src={SubscribeRequest} alt="step-icon" loading="lazy" />
        <StepDescription className="step-one" isArabic={i18n.language === "ar"}>
          <StepTitle>{t("partnersFirstStepTitle")}</StepTitle>
          <StepText>
            <li>{t("partnersFirstStepDescription1")}</li>
            <li>{t("partnersFirstStepDescription2")}</li>
          </StepText>
        </StepDescription>
      </StepRow>
      <StepRow>
        <StepIcon src={Approved} alt="step-icon" loading="lazy" />
        <StepDescription className="step-two" isArabic={i18n.language === "ar"}>
          <StepTitle>{t("partnersSecondStepTitle")}</StepTitle>
          <StepText>
            <li>{t("partnersSecondStepDescriptions1")}</li>
            <li>{t("partnersSecondStepDescriptions2")}</li>
          </StepText>
        </StepDescription>
      </StepRow>{" "}
      <StepRow>
        <StepIcon src={IncreasingArrow} alt="step-icon" loading="lazy" />
        <StepDescription
          className="step-three"
          isArabic={i18n.language === "ar"}
        >
          <StepTitle>{t("partnersThirdStepTitle")}</StepTitle>
          <StepText>
            <li>{t("partnerThirdStepDescription1")}</li>
            <li>{t("partnerThirdStepDescription2")}</li>
          </StepText>
        </StepDescription>
      </StepRow>
    </StepsContainer>
  );
};

export default Steps;
