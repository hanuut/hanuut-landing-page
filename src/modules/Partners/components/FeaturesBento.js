import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";

// --- Assets ---
import Grocery1 from "../../../assets/my_hanuut_features/grocery_1.png";
import Grocery2 from "../../../assets/my_hanuut_features/grocery_2.png";
import Grocery3 from "../../../assets/my_hanuut_features/grocery_3.png";

import Food1 from "../../../assets/my_hanuut_features/food_1.png";
import Food2 from "../../../assets/my_hanuut_features/food_2.png";
import Food3 from "../../../assets/my_hanuut_features/food_3.png";

import Ecom1 from "../../../assets/my_hanuut_features/ecom_1.png";
import Ecom2 from "../../../assets/my_hanuut_features/ecom_2.png";
import Ecom3 from "../../../assets/my_hanuut_features/ecom_3.png";

// --- Styled Components ---

const Section = styled.section`
  background-color: #050505; /* Consistent Dark Background */
  padding: 6rem 0;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1250px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Header = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  
  span {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const TabsWrapper = styled.div`
  display: inline-flex;
  background: #18181B;
  padding: 0.4rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const TabButton = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 40px;
  border: none;
  background: ${(props) => (props.$isActive ? props.theme.primaryColor : "transparent")};
  color: ${(props) => (props.$isActive ? "#FFF" : "#A1A1AA")};
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Tajawal", sans-serif;

  &:hover {
    color: #FFF;
    background: ${(props) => (props.$isActive ? props.theme.primaryColor : "rgba(255, 255, 255, 0.05)")};
  }
`;

// --- THE SPLIT LAYOUT ---
const SplitContent = styled(motion.div)`
  display: grid;
  /* 60% Images, 40% Text */
  grid-template-columns: 1.4fr 1fr; 
  gap: 4rem;
  width: 100%;
  align-items: start;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr; /* Stack on smaller screens */
    gap: 3rem;
  }
`;

// --- LEFT SIDE: The Image Grid (Bento) ---
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 280px 240px; /* Fixed compact heights */
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-rows: 200px 200px;
  }
`;

const ImageCard = styled(motion.div)`
  position: relative;
  background: #18181B;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  
  /* Grid Span Logic based on index */
  /* Item 0: Big Main (Span 2 cols) */
  &:nth-child(1) {
    grid-column: span 2;
  }
  /* Item 1: Normal */
  &:nth-child(2) {
    grid-column: span 1;
  }
  /* Item 2: Normal */
  &:nth-child(3) {
    grid-column: span 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }
`;

// --- RIGHT SIDE: The Q&A Content ---
const ContentSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
  height: 100%;
`;

const QuestionBox = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor};
    background: rgba(255, 255, 255, 0.05);
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const IconBadge = styled.div`
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.theme.primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
`;

const QuestionText = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #FFF;
  margin: 0;
  font-family: 'Tajawal', sans-serif;
`;

const AnswerText = styled.p`
  font-size: 0.95rem;
  color: #A1A1AA;
  line-height: 1.6;
  margin: 0;
  padding-left: ${(props) => (props.$isArabic ? "0" : "2.5rem")};
  padding-right: ${(props) => (props.$isArabic ? "2.5rem" : "0")};
  
  strong {
    color: ${(props) => props.theme.primaryColor};
    font-weight: 700;
  }
`;

const FeaturesBento = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [activeTab, setActiveTab] = useState("supermarkets");

  const contentMap = {
    supermarkets: [
      { q: "qna_gro_1_q", a: "qna_gro_1_a", image: Grocery1 },
      { q: "qna_gro_2_q", a: "qna_gro_2_a", image: Grocery2 },
      { q: "qna_gro_3_q", a: "qna_gro_3_a", image: Grocery3 },
    ],
    foodShops: [
      { q: "qna_food_1_q", a: "qna_food_1_a", image: Food1 },
      { q: "qna_food_2_q", a: "qna_food_2_a", image: Food2 },
      { q: "qna_food_3_q", a: "qna_food_3_a", image: Food3 },
    ],
    globalShops: [
      { q: "qna_ecom_1_q", a: "qna_ecom_1_a", image: Ecom1 },
      { q: "qna_ecom_2_q", a: "qna_ecom_2_a", image: Ecom2 },
      { q: "qna_ecom_3_q", a: "qna_ecom_3_a", image: Ecom3 },
    ],
  };

  const activeData = contentMap[activeTab];

  // Helper to parse bold markdown
  const parseBold = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
  };

  return (
    <Section>
      <Container>
        <Header>
          <Title>
            {t("features_section_title")} <span>{t("myHanuutTitle")}</span>
          </Title>
          
          <TabsWrapper>
            <TabButton $isActive={activeTab === "supermarkets"} onClick={() => setActiveTab("supermarkets")}>
              {t("tab_grocery")}
            </TabButton>
            <TabButton $isActive={activeTab === "foodShops"} onClick={() => setActiveTab("foodShops")}>
              {t("tab_food")}
            </TabButton>
            <TabButton $isActive={activeTab === "globalShops"} onClick={() => setActiveTab("globalShops")}>
              {t("tab_global")}
            </TabButton>
          </TabsWrapper>
        </Header>

        <AnimatePresence mode="wait">
          <SplitContent
            key={activeTab}
            $isArabic={isArabic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* --- LEFT: GRID OF IMAGES (Static, Bento Style) --- */}
            <ImageGrid>
              {activeData.map((item, index) => (
                <ImageCard key={`img-${index}`}>
                  <img src={item.image} alt="Feature" loading="lazy" />
                </ImageCard>
              ))}
            </ImageGrid>

            {/* --- RIGHT: Q&A CONTENT (User Guide Info) --- */}
            <ContentSide>
              {activeData.map((item, index) => (
                <QuestionBox key={`qna-${index}`}>
                  <QuestionHeader>
                    <IconBadge><FaCheck /></IconBadge>
                    <QuestionText>{t(item.q)}</QuestionText>
                  </QuestionHeader>
                  <AnswerText $isArabic={isArabic}>
                    {parseBold(t(item.a))}
                  </AnswerText>
                </QuestionBox>
              ))}
            </ContentSide>

          </SplitContent>
        </AnimatePresence>
      </Container>
    </Section>
  );
};

export default FeaturesBento;