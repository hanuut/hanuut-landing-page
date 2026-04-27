import { useRef, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import {
  FaApple,
  FaGooglePlay,
  FaCamera,
  FaKey,
  FaSearch,
  FaUserShield,
} from "react-icons/fa";
import Seo from "../../components/Seo";

// --- ASSETS ---
import TechStoreImg from "../../assets/3d_shops/tech_store.webp";
import FashionImg from "../../assets/3d_shops/fashion_store.webp";
import ArtStoreImg from "../../assets/3d_shops/art_store.webp";

// --- THEME ---
const esuuqTheme = {
  primaryColor: "#39A170",
  body: "#FDF4E3",
  text: "#111217",
  navHeight: "5rem",
};

const CanvasBackground = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #0a1a17;
`;

const ExchangeNetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.innerWidth < 768;

    let w, h;
    let particles = [];
    let mouse = { x: null, y: null, radius: isMobile ? 120 : 250 };
    let animationFrame;

    // Base RGB colors for the lights
    const COLORS = [
      { r: 57, g: 161, b: 112 },   // #39A170
      { r: 110, g: 231, b: 183 },  // #6EE7B7
      { r: 16, g: 185, b: 129 },   // #10B981
      { r: 167, g: 243, b: 208 },  // #A7F3D0
      { r: 5, g: 150, b: 105 }     // #059669
    ];

    const SHAPES = ["sphere", "cube", "gem", "pyramid"];

    class Particle {
      constructor() {
        this.reset();
        // Randomly scatter initially instead of resetting entirely
        this.x = Math.random() * w;
        this.y = Math.random() * h;
      }

      reset() {
        // Extreme diversity in sizes
        this.size = Math.random() * (isMobile ? 12 : 20) + 2; 
        this.baseSize = this.size;
        
        // Slower base velocity for the ambient background
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        
        // Appearance
        const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        // Pre-calculate shading strings to save CPU cycles
        this.colorLight = `rgb(${Math.min(255, baseColor.r * 1.5)}, ${Math.min(255, baseColor.g * 1.5)}, ${Math.min(255, baseColor.b * 1.5)})`;
        this.colorBase = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
        this.colorDark = `rgb(${baseColor.r * 0.5}, ${baseColor.g * 0.5}, ${baseColor.b * 0.5})`;
        
        this.shapeType = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        
        // State
        this.isShooting = false;
        this.targetOpacity = 0.1; // Very dim by default (fake blur/distance)
        this.currentOpacity = Math.random() * 0.2;
      }

      triggerShoot() {
        this.isShooting = true;
        // Burst of speed in random direction
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        // Brighten up before fading
        this.currentOpacity = 1;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Use globalAlpha for opacity changes instead of recalculating rgba strings
        ctx.globalAlpha = this.currentOpacity;

        const s = this.size;

        if (this.shapeType === "sphere") {
          // Fake 3D sphere using two overlapping circles (very fast)
          ctx.beginPath();
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.fillStyle = this.colorDark;
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(-s * 0.2, -s * 0.2, s * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = this.colorLight;
          ctx.fill();

        } else if (this.shapeType === "cube") {
          const r = s * 0.9;
          // Top face
          ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * 0.866, -r * 0.5); ctx.lineTo(0, 0); ctx.lineTo(-r * 0.866, -r * 0.5); ctx.closePath();
          ctx.fillStyle = this.colorLight; ctx.fill();
          // Left face
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-r * 0.866, -r * 0.5); ctx.lineTo(-r * 0.866, r * 0.5); ctx.lineTo(0, r); ctx.closePath();
          ctx.fillStyle = this.colorBase; ctx.fill();
          // Right face
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * 0.866, -r * 0.5); ctx.lineTo(r * 0.866, r * 0.5); ctx.lineTo(0, r); ctx.closePath();
          ctx.fillStyle = this.colorDark; ctx.fill();

        } else if (this.shapeType === "gem") {
          const w = s * 0.8;
          // Top half
          ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(-w, -s * 0.2); ctx.lineTo(0, 0); ctx.closePath();
          ctx.fillStyle = this.colorLight; ctx.fill();
          ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(w, -s * 0.2); ctx.lineTo(0, 0); ctx.closePath();
          ctx.fillStyle = this.colorBase; ctx.fill();
          // Bottom half
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-w, -s * 0.2); ctx.lineTo(0, s); ctx.closePath();
          ctx.fillStyle = this.colorDark; ctx.fill();
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, -s * 0.2); ctx.lineTo(0, s); ctx.closePath();
          ctx.fillStyle = this.colorBase; ctx.fill();

        } else if (this.shapeType === "pyramid") {
          const w = s * 0.9;
          // Left face
          ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(-w, s * 0.4); ctx.lineTo(0, s * 0.6); ctx.closePath();
          ctx.fillStyle = this.colorLight; ctx.fill();
          // Right face
          ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(w, s * 0.2); ctx.lineTo(0, s * 0.6); ctx.closePath();
          ctx.fillStyle = this.colorDark; ctx.fill();
        }

        ctx.restore();
      }

      update() {
        this.rotation += this.rotationSpeed;

        if (this.isShooting) {
          // Shrink and speed away
          this.size *= 0.92;
          this.currentOpacity *= 0.9;
          this.x += this.vx;
          this.y += this.vy;

          // Once it's tiny and invisible, reset it completely
          if (this.size < 0.5 || this.currentOpacity < 0.05) {
            this.reset();
            this.x = Math.random() * w;
            this.y = Math.random() * h;
          }
          return; // Skip normal hover logic
        }

        this.targetOpacity = 0.05; // Base "out of focus / less light" opacity

        // Interaction with mouse (Swarm/Glow effect)
        if (mouse.x !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            // Magnetic attraction
            const force = (mouse.radius - distance) / mouse.radius;
            this.vx += (dx / distance) * force * 0.02;
            this.vy += (dy / distance) * force * 0.02;
            
            // Bring into focus and enlarge
            this.targetOpacity = 0.3 + (force * 0.7);
            this.size = this.baseSize + (force * 5);
            this.rotationSpeed = (Math.random() - 0.5) * 0.05; // Spin faster
          } else {
            // Return to normal
            if (this.size > this.baseSize) this.size -= 0.2;
            this.rotationSpeed *= 0.98;
          }
        } else {
          if (this.size > this.baseSize) this.size -= 0.2;
          this.rotationSpeed *= 0.98;
        }

        // Smooth opacity transition
        this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.1;

        // Apply friction to velocities
        this.vx *= 0.97;
        this.vy *= 0.97;

        // Base drift
        this.x += this.vx + (Math.random() - 0.5) * 0.2;
        this.y += this.vy + (Math.random() - 0.5) * 0.2;

        // Screen wrap
        if (this.x < -20) this.x = w + 20;
        if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20;
        if (this.y > h + 20) this.y = -20;
      }
    }

    const init = () => {
      particles = [];
      // Highly optimized count. The trail effect + size diversity makes it look full.
      const count = isMobile ? 15 : 35; 
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    // --- ADDED RESIZE FUNCTION BACK ---
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

    const animate = () => {
      // Trail effect: fill screen with semi-transparent background instead of clearing completely
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(10, 26, 23, 0.25)'; // Higher alpha = shorter trails, lower = longer trails
      ctx.fillRect(0, 0, w, h);

      // Use 'lighter' for a beautiful, performant glowing blend effect when particles overlap
      ctx.globalCompositeOperation = 'lighter';
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Randomly pick an idle particle to "shoot" away and disappear (approx every 2-3 seconds)
      if (Math.random() < 0.01) {
        const idleParticles = particles.filter(p => !p.isShooting);
        if (idleParticles.length > 0) {
          const randomP = idleParticles[Math.floor(Math.random() * idleParticles.length)];
          randomP.triggerShoot();
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
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

  return <CanvasBackground ref={canvasRef} />;
};


// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  background-color: ${(props) => props.theme.body};
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  color: ${(props) => props.theme.text};
`;

const HeroSection = styled.section`
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background: ${(props) => props.theme.primaryColor};
`;

const HeroContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1rem;
`;

const Badge = styled(motion.span)`
  background-color: #000;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  font-weight: 700;
  font-family: 'Tajawal', sans-serif;
  font-size: 0.9rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(1.6rem, 3.8vw, 3rem);
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.2;
  font-family: 'Tajawal', sans-serif;
  margin: 0;
  max-width: 800px;
`;

const HeroSub = styled(motion.p)`
  font-size: 1.2rem;
  color: #fdf4e3;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
  font-family: 'Cairo', sans-serif;
  font-weight: 500;
`;

const ButtonRow = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
`;

const StoreButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: 'Tajawal', sans-serif;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);

  &.primary {
    background: #000000;
    color: #FFFFFF;
    border: 1px solid #000000;
    &:hover { transform: scale(1.03); }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #000000;
    border: 1px solid #E5E5E5;
    &:hover { background: #FFFFFF; transform: scale(1.03); }
  }

  svg { font-size: 1.5rem; }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

// --- NEW ACTION GRID SECTION ---
const ActionsSection = styled.section`
  padding: 6rem 0;
  background: ${(props) => props.theme.body};
  text-align: center;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  color: ${(props) => props.theme.text};
  margin-bottom: 3rem;
  padding-top: 0.5rem;
  font-family: 'Tajawal', sans-serif;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled(motion.div)`
  background: #FFFFFF;
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  border: 1px solid rgba(0,0,0,0.02);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(57, 161, 112, 0.1);
  }
