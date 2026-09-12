// modules/Tawsila/components/TawsilaPreFooter.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Section = styled.section`
  width: 100%;
  padding: 5rem 0;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  border-top: 1px solid #e2e8f0;
`;

const Container = styled(motion.div)`
  max-width: 800px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  z-index: 2;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const Title = styled.h2`
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  font-weight: 900;
  color: #0f172a;
  line-height: 1.25;
  font-family: var(--font-primary, "Tajawal"), sans-serif;

  span {
    color: #00875f;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0;
  line-height: 1.6;
`;

const ActionBtn = styled.button`
  background-color: #00875f;
  color: #ffffff;
  padding: 1rem 2.25rem;
  border-radius: 9999px;
  font-size: 1.05rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(0, 135, 95, 0.25);
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background-color: #006847;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 135, 95, 0.35);
  }
`;

const TawsilaPreFooter = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === "ar";

  return (
    <Section>
      <Container
        $isArabic={isArabic}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Title>
          {t("prefooter_title", "Prêt à partager vos déplacements ?")} <br />
          <span>{t("prefooter_subtitle", "Rejoignez la communauté Abrid à Béjaïa.")}</span>
        </Title>
        <Subtitle>
          {t("prefooter_desc", "Participez au projet pilote pour fluidifier les trajets du quotidien.")}
        </Subtitle>
        <ActionBtn onClick={() => navigate("/abridh/drive")}>
          <span>{t("abrid_btn_captain", "Devenir Capitaine")}</span>
          {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
        </ActionBtn>
      </Container>
    </Section>
  );
};

export default TawsilaPreFooter;