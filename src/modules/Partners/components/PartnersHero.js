import React from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import BorderBeamButton from "../../../components/BorderBeamButton";
import Windows from "../../../assets/windows.svg";
import Playstore from "../../../assets/playstore.webp";

// --- 1. Animations ---

const pulseGlow = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// --- 2. Styled Components ---

const Section = styled.section`
  width: 100%;
  min-height: 85vh;
  background-color: #050505; /* Deepest Black */
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

// Layer 1: The Soft Orange Ambient Glow
// INCREASED OPACITY: from 0.15 -> 0.35 to make it clearly visible
const OrangeAmbient = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(
    circle at 50% 45%, 
    rgba(240, 122, 72, 0.35) 0%, 
    rgba(240, 122, 72, 0.1) 40%, 
    transparent 80%
  );
  z-index: 0;
  pointer-events: none;
  animation: ${pulseGlow} 8s ease-in-out infinite;
`;

// Layer 2: The Grid Rectangles
// INCREASED OPACITY: from 0.05 -> 0.15 so lines are crisp
const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  /* The Lines: White with 15% opacity */
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  
  background-size: 60px 60px;
  
  /* Mask: Widen the visible area so it doesn't look like a small circle */
  mask-image: radial-gradient(ellipse at center, black 50%, transparent 90%);
  pointer-events: none;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1000px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2.5rem;
  padding-top: 2rem;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.5rem;
  border-radius: 100px;
  
  /* Glass Style with Orange Tint */
  background: rgba(240, 122, 72, 0.15); 
  border: 1px solid rgba(240, 122, 72, 0.4);
  box-shadow: 0 0 30px rgba(240, 122, 72, 0.15);
  backdrop-filter: blur(5px);

  color: #F07A48; 
  font-size: 0.9rem;
  font-weight: 700;
  font-family: 'Tajawal', sans-serif;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  
  animation: ${float} 6s ease-in-out infinite;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  line-height: 1.3;
  color: white;
  font-family: 'Tajawal', sans-serif;

  .highlight {
    background: linear-gradient(135deg, #FFFFFF 20%, #F07A48 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 10px 40px rgba(240, 122, 72, 0.3);
  }
`;

const SubHeading = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #d4d4d8; /* Zinc 300 - Lighter grey for better contrast on dark */
  max-width: 650px;
  line-height: 1.8;
  font-family: 'Cairo Variable', sans-serif;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Icon = styled.img`
  height: 1.6rem;
  width: auto;
  filter: invert(1);
`;

// --- Animation Config ---
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVars = {
  hidden: { y: 30, opacity: 0, filter: "blur(5px)" },
  visible: { 
    y: 0, 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
  }
};

const PartnersHero = () => {
  const { t, i18n } = useTranslation();

  const handleDownloadPlay = () => window.open(process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY, "_blank");
  const handleDownloadWindows = () => window.open(process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK, "_blank");

  return (
    <Section>
      <OrangeAmbient />
      <GridPattern />

      <Container as={motion.div} variants={containerVars} initial="hidden" animate="visible">
        
        <Badge variants={itemVars}>
          {t("partnerHeadingBoost")} {t("myHanuutTitle")}
        </Badge>

        <HeroTitle variants={itemVars} lang={i18n.language}>
          {t("partnersHero_heading_part1")} <br />
          <span className="highlight">{t("partnersHero_heading_part2")}</span>
        </HeroTitle>
        
        <SubHeading variants={itemVars}>
          {t("partnersHero_subheading")}
        </SubHeading>

        <ButtonGroup variants={itemVars}>
          <BorderBeamButton onClick={handleDownloadPlay}>
             <Icon src={Playstore} alt="Google Play" />
             <span>Google Play</span>
          </BorderBeamButton>
          
          <BorderBeamButton onClick={handleDownloadWindows}>
             <Icon src={Windows} alt="Windows" />
             <span>Windows</span>
          </BorderBeamButton>
        </ButtonGroup>

      </Container>
    </Section>
  );
};

export default PartnersHero;