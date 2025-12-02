import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "../../../components/SpotlightCard";
import {
  FaBarcode,
  FaUtensils,
  FaGlobeAfrica,
  FaBoxOpen,
  FaClipboardList,
  FaBell,
  FaTruck,
  FaLayerGroup,
  FaChartLine,
} from "react-icons/fa";

// --- Real Assets ---
import Grocery1 from "../../../assets/my_hanuut_features/grocery_1.png";
import Grocery2 from "../../../assets/my_hanuut_features/grocery_2.png";
import Grocery3 from "../../../assets/my_hanuut_features/grocery_3.png";

import Food1 from "../../../assets/my_hanuut_features/food_1.png";
import Food2 from "../../../assets/my_hanuut_features/food_2.png";
import Food3 from "../../../assets/my_hanuut_features/food_3.png";

// Assuming these exist for Global (or reusing relevant ones)
import Ecom1 from "../../../assets/my_hanuut_features/ecom_1.png";
import Ecom2 from "../../../assets/my_hanuut_features/ecom_2.png";
import Ecom3 from "../../../assets/my_hanuut_features/ecom_3.png";

// --- Styled Components ---

const Section = styled.section`
  background-color: #050505;
  padding: 2rem 0 6rem 0;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Header = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;

  span {
    color: #f07a48;
  }
`;

const TabsWrapper = styled.div`
  display: inline-flex;
  background: #18181b;
  padding: 0.4rem;
  border-radius: 16px;
  border: 1px solid #27272a;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const TabButton = styled.button`
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: ${(props) => (props.$isActive ? "#27272a" : "transparent")};
  color: ${(props) => (props.$isActive ? "white" : "#71717a")};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
  border: 1px solid ${(props) => (props.$isActive ? "#F07A48" : "transparent")};

  &:hover {
    color: white;
  }
`;

// --- The Robust Grid ---
const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 
     FIX: Using auto rows with minmax ensures cards grow to fit text 
     but never shrink below 350px, preventing overlap.
  */
  grid-auto-rows: minmax(380px, auto);
  gap: 1.5rem;
  width: 100%;

  /* Fixes z-index issues during animation */
  isolation: isolate;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BentoItem = styled(motion.div)`
  grid-column: ${(props) => props.$span || "span 1"};
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    grid-column: span 1 !important; /* Force stack on mobile */
    min-height: 400px;
  }
`;

const CardContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  /* Ensure text is always at top */
  justify-content: flex-start;
  gap: 1.5rem;
`;

const TextGroup = styled.div`
  /* Prevent text from being squashed */
  flex-shrink: 0;
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: "Tajawal", sans-serif;
`;

const CardDesc = styled.p`
  font-size: 1rem;
  color: #a1a1aa;
  line-height: 1.6;
  max-width: 95%;
`;

// Image Container
const VisualContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  background: #18181b;
  border-radius: 12px;
  border: 1px solid #27272a;
  overflow: hidden;
  position: relative;
  /* Ensure it has height but doesn't overflow parent */
  min-height: 220px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  ${BentoItem}:hover & img {
    transform: scale(1.03);
  }
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(240, 122, 72, 0.15);
  color: #f07a48;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const FeaturesBento = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("supermarkets");

  // --- COMPLETE CONTENT MAP ---
  const contentMap = {
    // 🛒 GROCERY
    supermarkets: [
      {
        id: "gro_1",
        span: "span 2",
        icon: <FaBarcode />,
        titleKey: "features_supermarkets_1_title", // Barcode Input
        descKey: "features_supermarkets_1_desc",
        image: Grocery1,
      },
      {
        id: "gro_2",
        span: "span 1",
        icon: <FaTruck />,
        titleKey: "features_supermarkets_2_title", // Shipment Tracking
        descKey: "features_supermarkets_2_desc",
        image: Grocery2,
      },
      {
        id: "gro_3",
        span: "span 3", // Full Width Bottom
        icon: <FaBell />,
        titleKey: "features_supermarkets_3_title", // Smart Alerts
        descKey: "features_supermarkets_3_desc",
        image: Grocery3,
      },
    ],

    // 🍔 FOOD
    foodShops: [
      {
        id: "food_1",
        span: "span 2",
        icon: <FaUtensils />,
        titleKey: "features_food_1_title", // Dynamic Menu
        descKey: "features_food_1_desc",
        image: Food1,
      },
      {
        id: "food_2",
        span: "span 1",
        icon: <FaBoxOpen />,
        titleKey: "features_food_2_title", // Product Management
        descKey: "features_food_2_desc",
        image: Food2,
      },
      {
        id: "food_3",
        span: "span 3",
        icon: <FaClipboardList />,
        titleKey: "features_food_3_title", // Seamless Orders
        descKey: "features_food_3_desc",
        image: Food3,
      },
    ],

    // 📦 GLOBAL
    globalShops: [
      {
        id: "ecom_1",
        span: "span 2",
        icon: <FaGlobeAfrica />,
        titleKey: "features_ecom_1_title", // Customizable Pages
        descKey: "features_ecom_1_desc",
        image: Ecom1,
      },
      {
        id: "ecom_2",
        span: "span 1",
        icon: <FaLayerGroup />,
        titleKey: "features_ecom_2_title", // Variants
        descKey: "features_ecom_2_desc",
        image: Ecom2,
      },
      {
        id: "ecom_3",
        span: "span 3",
        icon: <FaChartLine />,
        titleKey: "features_ecom_3_title", // Order Management
        descKey: "features_ecom_3_desc",
        image: Ecom3,
      },
    ],
  };

  const activeFeatures = contentMap[activeTab];

  return (
    <Section>
      <Container>
        <Header>
          <Title>
            {t("features_section_title")} <span>{t("myHanuutTitle")}</span>
          </Title>

          <TabsWrapper>
            <TabButton
              $isActive={activeTab === "supermarkets"}
              onClick={() => setActiveTab("supermarkets")}
            >
              {t("supermarkets_tab_label")}
            </TabButton>
            <TabButton
              $isActive={activeTab === "foodShops"}
              onClick={() => setActiveTab("foodShops")}
            >
              {t("foodShops_tab_label")}
            </TabButton>
            <TabButton
              $isActive={activeTab === "globalShops"}
              onClick={() => setActiveTab("globalShops")}
            >
              {t("globalShops_tab_label")}
            </TabButton>
          </TabsWrapper>
        </Header>

        <AnimatePresence mode="wait">
          <Grid
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeFeatures.map((feature) => (
              <BentoItem key={feature.id} $span={feature.span}>
                <SpotlightCard>
                  <CardContent>
                    <TextGroup>
                      <CardTitle>
                        <IconWrapper>{feature.icon}</IconWrapper>
                        {t(feature.titleKey)}
                      </CardTitle>
                      <CardDesc>{t(feature.descKey)}</CardDesc>
                    </TextGroup>
                    <VisualContainer>
                      <img
                        src={feature.image}
                        alt={t(feature.titleKey)}
                        loading="lazy"
                      />
                    </VisualContainer>
                  </CardContent>
                </SpotlightCard>
              </BentoItem>
            ))}
          </Grid>
        </AnimatePresence>
      </Container>
    </Section>
  );
};

export default FeaturesBento;
