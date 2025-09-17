import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// --- Feature Images ---
import Food1 from "../../../assets/my_hanuut_features/food_1.png";
import Food2 from "../../../assets/my_hanuut_features/food_2.png";
import Food3 from "../../../assets/my_hanuut_features/food_3.png";
import Grocery1 from "../../../assets/my_hanuut_features/grocery_1.png";
import Grocery2 from "../../../assets/my_hanuut_features/grocery_2.png";
import Grocery3 from "../../../assets/my_hanuut_features/grocery_3.png";

// --- Styled Components ---

// WHY IT WORKS: The Section is tall (300vh). This gives the main browser
// scrollbar "room" to move, which is essential for the logic to work.
const Section = styled.section`
  position: relative;
  background-color: #f9f9ff;
  height: 240vh; 
`;

// WHY IT WORKS: This container sticks to the top of the viewport
// for the entire 300vh scroll duration of its parent, <Section>.
const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

const HeaderContainer = styled.div`
  width: 100%;
  padding: 4rem 0 2rem 0;
  text-align: center;
  z-index: 10;
  flex-shrink: 0;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: ${(props) => props.theme.text};
  margin-bottom: 1rem;
  margin-top: 2rem;
`;

const TabsContainer = styled.div`
  display: inline-flex;
  gap: 1rem;
  background-color: #ffffff;
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.defaultRadius};
  border: 1px solid rgba(0, 0, 0, 0.08);
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  color: ${(props) => (props.$isActive ? props.theme.body : props.theme.text)};
  background-color: ${(props) => (props.$isActive ? props.theme.darkGreen : "transparent")};
  border: none;
  border-radius: ${(props) => props.theme.smallRadius};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${(props) => (props.$isActive ? props.theme.darkGreen : "rgba(0,0,0,0.05)")};
  }
`;

const ContentLayout = styled.div`
  position: relative;
  flex-grow: 1;
  width: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  gap: 3rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextColumn = styled.div` flex: 1; position: relative; height: 200px; `;
const ImageColumn = styled.div` flex: 1; display: flex; justify-content: center; align-items: center; position: relative; `;
const FeatureImage = styled(motion.img)` width: 100%; max-width: 400px; height: auto; position: absolute;`;
const FeatureTextContainer = styled(motion.div)` position: absolute; width: 100%; `;
const FeatureTitle = styled.h3` font-size: ${(props) => props.theme.fontxxl}; font-weight: 700; color: ${(props) => props.theme.text}; margin-bottom: 1rem; `;
const FeatureDescription = styled.p` font-size: ${(props) => props.theme.fontlg}; color: rgba(${(props) => props.theme.textRgba}, 0.7); line-height: 1.6; `;

const FeaturesSection = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("supermarkets");
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef(null);

  const featuresData = {
    supermarkets: [
      { title: t("features_supermarkets_1_title"), description: t("features_supermarkets_1_desc"), image: Grocery1 },
      { title: t("features_supermarkets_2_title"), description: t("features_supermarkets_2_desc"), image: Grocery2 },
      { title: t("features_supermarkets_3_title"), description: t("features_supermarkets_3_desc"), image: Grocery3 },
    ],
    foodShops: [
      { title: t("features_food_1_title"), description: t("features_food_1_desc"), image: Food1 },
      { title: t("features_food_2_title"), description: t("features_food_2_desc"), image: Food2 },
      { title: t("features_food_3_title"), description: t("features_food_3_desc"), image: Food3 },
    ],
  };
  
  const activeFeatures = featuresData[activeCategory];

  useEffect(() => {
    const handleWheel = (e) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isInsideSection = rect.top < 1 && rect.bottom > window.innerHeight;

      if (isInsideSection) {
        if (isTransitioning) {
          e.preventDefault();
          return;
        }

        const scrollDirection = e.deltaY > 0 ? "down" : "up";

        if (scrollDirection === "down") {
          if (activeFeatureIndex < activeFeatures.length - 1) {
            e.preventDefault();
            setIsTransitioning(true);
            setActiveFeatureIndex((prev) => prev + 1);
            setTimeout(() => setIsTransitioning(false), 1000);
          } else {
            // WHY IT WORKS: At the last feature, we DO NOT preventDefault,
            // allowing the user to scroll normally to the next section.
            return; 
          }
        } else { // Scrolling up
          if (activeFeatureIndex > 0) {
            e.preventDefault();
            setIsTransitioning(true);
            setActiveFeatureIndex((prev) => prev - 1);
            setTimeout(() => setIsTransitioning(false), 1000);
          } else {
            // WHY IT WORKS: At the first feature, we DO NOT preventDefault,
            // allowing the user to scroll normally back up to the previous section.
            return;
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);

  }, [activeFeatureIndex, activeFeatures.length, isTransitioning]);

  const textVariants = {
    hidden: { opacity: 0, x: i18n.language === 'ar' ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, x: i18n.language === 'ar' ? -50 : 50, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <Section ref={sectionRef}>
      <StickyContainer>
        <HeaderContainer>
          <SectionTitle>{t("features_section_title")}</SectionTitle>
          <TabsContainer>
            <TabButton
              $isActive={activeCategory === "supermarkets"}
              onClick={() => { setActiveCategory("supermarkets"); setActiveFeatureIndex(0); }}
            >
              {t("supermarkets_tab_label")}
            </TabButton>
            <TabButton
              $isActive={activeCategory === "foodShops"}
              onClick={() => { setActiveCategory("foodShops"); setActiveFeatureIndex(0); }}
            >
              {t("foodShops_tab_label")}
            </TabButton>
          </TabsContainer>
        </HeaderContainer>

        <ContentLayout isArabic={i18n.language === "ar"}>
          <TextColumn>
            <AnimatePresence mode="wait">
              <FeatureTextContainer
                key={`${activeCategory}-${activeFeatureIndex}`}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FeatureTitle>{activeFeatures[activeFeatureIndex].title}</FeatureTitle>
                <FeatureDescription>{activeFeatures[activeFeatureIndex].description}</FeatureDescription>
              </FeatureTextContainer>
            </AnimatePresence>
          </TextColumn>
          <ImageColumn>
            <AnimatePresence mode="wait">
              <FeatureImage
                key={`${activeCategory}-${activeFeatureIndex}`}
                src={activeFeatures[activeFeatureIndex].image}
                alt={activeFeatures[activeFeatureIndex].title}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            </AnimatePresence>
          </ImageColumn>
        </ContentLayout>
      </StickyContainer>
    </Section>
  );
};

export default FeaturesSection;