`;

const ActionIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: rgba(57, 161, 112, 0.1);
  color: ${(props) => props.theme.primaryColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #111217;
  font-family: 'Tajawal', sans-serif;
  margin: 0;
`;

const ActionDesc = styled.p`
  font-size: 1.05rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-family: 'Cairo', sans-serif;
`;

// --- NEW TRUST SECTION ---
const TrustSection = styled.section`
  padding: 6rem 0;
  background: #FFFFFF;
  overflow: hidden;
`;

const TrustSplit = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  
  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TrustText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: ${(props) => (props.$isArabic ? "flex-start" : "flex-start")};

  @media (max-width: 900px) {
    align-items: center;
  }
`;

const TrustIcon = styled.div`
  color: ${(props) => props.theme.primaryColor};
  font-size: 3rem;
`;

const CollageWrapper = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  height: 450px;
  
  @media (max-width: 900px) {
    height: 350px;
    margin-top: 3rem;
  }
`;

const CollageImg = styled(motion.img)`
  position: absolute;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  object-fit: cover;
  
  &.img1 {
    width: 60%;
    height: 70%;
    top: 0;
    left: 0;
    z-index: 2;
  }
  &.img2 {
    width: 50%;
    height: 60%;
    bottom: 0;
    right: 0;
    z-index: 3;
  }
  &.img3 {
    width: 40%;
    height: 50%;
    top: 10%;
    right: 5%;
    z-index: 1;
    opacity: 0.8;
  }
`;

