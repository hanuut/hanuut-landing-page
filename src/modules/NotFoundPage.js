import React from "react";
import styled from "styled-components";
import Oops from "../assets/404illustration.png"; // Make sure this is the correct path
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// --- Styled Components for the Redesigned Page ---

const Section = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* --- THE FIX: Blurred background image --- */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${Oops});
    background-size: cover;
    background-position: center;
    filter: blur(3px) brightness(0.9); /* Your requested effect */
    transform: scale(1.1); /* Prevent blurred edges */
    z-index: 1;
  }
`;

const ContentCard = styled.div`
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 500px;
  padding: 3rem;
  text-align: center;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  /* Glassmorphism effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.defaultRadius};
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxl};
  font-weight: 900;
  text-shadow: 0px 0px 10px rgba(24, 19, 19, 0.5) ;
  color: #ff002bff;
  font-family: 'Cairo Variable', sans-serif;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: ${(props) => props.theme.fontxl};
  color: rgba(255, 255, 255, 1);
  text-shadow: 0px 0px 10px rgba(24, 19, 19, 0.5) ;
  line-height: 1.6;
  margin-bottom: 2.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap; /* Allow buttons to wrap on small screens */
`;

// --- THE FIX: New Outlined Button Style ---
const ActionButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: transparent;
  color: #FFFFFF;
  border: 2px solid #FFFFFF;

  &:hover {
    background-color: #FFFFFF;
    color: ${(props) => props.theme.text};
  }
`;

const PrimaryButton = styled(ActionButton)`
  background-color: ${(props) => props.theme.primaryColor};
  border-color: ${(props) => props.theme.primaryColor};
  color: #FFFFFF;

  &:hover {
    background-color: ${(props) => props.theme.primaryColor};
    opacity: 0.9;
  }
`;


const NotFoundPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // --- THE FIX: Check if we are on a shop page ---
  const isShopPage = /^\/(@[^/]+|shop\/[^/]+)$/.test(location.pathname);

  const handleTryAgain = () => {
    // A simple page reload is the most effective way to "try again"
    window.location.reload();
  };

  return (
    <Section>
      <ContentCard isArabic={i18n.language === "ar"}>
        <Title>{t("404Title")}</Title>
        <Text>{t("404Text")}</Text>
        <ButtonGroup>
          {/* --- THE FIX: Conditionally render the "Try Again" button --- */}
          {isShopPage && (
            <PrimaryButton onClick={handleTryAgain}>
              {t("try_again_button")}
            </PrimaryButton>
          )}
          <Link to="/">
            <ActionButton> {t("404Button")} </ActionButton>
          </Link>
        </ButtonGroup>
      </ContentCard>
    </Section>
  );
};

export default NotFoundPage;