import React from "react";
import styled from "styled-components";
import Projection from "../../../assets/projection.svg";
import Order from "../../../assets/order.svg";
import { useTranslation } from "react-i18next";
import IncreasingArrow from "../../../assets/increasingArrow.svg";
import Megaphone from "../../../assets/megaphone.svg";
import Organize from "../../../assets/organize.svg";

const ValuesRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
    flex-direction: column;
    gap: 1rem;
  }
`;

const ValueCard = styled.div`
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  flex: 1;
  background-color: rgba(${(props) => props.theme.bodyRgba}, 1);
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 2rem 3rem;
  box-shadow: 0 2px 4px rgba(${(props) => props.theme.textRgba}, 0.2);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  backdrop-filter: blur(5px);
  @media (max-width: 768px) {
    width: 90%;
    padding: ${(props) => props.theme.actionButtonPadding};
    gap: 0.5rem;
  }
`;

const CardHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const Icon = styled.img`
  width: 4rem;
  height: 4rem;
  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
  }
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.fontxxxl};
  text-transform: capitalize;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const CardDescription = styled.p`
  font-size: ${(props) => props.theme.fontxl};

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;
const PartnersValues = () => {
  const { t, i18n } = useTranslation();
  return (
    <ValuesRow isArabic={i18n.language === "ar"}>
      <ValueCard isArabic={i18n.language === "ar"}>
        <CardHeading>
          <Icon src={Megaphone}></Icon>
          <Title>{t("partnersValue1")}</Title>
        </CardHeading>
        <CardDescription>{t("partnersValue1Description")}</CardDescription>
      </ValueCard>
      <ValueCard isArabic={i18n.language === "ar"}>
        <CardHeading>
          <Icon src={Organize}></Icon>
          <Title>{t("partnersValue2")}</Title>
        </CardHeading>
        <CardDescription> {t("partnersValue2Description")} </CardDescription>
      </ValueCard>
      <ValueCard isArabic={i18n.language === "ar"}>
        <CardHeading>
          <Icon src={IncreasingArrow}></Icon>
          <Title>{t("partnersValue3")}</Title>
        </CardHeading>
        <CardDescription>{t("partnersValue3Description")} </CardDescription>
      </ValueCard>
    </ValuesRow>
  );
};

export default PartnersValues;
