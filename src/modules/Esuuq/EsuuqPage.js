import React, { useRef } from "react";
import styled, { ThemeProvider, keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaApple, FaArrowLeft, FaArrowRight, FaGooglePlay, FaQuoteRight } from "react-icons/fa";

// --- Components ---
import BorderBeamButton from "../../components/BorderBeamButton";

// --- ASSETS (Update paths to your WebP files) ---
import TechStoreImg from "../../assets/3d_shops/tech_store.webp";
import FashionImg from "../../assets/3d_shops/fashion_store.webp";
import ArtStoreImg from "../../assets/3d_shops/art_store.webp";

// --- THEME ---
const esuuqTheme = {
  primaryColor: "#39A170", // Emerald
  body: "#FDF4E3", // Soft Ivory
  text: "#111217", // Navy
  navHeight: "5rem",
};

// --- ANIMATIONS ---
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  background-color: ${props => props.theme.body};
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  color: ${props => props.theme.text};
  position: relative;
`;

/* 
   NOISE TEXTURE:
   Adds a high-quality grain to the background to fix the contrast issue 
   and make the 3D assets pop.
*/
const NoiseTexture = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
`;

const Container = styled.div`
  max-width: 1400px; /* Wider container for the grid */
  width: 92%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  direction: ${props => props.$isArabic ? "rtl" : "ltr"};
`;

// --- HERO SECTION ---
const HeroSection = styled.section`
  min-height: 80vh; 
  padding-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  margin-bottom: 4rem;
`;

const Badge = styled(motion.span)`
  background-color: #111217;
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-family: 'Tajawal', sans-serif;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  letter-spacing: 0.5px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  color: #111217;
  line-height: 1.1;
  font-family: 'Tajawal', sans-serif;
  margin-bottom: 1.5rem;
  max-width: 900px;

  span {
    color: #39A170;
    display: inline-block;
    position: relative;
    /* Sketchy underline */
    &::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 100%;
      height: 0.2em;
      background-color: rgba(57, 161, 112, 0.15);
      z-index: -1;
      border-radius: 4px;
    }
  }
`;

const HeroSub = styled(motion.p)`
  font-size: 1.3rem;
  color: #52525b;
  max-width: 600px;
  line-height: 1.7;
  font-family: 'Cairo', sans-serif;
  font-weight: 500;
  margin-bottom: 2.5rem;
`;

// --- BUTTON FIX ---
const ButtonRow = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ButtonOverride = styled.div`
  button {
    min-width: 220px !important; 
    padding: 0 2rem !important;
    height: 56px !important;
  }
  
  /* FORCE BLACK STYLE FOR SECONDARY */
  &.secondary-btn button {
    border: 2px solid #111217 !important; 
    background: transparent !important;
    backdrop-filter: none !important;
    
    /* Inner text/icon color */
    div, span, p, svg {
      color: #111217 !important;
      fill: #111217 !important;
    }
    
    &:hover {
      background: rgba(17, 18, 23, 0.05) !important;
      transform: translateY(-2px);
    }
  }
`;

// --- THE MOVING GRID (BENTO PARALLAX) ---
const GridSection = styled.section`
  padding: 2rem 0 8rem 0;
  position: relative;
  overflow: hidden;
`;

const MasonryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column on mobile */
  }
