// src/modules/Tawsila/TawsilaLanding.js
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaRoute,
  FaWallet,
  FaClock,
  FaHeadset,
  FaCheckCircle,
  FaGooglePlay,
} from "react-icons/fa";

import TawsilaLayout from "./components/TawsilaLayout";
import Seo from "../../components/Seo";
import abridLogoGraphic from "../../assets/abridh_logo.webp";

// --- 1. LIGHT GALAXY CANVAS ---
const CanvasWrapper = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
`;

const LightMobilityCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const isMobile = window.innerWidth < 768;

    let w, h;
    let particles = [];
    let animationFrame;

    const COLORS = ["#00875F", "#10B981", "#2563EB", "#38BDF8"];

    class ParticleNode {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * (isMobile ? 2.5 : 3.5) + 1.5;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      draw() {
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -10) this.x = w + 10;
        if (this.x > w + 10) this.x = -10;
        if (this.y < -10) this.y = h + 10;
        if (this.y > h + 10) this.y = -10;
      }
    }

    const init = () => {
      particles = [];
      const count = isMobile ? 22 : 45;
      for (let i = 0; i < count; i++) {
        particles.push(new ParticleNode());
      }
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      init();
    };

    const drawConnections = () => {
      const maxDistSq = isMobile ? 12000 : 20000;
      ctx.lineWidth = 1;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const opacity = (1 - distSq / maxDistSq) * 0.22;
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = "#00875F";
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      drawConnections();
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <CanvasWrapper ref={canvasRef} />;
};

// --- HERO STYLES ---
const HeroSection = styled.section`
  position: relative;
  min-height: 85vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f8fafc;
  padding-top: calc(${(props) => props.theme.navHeight || "80px"} + 1rem);
  padding-bottom: 4rem;
`;

const BackgroundLogoContainer = styled.div`
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(520px, 85vw);
  height: auto;
  z-index: 1;
  pointer-events: none;
  opacity: 0.85;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 20px 40px rgba(0, 135, 95, 0.15));
  }
`;

const LiquidGlassLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(248, 250, 252, 0.6);

  mask-image: radial-gradient(
    circle 260px at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.8) 60%,
    rgba(0, 0, 1) 100%
  );
  -webkit-mask-image: radial-gradient(
    circle 260px at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.8) 60%,
    rgba(0, 0, 1) 100%
  );

  @media (hover: none) {
    mask-image: none;
    -webkit-mask-image: none;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 4;
  text-align: center;
  max-width: 840px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const LaunchBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 9999px;
  color: #00875f;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.3px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 900;
  color: #0f172a;
  line-height: 1.2;
  margin: 0;
  font-family: var(--font-primary, "Tajawal"), sans-serif;
  letter-spacing: -0.5px;

  span {
    color: #00875f;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: #475569;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 680px;
  font-weight: 500;
`;

const CtaRow = styled(motion.div)`
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const CaptainPillBtn = styled.button`
  background-color: #2563eb;
  color: #ffffff;
  padding: 1rem 2.25rem;
  border-radius: 9999px;
  font-size: 1.05rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
  }
`;

const DownloadStoreBtn = styled.button`
  background-color: #ffffff;
  color: #00875f;
  padding: 1rem 2.25rem;
  border-radius: 9999px;
  font-size: 1.05rem;
  font-weight: 800;
  border: 1.5px solid #a7f3d0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 135, 95, 0.08);
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    border-color: #00875f;
    background-color: #ecfdf5;
    transform: translateY(-2px);
  }
`;

const SectionContainer = styled.section`
  width: 90%;
  max-width: 1150px;
  margin: 0 auto;
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const SectionTitleBlock = styled.div`
  text-align: center;
  max-width: 700px;
  margin: 0 auto;

  h2 {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 900;
    color: #0f172a;
    margin: 0 0 0.5rem 0;
    font-family: "Tajawal", sans-serif;
  }
  p {
    font-size: 1.05rem;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
  }
`;

