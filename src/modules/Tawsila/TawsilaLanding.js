import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowRight, 
  FaArrowLeft, 
  FaCarAlt, 
  FaWallet, 
  FaGlobe, 
  FaClock, 
  FaMapMarkedAlt, 
  FaHeadset 
} from "react-icons/fa";

// --- Components ---
import TawsilaLayout from "./components/TawsilaLayout";
import BorderBeamButton from "../../components/BorderBeamButton";

// --- 1. THE 3D MOBILITY CANVAS BACKGROUND ---
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

const MobilityCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 150 };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? "#397FF9" : "#FFFFFF";
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > w || this.x < 0) this.speedX = -this.speedX;
        if (this.y > h || this.y < 0) this.speedY = -this.speedY;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= forceDirectionX * force * 3;
          this.y -= forceDirectionY * force * 3;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }

    const init = () => {
      particlesArray = [];
      let numberOfParticles = (w * h) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance =
            (particlesArray[a].x - particlesArray[b].x) ** 2 +
            (particlesArray[a].y - particlesArray[b].y) ** 2;
          if (distance < (w / 10) * (h / 10)) {
            opacityValue = 1 - distance / 10000;
            ctx.strokeStyle = `rgba(57, 127, 249, ${opacityValue * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
  color: #397FF9;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  letter-spacing: 1px;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 900;
  color: white;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
  font-family: 'Tajawal', sans-serif;
  letter-spacing: -1px;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  color: #A1A1AA;
  margin: 0 auto 3rem auto;
  max-width: 600px;
  line-height: 1.6;
  font-family: 'Cairo', sans-serif;
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
  direction: ${props => props.$isArabic ? 'rtl' : 'ltr'};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
`;

const BentoCard = styled(motion.div)`
  background: #18181B;
  border-radius: 32px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border: 1px solid rgba(255,255,255,0.05);
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
    @media (max-width: 900px) { grid-column: span 1; }
  }

  .content-wrapper {
    position: relative;
    z-index: 2;
  }

  h3 { 
    font-size: 2rem; 
    color: white; 
    margin-bottom: 1rem; 
    font-family: 'Tajawal', sans-serif;
  }
  
  p { 
    font-size: 1.1rem; 
    color: #A1A1AA; 
    line-height: 1.6; 
    font-family: 'Cairo', sans-serif;
    margin: 0;
  }

  .icon-top {
    font-size: 2.5rem;
    color: #397FF9;
    margin-bottom: 2rem;
  }
  
  .bg-icon {
    position: absolute;
    top: -10%;
    ${props => props.$isArabic ? 'left: -10%;' : 'right: -10%;'}
    font-size: 15rem;
    color: rgba(255,255,255,0.02);
    z-index: 0;
    transition: transform 0.5s ease, color 0.5s ease;
  }

  &:hover .bg-icon {
    transform: scale(1.1) rotate(${props => props.$isArabic ? '10deg' : '-10deg'});
    color: rgba(57, 127, 249, 0.05);
  }
`;

const tawsilaAppUrl = process.env.REACT_APP_Tawsila_DOWNLOAD_LINK || "https://play.google.com/store/apps/details?id=com.hanuut.tawsila";

// --- 3. MAIN COMPONENT ---
const TawsilaLanding = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const bentoCards = [
    {
      className: "span-2",
      icon: FaClock,
      title: t("tawsila_sticky_1_title", "Set your own schedule"),
      desc: t("tawsila_sticky_1_desc", "You're the boss. Drive when you want, where you want.")
    },
    {
      className: "span-1",
      icon: FaCarAlt,
      title: t("tawsila_bento_1_title", "Zero Friction"),
      desc: t("tawsila_bento_1_desc", "Sign up in minutes. Hit the road today.")
    },
    {
      className: "span-1",
      icon: FaMapMarkedAlt,
      title: t("tawsila_sticky_2_title", "Smart dispatching"),
      desc: t("tawsila_sticky_2_desc", "Our algorithm minimizes your downtime.")
    },
    {
      className: "span-2",
      icon: FaWallet,
      title: t("tawsila_bento_2_title", "Clear Earnings"),
      desc: t("tawsila_bento_2_desc", "Keep what you earn. Transparent payouts with no hidden fees.")
    },
    {
      className: "span-1",
      icon: FaHeadset,
      title: t("tawsila_sticky_3_title", "24/7 Support"),
      desc: t("tawsila_sticky_3_desc", "Real humans ready to help you at any time.")
    },
    {
      className: "span-2",
      icon: FaGlobe,
      title: t("tawsila_bento_3_title", "Community First"),
      desc: t("tawsila_bento_3_desc", "Connect people. Deliver moments. Be the heartbeat of your city.")
    }
  ];

  return (
    <TawsilaLayout>
      <Helmet>
        <title>Abridh | {t("companyName", "Hanuut")}</title>
      </Helmet>

      {/* --- HERO SECTION --- */}
      <HeroSection>
        <MobilityCanvas />
        <HeroContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Badge>Abridh by Hanuut</Badge>
          <Title>{t("tawsila_hero_title", "Move with purpose.")}</Title>
          <Subtitle>{t("tawsila_hero_subtitle", "Drive your future. Join the next generation of mobility and earn on your own terms.")}</Subtitle>
          
          <CtaGroup>
            <BorderBeamButton onClick={() => navigate("/abridh/drive")} beamColor="#397FF9">
              {t("tawsila_btn_drive", "Apply to Drive")} {isArabic ? <FaArrowLeft style={{marginRight:'8px'}}/> : <FaArrowRight style={{marginLeft:'8px'}}/>}
            </BorderBeamButton>
            <BorderBeamButton secondary onClick={() => window.open(tawsilaAppUrl, "_blank")} beamColor="#FFFFFF">
              {t("tawsila_btn_ride", "Request a Ride")}
            </BorderBeamButton>
          </CtaGroup>
        </HeroContent>
      </HeroSection>

      {/* --- NEW LAG-FREE BENTO GRID SECTION --- */}
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