`;

const Column = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// --- CARDS ---

// 1. Text Card (Integrated into grid)
const TextCard = styled(motion.div)`
  background: #FFFFFF;
  padding: 2.5rem;
  border-radius: 32px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 300px;
  border: 1px solid rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;

  /* Decorative accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => props.$accent || "#39A170"};
  }
`;

const CardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.$accent || "#39A170"};
  background: ${props => props.$bg || "rgba(57, 161, 112, 0.1)"};
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 800;
  font-family: 'Tajawal', sans-serif;
  margin-bottom: 1rem;
  color: #111217;
  line-height: 1.2;
`;

const CardDesc = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #52525b;
  font-family: 'Cairo', sans-serif;
`;

// 2. Image Card (The 3D Illustrations)
const ImageCard = styled(motion.div)`
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 30px 60px -15px rgba(0,0,0,0.15);
  background: transparent;
  
  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.03);
  }
`;

// --- ESUUQ PAGE COMPONENT ---

const EsuuqPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  // --- PARALLAX LOGIC ---
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Different speeds for columns to create the "Moving Grid" feel
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]); // Slow Up
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]); // Down
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -200]); // Fast Up

  const handleDownload = () => {
    window.open(process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK, "_blank");
  };

  return (
    <ThemeProvider theme={esuuqTheme}>
      <PageWrapper>
        <Helmet>
          <title>{t("nav_esuuq")} | {t("companyName")}</title>
        </Helmet>
        
        <NoiseTexture />

        <Container $isArabic={isArabic}>

          {/* --- MOVING GRID SECTION --- */}
          <GridSection ref={containerRef}>
            <MasonryGrid>
              
              {/* COLUMN 1: TECH + TRUST */}
              <Column style={{ y: y1 }}>
                <ImageCard
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <img src={TechStoreImg} alt="Tech Store" />
                </ImageCard>

                <TextCard 
                  $accent="#39A170"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardIcon $bg="rgba(57, 161, 112, 0.1)">
                    <FaQuoteRight />
                  </CardIcon>
                  <CardTitle>{t("pain_trust_title")}</CardTitle>
                  <CardDesc>{t("pain_trust_text")}</CardDesc>
                </TextCard>
              </Column>

              {/* COLUMN 2: C2C + HOME */}
              <Column style={{ y: y2 }}>
                <TextCard 
                  $accent="#F07A48"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                >
                  <CardIcon $accent="#F07A48" $bg="rgba(240, 122, 72, 0.1)">
                    <FaArrowRight style={{ transform: isArabic ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </CardIcon>
                  <CardTitle>{t("pain_clutter_title")}</CardTitle>
                  <CardDesc>{t("pain_clutter_text")}</CardDesc>
                </TextCard>

                <ImageCard
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <img src={ArtStoreImg} alt="Home Decor" />
                </ImageCard>
                
                {/* Extra spacer or decorative block could go here */}
              </Column>

              {/* COLUMN 3: FASHION + DELIVERY */}
              <Column style={{ y: y3 }}>
                <ImageCard
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <img src={FashionImg} alt="Fashion Store" />
                </ImageCard>

                <TextCard 
                  $accent="#397FF9"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardIcon $accent="#397FF9" $bg="rgba(57, 127, 249, 0.1)">
                    <FaArrowLeft style={{ transform: isArabic ? "rotate(180deg)" : "rotate(0deg)" }}/>
                  </CardIcon>
                  <CardTitle>{t("pain_delivery_title")}</CardTitle>
                  <CardDesc>{t("pain_delivery_text")}</CardDesc>
                </TextCard>
              </Column>

            </MasonryGrid>
          </GridSection>

          {/* --- HERO --- */}
          <HeroSection>
            <Badge 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }}
            >
              ✨ {t("nav_esuuq")}
            </Badge>
            
            <HeroTitle
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
            >
              {t("esuuq_hero_title")}
            </HeroTitle>
            
            <HeroSub
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.4 }}
            >
              {t("esuuq_hero_sub")}
            </HeroSub>

            <ButtonRow
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.5 }}
            >
              {/* Play Store */}
              <ButtonOverride>
                <BorderBeamButton onClick={handleDownload} beamColor="#39A170">
                  <FaGooglePlay size={20} style={{ margin: isArabic ? "0 0 0 10px" : "0 10px 0 0" }}/>
                  <span>Google Play</span>
                </BorderBeamButton>
              </ButtonOverride>

              {/* App Store (Fixed Contrast) */}
              <ButtonOverride className="secondary-btn">
                <BorderBeamButton onClick={handleDownload} beamColor="#111217" secondary>
                  <FaApple size={24} style={{ margin: isArabic ? "0 0 0 10px" : "0 10px 0 0" }}/>
                  <span>App Store</span>
                </BorderBeamButton>
              </ButtonOverride>
            </ButtonRow>
          </HeroSection>

        </Container>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default EsuuqPage;