import React, { useRef, useState } from "react";
import styled from "styled-components";

const CardWrapper = styled.div`
  position: relative;
  height: 100%;
  border-radius: 24px;
  /* Light Mode Styling */
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.08); /* Subtle grey border */
  overflow: hidden;
  padding: 0; /* Let children handle padding */
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
    border-color: rgba(57, 161, 112, 0.3); /* Green hint on hover */
  }
`;

const SpotlightOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
  /* White Glow */
  background: radial-gradient(
    800px circle at var(--mouse-x) var(--mouse-y),
    rgba(0, 0, 0, 0.03), /* Very subtle dark tint for contrast */
    transparent 40%
  );
  z-index: 3;
  
  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 5;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const LightSpotlightCard = ({ children, className, onClick }) => {
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
      onClick={onClick}
      style={{ "--mouse-x": `${position.x}px`, "--mouse-y": `${position.y}px` }}
    >
      <SpotlightOverlay />
      <Content>{children}</Content>
    </CardWrapper>
  );
};

export default LightSpotlightCard;