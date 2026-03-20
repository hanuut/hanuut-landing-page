import styled, { css } from "styled-components";
import { motion } from "framer-motion";

export const WizardContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
  font-family: 'Tajawal', sans-serif;
  color: white;
  padding-top: calc(${(props) => props.theme.navHeight} + 2rem);
`;

export const StepWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  padding: 3rem;
  z-index: 2;

  /* Glassmorphism card style */
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  backdrop-filter: blur(10px);
  
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border: none;
    background: transparent;
    backdrop-filter: none;
  }
`;

export const StepTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const StepSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: #A1A1AA;
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'Cairo', sans-serif;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #D4D4D8;
  margin-left: 4px;
`;

export const PremiumInput = styled.input`
  width: 100%;
  padding: 1.2rem;
  font-size: 1.1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.03);
  color: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #397FF9; /* Tawsila Blue */
    background-color: rgba(57, 127, 249, 0.05);
    box-shadow: 0 0 0 4px rgba(57, 127, 249, 0.1);
  }

  &::placeholder {
    color: #52525B;
  }
`;

export const ProgressContainer = styled.div`
  width: 90%;
  max-width: 400px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-top: 1rem;
  overflow: hidden;
  position: relative;
  z-index: 2;
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: #397FF9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(57, 127, 249, 0.5);
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: auto;
  padding-top: 3rem;
`;

export const NavButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Tajawal', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  ${props => props.$primary ? css`
    background-color: #397FF9;
    color: white;
    border: none;
    box-shadow: 0 10px 20px -10px rgba(57, 127, 249, 0.6);
    flex: 1;
    max-width: 200px;
    
    &:hover {
      background-color: #2563EB;
      transform: translateY(-2px);
    }
    &:disabled {
      background-color: #27272A;
      color: #52525B;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  ` : css`
    background-color: transparent;
    color: #A1A1AA;
    border: none;
    
    &:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
    }
  `}
`;

export const ErrorText = styled(motion.p)`
  color: #EF4444;
  font-size: 0.9rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
`;