// src/modules/PodStudio/components/storefront/pages/AurasLabLandingPage.jsx

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaArrowLeft, FaTshirt, FaTag, FaTruck } from "react-icons/fa";
import Seo from "../../../../../components/Seo";

// Background Assets
import Wide1 from "../../../../../assets/wide_1.webp"; 
import Wide2 from "../../../../../assets/wide_2.webp"; 
import Mobile1 from "../../../../../assets/mobile_1.webp"; 
import Mobile2 from "../../../../../assets/mobile_2.webp"; 

// --- DIRECT IMPORTS OF ALL 12 LOCAL POD MOCKUPS ---
import m1 from "../../../../../assets/pod_products/mockup_1.webp";
import m2 from "../../../../../assets/pod_products/mockup_2.webp";
import m3 from "../../../../../assets/pod_products/mockup_3.webp";
import m4 from "../../../../../assets/pod_products/mockup_4.webp";
import m5 from "../../../../../assets/pod_products/mockup_5.webp";
import m6 from "../../../../../assets/pod_products/mockup_6.webp";
import m7 from "../../../../../assets/pod_products/mockup_7.webp";
import m8 from "../../../../../assets/pod_products/mockup_8.png";
import m9 from "../../../../../assets/pod_products/mockup_9.webp";
import m10 from "../../../../../assets/pod_products/mockup_10.webp";
import m11 from "../../../../../assets/pod_products/mockup_11.webp";
import m12 from "../../../../../assets/pod_products/mockup_12.webp";

const LOCAL_MOCKUPS = [
  { src: m1, title: "EVERYDAY TEE", label: "everyday_tee", colorHex: "#60A5FA" },
  { src: m2, title: "HEAVY HOODIE", label: "hoodie_heavy", colorHex: "#39A170" },
  { src: m3, title: "OVERSIZED TEE", label: "oversized_260", colorHex: "#F07A48" },
  { src: m4, title: "ACID WASH CREW", label: "acid_wash", colorHex: "#EC4899" },
  { src: m5, title: "STREET SWEAT", label: "crewneck_classic", colorHex: "#397FF9" },
  { src: m6, title: "ZIP HOODIE", label: "zip_hoodie", colorHex: "#F59E0B" },
  { src: m7, title: "CANVAS 170", label: "canvas_170", colorHex: "#1D9E75" },
  { src: m8, title: "CARGO PANTS", label: "cargo_pants", colorHex: "#8B5CF6" },
  { src: m9, title: "VINTAGE HOODIE", label: "vintage_hoodie", colorHex: "#EF4444" },
  { src: m10, title: "STUDIO TOTE", label: "studio_tote", colorHex: "#38BDF8" },
  { src: m11, title: "MINIMAL TEE", label: "minimal_tee", colorHex: "#A1A1AA" },
  { src: m12, title: "DROP SHOULDER", label: "drop_shoulder", colorHex: "#F07A48" },
];

// ============================================================================
// STYLED COMPONENTS - REFINED HIERARCHY & FLUID GLASS CHAMBER
// ============================================================================

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: #050505;
  position: relative;
  overflow: hidden;
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
  opacity: 0.6;
`;

const DynamicGradientOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: ${(props) => props.$gradient};
  transition: background 1.2s ease-in-out;
`;

const SubtleGridCanvas = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px
    );
    background-size: 32px 32px;
    background-position: center center;
    mask-image: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      black 20%,
      transparent 60%
    );
    -webkit-mask-image: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      black 20%,
      transparent 60%
    );
    transition: opacity 0.5s ease;
  }
`;

const UIContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  padding: 0 4.5rem;
  box-sizing: border-box;
  pointer-events: none;

  @media (max-width: 1024px) {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 1.25rem;
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
  }
`;

