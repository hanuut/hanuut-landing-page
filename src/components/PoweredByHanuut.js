import React from "react";
import styled from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const BadgeWrapper = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900; /* Below Modals (1000), Above Content */
  pointer-events: none; /* Let clicks pass through wrapper area */
  display: flex;
  justify-content: center;
`;

const GlassPill = styled(Link)`
  pointer-events: auto;
  text-decoration: none;
  background: rgba(28, 28, 30, 0.6); /* Dark Glass */
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background: rgba(28, 28, 30, 0.8);
  }
`;

const Text = styled.span`
  font-size: 0.75rem;
  color: #8e8e93; /* System Grey */
  font-weight: 500;
  letter-spacing: 0.5px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
`;

const Heart = styled.span`
  font-size: 0.8rem;
  filter: grayscale(0.5);
`;

const BrandName = styled.span`
  color: #ffffff;
  font-weight: 700;
`;

const PoweredByHanuut = () => {
  // Optional: Hide badge when at the very top to let Hero shine, or keep always visible
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  // For this design, let's keep it visible but fade in slightly after scroll
  // OR just keep it static. Let's make it static for utility.

  return (
    <BadgeWrapper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <GlassPill to="/partners">
        <Text>Powered by</Text>
        <BrandName>Hanuut</BrandName>
        <Heart>💚</Heart>
      </GlassPill>
    </BadgeWrapper>
  );
};

export default PoweredByHanuut;