// --- BOTTOM CTA ---
const BottomCTA = styled.section`
  padding: 6rem 0;
  background: #111217;
  text-align: center;
`;

const BottomTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 2rem;
  font-family: 'Tajawal', sans-serif;
`;

// --- COMPONENT ---

const EsuuqPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const seoTitle = t(
    "seo_esuuq_title",
    "eSUUQ | Buy, Sell & Order Delivery in Algeria",
  );
  const seoDesc = t(
    "seo_esuuq_desc",
    "The ultimate marketplace in Algeria. Order food, shop from local supermarkets, or buy and sell used items securely.",
  );

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <ThemeProvider theme={esuuqTheme}>
      <PageWrapper>
        <Seo
          title={seoTitle}
          description={seoDesc}
          url="https://hanuut.com/esuuq"
          customSchema={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "eSUUQ by Hanuut",
            operatingSystem: "Web, Android, iOS",
            applicationCategory: "ShoppingApplication",
            image: "https://hanuut.com/static/esuuq.png",
            url: "https://hanuut.com/esuuq",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "DZD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.7",
              ratingCount: "3850",
            },
            description: seoDesc,
          }}
        />

        {/* --- HERO SECTION --- */}
        <HeroSection>
          <ExchangeNetworkCanvas />
          <HeroContent>
            <Badge
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ✨ {t("esuuq_v2.hero_badge", "eSUUQ Community")}
            </Badge>
            <HeroTitle
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t(
                "esuuq_v2.hero_title",
                "Put it out there. Get real responses.",
              )}
            </HeroTitle>
            <HeroSub
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t(
                "esuuq_v2.hero_subtitle",
                "The simplest way to sell, rent, or request anything in your city. Real people, instant connections.",
              )}
            </HeroSub>

            <ButtonRow
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <StoreButton
                href={process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK}
                target="_blank"
                className="primary"
              >
                <FaGooglePlay /> Google Play
              </StoreButton>
              <StoreButton
                href="https://apps.apple.com/dz/app/esuuq/id6752300426?l=fr-FR"
                target="_blank"
                className="secondary"
              >
                <FaApple /> App Store
              </StoreButton>
            </ButtonRow>
          </HeroContent>
        </HeroSection>

        {/* --- CORE ACTIONS GRID --- */}
        <ActionsSection ref={ref}>
          <Container $isArabic={isArabic}>
            <SectionTitle>
              {t("esuuq_v2.actions_title", "What do you need today?")}
            </SectionTitle>
            <ActionGrid>
              <ActionCard
                custom={0}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={cardVariants}
              >
                <ActionIcon>
                  <FaCamera />
                </ActionIcon>
                <ActionTitle>
                  {t("esuuq_v2.action_sell_title", "Sell it fast")}
                </ActionTitle>
                <ActionDesc>
                  {t(
                    "esuuq_v2.action_sell_desc",
                    "Snap a photo, set a price, and get offers from people nearby.",
                  )}
                </ActionDesc>
              </ActionCard>

              <ActionCard
                custom={1}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={cardVariants}
              >
                <ActionIcon>
                  <FaKey />
                </ActionIcon>
                <ActionTitle>
                  {t("esuuq_v2.action_rent_title", "Rent it out")}
                </ActionTitle>
                <ActionDesc>
                  {t(
                    "esuuq_v2.action_rent_desc",
                    "Have tools, gear, or space? Let others rent it safely.",
                  )}
                </ActionDesc>
              </ActionCard>

              <ActionCard
                custom={2}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={cardVariants}
              >
                <ActionIcon>
                  <FaSearch />
                </ActionIcon>
                <ActionTitle>
                  {t("esuuq_v2.action_request_title", "Ask the community")}
                </ActionTitle>
                <ActionDesc>
                  {t(
                    "esuuq_v2.action_request_desc",
                    "Looking for something specific? Just ask, and let sellers come to you.",
                  )}
                </ActionDesc>
              </ActionCard>
            </ActionGrid>
          </Container>
        </ActionsSection>

        {/* --- TRUST LAYER --- */}
        <TrustSection>
          <Container $isArabic={isArabic}>
            <TrustSplit>
              <TrustText $isArabic={isArabic}>
                <TrustIcon>
                  <FaUserShield />
                </TrustIcon>
                <SectionTitle style={{ marginBottom: "0.5rem" }}>
                  {t("esuuq_v2.trust_title", "Local & Trusted")}
                </SectionTitle>
                <HeroSub style={{ color: "#52525b", maxWidth: "100%" }}>
                  {t(
                    "esuuq_v2.trust_desc",
                    "Deal directly with verified people in your neighborhood through our secure chat. No middlemen, no hassle.",
                  )}
                </HeroSub>
              </TrustText>

              <CollageWrapper>
                <CollageImg
                  src={TechStoreImg}
                  className="img1"
                  alt="Tech Store"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                />
                <CollageImg
                  src={FashionImg}
                  className="img2"
                  alt="Fashion Store"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                />
                <CollageImg
                  src={ArtStoreImg}
                  className="img3"
                  alt="Art Store"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 0.8, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                />
              </CollageWrapper>
            </TrustSplit>
          </Container>
        </TrustSection>

        {/* --- BOTTOM CTA --- */}
        <BottomCTA>
          <Container $isArabic={isArabic}>
            <BottomTitle>
              {t("esuuq_v2.cta_bottom_title", "Ready to join the market?")}
            </BottomTitle>
            <ButtonRow>
              <StoreButton
                href={process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK}
                target="_blank"
                className="secondary"
                style={{ background: "#39A170", color: "#FFF", border: "none" }}
              >
                <FaGooglePlay /> Google Play
              </StoreButton>
              <StoreButton
                href="https://apps.apple.com/dz/app/esuuq/id6752300426?l=fr-FR"
                target="_blank"
                className="secondary"
              >
                <FaApple /> App Store
              </StoreButton>
            </ButtonRow>
          </Container>
        </BottomCTA>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default EsuuqPage;