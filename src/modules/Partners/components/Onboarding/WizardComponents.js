import styled, { css } from "styled-components";
import { motion } from "framer-motion";

export const WizardWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
  font-family: 'Tajawal', sans-serif;
`;

export const StepContainer = styled.div`
  width: 100%;
  max-width: 800px;
  
  /* --- CRITICAL FIXES --- */
  box-sizing: border-box; /* Ensures padding doesn't expand width */
  padding: 2rem 3rem; /* Generous desktop padding */
  
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 600px;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem; /* Safe gutter for mobile (24px) */
    justify-content: flex-start; /* Better for mobile keyboard interactions */
    padding-top: 4rem; 
  }
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const StepTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 0.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.8rem; /* Slightly smaller on mobile to prevent wrapping issues */
  }
`;

export const StepSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  margin-bottom: 3rem;
  font-family: 'Cairo', sans-serif;
  padding: 0 1rem; /* Extra safety for text */
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  flex: 1;
`;

export const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  margin-left: 4px;
`;

export const BigInput = styled.input`
  width: 100%;
  padding: 1.2rem;
  font-size: 1.1rem;
  border-radius: 16px;
  border: 2px solid #E5E5E5;
  background-color: #FAFAFA;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: #111;
  font-family: inherit;
  
  /* --- CRITICAL FIX --- */
  box-sizing: border-box; 

  &:focus {
    outline: none;
    border-color: #39A170;
    background-color: #FFF;
    box-shadow: 0 4px 20px rgba(57, 161, 112, 0.1);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #BBB;
  }
`;

export const ProgressContainer = styled.div`
  width: 90%; /* Use percentage to be safe on mobile */
  max-width: 400px;
  height: 6px;
  background-color: #F0F0F0;
  border-radius: 10px;
  margin-top: 3rem;
  overflow: hidden;
  position: relative;
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #39A170 0%, #2D855A 100%);
  border-radius: 10px;
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: auto;
  padding-top: 3rem; /* More breathing room above buttons */
`;

export const NavButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Tajawal', sans-serif;

  ${props => props.$primary ? css`
    background-color: #111;
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    
    &:hover {
      background-color: #000;
      transform: scale(1.05);
    }
    &:disabled {
      background-color: #CCC;
      cursor: not-allowed;
      transform: none;
    }
  ` : css`
    background-color: transparent;
    color: #666;
    border: none;
    
    &:hover {
      color: #111;
      background-color: #F5F5F5;
    }
  `}
`;