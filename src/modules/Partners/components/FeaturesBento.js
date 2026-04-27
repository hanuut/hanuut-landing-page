// src/modules/Partners/components/FeaturesBento.js
import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimesCircle, FaCheckCircle, FaArrowRight, FaArrowLeft, FaLayerGroup } from "react-icons/fa";

import FeatureDirectoryModal from "./FeatureDirectoryModal";

import Grocery1 from "../../../assets/my_hanuut_features/grocery_1.png";
import Grocery2 from "../../../assets/my_hanuut_features/grocery_2.png";
import Grocery3 from "../../../assets/my_hanuut_features/grocery_3.png";

import Food1 from "../../../assets/my_hanuut_features/food_1.png";
import Food2 from "../../../assets/my_hanuut_features/food_2.png";
import Food3 from "../../../assets/my_hanuut_features/food_3.png";

import Ecom1 from "../../../assets/my_hanuut_features/ecom_1.png";
import Ecom2 from "../../../assets/my_hanuut_features/ecom_2.png";
import Ecom3 from "../../../assets/my_hanuut_features/ecom_3.png";

const Section = styled.section`
  background-color: #050505; padding: 6rem 0; display: flex; justify-content: center; position: relative; overflow: hidden;
`;

const Container = styled.div`
  width: 90%; max-width: 1250px; display: flex; flex-direction: column; gap: 3rem;
`;

const Header = styled.div`
  text-align: center; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 800; color: #FFFFFF; margin: 0; font-family: "Tajawal", sans-serif;
  span { color: ${(props) => props.theme.primaryColor}; }
`;

const TabsWrapper = styled.div`
  display: inline-flex; background: #18181B; padding: 0.4rem; border-radius: 50px; border: 1px solid rgba(255, 255, 255, 0.1); gap: 0.5rem; flex-wrap: wrap; justify-content: center;
`;

const TabButton = styled.button`
  padding: 0.75rem 2rem; border-radius: 40px; border: none; background: ${(props) => (props.$isActive ? props.theme.primaryColor : "transparent")};
  color: ${(props) => (props.$isActive ? "#FFF" : "#A1A1AA")}; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; font-family: "Tajawal", sans-serif;
  &:hover { color: #FFF; background: ${(props) => (props.$isActive ? props.theme.primaryColor : "rgba(255, 255, 255, 0.05)")}; }
`;

const SplitContent = styled(motion.div)`
  display: grid; grid-template-columns: 1.4fr 1fr; gap: 4rem; width: 100%; align-items: start; direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 3rem; }
`;

const ImageGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: 280px 240px; gap: 1rem; width: 100%;
  @media (max-width: 768px) { grid-template-rows: 200px 200px; }
`;

const ImageCard = styled(motion.div)`
  position: relative; background: #18181B; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  &:nth-child(1) { grid-column: span 2; }
  &:nth-child(2) { grid-column: span 1; }
  &:nth-child(3) { grid-column: span 1; }
  img { width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.5s ease; }
  &:hover img { transform: scale(1.03); }
`;

const ContentSide = styled.div`
  display: flex; flex-direction: column; gap: 1.5rem; justify-content: center; height: 100%;
`;

const PainSolutionBox = styled.div`
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 1.5rem; transition: all 0.3s ease;
  &:hover { border-color: ${(props) => props.theme.primaryColor}; background: rgba(255, 255, 255, 0.05); }
`;

const Row = styled.div`
  display: flex; align-items: flex-start; gap: 1rem; margin-bottom: ${(props) => (props.$isLast ? "0" : "1rem")};
`;

const TextContent = styled.p`
  font-size: 0.95rem; color: ${(props) => (props.$isSolution ? "#E4E4E7" : "#A1A1AA")}; margin: 0; line-height: 1.5; font-family: 'Cairo', sans-serif;
  strong { color: ${(props) => props.theme.primaryColor}; font-weight: 700; }
`;

const ViewMoreBtn = styled.button`
  margin-top: 1rem; padding: 1rem; border-radius: 16px; background: rgba(240, 122, 72, 0.1); color: #F07A48; border: 1px solid rgba(240, 122, 72, 0.3);
  font-size: 1.05rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s ease; font-family: "Tajawal", sans-serif;
  &:hover { background: #F07A48; color: #FFF; }
`;

const FeaturesBento = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [activeTab, setActiveTab] = useState("globalShops");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contentMap = {
    globalShops: [
      { pain: "pain_global_1", sol: "sol_global_1", image: Ecom1 },
      { pain: "pain_global_2", sol: "sol_global_2", image: Ecom2 },
      { pain: "pain_global_3", sol: "sol_global_3", image: Ecom3 },
    ],
    foodShops: [
      { pain: "pain_food_1", sol: "sol_food_1", image: Food1 },
      { pain: "pain_food_2", sol: "sol_food_2", image: Food2 },
      { pain: "pain_food_3", sol: "sol_food_3", image: Food3 },
    ],
    supermarkets: [
      { pain: "pain_gro_1", sol: "sol_gro_1", image: Grocery1 },
      { pain: "pain_gro_2", sol: "sol_gro_2", image: Grocery2 },
      { pain: "pain_gro_3", sol: "sol_gro_3", image: Grocery3 },
    ],
  };

  const activeData = contentMap[activeTab];

  const parseBold = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
    );
  };

  return (
    <>
      <Section>
        <Container>
          <Header>
            <Title>
              {t("features_section_title")} <span>{t("myHanuutTitle")}</span>
            </Title>
            <TabsWrapper>
              <TabButton $isActive={activeTab === "globalShops"} onClick={() => setActiveTab("globalShops")}>
                {t("tab_global")}
              </TabButton>
              <TabButton $isActive={activeTab === "foodShops"} onClick={() => setActiveTab("foodShops")}>
                {t("tab_food")}
              </TabButton>
              <TabButton $isActive={activeTab === "supermarkets"} onClick={() => setActiveTab("supermarkets")}>
                {t("tab_grocery")}
              </TabButton>
            </TabsWrapper>
          </Header>

          <AnimatePresence mode="wait">
            <SplitContent key={activeTab} $isArabic={isArabic} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <ImageGrid>
                {activeData.map((item, index) => (
                  <ImageCard key={`img-${index}`}>
                    <img src={item.image} alt="Feature" loading="lazy" />
                  </ImageCard>
                ))}
              </ImageGrid>

              <ContentSide>
                {activeData.map((item, index) => (
                  <PainSolutionBox key={`ps-${index}`}>
                    <Row>
                      <FaTimesCircle style={{ color: '#EF4444', fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }} />
                      <TextContent>{t(item.pain)}</TextContent>
                    </Row>
                    <Row $isLast>
                      <FaCheckCircle style={{ color: '#39A170', fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }} />
                      <TextContent $isSolution>{parseBold(t(item.sol))}</TextContent>
                    </Row>
                  </PainSolutionBox>
                ))}
                
                <ViewMoreBtn onClick={() => setIsModalOpen(true)}>
                  <FaLayerGroup />
                  {t("view_all_features")} 
                </ViewMoreBtn>
              </ContentSide>
            </SplitContent>
          </AnimatePresence>
        </Container>
      </Section>
      
<FeatureDirectoryModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  activeTab={activeTab} 
/>
    </>
  );
};

export default FeaturesBento;