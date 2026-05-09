import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { FaMagic, FaShieldAlt } from "react-icons/fa";

import PlatformDownloadButtons from "./PlatformDownloadButtons";

const Section = styled.section` width: 100%; padding: 8rem 0 6rem 0; background-color: #050505; position: relative; display: flex; justify-content: center; overflow: hidden; border-top: 1px solid #18181b; `;
const Glow = styled.div` position: absolute; bottom: -50%; left: 50%; transform: translateX(-50%); width: 100vw; height: 50vh; background: radial-gradient(ellipse at center, rgba(240, 122, 72, 0.15) 0%, transparent 70%); filter: blur(60px); pointer-events: none; `;
const Container = styled.div` max-width: 800px; width: 90%; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2.5rem; z-index: 2; `;

const Title = styled.h2` font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: white; line-height: 1.1; font-family: 'Tajawal', sans-serif; span { color: #F07A48; } `;
const Description = styled.p` font-size: 1.15rem; color: #a1a1aa; line-height: 1.6; max-width: 600px; font-family: 'Cairo', sans-serif; `;

const WizardButton = styled.button`
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1rem 2rem; border-radius: 50px; color: white; font-size: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease; font-family: 'Tajawal', sans-serif;
  &:hover { background: rgba(255, 255, 255, 0.1); border-color: #39A170; transform: translateY(-2px); } svg { color: #39A170; }
`;

const SubText = styled.p` font-size: 0.9rem; color: #71717a; margin-top: 0.8rem; `;

const TrustNote = styled(motion.div)`
  margin-top: 1.5rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1rem 1.5rem; max-width: 550px; display: flex; align-items: flex-start; gap: 12px; text-align: ${(props) => (props.$isArabic ? "right" : "left")}; direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  svg { color: #39A170; font-size: 1.2rem; flex-shrink: 0; margin-top: 2px; }
  p { font-size: 0.85rem; color: #A1A1AA; margin: 0; line-height: 1.5; font-family: 'Cairo', sans-serif; strong { color: #E4E4E7; font-weight: 700; } }
`;

const CtaSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); 
  const isArabic = i18n.language === "ar";

  const handleWizardClick = () => {
    navigate("/partners/onboarding"); 
    window.scrollTo(0, 0);
  };

  return (
    <Section>
      <Glow />
      <Container>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <Title>{t("cta_new_title")}</Title>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
          <Description>{t("cta_new_desc")}</Description>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <WizardButton onClick={handleWizardClick}><FaMagic /> {t("cta_wizard_button")}</WizardButton>
          <SubText>{t("cta_wizard_note")}</SubText>
        </div>

        <PlatformDownloadButtons layout="cta" />

        <TrustNote $isArabic={isArabic} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
          <FaShieldAlt />
          <p dangerouslySetInnerHTML={{ __html: t("windows_trust_note") }} />
        </TrustNote>
         
      </Container>
    </Section>
  );
};

export default CtaSection;