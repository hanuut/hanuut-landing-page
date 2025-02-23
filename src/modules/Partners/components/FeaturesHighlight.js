import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import FeatureScroll from "./FeatureList";
import Smartphone from "../../../assets/smartphone.png";

const featuresData = (t) => ({
  foodShops: [
    {
      title: t("digitalMenuTitle"),
      description: t("digitalMenuDescription"),
      image: Smartphone,
    },
    {
      title: t("socialMediaTitle"),
      description: t("socialMediaDescription"),
      image: Smartphone,
    },
    {
      title: t("orderControlTitle"),
      description: t("orderControlDescription"),
      image: Smartphone,
    },
    {
      title: t("paymentsTitle"),
      description: t("paymentsDescription"),
      image: Smartphone,
    },
  ],
  supermarkets: [
    {
      title: t("inventoryControlTitle"),
      description: t("inventoryControlDescription"),
      image: Smartphone,
    },
    {
      title: t("financialMasteryTitle"),
      description: t("financialMasteryDescription"),
      image: Smartphone,
    },
    {
      title: t("onlineOfflineTitle"),
      description: t("onlineOfflineDescription"),
      image: Smartphone,
    },
    {
      title: t("orderManagementTitle"),
      description: t("orderManagementDescription"),
      image: Smartphone,
    },
  ],
});

const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.body};
  overflow: visible;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;

const Title = styled.h1`
  padding-top: 2rem;
  font-size: 3rem;
  color: ${(props) => props.theme.orangeColor};
  text-align: center;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: ${(props) => props.theme.actionButtonPadding};
  background-color: ${(props) =>
    props.isSelected ? props.theme.primaryColor : props.theme.body};
  color: ${(props) =>
    props.isSelected ? props.theme.body : props.theme.primaryColor};
  font-size: ${(props) => props.theme.fontsm};
  border: 1px solid;
  border-radius: ${(props) => props.theme.smallRadius};
  border-color: ${(props) => props.theme.primaryColor};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.isSelected
        ? props.theme.primaryColorDark
        : props.theme.primaryColor};
    color: ${(props) => props.theme.body};
    border-color: ${(props) => props.theme.body};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${(props) => props.theme.orangeColor}40;
  }
`;

const Paragraph = styled.p`
  font-size: ${(props) => props.theme.fontxxl};
  margin-bottom: 2rem;
  text-align: center;
  align-self: center;

  @media (max-width: 768px) {
    width: 90%;
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const FeaturesHighlightContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.body};
  z-index: 1000;
`;

const FeaturesHighlight = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("supermarkets");
  const [isSticky, setIsSticky] = useState(true);
  const featureScrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (featureScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          featureScrollRef.current;
        setIsSticky(scrollTop + clientHeight < scrollHeight - 10);
      }
    };

    const scrollContainer = featureScrollRef.current;
    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container isArabic={i18n.language === "ar"}>
      <FeaturesHighlightContainer
        style={{ position: isSticky ? "sticky" : "relative" }}
      >
        <Title>{t("discoverFeaturesTitle")}</Title>
        <Paragraph>{t("discoverFeaturesParagraph")}</Paragraph>
        <ButtonGroup>
          <Button
            onClick={() => setSelectedCategory("supermarkets")}
            isSelected={selectedCategory === "supermarkets"}
          >
            {t("supermarkets")}
          </Button>
          <Button
            onClick={() => setSelectedCategory("foodShops")}
            isSelected={selectedCategory === "foodShops"}
          >
            {t("foodShops")}
          </Button>
        </ButtonGroup>
      </FeaturesHighlightContainer>
      <FeatureScroll
        ref={featureScrollRef}
        features={featuresData(t)[selectedCategory]}
      />
    </Container>
  );
};

export default FeaturesHighlight;