// --- DUAL PERSONA MODULE ---
const DualPersonaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const PersonaCard = styled(motion.div)`
  background: #ffffff;
  border: 1.5px solid
    ${({ $isCaptain }) => ($isCaptain ? "#bfdbfe" : "#a7f3d0")};
  border-radius: 28px;
  padding: 2.75rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.04);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${({ $isCaptain }) => ($isCaptain ? "#2563EB" : "#00875F")};
  }

  .persona-badge {
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${({ $isCaptain }) => ($isCaptain ? "#2563eb" : "#00875f")};
    background: ${({ $isCaptain }) => ($isCaptain ? "#eff6ff" : "#ecfdf5")};
    padding: 4px 12px;
    border-radius: 6px;
    width: fit-content;
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  p {
    font-size: 1.05rem;
    color: #475569;
    line-height: 1.6;
    margin: 0;
    flex-grow: 1;
  }

  .action-btn {
    margin-top: 1rem;
    padding: 0.95rem 1.75rem;
    border-radius: 9999px;
    font-weight: 800;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;

    ${({ $isCaptain }) =>
      $isCaptain
        ? `
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.25);
      &:hover { background: #1d4ed8; transform: translateY(-2px); }
    `
        : `
      background: #00875f;
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(0, 135, 95, 0.25);
      &:hover { background: #006847; transform: translateY(-2px); }
    `}
  }
`;

// --- WHAT WE OFFER PILLARS (PDF 1, Slide 4) ---
const OfferGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const OfferCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.35rem;
  }

  h4 {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  p {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.55;
    margin: 0;
  }
`;

// --- 6-STEP VISUAL TRAIL (PDF 1, Slide 3) ---
const StepsTrailWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  width: 100%;

  @media (max-width: 960px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StepTrailCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;

  .step-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ecfdf5;
    color: #00875f;
    font-weight: 900;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 700;
    color: #334155;
    line-height: 1.4;
  }
`;

// --- QUALITY STANDARDS (PDF 1, Slide 8) ---
const QualityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QualityCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .icon-wrap {
    color: #00875f;
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .text {
    h4 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 0.4rem 0;
    }
    p {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.55;
      margin: 0;
    }
  }
`;

// --- YOU ARE NEVER ALONE (PDF 1, Slide 9) ---
const SupportBanner = styled.div`
  background: linear-gradient(135deg, #0b1528 0%, #1e293b 100%);
  color: #ffffff;
  border-radius: 28px;
  padding: 3rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  box-shadow: 0 10px 30px rgba(11, 21, 40, 0.2);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .content-side {
    max-width: 650px;
    h3 {
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0 0 0.75rem 0;
      color: #ffffff;
    }
    p {
      color: #cbd5e1;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
    }
  }

  .action-side {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

const WhiteCTAButton = styled.button`
  background: #ffffff;
  color: #0b1528;
  padding: 0.95rem 2rem;
  border-radius: 9999px;
  font-weight: 800;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #ecfdf5;
    color: #00875f;
    transform: translateY(-2px);
  }
`;

const TawsilaLanding = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroRef.current.style.setProperty("--mouse-x", `${x}%`);
    heroRef.current.style.setProperty("--mouse-y", `${y}%`);
  };

  const getAbridStoreLink = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return isIOS
      ? "https://apps.apple.com/dz/app/abridh/id6760981883"
      : process.env.REACT_APP_TAWSILA_DOWNLOAD_LINK ||
          "https://play.google.com/store/apps";
  };

  return (
    <TawsilaLayout>
      <Seo
        title={t(
          "seo_abrid_title",
          "Abrid | Mobilité Quotidienne en Toute Sérénité"
        )}
        description={t(
          "seo_abrid_desc",
          "Déplacements fiables et opportunités de conduite indépendantes en Algérie."
        )}
        url="https://hanuut.com/abridh"
      />

      {/* --- HERO WITH LIGHT PARTICLES & GLASS WATERMARK --- */}
      <HeroSection ref={heroRef} onMouseMove={handleMouseMove}>
        <LightMobilityCanvas />

        <BackgroundLogoContainer>
          <img src={abridLogoGraphic} alt="Abrid Watermark Logo" />
        </BackgroundLogoContainer>

        <LiquidGlassLayer />

        <HeroContent
          $isArabic={isArabic}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LaunchBadge>
            <span className="dot" />
            <span>Abridh Mobility Network</span>
          </LaunchBadge>

          <HeroTitle>
            {t("abrid_hero_title_prefix", "Votre mobilité au quotidien, ")}
            <span>
              {t("abrid_hero_title_highlight", "en toute confiance.")}
            </span>
          </HeroTitle>

          <HeroSubtitle>
            {t(
              "abrid_hero_sub",
              "Un réseau de mobilité humaine et transparente qui valorise le travail des capitaines et assure le confort des passagers."
            )}
          </HeroSubtitle>

          {/* Semantic CTAs: Distinct Passenger Download vs Captain Onboarding */}
          <CtaRow>
            <CaptainPillBtn onClick={() => navigate("/abridh/drive")}>
              <span>{t("abrid_btn_captain", "Devenir Capitaine Abridh")}</span>
              {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </CaptainPillBtn>

            <DownloadStoreBtn
              onClick={() => window.open(getAbridStoreLink(), "_blank")}
            >
              <FaGooglePlay />
              <span>
                {t(
                  "abrid_btn_passenger",
                  "Télécharger l'application Abrid"
                )}
              </span>
            </DownloadStoreBtn>
          </CtaRow>
        </HeroContent>
      </HeroSection>

      <SectionContainer $isArabic={isArabic}>
        {/* --- DUAL PERSONA MODULE --- */}
        <DualPersonaGrid>
          {/* Passenger Box */}
          <PersonaCard $isCaptain={false} $isArabic={isArabic}>
            <span className="persona-badge">
              {t("persona_passenger_tag", "Pour les Passagers")}
            </span>
            <h3>
              {t(
                "persona_passenger_title",
                "Déplacez-vous l'esprit tranquille"
              )}
            </h3>
            <p>{t("persona_passenger_desc")}</p>
            <button
              className="action-btn"
              onClick={() => window.open(getAbridStoreLink(), "_blank")}
            >
              <FaGooglePlay />
              <span>
                {t("persona_passenger_cta", "Télécharger l'application")}
              </span>
            </button>
          </PersonaCard>

          {/* Captain Box */}
          <PersonaCard $isCaptain={true} $isArabic={isArabic}>
            <span className="persona-badge">
              {t("persona_captain_tag", "Pour les Capitaines")}
            </span>
            <h3>
              {t(
                "persona_captain_title",
                "Une opportunité claire, locale et flexible"
              )}
            </h3>
            <p>{t("persona_captain_desc")}</p>
            <button
              className="action-btn"
              onClick={() => navigate("/abridh/drive")}
            >
              <span>{t("persona_captain_cta", "Rejoindre le réseau")}</span>
              {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
          </PersonaCard>
        </DualPersonaGrid>

        {/* --- WHAT WE OFFER PILLARS (PDF 1, Slide 4) --- */}
        <div>
          <SectionTitleBlock>
            <h2>{t("pillar_1_title", "Ce que nous vous offrons")}</h2>
            <p>
              {t(
                "pillar_1_desc",
                "Un partenariat équitable avec une assistance humaine sur le terrain."
              )}
            </p>
          </SectionTitleBlock>
          <div style={{ height: "1.5rem" }} />
          <OfferGrid>
            <OfferCard $isArabic={isArabic}>
              <div className="icon">
                <FaClock />
              </div>
              <h4>{t("pillar_1_title", "Flexibilité totale")}</h4>
              <p>{t("pillar_1_desc")}</p>
            </OfferCard>

            <OfferCard $isArabic={isArabic}>
              <div className="icon">
                <FaRoute />
              </div>
              <h4>{t("pillar_2_title", "Diversité des missions")}</h4>
              <p>{t("pillar_2_desc")}</p>
            </OfferCard>

            <OfferCard $isArabic={isArabic}>
              <div className="icon">
                <FaWallet />
              </div>
              <h4>{t("pillar_3_title", "Revenus transparents")}</h4>
              <p>{t("pillar_3_desc")}</p>
            </OfferCard>

            <OfferCard $isArabic={isArabic}>
              <div className="icon">
                <FaHeadset />
              </div>
              <h4>{t("pillar_3_title", "Support local")}</h4>
              <p>{t("pillar_3_desc")}</p>
            </OfferCard>
          </OfferGrid>
        </div>

        {/* --- 6-STEP VISUAL TRAIL (PDF 1, Slide 3) --- */}
        <div>
          <SectionTitleBlock>
            <h2>{t("how_it_works_title", "Comment ça fonctionne ?")}</h2>
          </SectionTitleBlock>
          <div style={{ height: "1.5rem" }} />
          <StepsTrailWrapper>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <StepTrailCard key={num}>
                <div className="step-num">{num}</div>
                <p>{t(`how_step_${num}`)}</p>
              </StepTrailCard>
            ))}
          </StepsTrailWrapper>
        </div>

        {/* --- QUALITY STANDARDS (PDF 1, Slide 8) --- */}
        <div>
          <SectionTitleBlock>
            <h2>{t("quality_standards_title", "Nos exigences de qualité")}</h2>
          </SectionTitleBlock>
          <div style={{ height: "1.5rem" }} />
          <QualityGrid>
            {[1, 2, 3, 4].map((num) => (
              <QualityCard key={num} $isArabic={isArabic}>
                <div className="icon-wrap">
                  <FaCheckCircle />
                </div>
                <div className="text">
                  <h4>{t(`quality_${num}_t`)}</h4>
                  <p>{t(`quality_${num}_d`)}</p>
                </div>
              </QualityCard>
            ))}
          </QualityGrid>
        </div>

        {/* --- YOU ARE NEVER ALONE (PDF 1, Slide 9) --- */}
        <SupportBanner $isArabic={isArabic}>
          <div className="content-side">
            <h3>
              {isArabic
                ? "لست وحدك على الطريق أبداً"
                : "Vous n'êtes jamais seul sur la route"}
            </h3>
            <p>
              {isArabic
                ? "تكنولوجيا ملاحية ذكية، تسوية واضحة لمستحقاتك، وفريق دعم محلي حقيقي يرافقك في كل خطوة."
                : "Technologie embarquée précise, gestion équitable des litiges, encaissements garantis et une équipe locale à votre écoute."}
            </p>
          </div>
          <div className="action-side">
            <WhiteCTAButton onClick={() => navigate("/abridh/drive")}>
              <span>{t("abrid_btn_captain", "Devenir Capitaine")}</span>
              {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </WhiteCTAButton>
          </div>
        </SupportBanner>
      </SectionContainer>
    </TawsilaLayout>
  );
};

export default TawsilaLanding;