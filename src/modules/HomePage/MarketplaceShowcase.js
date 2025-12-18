import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGavel,
  FaMapMarkedAlt,
  FaComments,
  FaArrowRight,
} from "react-icons/fa";
import FeatureImg1 from "../../assets/screenshots/scene1.png";
import FeatureImg2 from "../../assets/screenshots/scene2.png";
import FeatureImg3 from "../../assets/screenshots/scene3.png";

const Section = styled.section`
  padding: 6rem 0;
  background-color: #ffffff; /* Clean White to contrast with Ivory sections */
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 960px) {
    flex-direction: column-reverse;
    gap: 3rem;
  }
`;

// --- TEXT SIDE ---
const TextSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Badge = styled.span`
  background: rgba(57, 161, 112, 0.1);
  color: #39a170;
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.85rem;
  width: fit-content;
  font-family: "Tajawal", sans-serif;
`;

const Title = styled.h2`
  font-size: clamp(1rem, 4vw, 2rem);
  font-weight: 800;
  color: #111217;
  line-height: 1.2;
  font-family: "Tajawal", sans-serif;
  margin: 0;

  span {
    color: #39a170; /* Brand Green */
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #52525b;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
  max-width: 500px;
`;

// --- INTERACTIVE FEATURE LIST ---
const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.$active ? "#F8F9FA" : "transparent")};
  border: 1px solid
    ${(props) => (props.$active ? "rgba(57, 161, 112, 0.2)" : "transparent")};

  &:hover {
    background: #f8f9fa;
  }
`;

const IconBox = styled.div`
  min-width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${(props) => (props.$active ? "#39A170" : "#E4E4E7")};
  color: ${(props) => (props.$active ? "#FFF" : "#52525b")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
`;

const FeatureText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111217;
    margin: 0;
    font-family: "Tajawal", sans-serif;
  }

  p {
    font-size: 0.95rem;
    color: #52525b;
    margin: 0;
    line-height: 1.5;
    /* Hide description if not active on mobile to save space */
    @media (max-width: 600px) {
      display: ${(props) => (props.$active ? "block" : "none")};
    }
  }
`;

// --- IMAGE SIDE (PHONE MOCKUP) ---
const ImageSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  /* Give it a bit of height to breathe */
  min-height: 500px;

  img {
    width: 100%;
    max-width: 500px;
    height: auto;
    border-radius: 6px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    /* Animation attributes */
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.5s ease;
  }

  /* When image loads/switches */
  img.active {
    opacity: 1;
    transform: scale(1);
  }
`;

// A circle blob behind the phone
const BackBlob = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(57, 161, 112, 0.15) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  z-index: 0;
`;

const PhoneFrame = styled.div`
  width: 300px;
  height: 600px; // Approx ratio
  border-radius: 10px;

  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;

  @media (max-width: 500px) {
    width: 260px;
    height: 520px;
  }
`;

const Screen = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top; /* Important for long screenshots */
  }
`;

const CTAButton = styled.button`
  margin-top: 1rem;
  background: #111217;
  color: white;
  padding: 1rem 1rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: #27272a;
  }
`;

const MarketplaceShowcase = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      icon: <FaGavel />,
      title: t("market_feat_1_title"),
      desc: t("market_feat_1_desc"),
      image: FeatureImg1, // Screenshot of Bidding
    },
    {
      id: 1,
      icon: <FaMapMarkedAlt />,
      title: t("market_feat_2_title"),
      desc: t("market_feat_2_desc"),
      image: FeatureImg2, // Screenshot of Local Toggle
    },
    {
      id: 2,
      icon: <FaComments />,
      title: t("market_feat_3_title"),
      desc: t("market_feat_3_desc"),
      image: FeatureImg3, // Screenshot of Chat
    },
  ];

  const handleDownload = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Section>
      <Container $isArabic={isArabic}>
        {/* TEXT CONTENT */}
        <TextSide>
          <Badge>{t("market_section_badge")}</Badge>
          <Title
            dangerouslySetInnerHTML={{ __html: t("market_section_title") }}
          />

          <FeatureList>
            {features.map((feature, index) => (
              <FeatureItem
                key={feature.id}
                $active={activeFeature === index}
                onMouseEnter={() => setActiveFeature(index)} // Desktop Hover
                onClick={() => setActiveFeature(index)} // Mobile Click
              >
                <IconBox $active={activeFeature === index}>
                  {feature.icon}
                </IconBox>
                <FeatureText $active={activeFeature === index}>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>

          <CTAButton onClick={handleDownload}>
            {t("market_cta")}
            {isArabic ? (
              <FaArrowRight style={{ transform: "rotate(180deg)" }} />
            ) : (
              <FaArrowRight />
            )}
          </CTAButton>
        </TextSide>

        {/* IMAGE / PHONE MOCKUP */}
        <ImageSide>
          <BackBlob />
          <PhoneFrame>
            <Screen>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFeature}
                  src={features[activeFeature].image}
                  alt="App Screen"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
            </Screen>
          </PhoneFrame>
        </ImageSide>
      </Container>
    </Section>
  );
};

export default MarketplaceShowcase;
