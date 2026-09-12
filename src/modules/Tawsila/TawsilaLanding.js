// modules/Tawsila/TawsilaLanding.js
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaUsers,
  FaRoute,
  FaWallet,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCompass,
} from "react-icons/fa";

import TawsilaLayout from "./components/TawsilaLayout";
import BorderBeamButton from "../../components/BorderBeamButton";
import Seo from "../../components/Seo";
import abridLogoGraphic from "../../assets/abridh_logo.webp";

// --- 1. LIGHT GALAXY MOBILITY CANVAS ---
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

    const COLORS = ["#00875F", "#10B981", "#397FF9"];

    class ParticleNode {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * (isMobile ? 2.5 : 4) + 1.5;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      draw() {
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
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
      const count = isMobile ? 25 : 55;
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
      const maxDistSq = isMobile ? 12000 : 22000;
      ctx.lineWidth = 1;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const opacity = (1 - distSq / maxDistSq) * 0.25;
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

// --- 2. HERO & LIQUID-GLASS LOGO REVEAL ---
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

// Layer 2: Large Logo in Background
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

// Layer 3 & 4: Liquid Glass with dynamic cursor reveal
const LiquidGlassLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(248, 250, 252, 0.6);

  /* Progressive cursor reveal mask */
  mask-image: radial-gradient(
    circle 240px at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.8) 60%,
    rgba(0, 0, 0, 1) 100%
  );
  -webkit-mask-image: radial-gradient(
    circle 240px at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.8) 60%,
    rgba(0, 0, 0, 1) 100%
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
  box-shadow: 0 2px 8px rgba(0, 135, 95, 0.08);

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

const PrimaryPillBtn = styled.button`
  background-color: #00875f;
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
  box-shadow: 0 6px 20px rgba(0, 135, 95, 0.25);
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background-color: #006847;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 135, 95, 0.35);
  }
`;

const SecondaryPillBtn = styled.button`
  background-color: #ffffff;
  color: #0b1528;
  padding: 1rem 2.25rem;
  border-radius: 9999px;
  font-size: 1.05rem;
  font-weight: 800;
  border: 1.5px solid #cbd5e1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    border-color: #00875f;
    color: #00875f;
    transform: translateY(-2px);
    background-color: #f0fdf4;
  }
`;

// --- 3. DUAL-PERSONA SECTION ---
const SectionContainer = styled.section`
  width: 90%;
  max-width: 1150px;
  margin: 0 auto;
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

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
    background: ${({ $isCaptain }) => ($isCaptain ? "#397FF9" : "#00875F")};
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
      background: #0b1528;
      color: #ffffff;
      &:hover { background: #1e293b; transform: translateY(-2px); }
    `
        : `
      background: #00875f;
      color: #ffffff;
      &:hover { background: #006847; transform: translateY(-2px); }
    `}
  }
`;

// --- 4. 3 STREAMLINED PILLARS ---
const PillarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const PillarCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .icon-wrap {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: #ecfdf5;
    color: #00875f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.3rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  p {
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.6;
    margin: 0;
  }
`;

const BejaiaNotice = styled.div`
  background: #f1f5f9;
  border: 1.5px dashed #cbd5e1;
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};

  .text {
    max-width: 680px;
    h4 {
      font-size: 1.3rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 0.5rem 0;
    }
    p {
      font-size: 1rem;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }
  }
`;

