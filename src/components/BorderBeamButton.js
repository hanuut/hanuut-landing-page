import React from "react";
import styled, { keyframes } from "styled-components";

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
  
  /* Sizing */
  height: 56px; 
  min-width: 180px;

  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const BeamLayer = styled.div`
  position: absolute;
  width: 200%; 
  height: 200%; 
  top: -50%;
  left: -50%;
  
  /* The spinning gradient */
  background: conic-gradient(
    from 90deg at 50% 50%,
    transparent 0%,
    transparent 45%,
    ${(props) => props.theme.primaryColor || "#F07A48"} 50%,
    transparent 55%,
    transparent 100%
  );
  
  animation: ${rotate} 8s linear infinite; 
  filter: blur(8px); 
  z-index: 0;
`;

const InnerContent = styled.div`
  position: absolute;
  inset: 1.5px; 
  border-radius: 9999px;
  background-color: #101012; /* Dark background */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 1;

  /* --- THE FIX: Force white text for all children --- */
  color: #FFFFFF;
  font-family: 'Ubuntu', sans-serif;
  font-weight: 600;
  font-size: 1rem;

  span, p, h1, h2, h3, h4, h5, h6 {
    color: #FFFFFF !important;
  }
`;

const BorderBeamButton = ({ children, onClick }) => {
  return (
    <ButtonWrapper onClick={onClick}>
      <BeamLayer />
      <InnerContent>
        {children}
      </InnerContent>
    </ButtonWrapper>
  );
};

export default BorderBeamButton;