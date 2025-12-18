import React from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import BorderBeamButton from "../../../components/BorderBeamButton";
import Windows from "../../../assets/windows.svg";
import Playstore from "../../../assets/playstore.webp";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaMagic } from "react-icons/fa";
// --- NEW IMPORT: Make sure to save your image here ---
import AppLogo3D from "../../../assets/logos/myHanuut/logo_ar.png"; // <--- 3D Logo Image

// --- 1. Animations ---

const pulseGlow = keyframes`
  0% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); } /* Increased range for the logo */
  100% { transform: translateY(0px); }
`;

// --- 2. Styled Components ---

const Section = styled.section`
  width: 100%;
  min-height: 90vh; /* Slightly taller to accommodate the logo */
  background-color: #050505;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

// ... (Keep OrangeAmbient and GridPattern exactly as they were) ...
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

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 60px 60px;
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
  gap: 2rem; /* Reduced slightly to fit everything */
  padding-top: 2rem;
`;

// --- NEW: 3D Logo Container ---
const LogoContainer = styled(motion.div)`
  position: relative;
  width: 60px; 
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -1rem; /* Pull the badge closer */
  
  /* The Physics Animation */
  animation: ${float} 8s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 2;
    /* Enhance the 3D look */
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.5));
  }
`;

// --- NEW: Logo Glow ---
// This makes the logo look like it's glowing from behind
const LogoBacklight = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(240, 122, 72, 0.6) 0%, transparent 70%);
  filter: blur(40px);
  z-index: 1;
  opacity: 0.8;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.5rem;
  border-radius: 100px;
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
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 2.5rem);
  font-weight: 800;
  line-height: 1.3;
  color: white;
  font-family: 'Tajawal', sans-serif;

  .highlight {
    background: linear-gradient(135deg, #FFFFFF 20%, #F07A48 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 10px 40px rgba(145, 245, 179, 1);
  }
`;

const SubHeading = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #d4d4d8;
  max-width: 650px;
  line-height: 1.8;
  font-family: 'Cairo Variable', sans-serif;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Icon = styled.img`
  height: 1.6rem;
  width: auto;
  filter: invert(1);
`;

const WizardButton = styled.button`
  margin-top: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  font-family: 'Tajawal', sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #39A170;
    transform: translateY(-2px);
  }

  svg {
    color: #39A170;
  }
`;

const SubText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
`;

const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
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
  const navigate = useNavigate(); 

  const handleDownloadPlay = () => window.open(process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY, "_blank");
  const handleDownloadWindows = () => window.open(process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK, "_blank");
 const handleWizardClick = () => {
    navigate("/partners/onboarding"); // The route we will define next
    window.scrollTo(0, 0);
  };

  return (
    <Section>
      <OrangeAmbient />
      <GridPattern />

      <Container as={motion.div} variants={containerVars} initial="hidden" animate="visible">
        
        {/* --- NEW: The Floating Logo --- */}
        <LogoContainer variants={itemVars}>
          <LogoBacklight />
          <img src={AppLogo3D} alt="My Hanuut App" />
        </LogoContainer>

        <Badge variants={itemVars}>
          {/* Removed emoji as per previous request if you prefer clean look */}
           {t("partnerHeadingBoost")} {t("myHanuutTitle")}
        </Badge>

        <HeroTitle variants={itemVars} lang={i18n.language}>
          <span className="highlight">{t("partnersHero_heading_part1")}</span>
        </HeroTitle>
        
        <SubHeading variants={itemVars}>
          {t("partnersHero_subheading")}
        </SubHeading>

        <ButtonGroup variants={itemVars}>
          <BorderBeamButton onClick={handleDownloadPlay} beamColor="#F07A48">
             <Icon src={Playstore} alt="Google Play" />
             <span>Google Play</span>
          </BorderBeamButton>
          
          <BorderBeamButton onClick={handleDownloadWindows} secondary={true} beamColor="#F07A48">
             <Icon src={Windows} alt="Windows" />
             <span>Windows</span>
          </BorderBeamButton>
        </ButtonGroup>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <WizardButton onClick={handleWizardClick}>
            <FaMagic /> {/* Magic Icon */}
            {t("cta_wizard_button")}
          </WizardButton>
          <SubText>{t("cta_wizard_sub")}</SubText>
        </div>

      </Container>
    </Section>
  );
};

export default PartnersHero;