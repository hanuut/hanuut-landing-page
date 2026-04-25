import React from "react";
import styled, { keyframes, css } from "styled-components";

const rotate = keyframes`
  100% { transform: rotate(1turn); }
`;

const ButtonWrapper = styled.button`
  position: relative;
  display: inline-flex;
  padding: 1.5px; /* This creates the "border" thickness */
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  border-radius: 9999px;
  overflow: hidden; 
  
  /* Flexible sizing */
  min-height: 56px; 
  min-width: 180px;

  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const BeamLayer = styled.div`
  position: absolute;
  width: 200%; 
  height: 200%; 
  top: -50%;
  left: -50%;
  
  /* Dynamic Beam Color */
  background: conic-gradient(
    from 90deg at 50% 50%,
    transparent 0%,
    transparent 45%,
    ${(props) => props.$beamColor || props.theme.primaryColor || "#F07A48"} 50%,
    transparent 55%,
    transparent 100%
  );
  
  animation: ${rotate} 4s linear infinite; 
  filter: blur(9px); 
  z-index: 0;
  opacity: 0.8;
`;

const InnerContent = styled.div`
  /* Crucial Fix: Changed from absolute to relative to expand parent width */
  position: relative; 
  width: 100%;
  border-radius: 9999px;
  
  /* --- MODE SWITCHING --- */
  ${(props) =>
    props.$secondary
      ? css`
          /* Secondary: White Glass Blurry Background */
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          color: white; 
        `
      : css`
          /* Principal: Solid Dark Background */
          background-color: #101012;
          color: #FFFFFF;
        `}

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Slightly increased gap for icon breathing room */
  z-index: 1;
  padding: 0 1.8rem; /* Horizontal padding for text */

  /* Typography Force */
  font-family: var(--font-primary), sans-serif !important; 
  font-weight: 700;
  font-size: 1.05rem;
  white-space: nowrap; /* Forces text to stay on one line */

  @media (max-width: 480px) {
    white-space: normal; /* Allows safe wrapping on very tiny screens */
    font-size: 0.95rem;
    padding: 0.5rem 1.2rem;
  }

  span, p, h1, h2, h3, h4, h5, h6 {
    color: inherit !important;
  }
  
  /* Icon handling inside */
  img, svg {
    color: inherit !important;
    filter: ${(props) => props.$secondary ? 'brightness(0) invert(1)' : 'none'};
  }
`;

const BorderBeamButton = ({ children, onClick, secondary = false, beamColor, className }) => {
  return (
    // Passed className so styled-components overrides can target it if needed
    <ButtonWrapper onClick={onClick} type="button" className={className}>
      <BeamLayer $beamColor={beamColor} />
      <InnerContent $secondary={secondary}>
        {children}
      </InnerContent>
    </ButtonWrapper>
  );
};

export default BorderBeamButton;