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

// --- 1. EXCHANGE NETWORK CANVAS (High Conversion 3D Effect) ---
const CanvasBackground = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: auto; /* Required to catch mouse movements */
  /* Add a subtle dark gradient to make the green richer and the white text pop */
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
`;

const ExchangeNetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    let particles = [];

    // Mouse object with a "pull" radius
    const mouse = { x: null, y: null, radius: 250 };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        // Z-axis simulates depth (1 is far, 3 is close)
        this.z = Math.random() * 2 + 1;

        this.baseX = this.x;
        this.baseY = this.y;

        // Slower, elegant floating movement
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;

        // Base size depends on depth
        this.size = this.z * 1.5;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + this.z * 0.1})`; // Closer = brighter
        ctx.fill();

        // Add a subtle glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
      }

      update() {
        // Natural floating
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Bounce off screen edges smoothly
        if (this.baseX < 0 || this.baseX > w) this.vx *= -1;
        if (this.baseY < 0 || this.baseY > h) this.vy *= -1;

        // --- INTERACTION: The Pull ---
        // Instead of scattering, nodes are pulled slightly toward the mouse
        // This guides the user's eye to wherever the mouse is (ideally the CTA)
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.baseX;
          const dy = mouse.y - this.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Calculate a gentle pull force
            const force = (mouse.radius - distance) / mouse.radius;
            // The closer the node (z), the more it reacts
            const pullX = dx * force * 0.05 * this.z;
            const pullY = dy * force * 0.05 * this.z;

            this.x = this.baseX + pullX;
            this.y = this.baseY + pullY;
          } else {
            // Smooth return to base position
            this.x += (this.baseX - this.x) * 0.05;
            this.y += (this.baseY - this.y) * 0.05;
          }
        } else {
          this.x = this.baseX;
          this.y = this.baseY;
        }

        this.draw();
      }
    }

    const init = () => {
      particles = [];
      // Number of particles based on screen size (keeps it performant)
      const numberOfParticles = (w * h) / 15000;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };

    // Draw connecting lines between close particles
    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If particles are close, draw a line
          // The line opacity depends on how close they are
          if (distance < 120) {
            const opacity = 1 - distance / 120;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    let animationFrame;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => p.update());
      connect(); // Call the connection function after updating positions
      animationFrame = requestAnimationFrame(render);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      // Adjust for scroll position so the effect stays true to the cursor
      mouse.y = e.clientY + window.scrollY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    resize();
    render();

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
  min-height: 85vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  position: relative;\n  background: ${(props) => props.theme.primaryColor};\n`;

const HeroContent = styled(motion.div)`
  position: relative;\n  z-index: 2;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 1.5rem;\n  padding: 0 1rem;
`;

const Badge = styled(motion.span)`
  background-color: #000;\n  color: #fff;\n  padding: 0.5rem 1.2rem;\n  border-radius: 50px;\n  font-weight: 700;\n  font-family: 'Tajawal', sans-serif;\n  font-size: 0.9rem;\n  box-shadow: 0 5px 15px rgba(0,0,0,0.2);\n`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4.5rem);\n  font-weight: 800;\n  color: #FFFFFF;\n  line-height: 1.2;\n  font-family: 'Tajawal', sans-serif;\n  margin: 0;\n  max-width: 800px;\n`;

const HeroSub = styled(motion.p)`
  font-size: 1.2rem;\n  color: #fdf4e3;\n  opacity: 0.9;\n  max-width: 600px;\n  line-height: 1.6;\n  font-family: 'Cairo', sans-serif;\n  font-weight: 500;\n`;

const ButtonRow = styled(motion.div)`
  display: flex;\n  gap: 1rem;\n  flex-wrap: wrap;\n  justify-content: center;\n  margin-top: 1rem;\n`;

const StoreButton = styled.a`
  display: inline-flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.9rem 1.8rem;\n  border-radius: 50px;\n  font-weight: 600;\n  font-size: 1rem;\n  cursor: pointer;\n  text-decoration: none;\n  transition: all 0.2s ease;\n  font-family: 'Tajawal', sans-serif;\n  box-shadow: 0 4px 15px rgba(0,0,0,0.1);\n\n  &.primary {\n    background: #000000;\n    color: #FFFFFF;\n    border: 1px solid #000000;\n    &:hover { transform: scale(1.03); }\n  }\n\n  &.secondary {\n    background: rgba(255, 255, 255, 0.9);\n    color: #000000;\n    border: 1px solid #E5E5E5;\n    &:hover { background: #FFFFFF; transform: scale(1.03); }\n  }\n\n  svg { font-size: 1.5rem; }\n`;

