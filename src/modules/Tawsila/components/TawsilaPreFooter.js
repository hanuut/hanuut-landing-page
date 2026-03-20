import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BorderBeamButton from "../../../components/BorderBeamButton";

const Section = styled.section`
  width: 100%;
  padding: 6rem 0;
  background-color: #050505;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const Glow = styled.div`
  position: absolute;
  bottom: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  height: 50vh;
  background: radial-gradient(
    ellipse at center,
    rgba(57, 127, 249, 0.15) 0%, 
    transparent 70%
  );
  filter: blur(60px);
  pointer-events: none;
`;

const Container = styled(motion.div)`
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
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  line-height: 1.2;
  font-family: 'Tajawal', sans-serif;
  
  span {
    color: #397FF9; /* Tawsila Blue */
  }
`;

const TawsilaPreFooter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Section>
      <Glow />
      <Container
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Title>
          Ready to hit the road? <br />
          <span>Join the fleet today.</span>
        </Title>
        <BorderBeamButton 
          onClick={() => navigate("/tawsila/drive")} 
          beamColor="#397FF9"
        >
          {t("tawsila_btn_drive", "Apply to Drive")}
        </BorderBeamButton>
      </Container>
    </Section>
  );
};

export default TawsilaPreFooter;