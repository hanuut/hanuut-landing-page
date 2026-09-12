// modules/Tawsila/components/TawsilaWizardComponents.js
import styled, { css } from "styled-components";
import { motion } from "framer-motion";

export const WizardContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
  font-family: var(--font-primary, "Tajawal"), sans-serif;
  color: #0f172a;
  padding-top: calc(${(props) => props.theme.navHeight || "80px"} + 1.5rem);
  padding-bottom: 5rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

export const StepWrapper = styled.div`
  width: 100%;
  max-width: 640px;
  box-sizing: border-box;
  padding: 3rem 2.5rem;
  z-index: 2;

  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 28px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;

  @media (max-width: 680px) {
    padding: 2rem 1.25rem;
    border-radius: 20px;
    box-shadow: none;
    background: transparent;
    border: none;
  }
`;

export const StepTitle = styled(motion.h2)`
  font-size: clamp(1.75rem, 4vw, 2.3rem);
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  text-align: center;
  letter-spacing: -0.5px;
  line-height: 1.25;
`;

export const StepSubtitle = styled(motion.p)`
  font-size: 1.05rem;
  color: #64748b;
  text-align: center;
  margin: 0 auto 2.5rem auto;
  max-width: 500px;
  line-height: 1.6;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  margin-left: 2px;
  margin-right: 2px;
`;

export const PremiumInput = styled.input`
  width: 100%;
  padding: 1rem 1.15rem;
  font-size: 1rem;
  border-radius: 14px;
  border: 1.5px solid #cbd5e1;
  background-color: #f8fafc;
  color: #0f172a;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #00875f;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(0, 135, 95, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const ProgressContainer = styled.div`
  width: 90%;
  max-width: 420px;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 9999px;
  margin-top: 1rem;
  margin-bottom: 2rem;
  overflow: hidden;
  position: relative;
  z-index: 2;
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #00875f 0%, #10b981 100%);
  border-radius: 9999px;
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 1.5rem;
  gap: 1rem;
`;

export const NavButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  ${(props) =>
    props.$primary
      ? css`
          background-color: #00875f;
          color: #ffffff;
          border: none;
          box-shadow: 0 6px 20px rgba(0, 135, 95, 0.25);
          flex: 1;

          &:hover:not(:disabled) {
            background-color: #006847;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 135, 95, 0.35);
          }
          &:disabled {
            background-color: #cbd5e1;
            color: #64748b;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        `
      : css`
          background-color: #ffffff;
          color: #475569;
          border: 1.5px solid #cbd5e1;

          &:hover {
            color: #0f172a;
            border-color: #94a3b8;
            background-color: #f1f5f9;
          }
        `}
`;

export const ErrorText = styled(motion.p)`
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-align: center;
`;