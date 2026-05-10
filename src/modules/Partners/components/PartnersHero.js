import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { FaMagic, FaChevronDown } from "react-icons/fa";
import AppLogo3D from "../../../assets/logos/myHanuut/logo_ar.png"; 

import PlatformDownloadButtons from "./PlatformDownloadButtons";
import DigitalMatrixCanvas from "./DigitalMatrixCanvas";

const Section = styled.section`
  width: 100%; min-height: 100vh; background-color: #050505; color: white;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; overflow: hidden; top: 0;
`;

const Container = styled.div`
  width: 90%; max-width: 1000px; z-index: 5;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding-top: calc(${(props) => props.theme.navHeight} + 2rem); padding-bottom: 2rem;
  pointer-events: none;
`;

const LogoContainer = styled(motion.div)`
  position: relative; width: 65px; height: 65px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; 
  img { width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 2; filter: drop-shadow(0 10px 20px rgba(240, 122, 72, 0.5)); }
`;

const Badge = styled(motion.div)`
  display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1.4rem; border-radius: 100px;
  background: rgba(240, 122, 72, 0.08); border: 1px solid rgba(240, 122, 72, 0.3); backdrop-filter: blur(8px); color: #F07A48; font-size: 0.85rem; font-weight: 700; font-family: 'Tajawal', sans-serif; margin-bottom: 1.5rem;
`;

// h1 automatically gets KOGhorab from GlobalStyles
const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4.5rem); 
  font-weight: normal; 
  line-height: 1.2;
  color: white;
  margin: 0 0 0.5rem 0;
`;

// h2 normally gets KOGhorab, but we force Tajawal here for the English text
const HeroHighlight = styled(motion.h2)`
  font-family: var(--font-primary) !important;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(135deg, #FFFFFF 30%, #F07A48 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubHeading = styled(motion.p)`
  font-size: clamp(1.05rem, 2vw, 1.25rem); 
  color: rgba(255, 255, 255, 0.7);
  max-width: 650px;
  line-height: 1.6;
  margin: 0 auto 2.5rem auto;

  strong {
    font-weight: 500;
    color: white;
  }
`;

const WizardButton = styled.button`
  margin-top: 2rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.9rem 2.2rem; border-radius: 50px; color: white; font-size: 1.05rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease;
  font-family: 'Tajawal', sans-serif; pointer-events: auto;
  &:hover { background: rgba(240, 122, 72, 0.15); border-color: #F07A48; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(240, 122, 72, 0.1); }
  svg { color: #F07A48; }
`;

const SubText = styled.p` font-size: 0.85rem; color: #71717a; margin-top: 0.8rem; `;

const ScrollDownIndicator = styled(motion.div)`
  margin-top: 2rem;
  color: #71717a;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const PartnersHero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); 
  const isArabic = i18n.language === "ar";

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7 } }
  };

  return (
    <Section>
      <DigitalMatrixCanvas />
      <Container as={motion.div} initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
        
        <LogoContainer variants={itemVars}>
          <img src={AppLogo3D} alt="My Hanuut" />
        </LogoContainer>

        <Badge variants={itemVars}>My Hanuut</Badge>

        <HeroTitle variants={itemVars} style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
          {t("partners_hero_title")}
        </HeroTitle>

        <HeroHighlight variants={itemVars} style={{ direction: 'ltr' }}>
          Digital Command Center.
        </HeroHighlight>
        
        <SubHeading variants={itemVars} style={{ direction: isArabic ? 'rtl' : 'ltr' }}>
          {t("partners_hero_subtitle")} <br/>
          <strong>{t("partners_hero_outcome")}</strong>
        </SubHeading>

        <motion.div variants={itemVars} style={{ pointerEvents: 'auto' }}>
          <PlatformDownloadButtons layout="hero" />
        </motion.div>

        <motion.div variants={itemVars} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'auto' }}>
          <WizardButton onClick={() => navigate("/partners/onboarding")}>
            <FaMagic />
            {t("cta_onboard_primary")}
          </WizardButton>
          <SubText>{t("cta_wizard_note")}</SubText>
        </motion.div>

        <ScrollDownIndicator variants={itemVars} animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <FaChevronDown />
        </ScrollDownIndicator>

      </Container>
    </Section>
  );
};

export default PartnersHero;