const LeftCol = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  pointer-events: auto;
  justify-content: center;
  z-index: 8;
  max-width: 580px;
  
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  align-items: ${(props) => (props.$isArabic ? "flex-end" : "flex-start")};

  @media (max-width: 1024px) {
    position: relative;
    width: 100%;
    max-width: 100%;
    align-items: center;
    text-align: center;
    background: rgba(10, 10, 12, 0.65);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 2rem 1.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
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
  font-size: clamp(2.2rem, 4.5vw, 4.2rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1.15;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -1px;
`;

const Subtext = styled.p`
  font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  color: #d4d4d8;
  line-height: 1.6;
  margin: 0;
  font-family: "Cairo", sans-serif;
  max-width: 90%;

  @media (max-width: 640px) { max-width: 100%; }
`;

const PrimaryCta = styled(Link)`
  margin-top: 0.5rem;
  background: #F07A48;
  color: #050505;
  padding: 1.05rem 2.5rem;
  border-radius: 50px;
  font-size: 1.05rem;
  font-weight: 800;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 10px 25px rgba(240, 122, 72, 0.35);
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

// ============================================================================
// REFINED 3D HOLOGRAM CHAMBER (SECONDARY / 3RD GRADE UI ELEMENT)
// ============================================================================

const RightCol3D = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  pointer-events: auto;
  z-index: 5;

  @media (max-width: 1024px) {
    display: none; /* Hide on mobile so it never distracts or overfills */
  }
`;

const HoloDisplayChamber = styled.div`
  position: relative;
  width: 270px;
  height: 330px;
  background: rgba(12, 12, 14, 0.45);
  backdrop-filter: blur(28px) saturate(140%);
  -webkit-backdrop-filter: blur(28px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.02);

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 1px dashed rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }
`;

const CrosshairTarget = styled(motion.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.04;
  
  background-image:
    linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center center;
`;

const ShowcaseCard = styled(motion.div)`
  position: absolute;
  width: 215px;
  height: 265px;
  background: rgba(18, 18, 22, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  cursor: pointer;
  z-index: 5;
`;

const GarmentVisual = styled.div`
  width: 80%;
  height: 65%;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.8));
  user-select: none;
  position: relative;
  top: -8px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const TagInfo = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  text-align: right;
`;

const CoreTag = styled.div`
  background: ${(props) => props.$accent || "#F07A48"};
  color: #050505;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.5px;
`;

const ProductTitle = styled.div`
  color: #ffffff;
  font-weight: 900;
  font-family: "Tajawal", sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
`;

const CoordinateOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  pointer-events: none;
  text-align: left;
`;

const CoordText = styled.span`
  color: #a1a1aa;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 700;
`;

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
  z-index: 8;
  pointer-events: none;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 640px) {
    display: none;
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
  padding: 8px 16px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e4e4e7;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: "Cairo", sans-serif;
  svg { color: #F07A48; }
`;

// ============================================================================
// COMPONENT LOGIC & STATE
// ============================================================================

const AurasLabLandingPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [slideIndex, setSlideIndex] = useState(0);
  const [active3DIdx, setActive3DIdx] = useState(0);

  const handleMouseMove = (e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    // Background model photo switcher (every 8s)
    const bgTimer = setInterval(() => {
      setSlideIndex((prev) => (prev === 0 ? 1 : 0));
    }, 8000);

    // Calm 6.5s cycle for 3D card display
    const cardTimer = setInterval(() => {
      setActive3DIdx((prev) => (prev + 1) % LOCAL_MOCKUPS.length);
    }, 6500);

    return () => {
      clearInterval(bgTimer);
      clearInterval(cardTimer);
    };
  }, []);

  const SLIDES = [
    {
      id: 0,
      asset: Wide2, 
      mobileAsset: Mobile2,
      tagline: t("aurasLab.hero.slide2.tagline", "ZERO BRAND TAX"),
      headline: t("aurasLab.hero.slide2.headline", "Own the Blank.<br/>Create the Fit."),
      subtext: t("aurasLab.hero.slide2.subtext", "Quality fabrics without paying inflated prices for someone else's logo. Your style, your terms."),
      gradient: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)",
    },
    {
      id: 1,
      asset: Wide1, 
      mobileAsset: Mobile1,
      tagline: t("aurasLab.hero.slide1.tagline", "100% HEAVYWEIGHT COTTON"),
      headline: t("aurasLab.hero.slide1.headline", "Wear Your Identity.<br/>Not a Logo."),
      subtext: t("aurasLab.hero.slide1.subtext", "Premium street blanks engineered for total freedom. Wear them clean or print your own creations."),
      gradient: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)",
    }
  ];

  const activeSlide = SLIDES[slideIndex];
  const activeGarment = LOCAL_MOCKUPS[active3DIdx];
  const nextGarment = LOCAL_MOCKUPS[(active3DIdx + 1) % LOCAL_MOCKUPS.length];

  return (
    <PageWrapper
      $isArabic={isArabic}
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <Seo
        title={isArabic ? "أوراس لاب | استوديو الطباعة حسب الطلب" : "AURAS LAB | Custom Streetwear Studio"}
        description="Design custom streetwear on organic cotton blanks. Shipped across Algeria."
        url="https://hanuut.com/aurasLab"
      />

      {/* 1. Cinematic Background Photo */}
      <BackgroundLayer>
        <AnimatePresence mode="sync">
          <HeroImage
            key={activeSlide.id}
            src={window.innerWidth > 640 ? activeSlide.asset : activeSlide.mobileAsset}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </BackgroundLayer>

      {/* 2. Soft Background Matrix Grid */}
      <SubtleGridCanvas />

      {/* 3. Smooth Vignette Gradient */}
      <DynamicGradientOverlay $gradient={activeSlide.gradient} />

      <UIContainer>
        {/* 4. Left Column: Primary Copywriting & Action */}
        <LeftCol
          $isArabic={isArabic}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Tagline>{activeSlide.tagline}</Tagline>
          <Headline dangerouslySetInnerHTML={{ __html: activeSlide.headline }} />
          <Subtext>{activeSlide.subtext}</Subtext>
          
          <PrimaryCta to="/aurasLab/studio">
            <span>{t("aurasLab.common.enterStudio", "Enter Studio")}</span>
            {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
          </PrimaryCta>

          <MobileFeaturesRow>
            <FeaturePill><FaTshirt /> {t("aurasLab.features.quality")}</FeaturePill>
            <FeaturePill><FaTag /> {t("aurasLab.features.pricing")}</FeaturePill>
            <FeaturePill><FaTruck /> {t("aurasLab.features.shipping")}</FeaturePill>
          </MobileFeaturesRow>
        </LeftCol>

        {/* 5. Right Column: Calm, Non-Distracting Hologram Chamber (3rd Tier Element) */}
        <RightCol3D>
          <HoloDisplayChamber>
            <CrosshairTarget />

            <AnimatePresence mode="wait">
              {/* Only the active front card surfaces and submerges smoothly */}
              <ShowcaseCard
                key={activeGarment.label}
                $isFront={true}
                initial={{ opacity: 0, y: 30, scale: 0.92, filter: "blur(8px)" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  y: -25,
                  scale: 0.92,
                  filter: "blur(8px)",
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.8, 0.25, 1],
                }}
                onClick={() => navigate("/aurasLab/studio")}
              >
                <TagInfo>
                  <CoreTag $accent={activeGarment.colorHex}>{activeGarment.label}</CoreTag>
                  <ProductTitle>{activeGarment.title}</ProductTitle>
                </TagInfo>

                <GarmentVisual>
                  <img src={activeGarment.src} alt={activeGarment.title} />
                </GarmentVisual>

                <CoordinateOverlay>
                  <CoordText>SPEC: 100% COTTON</CoordText>
                  <CoordText>LAB: READY</CoordText>
                </CoordinateOverlay>
              </ShowcaseCard>
            </AnimatePresence>
          </HoloDisplayChamber>
        </RightCol3D>
      </UIContainer>

      {/* 6. Desktop Quality Badges */}
      <DesktopFeaturesRow $isArabic={isArabic}>
        <FeaturePill><FaTshirt /> {t("aurasLab.features.quality", "Coton Lourd Premium")}</FeaturePill>
        <FeaturePill><FaTag /> {t("aurasLab.features.pricing", "Prix Direct Atelier")}</FeaturePill>
        <FeaturePill><FaTruck /> {t("aurasLab.features.shipping", "Livraison 69 Wilayas")}</FeaturePill>
      </DesktopFeaturesRow>
    </PageWrapper>
  );
};

export default AurasLabLandingPage;