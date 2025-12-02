// components/SpotlightCard.js
import React, { useRef, useState } from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  position: relative;
  height: 100%;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.zinc800};
  background-color: ${(props) => props.theme.zinc950};
  overflow: hidden;
  padding: 2rem;
  /* Grain effect for texture */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
    opacity: 0.15;
    pointer-events: none;
  }
`;

// The glowing radial gradient that follows the mouse
const SpotlightOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.08),
    transparent 40%
  );
  z-index: 2;
  
  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
`;

const SpotlightCard = ({ children, className }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <CardWrapper
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={className}
      style={{ "--mouse-x": `${position.x}px`, "--mouse-y": `${position.y}px` }}
    >
      <SpotlightOverlay />
      <Content>{children}</Content>
    </CardWrapper>
  );
};

export default SpotlightCard;