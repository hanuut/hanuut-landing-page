import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import HanuutLogo from "../assets/hanuutLogo.webp"; // Using the small, simple logo

const MinimalFooterWrapper = styled.footer`
  width: 100%;
  padding: 1.5rem 0;
  background-color: #050505;
  color: #a1a1aa;
  border-top: 1px solid #27272a;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
`;

const Container = styled.div`
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
  font-weight: 500;

  a {
    color: #a1a1aa;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: #ffffff;
    }
  }
`;

const PoweredBy = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #a1a1aa;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
  
  &:hover {
    color: #ffffff;
  }

  img {
    height: 24px;
    width: auto;
  }

  @media (max-width: 768px) {
    order: -1; /* Move to the top on mobile */
  }
`;

const MinimalFooter = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <MinimalFooterWrapper isArabic={isArabic}>
      <Container>
        <LinksContainer>
          <span>© {new Date().getFullYear()} Hanuut</span>
          <Link to="/privacy">{t("footer.link_privacy")}</Link>
          <Link to="/terms_and_conditions">{t("footer.link_terms")}</Link>
        </LinksContainer>
        
        <PoweredBy to="/">
          <span>Powered</span>
          <img src={HanuutLogo} alt="Hanuut" />
        </PoweredBy>
      </Container>
    </MinimalFooterWrapper>
  );
};

export default MinimalFooter;