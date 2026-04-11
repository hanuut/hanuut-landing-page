import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowRight, 
  FaArrowLeft, 
  FaUsers, 
  FaWallet, 
  FaGlobe, 
  FaClock, 
  FaRoute, 
  FaHeadset 
} from "react-icons/fa";

// --- Components ---
import TawsilaLayout from "./components/TawsilaLayout";
import BorderBeamButton from "../../components/BorderBeamButton";
import Seo from "../../components/Seo";

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

const ScrollSection = styled.section`
  height: 300vh;
  position: relative;
  background-color: #050505;
`;

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const SplitLayout = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  gap: 4rem;
  direction: ${props => props.$isArabic ? 'rtl' : 'ltr'};

  @media (max-width: 900px) {
    flex-direction: column-reverse;
    justify-content: center;
  }
`;

const TextColumn = styled.div`
  flex: 1;
  position: relative;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 900px) {
    height: 30vh;
    text-align: center;
  }
`;

const TextBlock = styled(motion.div)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  will-change: transform, opacity;
  
  h2 {
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    margin-bottom: 1rem;
    color: white;
    font-family: 'Tajawal', sans-serif;
  }
  p {
    font-size: 1.2rem;
    color: #A1A1AA;
    line-height: 1.6;
    font-family: 'Cairo', sans-serif;
  }
`;

const PhoneColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PhoneMockup = styled.div`
  width: 320px;
  height: 650px;
  background: #18181B;
  border-radius: 40px;
  border: 8px solid #27272A;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 25px;
    background: #000;
    border-radius: 20px;
    z-index: 10;
  }

  @media (max-width: 900px) {
    width: 260px;
    height: 530px;
  }
`;

const PhoneScreen = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: ${props => props.$bg || "#09090B"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  text-align: center;
  position: absolute;
  top: 0; left: 0;
  will-change: transform, opacity;

  svg {
    font-size: 4rem;
    color: #397FF9;
    margin-bottom: 1.5rem;
  }

  h3 { color: white; font-size: 1.5rem; margin-bottom: 0.5rem; }
  p { color: #A1A1AA; font-size: 0.9rem; }
`;

// --- 3. MAIN COMPONENT ---
const TawsilaLanding = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.6, 0.7], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 1], [0, 1, 1]);

  const y1 = useTransform(scrollYProgress, [0, 0.35], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0.25, 0.35, 0.6, 0.7], [50, 0, 0, -50]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.7, 1], [50, 0, 0]);

  const bentoCards = [
    {
      className: "span-2",
      icon: FaClock, // Time/Schedule
      title: t("tawsila_sticky_1_title"),
      desc: t("tawsila_sticky_1_desc")
    },
    {
      className: "span-1",
      icon: FaUsers, // Replaced Car with Users (Community)
      title: t("tawsila_bento_1_title"),
      desc: t("tawsila_bento_1_desc")
    },
    {
      className: "span-1",
      icon: FaRoute, // Replaced Map with Route (Coordination)
      title: t("tawsila_sticky_2_title"),
      desc: t("tawsila_sticky_2_desc")
    },
    {
      className: "span-2",
      icon: FaWallet, // Cost sharing
      title: t("tawsila_bento_2_title"),
      desc: t("tawsila_bento_2_desc")
    },
    {
      className: "span-1",
      icon: FaHeadset,
      title: t("tawsila_sticky_3_title"),
      desc: t("tawsila_sticky_3_desc")
    },
    {
      className: "span-2",
      icon: FaGlobe, // Network
      title: t("tawsila_bento_3_title"),
      desc: t("tawsila_bento_3_desc")
    }
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
          "name": "Abridh by Hanuut",
          "operatingSystem": "Android, iOS",
          "applicationCategory": "TravelApplication",
          "image": "https://hanuut.com/static/abridh.png", // <-- ADDED LOGO
          "url": "https://hanuut.com/abridh",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "DZD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1240"
          },
          "description": seoDesc
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
            <BorderBeamButton onClick={() => navigate("/tawsila/drive")} beamColor="#397FF9">
              {t("tawsila_btn_drive")} {isArabic ? <FaArrowLeft style={{marginRight:'8px'}}/> : <FaArrowRight style={{marginLeft:'8px'}}/>}
            </BorderBeamButton>
            <BorderBeamButton secondary onClick={() => window.open(process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK, "_blank")} beamColor="#FFFFFF">
              {t("tawsila_btn_ride")}
            </BorderBeamButton>
          </CtaGroup>
        </HeroContent>
      </HeroSection>

      {/* --- STICKY SCROLL SECTION --- */}
      <ScrollSection ref={scrollRef}>
        <StickyContainer>
          <SplitLayout $isArabic={isArabic}>
            
            <TextColumn>
              <TextBlock style={{ opacity: opacity1, y: y1, zIndex: 3 }}>
                <h2>{t("tawsila_sticky_1_title")}</h2>
                <p>{t("tawsila_sticky_1_desc")}</p>
              </TextBlock>
              <TextBlock style={{ opacity: opacity2, y: y2, zIndex: 2 }}>
                <h2>{t("tawsila_sticky_2_title")}</h2>
                <p>{t("tawsila_sticky_2_desc")}</p>
              </TextBlock>
              <TextBlock style={{ opacity: opacity3, y: y3, zIndex: 1 }}>
                <h2>{t("tawsila_sticky_3_title")}</h2>
                <p>{t("tawsila_sticky_3_desc")}</p>
              </TextBlock>
            </TextColumn>

            <PhoneColumn>
              <PhoneMockup>
                <PhoneScreen style={{ opacity: opacity1 }}>
                  <FaUsers />
                  <h3>Réseau Privé</h3>
                  <p>Connexion sécurisée.</p>
                </PhoneScreen>
                <PhoneScreen style={{ opacity: opacity2, background: '#0e1726' }}>
                  <FaRoute />
                  <h3>Demande de déplacement</h3>
                  <p>Mise en relation en cours...</p>
                </PhoneScreen>
                <PhoneScreen style={{ opacity: opacity3 }}>
                  <FaWallet />
                  <h3>Participation</h3>
                  <p>Partage des frais équitable.</p>
                </PhoneScreen>
              </PhoneMockup>
            </PhoneColumn>

          </SplitLayout>
        </StickyContainer>
      </ScrollSection>

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