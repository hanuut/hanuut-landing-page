import React from "react";
import styled from "styled-components";
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

const Section = styled.section`
  padding: 4rem 0 6rem 0;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 400px 300px; /* Row 1 Tall, Row 2 Short */
  gap: 1.5rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto; /* Stack on mobile */
  }
`;

const CardWrapper = styled(motion.div)`
  grid-column: ${(props) => props.$span || "span 1"};
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 900px) {
    grid-column: span 1 !important;
    height: 350px;
  }
`;

// The Background Image Layer
const BackgroundImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${CardWrapper}:hover img {
    transform: scale(1.05);
  }

  /* Scrim to ensure text readability regardless of image */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0) 50%
    );
  }
`;

// The Glassmorphic Text Container
const ContentOverlay = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  z-index: 2;

  /* High opacity white glass */
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 1.5rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;

  /* Theme Border Accents */
  border-left: ${(props) =>
    props.$isArabic ? "none" : `4px solid ${props.$accentColor}`};
  border-right: ${(props) =>
    props.$isArabic ? `4px solid ${props.$accentColor}` : "none"};
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
  font-size: 1.4rem;
  font-weight: 800;
  color: #111217;
  margin: 0;
  font-family: "Tajawal", sans-serif;
`;

const CardDesc = styled.p`
  font-size: 0.95rem;
  color: #52525b;
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

  const cards = [
    {
      id: "vision",
      span: "span 2",
      title: t("home_vision_title"),
      desc: t("home_vision_desc"),
      image: VisionImg,
      icon: <FaStore />,
      // Green Theme
      accentColor: "#39A170",
      iconBg: "rgba(57, 161, 112, 0.1)",
      link: "#", // Or search
    },
    {
      id: "market",
      span: "span 1",
      title: t("home_market_title"),
      desc: t("home_market_desc"),
      image: MarketImg,
      icon: <FaHandshake />,
      // Green/Blue Theme
      accentColor: "#39A170",
      iconBg: "rgba(57, 161, 112, 0.1)",
      link: "#",
    },
    {
      id: "partner",
      span: "span 3", // Full width bottom
      title: t("home_partner_title"),
      desc: t("home_partner_desc"),
      image: PartnerImg,
      icon: <FaBriefcase />,
      // Orange Theme
      accentColor: "#F07A48",
      iconBg: "rgba(240, 122, 72, 0.1)",
      link: "/partners",
      cta: t("btn_partner_join"),
    },
  ];

  return (
    <Section>
      <Container>
        <Grid $isArabic={isArabic}>
          {cards.map((c, i) => (
            <Link to={c.link} key={c.id} style={{ display: "contents" }}>
              <CardWrapper
                $span={c.span}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <BackgroundImage>
                  <img src={c.image} alt={c.title} />
                </BackgroundImage>

                <ContentOverlay
                  $accentColor={c.accentColor}
                  $isArabic={isArabic}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <IconCircle $bg={c.iconBg} $color={c.accentColor}>
                      {c.icon}
                    </IconCircle>
                    <CardTitle>{c.title}</CardTitle>
                  </div>

                  <CardDesc>{c.desc}</CardDesc>

                  <ActionLink $color={c.accentColor}>
                    {c.cta || t("btn_explore")}
                    {isArabic ? (
                      <FaArrowRight style={{ transform: "rotate(180deg)" }} />
                    ) : (
                      <FaArrowRight />
                    )}
                  </ActionLink>
                </ContentOverlay>
              </CardWrapper>
            </Link>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

// Helper styled component for the icon inside the card
const IconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

export default ServicesGrid;
