import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaUsers,
  FaWallet,
  FaGlobe,
  FaClock,
  FaRoute,
  FaHeadset,
} from "react-icons/fa";

// --- Components ---
import TawsilaLayout from "./components/TawsilaLayout";
import BorderBeamButton from "../../components/BorderBeamButton";
import Seo from "../../components/Seo";

// --- 1. THE MAP MOBILITY CANVAS BACKGROUND ---
const CanvasContainer = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: auto;
  background: #050505;
`;

const getAbridhStoreLink = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  return isIOS
    ? "https://apps.apple.com/dz/app/abridh/id6760981883"
    : process.env.REACT_APP_TAWSILA_DOWNLOAD_LINK;
};

const MobilityCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Cap DPR to 1.5 for extreme performance on 4K/Retina screens
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); 
    const isMobile = window.innerWidth < 768;

    let w, h;
    let particles = [];
    let mouse = { x: -1000, y: -1000, radius: isMobile ? 200 : 350 };
    let animationFrame;

    // Tawsila Colors
    const COLORS = ["#397FF9", "#FFFFFF", "#1E40AF"];

    class MapNode {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * (isMobile ? 3 : 5) + 2; 
        
        // Very slow, deliberate movement like map tracking
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.connections = 0; // Track connections to limit webbing
      }

      draw() {
        // Inner solid core
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Subtle outer ring (map marker effect)
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color === "#FFFFFF" ? "#397FF9" : this.color;
        ctx.fill();
      }

      update() {
        // Mouse interaction (gentle push away)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius * 0.5) {
          const force = (mouse.radius * 0.5 - distance) / (mouse.radius * 0.5);
          this.vx += (dx / distance) * force * 0.02;
          this.vy += (dy / distance) * force * 0.02;
        }

        // Friction to keep movement steady
        this.vx *= 0.98;
        this.vy *= 0.98;

        this.x += this.vx + (Math.random() - 0.5) * 0.1;
        this.y += this.vy + (Math.random() - 0.5) * 0.1;

        // Wrap around screen
        if (this.x < -20) this.x = w + 20;
        if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20;
        if (this.y > h + 20) this.y = -20;
      }
    }

    const init = () => {
      particles = [];
      // Higher density works now because we aren't using expensive blending modes
      const count = isMobile ? 35 : 70; 
      for (let i = 0; i < count; i++) {
        particles.push(new MapNode());
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

    const drawMapRoutes = () => {
      const maxDistSq = isMobile ? 15000 : 30000;
      
      // Reset connection counts
      particles.forEach(p => p.connections = 0);

      ctx.lineWidth = 1.5;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          // Limit to max 2 connections per node to create map "routes" instead of stars
          if (particles[a].connections >= 2 || particles[b].connections >= 2) continue;

          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            particles[a].connections++;
            particles[b].connections++;

            let opacity = 1 - (distSq / maxDistSq);
            
            ctx.globalAlpha = opacity * 0.6;
            ctx.strokeStyle = '#397FF9';
            
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      // Clear canvas fully every frame for crisp, clean map lines (no blurry trails)
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      // Draw map network
      drawMapRoutes();
      
      // Draw map nodes
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // --- SPOTLIGHT VIGNETTE ---
      // This creates the perfect contrast for text and darkness where the mouse isn't
      ctx.globalAlpha = 1;
      let gradient;
      
      if (mouse.x !== -1000) {
        // If mouse is active, create a clear window around the mouse
        gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
        gradient.addColorStop(0, 'rgba(5, 5, 5, 0)');     // Fully transparent at mouse
        gradient.addColorStop(0.5, 'rgba(5, 5, 5, 0.6)'); // Starts fading to black
        gradient.addColorStop(1, 'rgba(5, 5, 5, 0.95)');  // Nearly pitch black outside radius
      } else {
        // Idle state: Screen is mostly dark to keep text contrast extremely high
        gradient = 'rgba(5, 5, 5, 0.85)';
      }

      ctx.fillStyle = gradient;
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
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <CanvasContainer ref={canvasRef} />;
};

// --- 2. STYLED COMPONENTS ---

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  width: 90%;
  pointer-events: none;
`;

const Badge = styled(motion.div)`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: #397ff9;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  letter-spacing: 1px;
`;

const Title = styled(motion.h1)`
  font-size: clamp(1.6rem, 3.8vw, 3rem)
  font-weight: 900;
  color: white;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
  font-family: "Tajawal", sans-serif;
  letter-spacing: -1px;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: #a1a1aa;
  margin: 0 auto 3rem auto;
  max-width: 600px;
  line-height: 1.6;
  font-family: "Cairo", sans-serif;
`;

const CtaGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  pointer-events: auto;
  flex-wrap: wrap;
`;

// --- NEW HIGH-PERFORMANCE BENTO GRID ---
const BentoSection = styled.section`
  padding: 6rem 0 10rem 0;
  background: #050505;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
