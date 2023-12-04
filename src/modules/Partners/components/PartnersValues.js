import React from "react";
import styled from "styled-components";
import Projection from "../../../assets/projection.svg";
import Order from "../../../assets/order.svg";
import Delivery from "../../../assets/deliveryIcon.svg";
import { useTranslation } from "react-i18next";
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
  max-width: 25%;
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
    max-width: 90%;
    width: 90%;
    padding: ${(props) => props.theme.actionButtonPadding};
    gap: 0.5rem;
  }
`;

const CardHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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
  font-weight: 900;
  text-transform: uppercase;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;

const CardDescription = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 400;
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
          <Icon src={Order}></Icon>
          <Title>{t("partnersValue1")}</Title>
        </CardHeading>
        <CardDescription>{t("partnersValue1Description")}</CardDescription>
      </ValueCard>
      <ValueCard isArabic={i18n.language === "ar"}>
        <CardHeading>
          <Icon src={Projection}></Icon>
          <Title>{t("partnersValue2")}</Title>
        </CardHeading>
        <CardDescription> {t("partnersValue2Description")} </CardDescription>
      </ValueCard>
      <ValueCard isArabic={i18n.language === "ar"}>
        <CardHeading>
          <Icon src={Delivery}></Icon>
          <Title>{t("partnersValue3")}</Title>
        </CardHeading>
        <CardDescription>{t("partnersValue3Description")} </CardDescription>
      </ValueCard>
    </ValuesRow>
  );
};

export default PartnersValues;
