import React from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaStore,
  FaShoppingBag,
  FaArrowLeft,
} from "react-icons/fa";

// Using placeholders mapped to new logic
import VisionImg from "../../../assets/feats1.png"; // For E'SUUQ
import PartnerImg from "../../../assets/feats3.jpeg"; // For My Hanuut

// --- Animations (Preserved) ---
const singleRotateFade = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
  100% { transform: translate(-50%, -50%) rotate(360deg); opacity: 0; }
`;

// --- Styled Components (Preserved) ---
const Section = styled.section`
  padding: 4rem 0 8rem 0;
  background-color: #fdf4e3; /* Ivory */
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

// Update Grid to be 2 Columns specifically for the Hub
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 50/50 Split */
  grid-template-rows: 450px; /* Taller cards */
  gap: 2rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const CardWrapper = styled(motion.div)`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  height: 100%;

  @media (max-width: 900px) {
    height: 400px;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #e5e5e5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  ${CardWrapper}:hover img {
    transform: scale(1.15);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    /* Darker gradient for better text contrast */
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0) 60%
    );
  }
`;

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

  /* Initial State: White Glass */
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition:
    background-color 0.8s ease,
    border-color 0.8s ease;

  ${CardWrapper}:hover & {
    background-color: #111217;
    border-color: #27272a;
  }
`;

const BorderBeam = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  border-radius: 20px;
  padding: 2px;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  opacity: 0;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    aspect-ratio: 1;
    background: conic-gradient(
      from 0deg,
      transparent 0%,
      transparent 70%,
      ${(props) => props.$color} 100%
    );
    transform: translate(-50%, -50%);
  }

  ${CardWrapper}:hover & {
    opacity: 1;
  }
  ${CardWrapper}:hover &::before {
    animation: ${singleRotateFade} 0.8s linear forwards;
  }
`;

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
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff; /* Always white due to dark gradient */
  margin: 0;
  font-family: "Tajawal", sans-serif;
`;

const CardDesc = styled.p`
  font-size: 1rem;
  color: #e4e4e7;
  line-height: 1.5;
  margin: 0;
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
    transform: ${(props) =>
      props.$isArabic ? "translateX(-5px)" : "translateX(5px)"};
  }
`;

const ServicesGrid = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Data for the 2 Split Cards
  const cards = [
    {
      id: "esuuq",
      title: t("nav_esuuq") || "E'SUUQ Marketplace",
      desc:
        t("card_consumer_desc") ||
        "Buy from trusted shops or sell your used items.",
      image: VisionImg,
      icon: <FaShoppingBag />,
      accentColor: "#39A170", // Green
      iconBg: "rgba(57, 161, 112, 0.2)",
      link: "/esuuq",
      cta: t("card_consumer_btn") || "Explore E'SUUQ",
    },
    {
      id: "partners",
      title: t("navPartners") || "My Hanuut",
      desc:
        t("card_business_desc") || "Digitize your shop and manage inventory.",
      image: PartnerImg,
      icon: <FaStore />,
      accentColor: "#F07A48", // Orange
      iconBg: "rgba(240, 122, 72, 0.2)",
      link: "/partners",
      cta: t("card_business_btn") || "Explore Solutions",
    },
  ];

  return (
    <Section>
      <Container>
        <Grid $isArabic={isArabic}>
          {cards.map((c, i) => (
            <Link to={c.link} key={c.id} style={{ display: "contents" }}>
              <CardWrapper
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <IconBadge $bg={c.iconBg} $color={c.accentColor}>
                        {c.icon}
                      </IconBadge>
                      <CardTitle>{c.title}</CardTitle>
                    </div>
                    <CardDesc>{c.desc}</CardDesc>
                    <ActionLink $color={c.accentColor} $isArabic={isArabic}>
                      {c.cta}
                      {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
                    </ActionLink>
                  </ContentInner>
                </ContentBox>
              </CardWrapper>
            </Link>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default ServicesGrid;
