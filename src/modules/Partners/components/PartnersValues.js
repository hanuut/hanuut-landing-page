import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SpotlightCard from "../../../components/SpotlightCard";
import { FaWifi, FaMagic, FaChartPie } from "react-icons/fa";

// --- Styled Components ---

const Section = styled.section`
  background-color: rgba(0, 0, 0, 1);
  padding: 6rem 0;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(
    circle,
    rgba(57, 161, 112, 0.08) 0%,
    transparent 70%
  );
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
  font-weight: 1000;
  color: ${(props) => props.theme.primaryColor};
  margin-bottom: 1rem;
  font-family: "Tajawal", sans-serif;

  span {
    color: ${(props) => props.theme.text};
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #68686fff;
  font-family: "Cairo", sans-serif;
  font-family: "Tajawal", sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// Inner content of the spotlight card
const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  height: 100%;
  padding: 1rem 0.5rem;
`;

const IconBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.primaryColor};
  font-size: 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;

  ${CardInner}:hover & {
    transform: scale(1.1);
    background: rgba(240, 122, 72, 0.15); /* Orange hint on hover */
    color: #f07a48;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
`;

const CardDesc = styled.p`
  font-size: 1.05rem;
  color: #a1a1aa;
  line-height: 1.6;
  margin: 0;
  font-family: "Cairo", sans-serif;
`;

const PartnersValues = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const values = [
    {
      icon: <FaWifi />,
      title: t("value_offline_title"),
      desc: t("value_offline_desc"),
    },
    {
      icon: <FaMagic />,
      title: t("value_marketing_title"),
      desc: t("value_marketing_desc"),
    },
    {
      icon: <FaChartPie />,
      title: t("value_analytics_title"),
      desc: t("value_analytics_desc"),
    },
  ];

  return (
    <Section>
      <BackgroundGlow />
      <Container>
        <Header>
          <Title>{t("partnersValues_sectionTitle")}</Title>
          <Subtitle>{t("partnersValues_subtitle")}</Subtitle>
        </Header>

        <Grid $isArabic={isArabic}>
          {values.map((val, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              style={{ height: "100%" }}
            >
              <SpotlightCard>
                <CardInner>
                  <IconBox>{val.icon}</IconBox>
                  <div>
                    <CardTitle>{val.title}</CardTitle>
                    <div style={{ height: "12px" }} />
                    <CardDesc>{val.desc}</CardDesc>
                  </div>
                </CardInner>
              </SpotlightCard>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default PartnersValues;
