import { useRef, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";

import { motion, useScroll, useTransform } from "framer-motion";
import { FaApple, FaArrowLeft, FaArrowRight, FaGooglePlay, FaQuoteRight } from "react-icons/fa";
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

// --- 1. DIGITAL GRASS CANVAS (Low Hardware Usage) ---
const CanvasBackground = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: auto;
`;

const DigitalGrass = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    let blades = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    };

    class Blade {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.length = Math.random() * 15 + 10; // Shorter grass
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.01 + Math.random() * 0.02; // Slower swaying
        this.opacity = 0.1; // Default low opacity
      }

      draw(time) {
        // Natural swaying logic (smaller movement)
        const sway = Math.sin(time * this.speed + this.x) * 2;

        // Interaction logic for both opacity and movement
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let moveX = 0;
        let targetOpacity = 0.1;

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          moveX = (dx / dist) * force * -20; // Gentler push
          targetOpacity = 0.1 + force * 0.5; // Ramp up to 0.6
        }
        
        // Smoothly interpolate opacity towards the target
        this.opacity += (targetOpacity - this.opacity) * 0.1;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + sway + moveX, this.y - this.length);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`; // Use dynamic opacity
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }


    const init = () => {
      blades = [];
      const spacing = 20; // Denser grid
      for (let x = -spacing; x < w + spacing; x += spacing) {
        for (let y = h + 10; y > -20; y -= spacing) {
          blades.push(new Blade(x, y));
        }
      }
    };

    let animationFrame;
    const render = (time) => {
      ctx.clearRect(0, 0, w, h);
      const t = time * 0.001;
      blades.forEach((b) => b.draw(t));
      animationFrame = requestAnimationFrame(render);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove); // Listen on canvas
    resize();
    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
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
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
  font-family: 'Tajawal', sans-serif;
  margin: 0;
  max-width: 800px;
`;

const HeroSub = styled(motion.p)`
  font-size: 1.2rem;
  color: #fdf4e3; /* Light Ivory text for better contrast on green */
  opacity: 0.9;
  max-width: 550px;
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

const GridSection = styled.section`
  padding: 8rem 0;
  position: relative;
  background: #FDF4E3;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;
// ... (The rest of your styled-components: MasonryGrid, Column, TextCard etc. remain unchanged)

const MasonryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const Column = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TextCard = styled(motion.div)`
  background: #FFFFFF;
  padding: 2.5rem;
  border-radius: 32px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 280px;
  border: 1px solid rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${(props) => props.$accent || "#39A170"};
  }
`;

const CardIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${(props) => props.$accent || "#39A170"};
  background: ${(props) => props.$bg || "rgba(57, 161, 112, 0.1)"};
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  font-family: "Tajawal", sans-serif;
  margin-bottom: 1rem;
  color: #111217;
  line-height: 1.2;
`;
const CardDesc = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #52525b;
  font-family: "Cairo", sans-serif;
`;
const ImageCard = styled(motion.div)`
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.1);
  background: transparent;
  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  &:hover img {
    transform: scale(1.03);
  }
`;

// --- COMPONENT ---

const EsuuqPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [50, -200]);

  return (
    <ThemeProvider theme={esuuqTheme}>
      <PageWrapper>
        <Seo 
          title={t("seo_esuuq_title")}
          description={t("seo_esuuq_desc")}
          url="https://hanuut.com/esuuq"
        />
        
        {/* --- HERO SECTION WITH CANVAS --- */}
        <HeroSection>
          <DigitalGrass />
          <HeroContent>
            <Badge initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              ✨ {t("nav_esuuq")}
            </Badge>
            <HeroTitle initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              {t("esuuq_hero_title")}
            </HeroTitle>
            <HeroSub initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              {t("esuuq_hero_sub")}
            </HeroSub>

            <ButtonRow initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <StoreButton href={process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK} target="_blank" className="primary">
                <FaGooglePlay /> Google Play
              </StoreButton>
              <StoreButton href="https://apps.apple.com/dz/app/esuuq/id6752300426?l=fr-FR" target="_blank" className="secondary">
                <FaApple /> App Store
              </StoreButton>
            </ButtonRow>
          </HeroContent>
        </HeroSection>

        {/* --- MOVING GRID SECTION --- */}
        <GridSection ref={containerRef}>
          <Container $isArabic={isArabic}>
            <MasonryGrid>
              <Column style={{ y: y1 }}>
                <ImageCard initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <img src={TechStoreImg} alt="Tech Store" />
                </ImageCard>
                <TextCard $accent="#39A170" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <CardIcon $bg="rgba(57, 161, 112, 0.1)"><FaQuoteRight /></CardIcon>
                  <CardTitle>{t("pain_trust_title")}</CardTitle>
                  <CardDesc>{t("pain_trust_text")}</CardDesc>
                </TextCard>
              </Column>
              <Column style={{ y: y2 }}>
                <TextCard $accent="#F07A48" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                  <CardIcon $accent="#F07A48" $bg="rgba(240, 122, 72, 0.1)">
                    <FaArrowRight style={{ transform: isArabic ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </CardIcon>
                  <CardTitle>{t("pain_clutter_title")}</CardTitle>
                  <CardDesc>{t("pain_clutter_text")}</CardDesc>
                </TextCard>
                <ImageCard initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                  <img src={ArtStoreImg} alt="Home Decor" />
                </ImageCard>
              </Column>
              <Column style={{ y: y3 }}>
                <ImageCard initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <img src={FashionImg} alt="Fashion Store" />
                </ImageCard>
                <TextCard $accent="#397FF9" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <CardIcon $accent="#397FF9" $bg="rgba(57, 127, 249, 0.1)">
                    <FaArrowLeft style={{ transform: isArabic ? "rotate(180deg)" : "rotate(0deg)" }}/>
                  </CardIcon>
                  <CardTitle>{t("pain_delivery_title")}</CardTitle>
                  <CardDesc>{t("pain_delivery_text")}</CardDesc>
                </TextCard>
              </Column>
            </MasonryGrid>
          </Container>
        </GridSection>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default EsuuqPage;