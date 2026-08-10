// src/modules/PodStudio/components/storefront/pages/AurasLabLandingPage.jsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaArrowLeft, FaTshirt, FaTag, FaTruck } from "react-icons/fa";
import Seo from "../../../../../components/Seo";

// Asset Placeholders (Adjust paths to your actual directory structure)
import Wide1 from "../../../../../assets/wide_1.webp"; // Model in corridor
import Wide2 from "../../../../../assets/wide_2.webp"; // Hooded model sitting
import TabletImg from "../../../../../assets/tablet.webp"; // Symmetrical back view
import Mobile1 from "../../../../../assets/mobile_1.webp"; // Quarter-zip
import Mobile2 from "../../../../../assets/mobile_2.webp"; // Blue tee

// ============================================================================
// STYLED COMPONENTS & DYNAMIC LAYOUT ENGINE
// ============================================================================

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  height: 100dvh; /* Mobile viewport fix */
  background-color: #050505;
  position: relative;
  overflow: hidden;
  /* STRICT LTR BASE: Prevents the entire layout grid from flipping in Arabic.
     We will handle RTL text alignment at the component level. */
  direction: ltr; 
`;

const BackgroundLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #050505;
`;

const HeroImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  inset: 0;
`;

const DynamicGradientOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: ${(props) => props.$gradient};
  transition: background 0.8s ease-in-out;
`;

const UIContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  box-sizing: border-box;
  pointer-events: none; /* Let clicks pass through to background if needed */

  /* --- DESKTOP LAYOUT SHIFTS (>1024px) --- */
  @media (min-width: 1025px) {
    display: block; /* Switch to block for strict absolute positioning */
  }

  /* --- TABLET LAYOUT SHIFTS (641px - 1024px) --- */
  @media (min-width: 641px) and (max-width: 1024px) {
    align-items: flex-end;
    justify-content: center;
    padding: 3rem 2rem;
    padding-bottom: 8rem; /* Leave room for desktop badges */
  }

  /* --- MOBILE LAYOUT SHIFTS (<640px) --- */
  @media (max-width: 640px) {
    align-items: flex-end;
    justify-content: center;
    padding: 1.25rem;
    /* Safe Area Inset guarantees button isn't clipped by iOS home bar */
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }
`;

const ContentBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  pointer-events: auto;
  
  /* Apply RTL dynamically ONLY to the text content block */
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  align-items: ${(props) => (props.$isArabic ? "flex-end" : "flex-start")};

  /* --- DESKTOP STRICT POSITIONING --- */
  @media (min-width: 1025px) {
    position: absolute;
    top: ${(props) => props.$top};
    left: ${(props) => props.$left};
    max-width: ${(props) => props.$maxWidth};
  }

  /* --- TABLET POSITIONING --- */
  @media (min-width: 641px) and (max-width: 1024px) {
    position: relative;
    max-width: 600px;
    align-items: center;
    text-align: center;
  }

  /* --- MOBILE BLUR CARD OVERLAY (<640px) --- */
  @media (max-width: 640px) {
    position: relative;
    width: 100%;
    max-width: 100%;
    align-items: center;
    text-align: center;
    background: rgba(10, 10, 12, 0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 2rem 1.5rem;
    box-sizing: border-box;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }
`;

const Tagline = styled.span`
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 700;
  color: #F07A48;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const Headline = styled.h1`
  font-size: clamp(2.2rem, 5vw, 4.5rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -1px;
`;

const Subtext = styled.p`
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: #d4d4d8;
  line-height: 1.6;
  margin: 0;
  font-family: "Cairo", sans-serif;
  max-width: 90%;

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

const PrimaryCta = styled(Link)`
  margin-top: 0.5rem;
  background: #F07A48;
  color: #050505;
  padding: 1.1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 800;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(240, 122, 72, 0.3);
  transition: transform 0.2s, filter 0.2s;
  font-family: "Tajawal", sans-serif;
  text-transform: uppercase;

  &:hover {
    transform: translateY(-3px);
    filter: brightness(1.15);
  }

  @media (max-width: 640px) {
    width: 100%;
    box-sizing: border-box;
    padding: 1.25rem;
  }
`;

// --- BADGE SYSTEM: SEPARATED BY VIEWPORT TO PREVENT CLIPPING ---

const DesktopFeaturesRow = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 0 2rem;
  box-sizing: border-box;
  z-index: 3;
  pointer-events: none;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 640px) {
    display: none; /* Hide absolute badges on mobile */
  }
`;

const MobileFeaturesRow = styled.div`
  display: none;
  @media (max-width: 640px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.25rem;
    width: 100%;
  }
`;

const FeaturePill = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e4e4e7;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: "Cairo", sans-serif;
  white-space: nowrap;

  svg {
    color: #F07A48;
  }
`;