const TawsilaLanding = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Dynamic Liquid-Glass Mouse Coordinate Tracking
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
          "Abrid | La mobilité communautaire, simplement (Béjaïa)",
        )}
        description={t(
          "seo_abrid_desc",
          "Plateforme de mobilité communautaire et de partage de trajets à Béjaïa. Déplacements partagés, participation transparente aux frais.",
        )}
        url="https://hanuut.com/abridh"
      />

      {/* --- HERO SECTION WITH LOGO LIQUID GLASS & GALAXY PARTICLES --- */}
      <HeroSection ref={heroRef} onMouseMove={handleMouseMove}>
        {/* Layer 1: Canvas particles */}
        <LightMobilityCanvas />

        {/* Layer 2: Big Background Logo */}
        <BackgroundLogoContainer>
          <img src={abridLogoGraphic} alt="Abrid Watermark Logo" />
        </BackgroundLogoContainer>

        {/* Layer 3 & 4: Liquid Glass Layer with cursor reveal */}
        <LiquidGlassLayer />

        {/* Layer 5: Hero Content */}
        <HeroContent
          $isArabic={isArabic}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LaunchBadge>
            <span className="dot" />
            <span>
              {t(
                "abrid_launch_badge",
                "Phase de test & Déploiement initial à Béjaïa",
              )}
            </span>
          </LaunchBadge>

          <HeroTitle>
            {t("abrid_hero_title_prefix", "La mobilité communautaire, ")}
            <span>{t("abrid_hero_title_highlight", "simplement.")}</span>
          </HeroTitle>

          <HeroSubtitle>
            {t(
              "abrid_hero_sub",
              "Coordonnez vos déplacements, partagez vos trajets et participez aux frais avec une communauté de membres.",
            )}
          </HeroSubtitle>

          <CtaRow>
            <PrimaryPillBtn onClick={() => navigate("/abridh/drive")}>
              <span>{t("abrid_btn_captain", "Devenir Capitaine")}</span>
              {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </PrimaryPillBtn>

            <SecondaryPillBtn
              onClick={() => window.open(getAbridStoreLink(), "_blank")}
            >
              <span>{t("abrid_btn_passenger", "Demander un déplacement")}</span>
            </SecondaryPillBtn>
          </CtaRow>
        </HeroContent>
      </HeroSection>

      {/* --- DUAL PERSONA MODULE --- */}
      <SectionContainer $isArabic={isArabic}>
        <DualPersonaGrid>
          {/* Persona 1: Passager */}
          <PersonaCard $isCaptain={false} $isArabic={isArabic}>
            <span className="persona-badge">
              {t("persona_passenger_tag", "Pour les Passagers")}
            </span>
            <h3>{t("persona_passenger_title", "Voyagez en toute sérénité")}</h3>
            <p>
              {t(
                "persona_passenger_desc",
                "Rejoignez des membres effectuant le même trajet que vous. Déplacements locaux clairs, estimation transparente de la contribution aux frais et capitaines vérifiés.",
              )}
            </p>
            <button
              className="action-btn"
              onClick={() => window.open(getAbridStoreLink(), "_blank")}
            >
              <span>
                {t("persona_passenger_cta", "Télécharger l'Application")}
              </span>
              {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
          </PersonaCard>

          {/* Persona 2: Capitaine */}
          <PersonaCard $isCaptain={true} $isArabic={isArabic}>
            <span className="persona-badge">
              {t("persona_captain_tag", "Pour les Capitaines")}
            </span>
            <h3>
              {t("persona_captain_title", "Partagez vos trajets du quotidien")}
            </h3>
            <p>
              {t(
                "persona_captain_desc",
                "Compensez vos dépenses d'entretien et de carburant en accueillant des membres voyageurs sur vos trajets habituels à Béjaïa. Zéro contrainte d'horaire.",
              )}
            </p>
            <button
              className="action-btn"
              onClick={() => navigate("/abridh/drive")}
            >
              <span>
                {t("persona_captain_cta", "Rejoindre en tant que Capitaine")}
              </span>
              {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
          </PersonaCard>
        </DualPersonaGrid>

        {/* --- 3 CORE COMMUNITY PILLARS --- */}
        <PillarsGrid>
          <PillarCard $isArabic={isArabic}>
            <div className="icon-wrap">
              <FaRoute />
            </div>
            <h4>{t("pillar_1_title", "Partage de Trajets")}</h4>
            <p>
              {t(
                "pillar_1_desc",
                "Des itinéraires partagés entre membres pour se déplacer simplement en ville ou entre localités voisines.",
              )}
            </p>
          </PillarCard>

          <PillarCard $isArabic={isArabic}>
            <div className="icon-wrap">
              <FaCompass />
            </div>
            <h4>{t("pillar_2_title", "Coordination Simple")}</h4>
            <p>
              {t(
                "pillar_2_desc",
                "Une application intuitive pour convenir facilement d'un point de rendez-vous et suivre l'arrivée du membre conducteur.",
              )}
            </p>
          </PillarCard>

          <PillarCard $isArabic={isArabic}>
            <div className="icon-wrap">
              <FaWallet />
            </div>
            <h4>{t("pillar_3_title", "Partage des Frais")}</h4>
            <p>
              {t(
                "pillar_3_desc",
                "Une contribution équitable aux frais de route calculée en amont, sans négociation ni surprise.",
              )}
            </p>
          </PillarCard>
        </PillarsGrid>

        {/* --- BÉJAÏA LAUNCH COMMITMENT --- */}
        <BejaiaNotice $isArabic={isArabic}>
          <div className="text">
            <h4>
              {t("bejaia_notice_title", "Déploiement progressif à Béjaïa")}
            </h4>
            <p>
              {t(
                "bejaia_notice_desc",
                "Abrid démarre son déploiement initial sous forme de phase pilote à Béjaïa. Nous stabilisons le service avec un groupe de membres fondateurs avant d'étendre la couverture.",
              )}
            </p>
          </div>
          <PrimaryPillBtn onClick={() => navigate("/abridh/drive")}>
            <FaMapMarkerAlt />
            <span>{t("bejaia_btn_join", "Participer au Pilote")}</span>
          </PrimaryPillBtn>
        </BejaiaNotice>
      </SectionContainer>
    </TawsilaLayout>
  );
};

export default TawsilaLanding;
