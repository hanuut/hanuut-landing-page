import React from "react";
import styled, { keyframes, css } from "styled-components";

const rotate = keyframes`
  100% { transform: rotate(1turn); }
`;

const ButtonWrapper = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
  border-radius: 9999px;
  overflow: hidden; 
  
  /* Fixed Size for consistency */
  height: 56px; 
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
  
  animation: ${rotate} 4s linear infinite; /* Slightly faster for visibility */
  filter: blur(9px); 
  z-index: 0;
  opacity: 0.8;
`;

const InnerContent = styled.div`
  position: absolute;
  inset: 1.5px; /* Border width */
  border-radius: 9999px;
  
  /* --- MODE SWITCHING --- */
  ${(props) =>
    props.$secondary
      ? css`
          /* Secondary: White Glass Blurry Background */
          background-color: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          /* Text color inherits or defaults to white for contrast on dark pages */
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
  gap: 12px;
  z-index: 1;

  /* Typography Force */
  font-family: 'Ubuntu', sans-serif;
  font-weight: 600;
  font-size: 1rem;

  span, p, h1, h2, h3, h4, h5, h6 {
    color: inherit !important;
  }
  
  /* Icon handling inside */
  img, svg {
    filter: ${(props) => props.$secondary ? 'brightness(0) invert(1)' : 'none'};
  }
`;

const BorderBeamButton = ({ children, onClick, secondary = false, beamColor }) => {
  return (
    <ButtonWrapper onClick={onClick} type="button">
      <BeamLayer $beamColor={beamColor} />
      <InnerContent $secondary={secondary}>
        {children}
      </InnerContent>
    </ButtonWrapper>
  );
};

export default BorderBeamButton;