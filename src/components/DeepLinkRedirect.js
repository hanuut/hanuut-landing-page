import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import LogoSrc from "../assets/hanuutLogo.webp";

/**
 * Enhanced DeepLinkRedirect component
 *
 * Handles redirecting users from web to the Hanuut mobile app using deep linking.
 * Styled to match Hanuut's brand design system and supports multilingual content.
 * Provides a seamless transition experience with smooth animations.
 *
 * @component
 */
const DeepLinkRedirect = ({
  appScheme = "hanuut://",
  storeUrl = "https://play.google.com/store/apps/details?id=com.hanuut.shop",
  appName = "Hanuut",
  redirectDelay = 3000,
  transformPath = (path) => path,
  showUI = true,
  logoSrc = LogoSrc,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Local state
  const location = useLocation();
  const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000));
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  /**
   * Detects the user's platform
   * @returns {Object} Platform information with isIOS and isAndroid flags
   */
  const detectPlatform = useCallback(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(userAgent);

    return { isIOS, isAndroid };
  }, []);

  /**
   * Processes the current path and constructs the deep link URL
   * @returns {string} The formatted deep link URL
   */
  const processPath = useCallback(() => {
    // Extract path and search params from current location
    const { pathname, search } = location;

    // Remove the /deeplink prefix if present
    const normalizedPath = pathname.startsWith("/deeplink")
      ? pathname.replace(/^\/deeplink\/?/, "")
      : pathname;

    // Apply any custom path transformations
    const transformedPath = transformPath(normalizedPath);

    // Construct the final deep link URL
    return `${appScheme}${transformedPath}${search}`;
  }, [location, appScheme, transformPath]);

  /**
   * Handles the redirection process to the app or store
   */
  useEffect(() => {
    // Generate the deep link URL
    const deepLinkUrl = processPath();
    const { isIOS } = detectPlatform();

    // Select the appropriate store URL based on platform
    const platformSpecificStoreUrl = isIOS
      ? storeUrl // Replace with iOS store URL when available
      : storeUrl;

    // Start redirection process
    setIsRedirecting(true);

    // Log attempt (helpful for debugging)
    console.log(`Attempting to open deep link: ${deepLinkUrl}`);

    // Attempt to open the app via deep link
    window.location.href = deepLinkUrl;

    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const newCount = prev - 1;

        // When we reach 0, begin animating out
        if (newCount <= 0) {
          setIsAnimatingOut(true);
          clearInterval(timer);
        }

        return Math.max(0, newCount);
      });
    }, 1000);

    // Set up fallback to store redirect
    const fallbackTimer = setTimeout(() => {
      console.log(`Redirecting to app store: ${platformSpecificStoreUrl}`);
      window.location.href = platformSpecificStoreUrl;
    }, redirectDelay);

    // Clean up timers
    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimer);
    };
  }, [processPath, redirectDelay, storeUrl, detectPlatform]);

  // If UI is disabled or redirection happens very quickly, don't render anything
  if (!showUI || !isRedirecting) return null;

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: -30,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 30, stiffness: 300 },
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {!isAnimatingOut && (
        <Container
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          isArabic={isArabic}
        >
          <Card variants={cardVariants} isArabic={isArabic}>
            <Logo variants={itemVariants}>
              {logoSrc ? (
                <LogoImage src={logoSrc} alt={appName} />
              ) : (
                <LogoText>{appName.charAt(0)}</LogoText>
              )}
            </Logo>

            <Heading variants={itemVariants}>
              {t("deepLinkOpeningApp", { appName }) || `Opening ${appName}`}
            </Heading>

            <Paragraph variants={itemVariants}>
              {t("deepLinkRedirectingMessage", { appName }) ||
                `We're redirecting you to the ${appName} app. If the app doesn't open automatically, you'll be taken to the app store in`}{" "}
              <CountdownText>{countdown}</CountdownText>{" "}
              {countdown === 1
                ? t("deepLinkSecond") || "second"
                : t("deepLinkSeconds") || "seconds"}
              .
            </Paragraph>

            <SpinnerContainer variants={itemVariants}>
              <Spinner />
            </SpinnerContainer>

            <ButtonContainer variants={itemVariants}>
              <StoreButton
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t("deepLinkOpenStore") || "Get it on Google Play"}
              </StoreButton>
            </ButtonContainer>
          </Card>
        </Container>
      )}
    </AnimatePresence>
  );
};

DeepLinkRedirect.propTypes = {
  /** The URI scheme for your app (e.g., 'hanuut://') */
  appScheme: PropTypes.string,

  /** URL to redirect users when the app isn't installed */
  storeUrl: PropTypes.string,

  /** Your app's name to display in the UI */
  appName: PropTypes.string,

  /** Delay in milliseconds before redirecting to store */
  redirectDelay: PropTypes.number,

  /** Optional path transformation function */
  transformPath: PropTypes.func,

  /** Whether to show the redirection UI */
  showUI: PropTypes.bool,

  /** Optional logo source URL */
  logoSrc: PropTypes.string,
};

// Styled Components with Hanuut brand styling
const Container = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(8px);
  direction: ${({ isArabic }) => (isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Card = styled(motion.div)`
  background-color: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 480px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
`;

const Logo = styled(motion.div)`
  width: 90px;
  height: 90px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 25%;
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin-bottom: 20px;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: auto;
`;

const LogoText = styled.span`
  color: white;
  font-size: 42px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Heading = styled(motion.h1)`
  width: 100%;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme?.primaryColor || "#4F46E5"};
  font-weight: 900;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Paragraph = styled(motion.p)`
  width: 100%;
  font-size: ${(props) => props.theme?.fontxl || "1.1rem"};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme?.fontmd || "1rem"};
  }
`;

const CountdownText = styled.span`
  font-weight: 700;
  color: ${(props) => props.theme?.primaryColor || "#4F46E5"};
`;

const SpinnerContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0.5rem 0 1.5rem;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(79, 70, 229, 0.2);
  border-radius: 50%;
  border-top-color: ${(props) => props.theme?.primaryColor || "#4F46E5"};
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

const ButtonContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StoreButton = styled(motion.a)`
  display: inline-block;
  background-color: #000000;
  color: white;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  font-size: ${(props) => props.theme?.fontmd || "1rem"};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: ${(props) => props.theme?.fontsm || "0.9rem"};
  }
`;

export default DeepLinkRedirect;
