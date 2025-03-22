import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

/**
 * Loading component designed to match Hanuut's brand style
 *
 * Used as a fallback UI for Suspense boundaries, showing a visually
 * appealing loading indicator while components or resources load.
 *
 * @component
 */
const Loading = ({
  message = "",
  logoSrc = null,
  appName = "Hanuut",
  fullscreen = true,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Default message if not provided
  const loadingMessage = message || t("loading.message") || "Loading...";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
  };

  return (
    <Container
      fullscreen={fullscreen}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      isArabic={isArabic}
    >
      <Card variants={itemVariants}>
        <Spinner variants={itemVariants} />
        <LoadingText variants={itemVariants}>{loadingMessage}</LoadingText>
      </Card>
    </Container>
  );
};

Loading.propTypes = {
  /** Custom loading message to display */
  message: PropTypes.string,

  /** Optional logo source URL */
  logoSrc: PropTypes.string,

  /** App name for fallback logo display */
  appName: PropTypes.string,

  /** Whether to display as fullscreen or inline */
  fullscreen: PropTypes.bool,
};

// Styled Components
const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${({ fullscreen }) => (fullscreen ? "100vh" : "100%")};
  min-height: ${({ fullscreen }) => (fullscreen ? "100vh" : "400px")};
  background-color: ${({ fullscreen }) =>
    fullscreen ? "rgba(249, 250, 251, 0.95)" : "transparent"};
  position: ${({ fullscreen }) => (fullscreen ? "fixed" : "relative")};
  top: 0;
  left: 0;
  z-index: ${({ fullscreen }) => (fullscreen ? 1000 : 1)};
  backdrop-filter: ${({ fullscreen }) => (fullscreen ? "blur(5px)" : "none")};
  direction: ${({ isArabic }) => (isArabic ? "rtl" : "ltr")};
`;

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  width: 90%;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

// const Logo = styled(motion.div)`
//   width: 70px;
//   height: 70px;
//   margin-bottom: 24px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: ${(props) => props.theme?.primaryColor || "#4F46E5"};
//   border-radius: 20%;
//   box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);

//   @media (max-width: 768px) {
//     width: 60px;
//     height: 60px;
//     margin-bottom: 20px;
//   }
// `;

// const LogoImage = styled.img`
//   width: 60%;
//   height: auto;
// `;

// const LogoText = styled.span`
//   color: white;
//   font-size: 36px;
//   font-weight: 700;

//   @media (max-width: 768px) {
//     font-size: 30px;
//   }
// `;

const Spinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(79, 70, 229, 0.2);
  border-radius: 50%;
  border-top-color: ${(props) => props.theme?.primaryColor || "#4F46E5"};
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const LoadingText = styled(motion.p)`
  color: #4b5563;
  font-size: ${(props) => props.theme?.fontxl || "1.25rem"};
  font-weight: 500;
  margin: 0;
  text-align: center;
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme?.fontlg || "1rem"};
  }
`;

export default Loading;
