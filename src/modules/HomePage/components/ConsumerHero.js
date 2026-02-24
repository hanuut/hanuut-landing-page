import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaStore, FaShoppingBag, FaArrowRight, FaArrowLeft } from "react-icons/fa";

import BorderBeamButton from "../../../components/BorderBeamButton";
// --- REPLACE THIS WITH YOUR NEW 3D IMAGE ---
import HubIllustration from "../../../assets/hub_illustration.png"; 

// --- Animations ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const blobMove = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

// --- Styled Components ---

const Section = styled.section`
  width: 100%;
  /* Ensure it fills height minus navbar */
  min-height: calc(100vh - 5rem); 
  background-color: #ffffffff; /* Ivory Background */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
`;

const Blob = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: ${(props) => props.color};
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
  animation: ${blobMove} 20s infinite alternate;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
`;

const Container = styled.div`
  width: 90%;
  max-width: 1250px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 960px) {
    flex-direction: column-reverse;
    text-align: center;
    gap: 4rem;
    padding-top: 2rem;
  }
`;

const TextContent = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isArabic ? "flex-start" : "flex-start")};
  gap: 1.5rem;
  z-index: 10;

  @media (max-width: 960px) {
    align-items: center;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2 rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.15;
  color: #111217;
  font-family: "Tajawal", sans-serif;
  margin: 0;

  span {
    background: linear-gradient(135deg, #39a170 0%, #f07a48 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.35rem;
  color: #52525b;
  line-height: 1.6;
  max-width: 600px;
  font-family: "Cairo", sans-serif;
  font-weight: 500;
`;

const ImageContent = styled(motion.div)`
  flex: 1.2; /* Give image slightly more space */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* Allow image to overlap blobs */
  z-index: 2; 
`;

// --- New Illustration Wrapper (Replaces PhoneWrapper) ---
const IsometricWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 750px; /* Larger max-width for the building scene */
  
  /* Floating Animation */
  animation: ${float} 6s ease-in-out infinite;
  
  /* Ensure image fits well */
  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    /* Soft drop shadow instead of box-shadow for transparent PNG */
    filter: drop-shadow(0 30px 40px rgba(0,0,0,0.15));
    
    /* Slight scale on hover for interactivity */
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.02);
  }
`;

// --- Updated Button Styling ---
const ButtonsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 960px) {
    justify-content: center;
  }
`;

// Wrapper to override BorderBeamButton styles locally
const ButtonOverride = styled.div`
  /* Override width/padding logic here */
  button {
    /* Make buttons wider */
    min-width: 240px !important; 
    padding: 0 2.5rem !important; 
  }

  /* Specific overrides for the Secondary (My Hanuut) button */
  &.secondary-btn {
    button {
      /* Force border to match text */
      border: 2px solid #111217 !important; 
      /* Force background to be transparent */
      background: transparent !important;
      
      /* Force TEXT and ICON to be Black */
      div {
        color: #111217 !important;
      }
      span, p, svg {
        color: #111217 !important;
        fill: #111217 !important;
      }
      
      /* Hover state for secondary */
      &:hover {
        background: rgba(17, 18, 23, 0.05) !important;
      }
    }
  }
`;

const ArrowIcon = styled.span`
  display: flex;
  align-items: center;
  /* Flip margins based on language */
  margin-left: ${props => props.isArabic ? 0 : '12px'};
  margin-right: ${props => props.isArabic ? '12px' : 0};
  font-size: 0.9rem;
`;

const ConsumerHero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <Section>
      {/* Background Blobs */}
      <Blob color="rgba(57, 161, 112, 0.25)" top="-10%" left="-10%" />
      <Blob color="rgba(240, 122, 72, 0.2)" bottom="10%" right="-5%" />

      <Container $isArabic={isArabic}>
        <TextContent
          $isArabic={isArabic}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {/* Ecosystem Badge */}
          <motion.div variants={itemVars}>
            <span
              style={{
                background: "rgba(17, 18, 23, 0.05)",
                color: "#111217",
                padding: "8px 16px",
                borderRadius: "30px",
                fontWeight: "700",
                fontSize: "0.9rem",
                border: "1px solid rgba(17, 18, 23, 0.1)",
                fontFamily: "Tajawal, sans-serif"
              }}
            >
              {t("companyName") || "Hanuut Express"} Ecosystem
            </span>
          </motion.div>

          <Title as={motion.h1} variants={itemVars}>
            {t("hub_headline") || "The Digital Infrastructure for Commerce"}
          </Title>

          <Subtitle as={motion.p} variants={itemVars}>
            {t("hub_subheadline") || "Connecting shops, customers, and delivery in one trusted system."}
          </Subtitle>

          <motion.div variants={itemVars}>
            <ButtonsRow>
              {/* 1. E'SUUQ Button (Black Background, White Text) */}
              <ButtonOverride>
                <BorderBeamButton onClick={() => navigate("/esuuq")} beamColor="#39A170">
                  <FaShoppingBag style={{ fontSize: '1.2rem' }} />
                  <span>{t("nav_esuuq") || "E'SUUQ"}</span>
                  <ArrowIcon isArabic={isArabic}>
                    {isArabic ? <FaArrowLeft/> : <FaArrowRight/>}
                  </ArrowIcon>
                </BorderBeamButton>
              </ButtonOverride>

              {/* 2. My Hanuut Button (Transparent, Black Text) */}
              {/* Added 'secondary-btn' class to force black colors */}
              <ButtonOverride className="secondary-btn">
                <BorderBeamButton 
                  onClick={() => navigate("/partners")} 
                  beamColor="#F07A48" 
                  secondary={true}
                >
                  <FaStore style={{ fontSize: '1.2rem' }} />
                  <span>{t("navPartners") || "My Hanuut"}</span>
                  <ArrowIcon isArabic={isArabic}>
                    {isArabic ? <FaArrowLeft/> : <FaArrowRight/>}
                  </ArrowIcon>
                </BorderBeamButton>
              </ButtonOverride>
            </ButtonsRow>
          </motion.div>
        </TextContent>

        {/* 3D Illustration Side */}
        <ImageContent
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <IsometricWrapper>
            <img
              src={HubIllustration}
              alt="Hanuut Express Digital Ecosystem"
            />
          </IsometricWrapper>
        </ImageContent>
      </Container>
    </Section>
  );
};

export default ConsumerHero;