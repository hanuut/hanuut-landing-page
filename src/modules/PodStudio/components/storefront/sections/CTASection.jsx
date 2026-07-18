import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const CTAContainer = styled.section`
  width: 100%;
  padding: 6rem 2rem;
  background-color: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const CTASection = ({ onStartDesign }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <CTAContainer $isArabic={isArabic}>
      <h2
        style={{
          fontSize: "2.5rem",
          margin: 0,
          color: "white",
          fontFamily: "Tajawal",
        }}
      >
        {t("pod_studio_ready_to_create")}
      </h2>
      <p
        style={{
          color: "#a1a1aa",
          maxWidth: "500px",
          margin: 0,
          fontFamily: "Cairo",
          lineHeight: 1.6,
        }}
      >
        {t("pod_studio_ready_cta_sub")}
      </p>
      <button
        onClick={onStartDesign}
        style={{
          marginTop: "1rem",
          background: "#fff",
          color: "#000",
          border: "none",
          padding: "1rem 2rem",
          borderRadius: "50px",
          fontWeight: 800,
          fontSize: "1rem",
          cursor: "pointer",
          fontFamily: "Tajawal",
        }}
      >
        {t("pod_studio_start_designing_cta")}
      </button>
    </CTAContainer>
  );
};

CTASection.propTypes = {
  onStartDesign: PropTypes.func.isRequired,
};

export default CTASection;
