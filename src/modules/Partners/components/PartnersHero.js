import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import BorderBeamButton from "../../../components/BorderBeamButton";
import Windows from "../../../assets/windows.svg";
import Playstore from "../../../assets/playstore.webp";
import { useNavigate } from "react-router-dom"; 
import { FaMagic, FaApple } from "react-icons/fa";
import AppLogo3D from "../../../assets/logos/myHanuut/logo_ar.png"; 

// --- 1. THE DIGITAL MATRIX CANVAS ---
const CanvasContainer = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: #050505;
`;

const DigitalMatrixCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const isMobile = window.innerWidth < 768;

    let w, h;
    let pulses = [];
    let mouse = { x: -1000, y: -1000, radius: isMobile ? 150 : 300 };
    let animationFrame;

    const ORANGE = "rgba(240, 122, 72,";
    const GREEN = "rgba(57, 161, 112,";
    const WHITE = "rgba(255, 255, 255,";

    class DataPulse {
      constructor() {
        this.reset();
        this.progress = Math.random(); 
      }

      reset() {
        this.lineIndex = Math.floor(Math.random() * 24); 
        this.progress = Math.random() > 0.5 ? 0 : 1; 
        this.direction = this.progress === 0 ? 1 : -1;
        this.baseSpeed = (Math.random() * 0.0005 + 0.0002);
        this.speed = this.baseSpeed;
        this.isShooting = false;

        const rand = Math.random();
        if (rand < 0.01) this.color = WHITE;
        else if (rand < 0.06) this.color = GREEN;
        else this.color = ORANGE;
        
        this.opacity = Math.random() * 0.4 + 0.3;
      }

      update() {
        this.progress += this.speed * this.direction;
        if (this.progress > 1.1 || this.progress < -0.1) {
          this.reset();
        }
      }

      triggerHyperSpeed() {
        this.isShooting = true;
        this.speed = this.baseSpeed * 100;
        this.opacity = 1;
      }
    }

    const init = () => {
      pulses = [];
      const count = isMobile ? 20 : 45;
      for (let i = 0; i < count; i++) {
        pulses.push(new DataPulse());
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

    const drawGrid = () => {
      const gridCount = 24;
      const horizon = h * 0.45;
      ctx.lineWidth = 1;

      for (let i = 0; i <= gridCount; i++) {
        const x = (w / gridCount) * i;
        let dx = mouse.x - x;
        let dy = mouse.y - (h * 0.7);
        let dist = Math.sqrt(dx * dx + dy * dy);
        let hoverEffect = mouse.x !== -1000 && dist < mouse.radius ? (1 - dist/mouse.radius) : 0;

        ctx.strokeStyle = `${ORANGE} ${0.08 + hoverEffect * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(w / 2 + (x - w / 2) * 0.05, horizon);
        ctx.stroke();
      }

      for (let j = 0; j < 10; j++) {
        const py = horizon + (Math.pow(j / 10, 2)) * (h - horizon);
        ctx.strokeStyle = `${ORANGE} 0.05)`;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.stroke();
      }
    };

    const animate = (now) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      drawGrid();

      const horizon = h * 0.45;
      const gridCount = 24;

      pulses.forEach(p => {
        p.update();
        const xStart = (w / gridCount) * p.lineIndex;
        const xEnd = w / 2 + (xStart - w / 2) * 0.05;
        const currentX = xStart + (xEnd - xStart) * p.progress;
        const currentY = horizon + (Math.pow(1 - p.progress, 2)) * (h - horizon);

        // FIX: Math.max ensures size is never negative to prevent IndexSizeError
        const rawSize = p.isShooting ? 30 : (15 * (1 - p.progress));
        const size = Math.max(0.1, rawSize);

        ctx.beginPath();
        const grad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, size);
        grad.addColorStop(0, `${p.color} ${p.opacity})`);
        grad.addColorStop(1, `${p.color} 0)`);
        ctx.fillStyle = grad;
        ctx.arc(currentX, currentY, size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (Math.random() < 0.0011) {
        const available = pulses.filter(p => !p.isShooting);
        if (available.length > 0) {
          available[Math.floor(Math.random() * available.length)].triggerHyperSpeed();
        }
      }

      const gradX = mouse.x === -1000 ? w/2 : mouse.x;
      const gradY = mouse.y === -1000 ? h/2 : mouse.y;
      const vignette = ctx.createRadialGradient(gradX, gradY, 0, gradX, gradY, Math.max(1, mouse.radius * 2));
      vignette.addColorStop(0, 'rgba(5, 5, 5, 0)');
      vignette.addColorStop(0.7, 'rgba(5, 5, 5, 0.4)');
      vignette.addColorStop(1, 'rgba(5, 5, 5, 0.7)');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      animationFrame = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    resize();
    animate(0);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <CanvasContainer ref={canvasRef} />;
};

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); } 
  100% { transform: translateY(0px); }
