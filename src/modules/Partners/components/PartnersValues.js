import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SpotlightCard from "../../../components/SpotlightCard";
import { FaWifi, FaMagic, FaChartPie, FaLayerGroup } from "react-icons/fa";

const Section = styled.section`
  background-color: #000000; padding: 6rem 0; display: flex; justify-content: center; position: relative; overflow: hidden;
`;

const BackgroundGlow = styled.div`
  position: absolute; width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(57, 161, 112, 0.08) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none;
`;

const Container = styled.div` width: 90%; max-width: 1200px; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 4rem; `;
const Header = styled.div` text-align: center; max-width: 700px; `;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: ${(props) => props.theme.primaryColor}; margin-bottom: 1rem; font-family: "Tajawal", sans-serif;
  span { color: white; }
`;

const Subtitle = styled.p` font-size: 1.1rem; color: #a1a1aa; font-family: "Cairo", sans-serif; `;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; width: 100%; direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const CardInner = styled.div` display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; height: 100%; padding: 1rem 0.5rem; `;

const IconBox = styled.div`
  width: 50px; height: 50px; border-radius: 16px; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center;
  color: ${(props) => props.theme.primaryColor}; font-size: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1); transition: transform 0.3s ease;
  ${CardInner}:hover & { transform: scale(1.1); background: rgba(240, 122, 72, 0.15); color: #f07a48; }
`;

const CardTitle = styled.h3` font-size: 1.25rem; font-weight: 700; color: white; margin: 0; font-family: "Tajawal", sans-serif; `;
const CardDesc = styled.p` font-size: 0.95rem; color: #a1a1aa; line-height: 1.6; margin: 0; font-family: "Cairo", sans-serif; `;

const PartnersValues = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const values = [
    { icon: <FaWifi />, title: t("value_offline_title"), desc: t("value_offline_body") },
    { icon: <FaMagic />, title: t("value_marketing_title"), desc: t("value_marketing_body") },
    { icon: <FaChartPie />, title: t("value_analytics_title"), desc: t("value_analytics_body") },
    { icon: <FaLayerGroup />, title: t("value_ecosystem_title"), desc: t("value_ecosystem_body"), isComingSoon: true },
  ];

  return (
    <Section>
      <BackgroundGlow />
      <Container>
        <Header>
          <Title>{t("values_reality_title")}</Title>
          <Subtitle>{t("values_reality_subtitle")}</Subtitle>
        </Header>

        <Grid $isArabic={isArabic}>
          {values.map((val, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }} style={{ height: "100%" }}>
              <SpotlightCard>
                <CardInner>
                  <IconBox>{val.icon}</IconBox>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CardTitle>{val.title}</CardTitle>
                      {val.isComingSoon && <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: '#27272a', borderRadius: '4px', color: '#a1a1aa', fontWeight: 700, whiteSpace: 'nowrap'}}>{t("value_coming_soon")}</span>}
                    </div>
                    <div style={{ height: "10px" }} />
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