// ============================================================================
// COMPONENT LOGIC & STATE
// ============================================================================

const AurasLabLandingPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const [slideIndex, setSlideIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 641;
  const isTablet = windowWidth >= 641 && windowWidth <= 1024;
  const isDesktop = windowWidth > 1024;

  useEffect(() => {
    if (isTablet) return; // Tablet locks to the single static asset
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, [isTablet]);

  // --- DYNAMIC SLIDE METADATA ---
  const SLIDES = [
    {
      id: 0,
      desktopAsset: Wide2, // Hooded model sitting on concrete cube
      mobileAsset: Mobile2, // Blue tee torso
      tagline: t("aurasLab.hero.slide2.tagline", "ZERO BRAND TAX"),
      headline: t("aurasLab.hero.slide2.headline", "Own the Blank.<br/>Create the Fit."),
      subtext: t("aurasLab.hero.slide2.subtext", "Quality fabrics without paying inflated prices for someone else's logo. Your style, your terms."),
      // Strict Desktop Alignment mapping to the image void
      desktopTop: "15%",
      desktopLeft: "8%",
      maxWidth: "500px",
      gradient: isDesktop 
        ? "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 45%, transparent 100%)"
        : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
    },
    {
      id: 1,
      desktopAsset: Wide1, // Model in brutalist corridor
      mobileAsset: Mobile1, // High-neck quarter-zip
      tagline: t("aurasLab.hero.slide1.tagline", "100% HEAVYWEIGHT COTTON"),
      headline: t("aurasLab.hero.slide1.headline", "Wear Your Identity.<br/>Not a Logo."),
      subtext: t("aurasLab.hero.slide1.subtext", "Premium street blanks engineered for total freedom. Wear them clean or print your own creations."),
      // Strict Desktop Alignment mapping to the shadow wall
      desktopTop: "25%",
      desktopLeft: "8%",
      maxWidth: "550px",
      gradient: isDesktop
        ? "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)"
        : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
    }
  ];

  const activeSlide = isTablet ? SLIDES[0] : SLIDES[slideIndex];
  const activeImage = isTablet ? TabletImg : isMobile ? activeSlide.mobileAsset : activeSlide.desktopAsset;

  const renderFeatures = () => (
    <>
      <FeaturePill><FaTshirt /> {t("aurasLab.features.quality", "Heavy Cotton Blanks")}</FeaturePill>
      <FeaturePill><FaTag /> {t("aurasLab.features.pricing", "Fair Direct Value")}</FeaturePill>
      <FeaturePill><FaTruck /> {t("aurasLab.features.shipping", "58 Wilayas Delivery")}</FeaturePill>
    </>
  );

  return (
    <PageWrapper $isArabic={isArabic}>
      <Seo
        title={isArabic ? "أوراس لاب | استوديو الطباعة حسب الطلب" : "AURAS LAB | Custom Streetwear Studio"}
        description={isArabic ? "صمم ملابسك الخاصة على خامات قطنية عالية الجودة مع الشحن لكافة الولايات." : "Design custom streetwear on organic cotton blanks. Shipped across Algeria."}
        url="https://hanuut.com/aurasLab"
      />

      <BackgroundLayer>
        <AnimatePresence mode="sync">
          <HeroImage
            key={activeImage}
            src={activeImage}
            alt="Auras Lab Collection"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            fetchpriority={slideIndex === 0 ? "high" : "auto"}
            loading={slideIndex === 0 ? "eager" : "lazy"}
          />
        </AnimatePresence>
      </BackgroundLayer>

      <DynamicGradientOverlay $gradient={activeSlide.gradient} />

      <UIContainer>
        <AnimatePresence mode="wait">
          <ContentBlock
            key={activeSlide.id}
            $isArabic={isArabic}
            $top={activeSlide.desktopTop}
            $left={activeSlide.desktopLeft}
            $maxWidth={activeSlide.maxWidth}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Tagline>{activeSlide.tagline}</Tagline>
            
            <Headline dangerouslySetInnerHTML={{ __html: activeSlide.headline }} />
            
            <Subtext>{activeSlide.subtext}</Subtext>
            
            <PrimaryCta to="/aurasLab/studio">
              <span>{t("aurasLab.common.enterStudio", "Enter Studio")}</span>
              {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </PrimaryCta>

            {/* Injected directly inside the block for Mobile ONLY */}
            <MobileFeaturesRow>
              {renderFeatures()}
            </MobileFeaturesRow>

          </ContentBlock>
        </AnimatePresence>
      </UIContainer>

      {/* Renders fixed at the bottom for Desktop & Tablet ONLY */}
      <DesktopFeaturesRow
        $isArabic={isArabic}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {renderFeatures()}
      </DesktopFeaturesRow>

    </PageWrapper>
  );
};

export default AurasLabLandingPage;