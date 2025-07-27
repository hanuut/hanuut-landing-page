import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import FeatureScroll from "./FeatureList";
import Food1 from "../../../assets/my_hanuut_features/food_1.png";
import Food2 from "../../../assets/my_hanuut_features/food_2.png";
import Food3 from "../../../assets/my_hanuut_features/food_3.png";
import Grocery1 from "../../../assets/my_hanuut_features/grocery_1.png";
import Grocery2 from "../../../assets/my_hanuut_features/grocery_2.png";
import Grocery3 from "../../../assets/my_hanuut_features/grocery_3.png";

const featuresData = (t) => ({
  foodShops: [
    {
      title: t("foodShopsTitle"),
      description: t("foodShopsDescription"),
      image: Food1,
    },
    {
      title: t("socialMediaTitle"),
      description: t("socialMediaDescription"),
      image: Food2,
    },
    {
      title: t("orderControlTitle"),
      description: t("orderControlDescription"),
      image: Food3,
    },
  ],
  supermarkets: [
    {
      title: t("inventoryControlTitle"),
      description: t("inventoryControlDescription"),
      image: Grocery1,
    },
    {
      title: t("financialMasteryTitle"),
      description: t("financialMasteryDescription"),
      image: Grocery2,
    },
    {
      title: t("seamlessPaymentsTitle"),
      description: t("seamlessPaymentsDescription"),
      image: Grocery3,
    },
  ],
  globalShops: [
    {
      title: t("onlineOfflineTitle"),
      description: t("onlineOfflineDescription"),
      image: Grocery1,
    },
    {
      title: t("smartOrderTitle"),
      description: t("smartOrderDescription"),
      image: Grocery2,
    },
    {
      title: t("orderManagementTitle"),
      description: t("orderManagementDescription"),
      image: Grocery3,
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
  color: ${(props) => props.theme.accent};
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
    props.isSelected ? props.theme.darkGreen : props.theme.body};
  color: ${(props) =>
    props.isSelected ? props.theme.accent : props.theme.darkGreen};
  font-size: ${(props) => props.theme.fontxl};
  border: 1px solid;
  border-radius: ${(props) => props.theme.smallRadius};
  border-color: ${(props) => props.theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${(props) => (props.isSelected ? 900 : 400)};
  &:hover {
    background-color: ${(props) => props.theme.darkGreen};
    color: ${(props) => props.theme.accent};
    border-color: ${(props) => props.theme.body};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${(props) => props.theme.accent}40;
  }
`;

const Paragraph = styled.p`
  font-size: ${(props) => props.theme.fontxxl};
  margin-bottom: 2rem;
  padding: 0rem 6rem;
  text-align: center;
  align-self: center;
  @media (max-width: 768px) {
    padding: 0rem 2rem;
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const FeaturesHighlightContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.body};
  z-index: 1000;
`;

const FeaturesHighlight = ({alReadySelected}) => {
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

  // Domain content from l18n
  const domainContent = {
    features: {
      supermarkets: t("myHanuutFeatures.grocerySections", {
        returnObjects: true,
      }),
      foodShops: t("myHanuutFeatures.foodSections", { returnObjects: true }),
      globalShops: t("myHanuutFeatures.ecomSections", { returnObjects: true }),
    },
  };

  // Get the appropriate sections for the selected category
  const currentFeaturesSteps = domainContent.features[selectedCategory] || [];
  const generateTitle = () => {
    return currentFeaturesSteps.slice(0, 1);
  };

  // // If already selected, set the initial state
  // useEffect(() => {
  //   if (alReadySelected) {
  //     setSelectedCategory(alReadySelected);
  //   }
  // }, [alReadySelected]);
  return (
    <Container isArabic={i18n.language === "ar"}>
      <FeaturesHighlightContainer
        style={{ position: isSticky ? "sticky" : "relative" }}
      >
        {generateTitle().map((section, indexS) => (
          <Title>{section.title}</Title>
        ))}
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
          <Button
            onClick={() => setSelectedCategory("globalShops")}
            isSelected={selectedCategory === "globalShops"}
          >
            {t("globalShops")}
          </Button>
        </ButtonGroup>
      </FeaturesHighlightContainer>
      <FeatureScroll
        ref={featureScrollRef}
        features={featuresData(t)[selectedCategory]}
        selectedFeature={selectedCategory}
      />
    </Container>
  );
};

export default FeaturesHighlight;
