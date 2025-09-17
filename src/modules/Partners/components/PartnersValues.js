import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

// Ensure these asset paths are correct relative to the component's location
import IncreasingArrow from "../../../assets/increasingArrow.svg";
import Megaphone from "../../../assets/megaphone.svg";
import Organize from "../../../assets/organize.svg";

// --- Styled Components ---

const ValuesSection = styled.section`
  width: 100%;
  padding: 6rem 0;
  background-color: ${(props) => props.theme.body}; // Light background for contrast
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: ${(props) => props.theme.text};
  text-align: center;
`;

const CardsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch; // Makes cards equal height
  justify-content: center;
  gap: 2rem;

  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ValueCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: ${(props) => props.theme.defaultRadius};
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.07);
  }

  @media (max-width: 992px) {
    width: 100%;
    max-width: 500px;
  }
`;

const Icon = styled.img`
  width: 3rem;
  height: 3rem;
`;

const CardTitle = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  font-weight: 600;
  color: ${(props) => props.theme.text};
`;

const CardDescription = styled.p`
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
  line-height: 1.6;
`;

const PartnersValues = () => {
  const { t, i18n } = useTranslation();

  return (
    <ValuesSection>
      <Container isArabic={i18n.language === "ar"}>
        <SectionTitle>{t("partnersValues_sectionTitle")}</SectionTitle>
        <CardsContainer>
          <ValueCard>
            <Icon src={Megaphone} alt="Megaphone Icon" />
            <CardTitle>{t("partnersValue1_title")}</CardTitle>
            <CardDescription>{t("partnersValue1_description")}</CardDescription>
          </ValueCard>

          <ValueCard>
            <Icon src={Organize} alt="Organize Icon" />
            <CardTitle>{t("partnersValue2_title")}</CardTitle>
            <CardDescription>{t("partnersValue2_description")}</CardDescription>
          </ValueCard>

          <ValueCard>
            <Icon src={IncreasingArrow} alt="Increasing Arrow Icon" />
            <CardTitle>{t("partnersValue3_title")}</CardTitle>
            <CardDescription>{t("partnersValue3_description")}</CardDescription>
          </ValueCard>
        </CardsContainer>
      </Container>
    </ValuesSection>
  );
};

export default PartnersValues;