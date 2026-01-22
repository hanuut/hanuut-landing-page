import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

// --- Styled Components ---

const HeroContainer = styled.header`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  /* 
     FIX: Changed from 'center' to 'flex-start' 
     This moves the whole block to the Right (in Arabic) or Left (in English)
  */
  align-items: flex-start; 
  padding: 1rem 0 2rem 0; 
  margin-bottom: 0.5rem;
`;

// Glow Layer (Shifted position since content is no longer centered)
const GlowLayer = styled.div`
  position: absolute;
  /* 
     Adjusted glow to be dynamic based on direction, 
     or just wide enough to cover the top area 
  */
  top: 50%;
  left: 50%; 
  transform: translate(-50%, -50%);
  width: 100%; 
  height: 80%;
  background: radial-gradient(
    ellipse, 
    ${(props) => props.$glowColor || "rgba(240, 122, 72, 0.12)"} 0%, 
    transparent 70%
  );
  filter: blur(60px);
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  /* FIX: Align content to start */
  justify-content: flex-start;
`;

// --- Horizontal Layout ---
const HeaderFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  /* FIX: Force text alignment to start (Right in AR, Left in EN) */
  text-align: start; 
  max-width: 800px;

  /* Mobile Stack */
  @media (max-width: 768px) {
    flex-direction: column;
    /* FIX: Align items to start on mobile too, per request */
    align-items: flex-start; 
    text-align: start;
    gap: 0.75rem;
  }
`;

const HeroLogo = styled(motion.img)`
  width: 80px; 
  height: 80px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    border-radius: 16px;
  }
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(1.5rem, 4vw, 2.2rem); 
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.1;
  font-family: 'Tajawal', sans-serif;
  letter-spacing: -0.01em;
`;

const HeroDescription = styled(motion.p)`
  font-size: 0.95rem; 
  color: #A1A1AA;
  max-width: 500px;
  line-height: 1.4;
  margin: 0;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// --- Animations ---
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const ShopHeader = ({ shop, imageData, brandColors }) => {
  const { t } = useTranslation();

  if (!shop) return null;
  
  const glowColor = brandColors?.main ? `${brandColors.main}30` : null; 

  return (
    <HeroContainer>
      <GlowLayer $glowColor={glowColor} />
      
      <Content>
        <HeaderFlex>
          {imageData && (
            <HeroLogo 
              src={imageData} 
              alt={`${shop.name} logo`} 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            />
          )}
          
          <TextGroup>
            <HeroTitle 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: 0.1 }}
            >
              {shop.name}
            </HeroTitle>
            
            {shop.description && (
              <HeroDescription
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.2 }}
              >
                {shop.description}
              </HeroDescription>
            )}
          </TextGroup>
        </HeaderFlex>
      </Content>
    </HeroContainer>
  );
};

export default ShopHeader;