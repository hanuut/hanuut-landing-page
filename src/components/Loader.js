// src/components/Loader.js (or wherever it is located)

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import loadingAnimation from "../assets/loader.gif"; 

const Loading = ({
  message = "",
  fullscreen = true,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const loadingMessage = message || t("loading.message") || "Loading...";

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
      $fullscreen={fullscreen}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      isArabic={isArabic}
    >
      <Card variants={itemVariants}>
        {/* --- THE FIX: STEP 4 --- */}
        {/* Use the new LoadingGif component instead of the old Spinner */}
        <LoadingGif
          src={loadingAnimation}
          alt={loadingMessage}
          variants={itemVariants}
        />
        <LoadingText variants={itemVariants}>{loadingMessage}</LoadingText>
      </Card>
    </Container>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  $fullscreen: PropTypes.bool,
};

// --- THE FIX: STEP 3 ---
// We create a new styled component for our GIF.
const LoadingGif = styled(motion.img)`
  width: 80px; // You can adjust the size here
  height: 80px;
  margin-bottom: 20px;
`;

// --- THE FIX: STEP 2 ---
// The old CSS-based Spinner is no longer needed and has been removed.

const Container = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
height: ${({ $fullscreen }) => ($fullscreen ? "100vh" : "100%")};
  min-height: ${({ $fullscreen }) => ($fullscreen ? "100vh" : "400px")};
  background-color: ${({ $fullscreen }) =>
    $fullscreen ? "rgba(249, 250, 251, 0.95)" : "transparent"};
  position: ${({ $fullscreen }) => ($fullscreen ? "fixed" : "relative")};
  z-index: ${({ $fullscreen }) => ($fullscreen ? 1000 : 1)};
  backdrop-filter: ${({ $fullscreen }) => ($fullscreen ? "blur(5px)" : "none")};
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