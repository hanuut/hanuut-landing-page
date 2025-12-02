import React from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import BorderBeamButton from "../../../components/BorderBeamButton";
import Playstore from "../../../assets/playstore.webp";
import HanuutIllustration from "../../../assets/illustrations/home_animation_en.gif";
import HanuutIllustrationAr from "../../../assets/illustrations/home_animation_ar.gif";

// --- 1. Animations ---
const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const blobMove = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

// --- 2. Styled Components ---

const Section = styled.section`
  width: 100%;
  /* Full height minus nav */
  min-height: calc(100vh - 5rem); 
  background-color: #FDF4E3; /* Soft Ivory */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Blob = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: ${(props) => props.color};
  filter: blur(100px);
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
  max-width: 1200px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    flex-direction: column-reverse;
    text-align: center;
    padding-top: 2rem;
    padding-bottom: 4rem;
  }
`;

const TextContent = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isArabic ? "flex-start" : "flex-start")};
  gap: 1.5rem;
  z-index: 10;

  @media (max-width: 900px) {
    align-items: center;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.2;
  color: #111217;
  font-family: 'Tajawal', sans-serif;
  margin: 0;

  span {
    background: linear-gradient(135deg, #39A170 0%, #F07A48 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #52525b;
  line-height: 1.7;
  max-width: 550px;
  font-family: 'Cairo Variable', sans-serif;
`;

const ImageContent = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 600px;
  
  @media (max-width: 900px) {
    height: auto;
    width: 100%;
  }
`;

const PhoneWrapper = styled.div`
  position: relative;
  width: 300px; 
  border-radius: 45px;
  border: 12px solid rgba(255,255,255,0.4);
  box-shadow: 
    0 30px 60px rgba(57, 161, 112, 0.25), 
    inset 0 0 0 2px rgba(255,255,255,0.5);
  overflow: hidden;
  animation: ${float} 6s ease-in-out infinite;
  background: white;

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  @media (max-width: 500px) {
    width: 260px;
  }
`;

const FloatingBadge = styled(motion.div)`
  position: absolute;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #111217;
  font-size: 0.9rem;
  z-index: 3;
  border: 1px solid rgba(255,255,255,0.6);
  font-family: 'Tajawal', sans-serif;

  top: ${(props) => props.top};
  bottom: ${(props) => props.bottom};
  left: ${(props) => props.left};
  right: ${(props) => props.right};

  span {
    width: 12px;
    height: 12px;
    background: ${(props) => props.color || "#39A170"};
    border-radius: 50%;
    box-shadow: 0 0 10px ${(props) => props.color || "#39A170"};
  }
  
  @media (max-width: 900px) {
    display: none; 
  }
`;

const Icon = styled.img`
  height: 1.5rem;
  margin-right: 10px;
  filter: invert(1); 
`;

const ConsumerHero = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

 const handleDownload = () => {
    const link = process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK;
    if (link) window.open(link, "_blank");
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <Section>
      <Blob color="rgba(57, 161, 112, 0.25)" top="-10%" left="-10%" />
      <Blob color="rgba(240, 122, 72, 0.2)" bottom="10%" right="-5%" />

      <Container $isArabic={isArabic}>
        
        <TextContent
          $isArabic={isArabic}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.div variants={itemVars}>
            <span style={{ 
              background: 'rgba(57, 161, 112, 0.1)', 
              color: '#39A170', 
              padding: '8px 16px', 
              borderRadius: '30px', 
              fontWeight: '700',
              fontSize: '0.85rem',
              letterSpacing: '0.5px',
              border: '1px solid rgba(57, 161, 112, 0.2)'
            }}>
              ✨ {t("appTitle")} Customer App
            </span>
          </motion.div>

          <Title as={motion.h1} variants={itemVars}>
            {t("homeHeading")} <br />
            <span>{t("homeSubHeading")}</span>
          </Title>

          <Subtitle as={motion.p} variants={itemVars}>
            {t("homeParagraph")}
          </Subtitle>

          <motion.div variants={itemVars}>
            <BorderBeamButton 
                onClick={handleDownload}
                beamColor="#39A170"
            >
               <Icon src={Playstore} alt="Play Store" />
               <span>{t("googlePlay")}</span>
            </BorderBeamButton>
            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#888', fontFamily: 'Cairo Variable' }}>
              {t("homeSmallerParagraph")}
            </p>
          </motion.div>
        </TextContent>

        <ImageContent
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge 1: Live Shopping (Green) */}
          <FloatingBadge 
            top="15%" 
            left={isArabic ? "-40px" : "auto"} 
            right={isArabic ? "auto" : "20px"}
            color="#39A170" 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span></span> {t("live_shopping_title") || "Live Shopping"}
          </FloatingBadge>
          
          {/* Badge 2: C2C Marketplace (Blue) */}
          <FloatingBadge 
            bottom="20%" 
            right={isArabic ? "-30px" : "auto"}
            left={isArabic ? "auto" : "-20px"}
            color="#397FF9" /* Blue for Market */
            animate={{ y: [0, 15, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span></span> {t("home_market_title") || "Community Market"}
          </FloatingBadge>

          <PhoneWrapper>
            <img 
              src={isArabic ? HanuutIllustrationAr : HanuutIllustration} 
              alt="Hanuut App" 
            />
          </PhoneWrapper>
        </ImageContent>

      </Container>
    </Section>
  );
};

export default ConsumerHero;