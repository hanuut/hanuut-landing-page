import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaChartLine, FaLayerGroup, FaBullhorn } from "react-icons/fa";

// --- Styled Components ---

const Section = styled.section`
  background-color: #050505;
  padding: 6rem 0;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

/* Background Mesh Gradient (Subtle) */
const BackgroundGlow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(240, 122, 72, 0.05) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1200px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
`;

const Header = styled.div`
  text-align: center;
  max-width: 700px;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  font-family: 'Tajawal', sans-serif;
  
  span {
    color: #F07A48; /* Partner Orange */
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// --- Holographic Card ---
const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;

  /* Hover Effect: Orange Border Glow */
  &:hover {
    border-color: rgba(240, 122, 72, 0.3);
    transform: translateY(-5px);
  }

  /* Inner Glow on Hover */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(
      800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
      rgba(240, 122, 72, 0.06), 
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const IconBox = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(240, 122, 72, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F07A48;
  font-size: 1.5rem;
  border: 1px solid rgba(240, 122, 72, 0.2);
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  font-family: 'Tajawal', sans-serif;
`;

const CardDesc = styled.p`
  font-size: 1.05rem;
  color: #a1a1aa; /* Zinc 400 */
  line-height: 1.6;
  margin: 0;
`;

const PartnersValues = () => {
  const { t, i18n } = useTranslation();

  const values = [
    {
      icon: <FaBullhorn />,
      title: t("partnersValue1_title") || "Expand Reach",
      desc: t("partnersValue1_description") || "Your customers are online. Put your shop in their pockets and receive orders from anywhere."
    },
    {
      icon: <FaLayerGroup />,
      title: t("partnersValue2_title") || "Simplify Operations",
      desc: t("partnersValue2_description") || "Control inventory, orders, and sales from a single, unified dashboard."
    },
    {
      icon: <FaChartLine />,
      title: t("partnersValue3_title") || "Grow Business",
      desc: t("partnersValue3_description") || "Use real data and analytics to understand customers and boost profits."
    }
  ];

  return (
    <Section>
      <BackgroundGlow />
      <Container dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        
        <Header>
          <Title>{t("partnersValues_sectionTitle") || "Why"} <span>{t("myHanuutTitle") || "My Hanuut"}</span>?</Title>
        </Header>

        <Grid>
          {values.map((val, index) => (
            <Card 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <IconBox>{val.icon}</IconBox>
              <div>
                <CardTitle>{val.title}</CardTitle>
                <div style={{ height: '10px' }} />
                <CardDesc>{val.desc}</CardDesc>
              </div>
            </Card>
          ))}
        </Grid>

      </Container>
    </Section>
  );
};

export default PartnersValues;