const Container = styled.div`
  max-width: 1200px;\n  width: 90%;\n  margin: 0 auto;\n  position: relative;\n  z-index: 10;\n  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};\n`;

// --- NEW ACTION GRID SECTION ---
const ActionsSection = styled.section`
  padding: 6rem 0;\n  background: ${(props) => props.theme.body};\n  text-align: center;\n`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);\n  font-weight: 800;\n  color: ${(props) => props.theme.text};\n  margin-bottom: 3rem;\n  font-family: 'Tajawal', sans-serif;\n`;

const ActionGrid = styled.div`
  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 2rem;\n  \n  @media (max-width: 900px) {\n    grid-template-columns: 1fr;\n  }\n`;

const ActionCard = styled(motion.div)`
  background: #FFFFFF;\n  border-radius: 24px;\n  padding: 3rem 2rem;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.04);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 1rem;\n  border: 1px solid rgba(0,0,0,0.02);\n  transition: transform 0.3s ease;\n\n  &:hover {\n    transform: translateY(-5px);\n    box-shadow: 0 20px 40px rgba(57, 161, 112, 0.1);\n  }\n`;

const ActionIcon = styled.div`
  width: 70px;\n  height: 70px;\n  border-radius: 20px;\n  background: rgba(57, 161, 112, 0.1);\n  color: ${(props) => props.theme.primaryColor};\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 2rem;\n  margin-bottom: 1rem;\n`;

const ActionTitle = styled.h3`
  font-size: 1.5rem;\n  font-weight: 800;\n  color: #111217;\n  font-family: 'Tajawal', sans-serif;\n  margin: 0;\n`;

const ActionDesc = styled.p`
  font-size: 1.05rem;\n  color: #666;\n  line-height: 1.6;\n  margin: 0;\n  font-family: 'Cairo', sans-serif;\n`;

// --- NEW TRUST SECTION ---
const TrustSection = styled.section`
  padding: 6rem 0;\n  background: #FFFFFF;\n  overflow: hidden;\n`;

const TrustSplit = styled.div`
  display: flex;\n  align-items: center;\n  gap: 4rem;\n  \n  @media (max-width: 900px) {\n    flex-direction: column;\n    text-align: center;\n  }\n`;

const TrustText = styled.div`
  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n  align-items: ${(props) => (props.$isArabic ? "flex-start" : "flex-start")};\n\n  @media (max-width: 900px) {\n    align-items: center;\n  }\n`;

const TrustIcon = styled.div`
  color: ${(props) => props.theme.primaryColor};\n  font-size: 3rem;\n`;

const CollageWrapper = styled.div`
  flex: 1;\n  position: relative;\n  width: 100%;\n  height: 450px;\n  \n  @media (max-width: 900px) {\n    height: 350px;\n    margin-top: 3rem;\n  }\n`;

const CollageImg = styled(motion.img)`
  position: absolute;\n  border-radius: 20px;\n  box-shadow: 0 20px 40px rgba(0,0,0,0.15);\n  object-fit: cover;\n  \n  &.img1 {\n    width: 60%;\n    height: 70%;\n    top: 0;\n    left: 0;\n    z-index: 2;\n  }\n  &.img2 {\n    width: 50%;\n    height: 60%;\n    bottom: 0;\n    right: 0;\n    z-index: 3;\n  }\n  &.img3 {\n    width: 40%;\n    height: 50%;\n    top: 10%;\n    right: 5%;\n    z-index: 1;\n    opacity: 0.8;\n  }\n`;

// --- BOTTOM CTA ---
const BottomCTA = styled.section`
  padding: 6rem 0;\n  background: #111217;\n  text-align: center;\n`;

const BottomTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);\n  font-weight: 800;\n  color: #FFFFFF;\n  margin-bottom: 2rem;\n  font-family: 'Tajawal', sans-serif;\n`;

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
