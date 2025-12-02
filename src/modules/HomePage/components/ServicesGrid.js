import React from "react";
import styled , { keyframes, css }from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaStore,
  FaHandshake,
  FaBriefcase,
} from "react-icons/fa";

// --- Import your GENERATED images here ---
// For now, using placeholders, but REPLACE these with your new generations
import VisionImg from "../../../assets/feats1.png";
import MarketImg from "../../../assets/feats2.jpeg";
import PartnerImg from "../../../assets/feats3.jpeg";
// --- 1. Physics & Animations ---

const singleRotateFade = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
    opacity: 0;
  }
`;

// --- 2. Layout Components ---

const Section = styled.section`
  padding: 4rem 0 8rem 0;
  background-color: #FDF4E3; /* Ivory */
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 92%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 400px 300px; 
  gap: 1.5rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const CardWrapper = styled(motion.div)`
  grid-column: ${(props) => props.$span || "span 1"};
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  height: 100%;
  
  @media (max-width: 900px) {
    grid-column: span 1 !important;
    height: 380px;
  }
`;

// --- 3. Visual Layers ---

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #e5e5e5; /* Loading placeholder color */
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Slower, smoother zoom */
  }

  /* Zoom effect on parent hover */
  ${CardWrapper}:hover img {
    transform: scale(1.15);
  }

  /* Scrim for text readability */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(0,0,0,0) 60%);
  }
    /* Hover State: Dark Mode */
  ${CardWrapper}:hover & {
     &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%);
  }
  }
`;

// The Content Box Container
const ContentBox = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  z-index: 2;
  
  padding: 1.5rem;
  border-radius: 20px;
  
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
  
  /* Initial State: White Glass with Blur */
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  
  /* Transition for Color Change (800ms) */
  transition: background-color 0.8s ease, border-color 0.8s ease;

  /* Hover State: Dark Mode */
  ${CardWrapper}:hover & {
    background-color: #111217; /* Black */
    border-color: #27272a; /* Dark Grey Border */
  }
`;

// The Border Beam Effect using CSS Masking
const BorderBeam = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5; /* On top of box background */
  border-radius: 20px;
  
  /* Masking Technique: Only show the 2px border area */
  padding: 2px; 
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  
  opacity: 0; 

  /* The Spinning Gradient Layer */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%; /* Oversized to cover rotation corners */
    aspect-ratio: 1;
    background: conic-gradient(
      from 0deg, 
      transparent 0%, 
      transparent 70%, 
      ${(props) => props.$color} 100%
    );
    transform: translate(-50%, -50%);
  }

  /* Animate on Hover */
  ${CardWrapper}:hover & {
    opacity: 1;
  }
  
  ${CardWrapper}:hover &::before {
    animation: ${singleRotateFade} 0.8s linear forwards;
  }
`;

// Inner content container to sit above any background layers
const ContentInner = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
`;

const IconBadge = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  transition: all 0.8s ease;
  
  /* Keep icon visible on dark background */
  ${CardWrapper}:hover & {
     background: rgba(255,255,255,0.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 800;
  color: #111217;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  transition: color 0.8s ease;

  ${CardWrapper}:hover & {
    color: #FFFFFF;
  }
`;

const CardDesc = styled.p`
  font-size: 0.95rem;
  color: #52525b;
  line-height: 1.5;
  margin: 0;
  transition: color 0.8s ease;

  ${CardWrapper}:hover & {
    color: #a1a1aa; /* Light Grey for readability on black */
  }
`;

const ActionLink = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  transition: all 0.8s ease;

  svg {
    transition: transform 0.2s;
  }
  ${CardWrapper}:hover & svg {
    transform: translateX(5px);
  }
`;

const ServicesGrid = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
 const handleSmartRedirect = () => {
    // 1. Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 2. Wait 1s, then open link
    setTimeout(() => {
      const link = process.env.REACT_APP_HANUUT_CUSTOMER_DOWNLOAD_LINK;
      if (link) window.open(link, "_blank");
    }, 1000);
  };

  const cards = [
    {
      id: "vision",
      span: "span 2",
      title: t("home_vision_title"),
      desc: t("home_vision_desc"),
      image: VisionImg,
      icon: <FaStore />,
      accentColor: "#39A170", // Green
      iconBg: "rgba(57, 161, 112, 0.1)",
      action: handleSmartRedirect,
    },
    {
      id: "market",
      span: "span 1",
      title: t("home_market_title"),
      desc: t("home_market_desc"),
      image: MarketImg,
      icon: <FaHandshake />,
      accentColor: "#39A170", // Green
      iconBg: "rgba(57, 161, 112, 0.1)",
      action: handleSmartRedirect,
    },
    {
      id: "partner",
      span: "span 3", 
      title: t("home_partner_title"),
      desc: t("home_partner_desc"),
      image: PartnerImg,
      icon: <FaBriefcase />,
      accentColor: "#F07A48", // Orange
      iconBg: "rgba(240, 122, 72, 0.1)",
      link: "/partners",
      cta: t("aboutUsCtaButton"), // "Partner with us"
    },
  ];

  return (
     <Section>
      <Container>
        <Grid $isArabic={isArabic}>
          {cards.map((c, i) => {
            // Render Content Helper
            const CardContentBlock = (
              <CardWrapper
                $span={c.span}
                // If it has an action, attach click handler
                onClick={c.action ? c.action : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <BackgroundImage>
                  <img src={c.image} alt={c.title} loading="lazy" />
                </BackgroundImage>

                <ContentBox>
                  <BorderBeam $color={c.accentColor} />
                  <ContentInner>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                      <IconBadge $bg={c.iconBg} $color={c.accentColor}>
                        {c.icon}
                      </IconBadge>
                      <CardTitle>{c.title}</CardTitle>
                    </div>
                    <CardDesc>{c.desc}</CardDesc>
                    <ActionLink $color={c.accentColor}>
                      {c.cta || t("btn_explore")}
                      {isArabic ? <FaArrowRight style={{ transform: "rotate(180deg)" }} /> : <FaArrowRight />}
                    </ActionLink>
                  </ContentInner>
                </ContentBox>
              </CardWrapper>
            );

            // Conditional Rendering: Link vs Div
            return c.link ? (
              <Link to={c.link} key={c.id} style={{ display: "contents" }}>
                {CardContentBlock}
              </Link>
            ) : (
              <React.Fragment key={c.id}>
                {CardContentBlock}
              </React.Fragment>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
};

export default ServicesGrid;