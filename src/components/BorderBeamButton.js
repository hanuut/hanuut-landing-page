import React from "react";
import styled, { keyframes, css } from "styled-components";

const spinBeam = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
`;

const ButtonWrapper = styled.button`
  position: relative;
  display: inline-flex;
  align-items: stretch;
  justify-content: center;
  
  /* Primary gets a 2px gap for the glowing border. Secondary gets 0 because we give it a solid border */
  padding: ${(props) => (props.$secondary ? "0" : "2px")};
  border: ${(props) => (props.$secondary ? "2px solid #111217" : "none")};
  background: transparent;
  cursor: pointer;
  outline: none;
  border-radius: 9999px;
  
  /* Forces perfect clipping across all browsers */
  overflow: hidden; 
  isolation: isolate;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  transform: translateZ(0);

  /* Base Sizing */
  min-height: 56px; 
  min-width: 180px;
  width: fit-content;

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
  top: 50%;
  left: 50%;
  width: 300%;
  aspect-ratio: 1; 
  transform: translate(-50%, -50%);
  
  /* A smooth conic gradient creates the glowing effect without CSS blur bugs */
  background: conic-gradient(
    from 90deg at 50% 50%,
    transparent 0%,
    transparent 40%,
    ${(props) => props.$beamColor || props.theme.primaryColor || "#F07A48"} 50%,
    transparent 60%,
    transparent 100%
  );
  
  animation: ${spinBeam} 4s linear infinite; 
  z-index: -1;
  /* Make the beam softer inside the frosted glass of the secondary button */
  opacity: ${(props) => (props.$secondary ? 0.5 : 1)}; 
`;

const InnerContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1; 
  border-radius: 9999px;
  
  /* --- MODE SWITCHING --- */
  ${(props) =>
    props.$secondary
      ? css`
          /* Frosted Glass Effect */
          background-color: rgba(255, 255, 255, 0.7); 
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #111217; 
        `
      : css`
          /* Solid Dark */
          background-color: #101012;
          color: #FFFFFF;
        `}

  gap: 10px;
  z-index: 1;
  
  /* Padding goes HERE on the text container, allowing the button to expand naturally */
  padding: 0 2rem; 

  font-family: var(--font-primary, 'Ubuntu'), sans-serif !important; 
  font-weight: 700;
  font-size: 1.05rem;
  white-space: nowrap; 

  span, p, h1, h2, h3, h4, h5, h6 {
    color: inherit !important;
  }
  
  img, svg {
    color: inherit !important;
    /* Ensure icons match text color */
    filter: ${(props) => props.$secondary ? 'none' : 'brightness(0) invert(1)'};
  }
`;

const BorderBeamButton = ({ children, onClick, secondary = false, beamColor, className }) => {
  return (
    <ButtonWrapper onClick={onClick} type="button" className={className} $secondary={secondary}>
      <BeamLayer $beamColor={beamColor} $secondary={secondary} />
      {/* We add className "inner-content" so parents can target it securely */}
      <InnerContent className="inner-content" $secondary={secondary}>
        {children}
      </InnerContent>
    </ButtonWrapper>
  );
};

export default BorderBeamButton;