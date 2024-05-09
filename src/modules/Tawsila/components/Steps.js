import React from "react";
import styled from "styled-components";
import HexagoneIcon from "./HexagoneIcon";
import HexagoneIconSvg from "../../../assets/hexagone.svg";
import { useTranslation } from "react-i18next";
const Section = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  background-color: ${(props) => props.theme.secondaryColor};
  padding: 2rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  justify-content: flex-start;
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: bold;
  color: ${(props) => props.theme.body};
  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const StepsContainer = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  min-height: 20vh;
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
    gap: 3rem;
  }
`;

const StepCart = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    gap: 1rem;
  }
`;

const StepCartHeading = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepingCartBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: flex-start;
    justify-content: flex-start;
  }
`;

const CartBodyTitle = styled.h3`
  margin-top: 5px;
  color: ${(props) => props.theme.body};
  width: 75%;
  text-align: center;
  font-size: ${(props) => props.theme.fontxxxl};

  @media (max-width: 768px) {
    text-align: ${(props) => (props.isArabic ? "right" : "left")};
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const CartBodyContent = styled.p`
  color: ${(props) => props.theme.body};
  width: 75%;
  text-align: center;
  font-size: ${(props) => props.theme.fontxxl};
  @media (max-width: 768px) {
    width: 100%;
    text-align: ${(props) => (props.isArabic ? "right" : "left")};
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const Steps = () => {
  const { t, i18n } = useTranslation();
  return (
    <Section isArabic={i18n.language === "ar"}>
      <StepsContainer isArabic={i18n.language === "ar"}>
        <StepCart>
          <StepCartHeading>
            <HexagoneIcon img={HexagoneIconSvg} content={1} />
          </StepCartHeading>
          <StepingCartBody>
            <CartBodyTitle isArabic={i18n.language === "ar"}>
              {t("firstJoinStepTitle")}
            </CartBodyTitle>
            <CartBodyContent isArabic={i18n.language === "ar"}>
              {t("firstJoinStepText")}
            </CartBodyContent>
          </StepingCartBody>
        </StepCart>
        <StepCart>
          <StepCartHeading>
            <HexagoneIcon img={HexagoneIconSvg} content={2} />
          </StepCartHeading>
          <StepingCartBody>
            <CartBodyTitle isArabic={i18n.language === "ar"}>
              {t("secondJoinStepTitle")}
            </CartBodyTitle>
            <CartBodyContent isArabic={i18n.language === "ar"}>
              {t("secondJoinStepText")}
            </CartBodyContent>
          </StepingCartBody>
        </StepCart>
        <StepCart>
          <StepCartHeading>
            <HexagoneIcon img={HexagoneIconSvg} content={3} />
          </StepCartHeading>
          <StepingCartBody>
            <CartBodyTitle isArabic={i18n.language === "ar"}>
              {t("thirdJoinStepTitle")}
            </CartBodyTitle>
            <CartBodyContent isArabic={i18n.language === "ar"}>
              {t("thirdJoinStepText")}
            </CartBodyContent>
          </StepingCartBody>
        </StepCart>
      </StepsContainer>
    </Section>
  );
};

export default Steps;
