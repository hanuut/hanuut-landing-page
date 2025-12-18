import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Windows from "../../../assets/windows.svg";
import Playstore from "../../../assets/playstore.webp";
import BorderBeamButton from "../../../components/BorderBeamButton";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaMagic } from "react-icons/fa";

// --- Styled Components ---

const Section = styled.section`
  width: 100%;
  padding: 8rem 0 6rem 0;
  background-color: #050505;
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-top: 1px solid #18181b;
`;

// Bottom Glow
const Glow = styled.div`
  position: absolute;
  bottom: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 50vh;
  background: radial-gradient(
    ellipse at center,
    rgba(240, 122, 72, 0.2) 0%, 
    transparent 70%
  );
  filter: blur(60px);
  pointer-events: none;
`;

const Container = styled.div`
  max-width: 800px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  z-index: 2;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  font-family: 'Tajawal', sans-serif;
  
  span {
    color: #F07A48;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  color: #a1a1aa;
  line-height: 1.6;
  max-width: 600px;
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;


const WizardButton = styled.button`
  margin-top: 2rem;
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

const CtaSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Hook for navigation

  const handleDownloadPlay = () => {
    const link = process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;
    if (link) window.open(link, "_blank");
  };

  const handleDownloadWindows = () => {
    const link = process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;
    if (link) window.open(link, "_blank");
  };

  const handleWizardClick = () => {
    navigate("/partners/onboarding"); // The route we will define next
    window.scrollTo(0, 0);
  };

  return (
    <Section>
      <Glow />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Title>
            {t("cta_section_title") || "Ready to"} <br/>
            <span>{t("partnersCtaBusiness") || "Scale?"}</span>
          </Title>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Description>{t("cta_section_description")}</Description>
        </motion.div>
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <WizardButton onClick={handleWizardClick}>
            <FaMagic /> {/* Magic Icon */}
            {t("cta_wizard_button")}
          </WizardButton>
          <SubText>{t("cta_wizard_sub")}</SubText>
        </div>
        <ButtonsRow>
          {/* Principal */}
          <BorderBeamButton 
            onClick={handleDownloadPlay}
            beamColor="#F07A48"
          >
              <img src={Playstore} alt="Google Play" style={{ height: '1.5rem' }} />
              <span>Google Play</span>
          </BorderBeamButton>
          
          {/* Secondary */}
          <BorderBeamButton 
            onClick={handleDownloadWindows}
            secondary={true}
            beamColor="#F07A48"
          >
              <img src={Windows} alt="Windows" style={{ height: '1.5rem' }} />
              <span>Windows</span>
          </BorderBeamButton>
        </ButtonsRow>
         
      </Container>
    </Section>
  );
};

export default CtaSection;