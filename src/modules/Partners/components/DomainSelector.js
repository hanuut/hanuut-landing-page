import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaUtensils, FaBarcode } from "react-icons/fa";

const Section = styled.section`
  padding: 6rem 0;
  background: #050505;
  color: white;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #18181b;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 800;
  font-family: 'Tajawal', sans-serif;
  color: white;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const GatewayCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  /* Top Accent Border */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => props.$color};
    opacity: 0.5;
    transition: opacity 0.3s;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: ${(props) => props.$color}80;
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    
    &::before {
      opacity: 1;
    }

    .explore-btn {
      color: ${(props) => props.$color};
      transform: ${(props) => props.$isArabic ? "translateX(-5px)" : "translateX(5px)"};
    }
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${(props) => props.$color}15;
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  font-family: 'Tajawal', sans-serif;
`;

const CardDesc = styled.p`
  font-size: 1.05rem;
  color: #a1a1aa;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  font-family: 'Cairo', sans-serif;
  flex-grow: 1;
`;

const ExploreText = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #71717a;
  font-family: 'Tajawal', sans-serif;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DomainSelector = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  const cards = [
    {
      route: "/restaurant",
      label: t("domain_food_label"),
      desc: t("domain_food_desc"),
      color: "#1D9E75",
      icon: <FaUtensils />
    },
    {
      route: "/epicerie",
      label: t("domain_grocery_label"),
      desc: t("domain_grocery_desc"),
      color: "#397FF9",
      icon: <FaBarcode />
    },
    {
      route: "/boutique",
      label: t("domain_global_label"),
      desc: t("domain_global_desc"),
      color: "#F07A48",
      icon: <FaShoppingBag />
    }
  ];

  return (
    <Section>
      <Container $isArabic={isArabic}>
        <SectionHeader>
          <Title>{t("gateway_title")}</Title>
        </SectionHeader>

        <Grid>
          {cards.map((card, index) => (
            <GatewayCard 
              key={index}
              $color={card.color}
              $isArabic={isArabic}
              onClick={() => {
                window.scrollTo(0,0);
                navigate(card.route);
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <IconWrapper $color={card.color}>
                {card.icon}
              </IconWrapper>
              <CardTitle>{card.label}</CardTitle>
              <CardDesc>{card.desc}</CardDesc>
              <ExploreText className="explore-btn">
                {t("gateway_btn")}
              </ExploreText>
            </GatewayCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default DomainSelector;