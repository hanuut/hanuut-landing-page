import React, { useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 900;
  color: #fff;
  font-family: "Tajawal", sans-serif;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #a1a1aa;
  font-size: 1.1rem;
  font-family: "Cairo", sans-serif;
`;

const HorizontalRail = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PersonaCard = styled.div`
  min-width: 320px;
  flex: 1;
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #f07a48;
    transform: translateY(-5px);
  }
`;

const StepFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.02);
  padding: 1rem;
  border-radius: 12px;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  text-align: start;

  .label {
    font-size: 0.65rem;
    color: #71717a;
    text-transform: uppercase;
    font-weight: 800;
  }
  .val {
    font-size: 0.95rem;
    color: white;
    font-weight: 700;
    font-family: "Tajawal", sans-serif;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  color: #f07a48;
  font-weight: 800;
  font-size: 0.9rem;
`;

const CreativePossibilities = ({ products, onSelectCanvas }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const personas = useMemo(() => {
    if (!products || products.length === 0) return [];
    const getProduct = (keyword) =>
      products.find((p) => p.name?.toLowerCase().includes(keyword)) ||
      products[0];

    return [
      {
        title: t("pod_studio_brand_club"),
        desc: t("pod_studio_club_sub"),
        idea: isArabic ? "شعار النادي ⚽" : "Club Crest ⚽",
        productObj: getProduct("manches") || getProduct("long"),
      },
      {
        title: t("pod_studio_brand_merch"),
        desc: t("pod_studio_merch_sub"),
        idea: isArabic ? "ألبوم غنائي 💿" : "Album Art 💿",
        productObj: getProduct("hoodie"),
      },
      {
        title: t("pod_studio_brand_coffee"),
        desc: t("pod_studio_coffee_sub"),
        idea: isArabic ? "لوغو المقهى ☕" : "Cafe Logo ☕",
        productObj: getProduct("tote") || getProduct("bag"),
      },
    ];
  }, [products, t, isArabic]);

  if (personas.length === 0) return null;

  return (
    <Section $isArabic={isArabic}>
      <SectionHeader>
        <Title>{t("pod_studio_transformation_title")}</Title>
        <Subtitle>{t("pod_studio_transformation_subtitle")}</Subtitle>
      </SectionHeader>

      <HorizontalRail style={{ direction: isArabic ? "rtl" : "ltr" }}>
        {personas.map((p, idx) => (
          <PersonaCard key={idx} onClick={() => onSelectCanvas(p.productObj)}>
            <div>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#71717a",
                  textTransform: "uppercase",
                  fontWeight: 800,
                }}
              >
                {p.productObj?.name || "Premium Blank"}
              </span>
              <h3
                style={{
                  fontSize: "1.3rem",
                  margin: "4px 0",
                  color: "white",
                  fontFamily: "Tajawal",
                }}
              >
                {p.title}
              </h3>
              <p style={{ margin: 0, color: "#a1a1aa", fontSize: "0.9rem" }}>
                {p.desc}
              </p>
            </div>

            <StepFlow>
              <StepItem>
                <span className="label">{t("pod_studio_step_idea")}</span>
                <span className="val">{p.idea}</span>
              </StepItem>
              <div style={{ color: "#F07A48" }}>
                {isArabic ? (
                  <FaArrowLeft size={12} />
                ) : (
                  <FaArrowRight size={12} />
                )}
              </div>
              <StepItem>
                <span className="label">{t("pod_studio_step_blank")}</span>
                <span className="val">
                  {p.productObj?.name || "Premium Blank"}
                </span>
              </StepItem>
            </StepFlow>

            <ActionRow>
              <span>{t("pod_studio_start_designing_btn")}</span>
              {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
            </ActionRow>
          </PersonaCard>
        ))}
      </HorizontalRail>
    </Section>
  );
};

CreativePossibilities.propTypes = {
  products: PropTypes.array.isRequired,
  onSelectCanvas: PropTypes.func.isRequired,
};

export default CreativePossibilities;
