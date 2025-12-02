import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Windows from "../../../assets/windows.svg";
import Playstore from "../../../assets/playstore.webp";
import BorderBeamButton from "../../../components/BorderBeamButton";

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

// Custom styling for the download buttons to fit the dark theme
const DarkButtonWrapper = styled.div`
  button {
    background-color: white !important;
    color: black !important;
    border: 1px solid white;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(255,255,255,0.2);
    }
  }
`;

const GlassButtonWrapper = styled.div`
  button {
    background-color: rgba(255,255,255,0.05) !important;
    color: white !important;
    border: 1px solid rgba(255,255,255,0.2);
    
    &:hover {
      background-color: rgba(255,255,255,0.1) !important;
      transform: scale(1.05);
    }
  }
`;

const CtaSection = () => {
  const { t, i18n } = useTranslation();

const handleDownloadPlay = () => {
    const link = process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY;
    if (link) window.open(link, "_blank");
  };

  const handleDownloadWindows = () => {
    const link = process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK;
    if (link) window.open(link, "_blank");
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