`;

const BentoContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(320px, auto);
  gap: 1.5rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
`;

const BentoCard = styled(motion.div)`
  background: #18181b;
  border-radius: 32px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: default;

  &:hover {
    border-color: rgba(57, 127, 249, 0.4);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(57, 127, 249, 0.1);
  }

  &.span-2 {
    grid-column: span 2;
    @media (max-width: 900px) {
      grid-column: span 1;
    }
  }

  .content-wrapper {
    position: relative;
    z-index: 2;
  }

  h3 {
    font-size: 2rem;
    color: white;
    margin-bottom: 1rem;
    font-family: "Tajawal", sans-serif;
  }

  p {
    font-size: 1.1rem;
    color: #a1a1aa;
    line-height: 1.6;
    font-family: "Cairo", sans-serif;
    margin: 0;
  }

  .icon-top {
    font-size: 2.5rem;
    color: #397ff9;
    margin-bottom: 2rem;
  }

  .bg-icon {
    position: absolute;
    top: -10%;
    ${(props) => (props.$isArabic ? "left: -10%;" : "right: -10%;")}
    font-size: 15rem;
    color: rgba(255, 255, 255, 0.02);
    z-index: 0;
    transition:
      transform 0.5s ease,
      color 0.5s ease;
  }

  &:hover .bg-icon {
    transform: scale(1.1)
      rotate(${(props) => (props.$isArabic ? "10deg" : "-10deg")});
    color: rgba(57, 127, 249, 0.05);
  }
`;

// --- 3. MAIN COMPONENT ---
const TawsilaLanding = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const bentoCards = [
    {
      className: "span-2",
      icon: FaClock,
      title: t("tawsila_sticky_1_title"),
      desc: t("tawsila_sticky_1_desc"),
    },
    {
      className: "span-1",
      icon: FaUsers, 
      title: t("tawsila_bento_1_title"),
      desc: t("tawsila_bento_1_desc"),
    },
    {
      className: "span-1",
      icon: FaRoute, 
      title: t("tawsila_sticky_2_title"),
      desc: t("tawsila_sticky_2_desc"),
    },
    {
      className: "span-2",
      icon: FaWallet, 
      title: t("tawsila_bento_2_title"),
      desc: t("tawsila_bento_2_desc"),
    },
    {
      className: "span-1",
      icon: FaHeadset,
      title: t("tawsila_sticky_3_title"),
      desc: t("tawsila_sticky_3_desc"),
    },
    {
      className: "span-2",
      icon: FaGlobe, 
      title: t("tawsila_bento_3_title"),
      desc: t("tawsila_bento_3_desc"),
    },
  ];

  const seoTitle = t("seo_tawsila_title");
  const seoDesc = t("seo_tawsila_desc");

  return (
    <TawsilaLayout>
      <Seo
        title={seoTitle}
        description={seoDesc}
        url="https://hanuut.com/abridh"
        customSchema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Abridh by Hanuut",
          operatingSystem: "Android, iOS",
          applicationCategory: "TravelApplication",
          image: "https://hanuut.com/static/abridh.png", 
          url: "https://hanuut.com/abridh",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "DZD",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "1240",
          },
          description: seoDesc,
        }}
      />

      {/* --- HERO SECTION --- */}
      <HeroSection>
        <MobilityCanvas />
        <HeroContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Badge>Abridh | Phase Expérimentale</Badge>
          <Title>{t("tawsila_hero_title")}</Title>
          <Subtitle>{t("tawsila_hero_subtitle")}</Subtitle>

          <CtaGroup>
            <BorderBeamButton
              onClick={() => navigate("/tawsila/drive")}
              beamColor="#397FF9"
            >
              {t("tawsila_btn_drive")}{" "}
              {isArabic ? (
                <FaArrowLeft style={{ marginRight: "8px" }} />
              ) : (
                <FaArrowRight style={{ marginLeft: "8px" }} />
              )}
            </BorderBeamButton>
            <BorderBeamButton
              secondary
              onClick={() => window.open(getAbridhStoreLink(), "_blank")}
              beamColor="#FFFFFF"
            >
              {t("tawsila_btn_ride")}
            </BorderBeamButton>
          </CtaGroup>
        </HeroContent>
      </HeroSection>

      {/* --- BENTO GRID SECTION --- */}
      <BentoSection>
        <BentoContainer $isArabic={isArabic}>
          {bentoCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <BentoCard
                key={index}
                className={card.className}
                $isArabic={isArabic}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              >
                <IconComponent className="bg-icon" />
                <div className="content-wrapper">
                  <IconComponent className="icon-top" />
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </BentoCard>
            );
          })}
        </BentoContainer>
      </BentoSection>
    </TawsilaLayout>
  );
};

export default TawsilaLanding;