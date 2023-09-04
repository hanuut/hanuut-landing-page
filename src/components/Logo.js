import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
const Section = styled.h1`
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: 900;
  letter-spacing: 1px;
  color: ${(props) => props.theme.primaryColor};
  cursor: default;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const Logo = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Link to="/">
      <Section isArabic={isArabic} href="/">
        {t("appTitle")}
      </Section>
    </Link>
  );
};

export default Logo;