`;

const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  background-color: #050505;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  top: 0;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1000px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  padding-top: calc(${(props) => props.theme.navHeight} + 2rem);
  padding-bottom: 4rem;
  pointer-events: none;

  @media (max-width: 768px) {
    padding-top: calc(${(props) => props.theme.navHeightMobile} + 2rem);
  }
`;

const LogoContainer = styled(motion.div)`
  position: relative;
  width: 65px; 
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -1rem; 
  animation: ${float} 5s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 10px 20px rgba(240, 122, 72, 0.5));
  }
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.4rem;
  border-radius: 100px;
  background: rgba(240, 122, 72, 0.08); 
  border: 1px solid rgba(240, 122, 72, 0.3);
  backdrop-filter: blur(8px);
  color: #F07A48; 
  font-size: 0.85rem;
  font-weight: 700;
  font-family: 'Tajawal', sans-serif;
  margin-bottom: 0.5rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.2;
  color: white;
  font-family: 'Tajawal', sans-serif;

  .highlight {
    background: linear-gradient(to bottom, #FFFFFF 30%, #F07A48 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const SubHeading = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  color: #a1a1aa;
  max-width: 600px;
  line-height: 1.7;
  font-family: 'Cairo Variable', sans-serif;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  pointer-events: auto;
`;

const Icon = styled.img`
  height: 1.5rem;
  width: auto;
  filter: invert(1);
`;

const WizardButton = styled.button`
  margin-top: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.9rem 2.2rem;
  border-radius: 50px;
  color: white;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  font-family: 'Tajawal', sans-serif;
  pointer-events: auto;

  &:hover {
    background: rgba(240, 122, 72, 0.15);
    border-color: #F07A48;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(240, 122, 72, 0.1);
  }

  svg { color: #F07A48; }
`;

const SubText = styled.p`
  font-size: 0.85rem;
  color: #71717a;
  margin-top: 0.8rem;
`;

const PartnersHero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); 

  const handleDownloadPlay = () => window.open(process.env.REACT_APP_MY_HANUUT_DOWNLOAD_LINK_GOOGLE_PLAY, "_blank");
  const handleDownloadWindows = () => window.open(process.env.REACT_APP_WINDOWS_MY_HANUUT_DOWNLOAD_LINK, "_blank");
  const handleDownloadIOS = () => window.open("https://apps.apple.com/us/app/my-hanuut/id6762234117", "_blank");
  const handleWizardClick = () => {
    navigate("/partners/onboarding");
    window.scrollTo(0, 0);
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7 } }
  };

  return (
    <Section>
      <DigitalMatrixCanvas />

      <Container as={motion.div} initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
        
        <LogoContainer variants={itemVars}>
          <img src={AppLogo3D} alt="My Hanuut App" />
        </LogoContainer>

        <Badge variants={itemVars}>
           {t("partnerHeadingBoost")} {t("myHanuutTitle")}
        </Badge>

        <HeroTitle variants={itemVars} lang={i18n.language}>
          <span className="highlight">{t("partnersHero_heading_part1")}</span>
        </HeroTitle>
        
        <SubHeading variants={itemVars}>
          {t("partnersHero_subheading")}
        </SubHeading>

        <ButtonGroup variants={itemVars}>
          <BorderBeamButton onClick={handleDownloadPlay} beamColor="#F07A48">
            <Icon src={Playstore} alt="Google Play" />
            <span>Google Play</span>
          </BorderBeamButton>

          <BorderBeamButton onClick={handleDownloadIOS} secondary={true} beamColor="#F07A48">
            <FaApple style={{ fontSize: '1.5rem' }} />
            <span>App Store</span>
          </BorderBeamButton>

          <BorderBeamButton onClick={handleDownloadWindows} secondary={true} beamColor="#F07A48">
            <Icon src={Windows} alt="Windows" />
            <span>Windows</span>
          </BorderBeamButton>
        </ButtonGroup>

        <motion.div variants={itemVars} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <WizardButton onClick={handleWizardClick}>
            <FaMagic />
            {t("cta_wizard_button")}
          </WizardButton>
          <SubText>{t("cta_wizard_sub")}</SubText>
        </motion.div>

      </Container>
    </Section>
  );
};

export default PartnersHero;