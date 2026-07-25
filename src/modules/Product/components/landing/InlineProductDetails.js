import React, { useState, useEffect, useMemo, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import {
  FaTimes,
  FaExpand,
  FaEye,
  FaBookmark,
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaPalette,
  FaCloudUploadAlt,
  FaSlidersH,
  FaTrash,
  FaArrowsAltH,
  FaArrowsAltV,
  FaSpinner,
  FaShoppingCart,
  FaBorderAll,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import axios from "axios";

// FIXED: Re-included getTemplateConfig in the named imports
import {
  getGarmentDimensions,
  getTemplateConfig,
  getRawPrintCost,
  calculatePhysicalMetrics,
  calculateScaleFromPhysicalWidth,
  getFittedPrintZoneRatios,
} from "../../../PodStudio/hooks/usePrintableArea";

import { updateCartQuantity } from "../../../Cart/state/reducers";

import {
  retrieveFile,
  persistFile,
} from "../../../PodStudio/utils/indexedDbHelper";

// ============================================================================
// STYLED COMPONENTS - ALL DECLARED EXACTLY ONCE
// ============================================================================

const pulseShine = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(240, 122, 72, 0.6); transform: scale(1); }
  50% { box-shadow: 0 0 0 15px rgba(240, 122, 72, 0); transform: scale(1.05); }
  100% { box-shadow: 0 0 0 0 rgba(240, 122, 72, 0); transform: scale(1); }
`;

const MobileFAB = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #050505;
    border: none;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    z-index: 1000;
    cursor: pointer;
    animation: ${pulseShine} 2s infinite;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const DetailContainer = styled(motion.div)`
  width: 100%;
  background: #111214;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
  min-height: 550px;
`;

const BlurredBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(props) => props.$imgUrl});
  background-size: cover;
  background-position: center;
  filter: blur(50px) brightness(0.5);
  transform: scale(1.15);
  z-index: 0;
  pointer-events: none;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(17, 18, 20, 0.4) 0%,
    rgba(17, 18, 20, 0.85) 50%,
    #111214 100%
  );
  z-index: 1;
  pointer-events: none;
`;

const RelativeContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 2rem;
  align-items: start;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const GallerySection = styled.div`
  width: 100%;
  height: 350px;
  background: rgba(24, 24, 27, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BlurBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(props) => props.$imgUrl});
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.6);
  opacity: 0.35;
  z-index: 1;
  pointer-events: none;
`;

const SharpForegroundImage = styled.img`
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const MainImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: zoom-in;
  z-index: 2;
`;

const AltImagesRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  width: 100%;
  justify-content: center;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const AltThumbnail = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  overflow: hidden;
  background: #e5e5e5;
  border: 2px solid
    ${(props) => (props.$active ? props.theme.primaryColor : "transparent")};
  cursor: pointer;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FloatingSocialProof = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  gap: 8px;
`;

const ProofBadge = styled.span`
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  svg {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const ImageOverlayScrim = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(17, 18, 20, 0.95) 0%,
    rgba(17, 18, 20, 0.4) 60%,
    transparent 100%
  );
  padding: 3rem 1.25rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  z-index: 5;
`;

const Brand = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.primaryColor};
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1.5px;
`;

const ProductName = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 900;
  color: ${(props) => props.theme.primaryColor};
  margin-top: 0.2rem;
`;

const ZoomHint = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 50%;
  color: white;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const InfoSection = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: "Tajawal", sans-serif;
`;

const OptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: start;
`;

const ActionPanelRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  width: 100%;
  flex-wrap: wrap;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const PanelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: ${(props) => (props.$isButton ? "1 1 180px" : "0 1 auto")};
  min-width: fit-content;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const PillsContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 2px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ColorSwatch = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${(props) => props.$colorCode || "#27272a"};
  border: 2px solid
    ${(props) => (props.$active ? "white" : "rgba(255,255,255,0.1)")};
  box-shadow: ${(props) =>
    props.$active ? `0 0 8px ${props.theme.primaryColor}` : "none"};
  &:hover {
    transform: scale(1.15);
  }
`;

const SizePill = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  background: ${(props) => (props.$active ? "white" : "rgba(255,255,255,0.03)")};
  border: 1px solid
    ${(props) =>
      props.$active ? props.theme.primaryColor : "rgba(255,255,255,0.1)"};
  color: ${(props) => (props.$active ? "#000" : "#D4D4D8")};
  box-shadow: ${(props) =>
    props.$active ? `0 0 8px ${props.theme.primaryColor}50` : "none"};
  &:hover {
    background: ${(props) =>
      props.$active ? "white" : "rgba(255,255,255,0.08)"};
  }
`;

const AddToCartBtn = styled.button`
  background: ${(props) => props.theme.primaryColor};
  color: #000;
  border: none;
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);
  }
`;

const LightboxCard = styled(motion.div)`
  width: 90%;
  max-width: 450px;
  aspect-ratio: 1;
  background-image: linear-gradient(45deg, #18181b 25%, transparent 25%),
    linear-gradient(-45deg, #18181b 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #18181b 75%),
    linear-gradient(-45deg, transparent 75%, #18181b 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
  background-color: #27272a;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
`;

const UploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  border: 2px dashed ${(props) => props.theme.primaryColor}80;
  border-radius: 16px;
  background: ${(props) => props.theme.primaryColor}08;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  &:hover {
    background: ${(props) => props.theme.primaryColor}15;
    border-color: ${(props) => props.theme.primaryColor};
  }
  input {
    display: none;
  }
`;

const SliderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  direction: ltr;
  label {
    font-size: 0.8rem;
    color: #a1a1aa;
    font-weight: 800;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    letter-spacing: 0.5px;
  }
  .row-input {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  input[type="range"] {
    flex: 1;
    accent-color: ${(props) => props.theme.primaryColor};
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    outline: none;
  }
  input[type="number"] {
    width: 65px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: white;
    padding: 4px 6px;
    font-size: 0.85rem;
    text-align: center;
    outline: none;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    &:focus {
      border-color: ${(props) => props.theme.primaryColor};
    }
  }
`;

const DimensionSegment = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2px;
  border-radius: 10px;
  margin-bottom: 0.5rem;
`;

const SegmentBtn = styled.button`
  background: ${(props) =>
    props.$active ? props.theme.primaryColor : "transparent"};
  color: ${(props) => (props.$active ? "#000" : "white")};
  border: none;
  padding: 0.6rem;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: "Tajawal", sans-serif;
`;

const OptionSegment = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 12px;
`;

export const NavigationRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

export const WizardBtn = styled.button`
  flex: 1;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
  border: none;
  ${(props) =>
    props.$primary
      ? ` background: ${props.theme.primaryColor}; color: #000; &:hover { transform: translateY(-2px); filter: brightness(1.1); } `
      : ` background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid rgba(255,255,255,0.08); &:hover { background: rgba(255, 255, 255, 0.1); } `}
  &:disabled {
    background: #27272a;
    color: #71717a;
    border-color: transparent;
    cursor: not-allowed;
    transform: none;
  }
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.25rem;
  width: 100%;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  color: #a1a1aa;
`;
const SummaryValue = styled.span`
  color: white;
  font-weight: 700;
`;

const LiveSpecsCard = styled.div`
  background: rgba(57, 161, 112, 0.08);
  border: 1px solid rgba(57, 161, 112, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 10px;
  text-align: center;
  margin-top: 0.5rem;
`;

const SpecMetric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .label {
    font-size: 0.65rem;
    color: #a1a1aa;
    text-transform: uppercase;
    font-weight: 700;
  }
  .value {
    font-size: 0.95rem;
    font-weight: 800;
    color: white;
    margin-top: 2px;
  }
  .price-value {
    color: #39a170;
  }
`;

const ArtworkManager = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.75rem 1rem;
  width: 100%;
  box-sizing: border-box;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const ArtworkInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

const ArtworkThumbnailWrap = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 10px;
  overflow: hidden;
  background-image: linear-gradient(45deg, #18181b 25%, transparent 25%),
    linear-gradient(-45deg, #18181b 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #18181b 75%),
    linear-gradient(-45deg, transparent 75%, #18181b 75%);
  background-size: 10px 10px;
  background-position:
    0 0,
    0 5px,
    5px -5px,
    -5px 0px;
  background-color: #27272a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const MiniActionButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: #a1a1aa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0.95rem;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.3);
  }
  &.danger:hover {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border-color: #ef4444;
  }
`;

const COLOR_MAP = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  grey: "#6B7280",
  beige: "#F5F5DC",
};

// --- WORKSPACE STEP INDICATORS ---
const StepIndicatorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 1rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;
const StepNode = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: ${(props) => (props.$active ? 1 : 0.45)};
  transition: opacity 0.3s;
`;
const StepCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active ? props.theme.primaryColor : "rgba(255, 255, 255, 0.1)"};
  color: ${(props) => (props.$active ? "#00" : "#FFF")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
`;
const StepText = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(props) => (props.$active ? "#FFF" : "#A1A1AA")};
  font-family: "Tajawal", sans-serif;
`;
const StepLine = styled.div`
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.05);
  margin: 0 1rem;
`;

export const PodStepIndicator = ({ currentStep, isArabic }) => {
  return (
    <StepIndicatorWrapper $isArabic={isArabic}>
      <StepNode $active={currentStep === 1}>
        <StepCircle $active={currentStep === 1}>1</StepCircle>
        <StepText $active={currentStep === 1}>Base Garment</StepText>
      </StepNode>
      <StepLine />
      <StepNode $active={currentStep === 2}>
        <StepCircle $active={currentStep === 2}>2</StepCircle>
        <StepText $active={currentStep === 2}>Design & Place</StepText>
      </StepNode>
      <StepLine />
      <StepNode $active={currentStep === 3}>
        <StepCircle $active={currentStep === 3}>3</StepCircle>
        <StepText $active={currentStep === 3}>Fulfillment Review</StepText>
      </StepNode>
    </StepIndicatorWrapper>
  );
};

const PodCanvasContainer = styled.div`
  width: 100%;
  height: 440px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
      circle at center,
      rgba(240, 122, 72, 0.1) 0%,
      rgba(12, 12, 14, 0.98) 100%
    ),
    linear-gradient(45deg, #141416 25%, transparent 25%),
    linear-gradient(-45deg, #141416 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #141416 75%),
    linear-gradient(-45deg, transparent 75%, #141416 75%);
  background-size:
    100% 100%,
    16px 16px,
    16px 16px,
    16px 16px,
    16px 16px;
  background-position:
    center,
    0 0,
    0 8px,
    8px -8px,
    -8px 0px;
  background-color: #0c0c0e;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    inset 0 0 40px rgba(0, 0, 0, 0.85),
    0 20px 40px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.06);
  user-select: none;
`;
const GarmentWorkspace = styled.div`
  position: relative;
  width: 95%;
  height: 95%;
  max-width: 410px;
  max-height: 410px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BaseGarmentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 1;
`;
const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: ${(props) => (props.$visible ? 0.35 : 0)};
  transition: opacity 0.2s;
  background-size: 20px 20px;
  background-image: linear-gradient(
      to right,
      rgba(57, 161, 112, 0.6) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(57, 161, 112, 0.6) 1px, transparent 1px);
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1.5px;
    background: #39a170;
  }
  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1.5px;
    background: #39a170;
  }
`;

const TemplateContentArea = styled.div`
  position: absolute;
  z-index: 2;
  overflow: hidden;
  top: ${(props) => props.$area.top}%;
  left: ${(props) => props.$area.left}%;
  width: ${(props) => props.$area.width}%;
  height: ${(props) => props.$area.height}%;
  pointer-events: none;
`;

const InteractivePrintArea = styled.div`
  position: absolute;
  top: ${(props) => props.$area.top}%;
  left: ${(props) => props.$area.left}%;
  width: ${(props) => props.$area.width}%;
  height: ${(props) => props.$area.height}%;
  pointer-events: auto;
  z-index: 3;
`;

const TransformableBox = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: move;
  z-index: 5;
  user-select: none;
  touch-action: none;
  border: 1.5px dashed rgba(255, 255, 255, 0.65);
`;
const ScaleHandle = styled.div`
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid ${(props) => props.theme.primaryColor};
  cursor: se-resize;
  z-index: 10;
`;
const RotateHandle = styled.div`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid #397ff9;
  cursor: grab;
  z-index: 10;
  &::after {
    content: "";
    position: absolute;
    top: 12px;
    left: 5px;
    width: 2px;
    height: 12px;
    background: #397ff9;
  }
`;
const ToggleGridBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(15, 15, 18, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e4e4e7;
  padding: 8px 14px;
  border-radius: 50px;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.8rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
    color: white;
  }
`;
const CanvasLegend = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(15, 15, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 100;
  font-family: "Cairo", sans-serif;
  pointer-events: none;
  text-align: left;
  direction: ltr;
`;
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: #a1a1aa;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) => props.$color || "#fff"};
  }
  .label {
    font-weight: 700;
    color: #ffffff;
    font-family: "Tajawal", sans-serif;
  }
  .value {
    font-family: monospace;
    font-weight: 700;
    color: ${(props) => props.$valColor || "#a1a1aa"};
  }
`;

export const PodCanvasPreview = ({
  baseImageUrl,
  podState,
  setPodState,
  productName,
  selectedSize = "M",
}) => {
  const [showGrid, setShowGrid] = useState(false);
  const containerRef = useRef(null);
  const interactionRef = useRef({
    type: "none",
    startX: 0,
    startY: 0,
    startXVal: 0,
    startYVal: 0,
    startScale: 0,
    startRotation: 0,
  });

  const currentSide = podState.side;
  const config = podState[currentSide];

  const ratios = useMemo(() => {
    return getFittedPrintZoneRatios(productName, selectedSize, currentSide);
  }, [productName, selectedSize, currentSide]);

  const garmentDims = useMemo(() => {
    return getGarmentDimensions(productName, selectedSize);
  }, [productName, selectedSize]);

  const handlePointerDown = (e, type) => {
    e.stopPropagation();
    e.preventDefault();
    if (!config.previewUrl) return;

    interactionRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startXVal: config.x,
      startYVal: config.y,
      startScale: config.scale,
      startRotation: config.rotation,
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    const {
      type,
      startX,
      startY,
      startXVal,
      startYVal,
      startScale,
      startRotation,
    } = interactionRef.current;
    if (type === "none" || !containerRef.current) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const bounds = containerRef.current.getBoundingClientRect();

    if (type === "drag") {
      const percentageChangeX = (deltaX / bounds.width) * 100;
      const percentageChangeY = (deltaY / bounds.height) * 100;

      setPodState((prev) => ({
        ...prev,
        [currentSide]: {
          ...prev[currentSide],
          x: Math.min(
            100,
            Math.max(0, Math.round(startXVal + percentageChangeX))
          ),
          y: Math.min(
            100,
            Math.max(0, Math.round(startYVal + percentageChangeY))
          ),
        },
      }));
    } else if (type === "scale") {
      const scaleFactor = 1 + deltaX / 150;
      setPodState((prev) => ({
        ...prev,
        [currentSide]: {
          ...prev[currentSide],
          scale: Math.min(
            120,
            Math.max(15, Math.round(startScale * scaleFactor))
          ),
        },
      }));
    } else if (type === "rotate") {
      const center = {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      };
      const angle =
        Math.atan2(e.clientY - center.y, e.clientX - center.x) *
        (180 / Math.PI);
      const startAngle =
        Math.atan2(startY - center.y, startX - center.x) * (180 / Math.PI);

      setPodState((prev) => ({
        ...prev,
        [currentSide]: {
          ...prev[currentSide],
          rotation: Math.round((startRotation + (angle - startAngle)) % 360),
        },
      }));
    }
  };

  const handlePointerUp = () => {
    interactionRef.current.type = "none";
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  return (
    <PodCanvasContainer>
      <GarmentWorkspace ref={containerRef}>
        <ToggleGridBtn type="button" onClick={() => setShowGrid(!showGrid)}>
          <FaBorderAll /> Grid
        </ToggleGridBtn>

        {baseImageUrl ? (
          <BaseGarmentImage src={baseImageUrl} alt="Base Product Substrate" />
        ) : (
          <div style={{ color: "#888" }}>Loading templates...</div>
        )}

        <TemplateContentArea $area={ratios.contentArea}>
          <div
            style={{
              position: "absolute",
              top: `${ratios.printArea.top}%`,
              left: `${ratios.printArea.left}%`,
              width: `${ratios.printArea.width}%`,
              height: `${ratios.printArea.height}%`,
              overflow: "visible",
            }}
          >
            {config.previewUrl && (
              <img
                src={config.previewUrl}
                alt="Visual Print Layer"
                style={{
                  position: "absolute",
                  left: `${config.x}%`,
                  top: `${config.y}%`,
                  width: `${config.scale}%`,
                  transform: `translate(-50%, -50%) rotate(${config.rotation || 0}deg)`,
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </TemplateContentArea>

        <InteractivePrintArea
          ref={containerRef}
          $area={ratios.absolutePrintArea}
        >
          <GridOverlay $visible={showGrid} />
          {config.previewUrl && (
            <TransformableBox
              style={{
                left: `${config.x}%`,
                top: `${config.y}%`,
                width: `${config.scale}%`,
                aspectRatio: "1/1",
                transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, "drag")}
            >
              <div style={{ width: "100%", height: "100%", opacity: 0 }} />
              <ScaleHandle
                onPointerDown={(e) => handlePointerDown(e, "scale")}
              />
              <RotateHandle
                onPointerDown={(e) => handlePointerDown(e, "rotate")}
              />
            </TransformableBox>
          )}
        </InteractivePrintArea>

        {garmentDims && (
          <CanvasLegend>
            <LegendItem $color="#ffffff" $valColor="#ffffff">
              <span className="dot" />
              <span className="label">Garment:</span>
              <span className="value">
                A: {garmentDims.A}cm{" "}
                {garmentDims.B ? `× B: ${garmentDims.B}cm` : ""}
              </span>
            </LegendItem>
          </CanvasLegend>
        )}
      </GarmentWorkspace>
    </PodCanvasContainer>
  );
};

export const PodStepTwoControls = ({
  podState,
  setPodState,
  product,
  onNext,
  onBack,
  isArabic,
}) => {
  const { t } = useTranslation();
  const currentSide = podState.side;
  const config = podState[currentSide];
  const replacementInputRef = useRef(null);

  const [aspectRatio, setAspectRatio] = useState(1);
  const [refDimension, setRefDimension] = useState("width");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const garmentDims = useMemo(
    () => getGarmentDimensions(product.name, "M", product.sizeChart),
    [product.name, product.sizeChart]
  );

  useEffect(() => {
    let isMounted = true;
    if (config.previewUrl) {
      const img = new Image();
      img.src = config.previewUrl;
      img.onload = () => {
        if (isMounted) {
          const ratio = img.naturalWidth / img.naturalHeight;
          setAspectRatio(ratio);
          setRefDimension(ratio >= 1 ? "width" : "height");
          setPodState((prev) => ({
            ...prev,
            [currentSide]: {
              ...prev[currentSide],
              aspectRatio: ratio,
            },
          }));
        }
      };
    } else {
      setAspectRatio(1);
    }
    return () => {
      isMounted = false;
    };
  }, [config.previewUrl, currentSide, setPodState]);

  const physicalMetrics = useMemo(() => {
    return calculatePhysicalMetrics(
      config.scale,
      garmentDims.B,
      garmentDims.A,
      aspectRatio
    );
  }, [config.scale, garmentDims, aspectRatio]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setPodState((prev) => ({
        ...prev,
        [currentSide]: { ...prev[currentSide], file, previewUrl: localUrl },
      }));
    }
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setPodState((prev) => ({
      ...prev,
      [currentSide]: { ...prev[currentSide], [name]: parseInt(value, 10) },
    }));
  };

  const handlePhysicalSizeChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    const targetScalePct = calculateScaleFromPhysicalWidth(
      val,
      garmentDims.B
    );

    setPodState((prev) => ({
      ...prev,
      [currentSide]: {
        ...prev[currentSide],
        scale: Math.min(120, Math.max(15, Math.round(targetScalePct))),
      },
    }));
  };

  const clearSide = () => {
    setPodState((prev) => ({
      ...prev,
      [currentSide]: {
        file: null,
        previewUrl: null,
        scale: 50,
        x: 50,
        y: 50,
        rotation: 0,
        aspectRatio: 1,
      },
    }));
    setRefDimension("width");
    if (replacementInputRef.current) replacementInputRef.current.value = "";
  };

  const maxLimit = useMemo(() => {
    if (refDimension === "width") {
      return physicalMetrics.maxPrintWidthCm;
    } else {
      return physicalMetrics.maxPrintHeightCm;
    }
  }, [refDimension, physicalMetrics]);

  const currentActiveVal =
    refDimension === "width" ? physicalMetrics.width : physicalMetrics.height;

  const livePrintCost = useMemo(() => {
    const w = parseFloat(physicalMetrics.width);
    const h = parseFloat(physicalMetrics.height);
    return getRawPrintCost(w, h) + 50;
  }, [physicalMetrics.width, physicalMetrics.height]);

  const handleFABClick = (e) => {
    e.stopPropagation();
    const currentSideState = podState[podState.side];

    if (!currentSideState.previewUrl) {
      const fileInput = document.getElementById("inline-upload-input");
      if (fileInput) fileInput.click();
    } else {
      const controlsSection = document.getElementById("inline-controls-section");
      if (controlsSection) {
        controlsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <ControlsWrapper id="inline-controls-section">
      {product.hasBackPrintSurface && (
        <OptionSegment>
          <SegmentBtn
            $active={podState.side === "front"}
            onClick={() => setPodState((prev) => ({ ...prev, side: "front" }))}
          >
            Front Side
          </SegmentBtn>
          <SegmentBtn
            $active={podState.side === "back"}
            onClick={() => setPodState((prev) => ({ ...prev, side: "back" }))}
          >
            Back Side
          </SegmentBtn>
        </OptionSegment>
      )}

      {!config.previewUrl ? (
        <UploadBox style={{ padding: "2rem 1.5rem" }}>
          <FaCloudUploadAlt size={24} />
          <span style={{ fontWeight: 800 }}>
            Upload Design for {currentSide === "front" ? "Front" : "Back"}
          </span>
          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
            Transparent background PNG required
          </span>
          <input
            id="inline-upload-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </UploadBox>
      ) : (
        <>
          <ArtworkManager $isArabic={isArabic}>
            <ArtworkInfo>
              <ArtworkThumbnailWrap>
                <img src={config.previewUrl} alt="Thumbnail" />
              </ArtworkThumbnailWrap>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  color: "#FFF",
                }}
              >
                {config.file?.name
                  ? config.file.name.substring(0, 12) +
                    (config.file.name.length > 12 ? "..." : "")
                  : "Artwork File"}
              </span>
            </ArtworkInfo>
            <ActionRow>
              <MiniActionButton
                type="button"
                title={t("view", "View Alone")}
                onClick={() => setIsLightboxOpen(true)}
              >
                <FaEye />
              </MiniActionButton>
              <MiniActionButton
                type="button"
                title={t("change", "Replace Image")}
                onClick={() => replacementInputRef.current.click()}
              >
                <FaCloudUploadAlt />
                <input
                  type="file"
                  ref={replacementInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </MiniActionButton>
              <MiniActionButton
                type="button"
                className="danger"
                title={t("delete", "Remove Design")}
                onClick={clearSide}
              >
                <FaTrash />
              </MiniActionButton>
            </ActionRow>
          </ArtworkManager>

          <LiveSpecsCard>
            <SpecMetric>
              <span className="label">Width</span>
              <span className="value">{physicalMetrics.width} cm</span>
            </SpecMetric>
            <SpecMetric>
              <span className="label">Height</span>
              <span className="value">{physicalMetrics.height} cm</span>
            </SpecMetric>
            <SpecMetric
              style={{
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                paddingLeft: "8px",
              }}
            >
              <span className="label">Print Cost</span>
              <span className="value price-value">DA {livePrintCost}</span>
            </SpecMetric>
          </LiveSpecsCard>

          <OptionSection>
            <SectionLabel>{t("pod_studio_scale_percentage")}</SectionLabel>
            <DimensionSegment>
              <SegmentBtn
                type="button"
                $active={refDimension === "width"}
                onClick={() => setRefDimension("width")}
              >
                <FaArrowsAltH /> {t("width_prefix", "Width")}
              </SegmentBtn>
              <SegmentBtn
                type="button"
                $active={refDimension === "height"}
                onClick={() => setRefDimension("height")}
              >
                <FaArrowsAltV /> {t("height_prefix", "Height")}
              </SegmentBtn>
            </DimensionSegment>

            <SliderGroup>
              <label>
                <span>
                  {refDimension === "width"
                    ? t("width_prefix", "Width")
                    : t("height_prefix", "Height")}
                </span>
                <span>{currentActiveVal} cm</span>
              </label>
              <div className="row-input">
                <input
                  type="range"
                  name="scale"
                  min="15"
                  max="120"
                  value={config.scale}
                  onChange={handleSliderChange}
                />
                <input
                  type="number"
                  name="scale_cm"
                  step="0.1"
                  min={(0.15 * maxLimit).toFixed(1)}
                  max={maxLimit.toFixed(1)}
                  value={currentActiveVal}
                  onChange={handlePhysicalSizeChange}
                />
                <span style={{ fontSize: "0.8rem", color: "white" }}>cm</span>
              </div>
            </SliderGroup>
          </OptionSection>

          <SliderGroup>
            <label>X-Axis Alignment</label>
            <div className="row-input">
              <input
                type="range"
                name="x"
                min="0"
                max="100"
                value={config.x}
                onChange={handleSliderChange}
              />
            </div>
          </SliderGroup>

          <SliderGroup>
            <label>Y-Axis Alignment</label>
            <div className="row-input">
              <input
                type="range"
                name="y"
                min="0"
                max="100"
                value={config.y}
                onChange={handleSliderChange}
              />
            </div>
          </SliderGroup>

          <SliderGroup>
            <label>Angle Rotation</label>
            <div className="row-input">
              <input
                type="range"
                name="rotation"
                min="0"
                max="359"
                value={config.rotation}
                onChange={handleSliderChange}
              />
            </div>
          </SliderGroup>
        </>
      )}

      <NavigationRow>
        <WizardBtn type="button" onClick={onBack}>
          {isArabic ? <FaChevronRight /> : <FaChevronLeft />} Back
        </WizardBtn>
        <WizardBtn type="button" $primary onClick={onNext}>
          Continue {isArabic ? <FaChevronLeft /> : <FaChevronRight />}
        </WizardBtn>
      </NavigationRow>

      <MobileFAB onClick={handleFABClick}>
        {podState[podState.side].previewUrl ? <FaSlidersH /> : <FaCloudUploadAlt />}
      </MobileFAB>

      <AnimatePresence>
        {isLightboxOpen && config.previewUrl && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <LightboxCard
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={config.previewUrl} alt="Bespoke Design view" />
              <button
                onClick={() => setIsLightboxOpen(false)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTimes />
              </button>
            </LightboxCard>
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </ControlsWrapper>
  );
};

export const PodStepThreeControls = ({
  podState,
  product,
  selectedColor,
  selectedSize,
  currentSizeDetails,
  onBack,
  onSubmit,
  isSubmitting,
  isArabic,
}) => {
  const { t } = useTranslation();
  const baseApparelCost = currentSizeDetails?.sellingPrice || 0;

  const garmentDims = getGarmentDimensions(
    product.name,
    selectedSize,
    product.sizeChart
  );

  const frontMetrics = calculatePhysicalMetrics(
    podState.front.scale,
    garmentDims.B,
    garmentDims.A,
    podState.front.aspectRatio || 1
  );

  const backMetrics = calculatePhysicalMetrics(
    podState.back.scale,
    garmentDims.B,
    garmentDims.A,
    podState.back.aspectRatio || 1
  );

  const frontPrintCost = useMemo(() => {
    if (!podState.front.file && !podState.front.previewUrl) return 0;
    return getRawPrintCost(frontMetrics.width, frontMetrics.height) + 50;
  }, [podState.front, frontMetrics]);

  const backPrintCost = useMemo(() => {
    if (!podState.back.file && !podState.back.previewUrl) return 0;
    return getRawPrintCost(backMetrics.width, backMetrics.height);
  }, [podState.back, backMetrics]);

  const finalCost = baseApparelCost + frontPrintCost + backPrintCost;

  return (
    <ControlsWrapper>
      <h3
        style={{
          fontSize: "1.2rem",
          fontWeight: 800,
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "white",
          fontFamily: "Tajawal",
        }}
      >
        <FaEye style={{ color: "#39A170" }} /> Billing Breakdown
      </h3>

      <SummaryCard>
        <SummaryRow>
          <SummaryLabel>Apparel Base:</SummaryLabel>
          <SummaryValue>{baseApparelCost} DA</SummaryValue>
        </SummaryRow>

        {frontPrintCost > 0 && (
          <SummaryRow>
            <SummaryLabel>Front Print Cost:</SummaryLabel>
            <SummaryValue>+{frontPrintCost} DA</SummaryValue>
          </SummaryRow>
        )}

        {backPrintCost > 0 && (
          <SummaryRow>
            <SummaryLabel>Back Print Cost:</SummaryLabel>
            <SummaryValue>+{backPrintCost} DA</SummaryValue>
          </SummaryRow>
        )}

        <SummaryRow
          style={{
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SummaryLabel style={{ fontSize: "1rem", fontWeight: "bold" }}>
            Total Due:
          </SummaryLabel>
          <SummaryValue style={{ fontSize: "1.25rem", color: "#39A170" }}>
            {finalCost} DA
          </SummaryValue>
        </SummaryRow>
      </SummaryCard>

      <NavigationRow>
        <WizardBtn type="button" onClick={onBack} disabled={isSubmitting}>
          {isArabic ? <FaChevronRight /> : <FaChevronLeft />} Edit Design
        </WizardBtn>
        <WizardBtn
          type="button"
          $primary
          onClick={() => onSubmit(finalCost)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <FaSpinner className="fa-spin" />
          ) : (
            <>
              <FaShoppingCart /> Add to Cart
            </>
          )}
        </WizardBtn>
      </NavigationRow>
    </ControlsWrapper>
  );
};

const InlineProductDetails = ({
  product,
  isPodShop,
  onAddToCart,
  onUpdateQuantity,
  cartItems,
  isOrderingEnabled,
  onClose,
  onImageChange,
  onWizardStepChange,
  editingCartItem,
  setEditingCartItem,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";

  const isPod = product?.printOnDemand || isPodShop;

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageId, setActiveImageId] = useState(null);
  const [imagesMap, setImagesMap] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [wizardStep, setWizardStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [podState, setPodState] = useState({
    side: "front",
    front: {
      file: null,
      previewUrl: null,
      scale: 80,
      x: 50,
      y: 50,
      rotation: 0,
      aspectRatio: 1,
    },
    back: {
      file: null,
      previewUrl: null,
      scale: 80,
      x: 50,
      y: 50,
      rotation: 0,
      aspectRatio: 1,
    },
  });

  useEffect(() => {
    if (onWizardStepChange) onWizardStepChange(wizardStep);
  }, [wizardStep, onWizardStepChange]);

  useEffect(() => {
    let isMounted = true;
    let freshFrontUrl = null;
    let freshBackUrl = null;

    if (editingCartItem) {
      const rawCustom = editingCartItem.podCustomization;
      const adaptedCustom = editingCartItem.customization;

      const custom =
        rawCustom ||
        (adaptedCustom
          ? {
              printSide: adaptedCustom.printSide,
              front: adaptedCustom.front
                ? {
                    originalImageUrl:
                      adaptedCustom.front.artworkUrl ||
                      adaptedCustom.front.originalImageUrl,
                    width:
                      adaptedCustom.front.widthPercent ??
                      adaptedCustom.front.width,
                    x:
                      adaptedCustom.front.xOffsetPercent ??
                      adaptedCustom.front.x,
                    y:
                      adaptedCustom.front.yOffsetPercent ??
                      adaptedCustom.front.y,
                    rotation: adaptedCustom.front.rotation,
                  }
                : null,
              back: adaptedCustom.back
                ? {
                    originalImageUrl:
                      adaptedCustom.back.artworkUrl ||
                      adaptedCustom.back.originalImageUrl,
                    width:
                      adaptedCustom.back.widthPercent ??
                      adaptedCustom.back.width,
                    x:
                      adaptedCustom.back.xOffsetPercent ?? adaptedCustom.back.x,
                    y:
                      adaptedCustom.back.yOffsetPercent ?? adaptedCustom.back.y,
                    rotation: adaptedCustom.back.rotation,
                  }
                : null,
            }
          : null);

      if (custom) {
        const stableId =
          editingCartItem.variantId || editingCartItem.lineItemId;
        setWizardStep(2);

        const loadDesignUrls = async () => {
          let frontPreview = custom.front
            ? custom.front.originalImageUrl
            : null;
          let backPreview = custom.back ? custom.back.originalImageUrl : null;

          if (custom.front?.originalImageUrl?.startsWith("blob:") && stableId) {
            const blob = await retrieveFile(`${stableId}_front`);
            if (blob && isMounted) {
              freshFrontUrl = URL.createObjectURL(blob);
              frontPreview = freshFrontUrl;
            }
          }

          if (custom.back?.originalImageUrl?.startsWith("blob:") && stableId) {
            const blob = await retrieveFile(`${stableId}_back`);
            if (blob && isMounted) {
              freshBackUrl = URL.createObjectURL(blob);
              backPreview = freshBackUrl;
            }
          }

          if (isMounted) {
            setPodState({
              side: custom.printSide === "back" ? "back" : "front",
              front: custom.front
                ? {
                    file: "existing",
                    previewUrl: frontPreview,
                    scale: custom.front.width,
                    x: custom.front.x,
                    y: custom.front.y,
                    rotation: custom.front.rotation || 0,
                    aspectRatio: 1,
                  }
                : {
                    file: null,
                    previewUrl: null,
                    scale: 80,
                    x: 50,
                    y: 50,
                    rotation: 0,
                    aspectRatio: 1,
                  },
              back: custom.back
                ? {
                    file: "existing",
                    previewUrl: backPreview,
                    scale: custom.back.width,
                    x: custom.back.x,
                    y: custom.back.y,
                    rotation: custom.back.rotation || 0,
                    aspectRatio: 1,
                  }
                : {
                    file: null,
                    previewUrl: null,
                    scale: 80,
                    x: 50,
                    y: 50,
                    rotation: 0,
                    aspectRatio: 1,
                  },
            });
          }
        };

        loadDesignUrls();
      }
    } else {
      setPodState({
        side: "front",
        front: {
          file: null,
          previewUrl: null,
          scale: 80,
          x: 50,
          y: 50,
          rotation: 0,
          aspectRatio: 1,
        },
        back: {
          file: null,
          previewUrl: null,
          scale: 80,
          x: 50,
          y: 50,
          rotation: 0,
          aspectRatio: 1,
        },
      });
      setActiveImageId(null);
    }

    return () => {
      isMounted = false;
      if (freshFrontUrl) URL.revokeObjectURL(freshFrontUrl);
      if (freshBackUrl) URL.revokeObjectURL(freshBackUrl);
    };
  }, [editingCartItem]);

  useEffect(() => {
    if (product?.availabilities?.length > 0) {
      const firstAvail = product.availabilities[0];
      setSelectedColor(firstAvail.color);
      if (firstAvail.sizes?.length > 0) {
        setSelectedSize(firstAvail.sizes[0].size);
      }

      const previews = product?.previewImages ?? [];
      setActiveImageId(previews.length > 0 ? previews[0] : firstAvail.imageId);
    }
  }, [product]);

  const currentAvailability = useMemo(() => {
    return product.availabilities.find((a) => a.color === selectedColor);
  }, [product, selectedColor]);

  const currentSizeDetails = useMemo(() => {
    return currentAvailability?.sizes.find((s) => s.size === selectedSize);
  }, [currentAvailability, selectedSize]);

  useEffect(() => {
    if (currentAvailability) {
      const sizeExists = currentAvailability.sizes.some(
        (s) => s.size === selectedSize
      );
      if (!sizeExists && currentAvailability.sizes?.length > 0) {
        setSelectedSize(currentAvailability.sizes[0].size);
      }
      const previews = product?.previewImages ?? [];
      setActiveImageId(
        previews.length > 0 ? previews[0] : currentAvailability.imageId
      );
    }
  }, [
    selectedColor,
    currentAvailability,
    selectedSize,
    product?.previewImages,
  ]);

  useEffect(() => {
    if (activeImageId && onImageChange) {
      onImageChange(product._id, activeImageId);
    }
  }, [activeImageId, onImageChange, product._id]);

  const activePodTemplateId = useMemo(() => {
    if (!isPod || !currentAvailability) return null;
    return podState.side === "back"
      ? currentAvailability.podBackTemplateId
      : currentAvailability.podFrontTemplateId;
  }, [isPod, currentAvailability, podState.side]);

  const allImageIds = useMemo(() => {
    const ids = [...(product?.previewImages ?? [])];
    if (product?.availabilities) {
      product.availabilities.forEach((av) => {
        if (av.imageId) ids.push(av.imageId);
        if (av.altImageIds) ids.push(...av.altImageIds);
        if (av.podFrontTemplateId) ids.push(av.podFrontTemplateId);
        if (av.podBackTemplateId) ids.push(av.podBackTemplateId);
      });
    }
    return Array.from(new Set(ids));
  }, [product]);

  useEffect(() => {
    allImageIds.forEach((id) => {
      if (imagesMap[id]) return;
      getImage(id).then((res) => {
        if (res.data) {
          setImagesMap((prev) => ({ ...prev, [id]: getImageUrl(res.data) }));
        }
      });
    });
  }, [allImageIds, imagesMap]);

  const currentVariantId = `${product._id}_${selectedColor}_${selectedSize}`;

  const handleAdd = () => {
    if (!currentSizeDetails) return;
    onAddToCart({
      product,
      productId: product._id,
      title: product.name,
      variantId: currentVariantId,
      color: selectedColor,
      size: selectedSize,
      sellingPrice: currentSizeDetails.sellingPrice,
      imageId: currentAvailability.imageId,
      quantity: 1,
    });
  };

  const galleryImages = useMemo(() => {
    const previews = product?.previewImages ?? [];
    const mockups = [];
    if (currentAvailability) {
      if (currentAvailability.imageId)
        mockups.push(currentAvailability.imageId);
      if (currentAvailability.altImageIds)
        mockups.push(...currentAvailability.altImageIds);
    }
    return Array.from(new Set([...previews, ...mockups]));
  }, [product?.previewImages, currentAvailability]);

  const showViews = !!(product.viewsCount && product.viewsCount > 0);
  const showSaves = !!(product.savesCount && product.savesCount > 0);

  const handleFinalSubmit = async (finalPrice) => {
    if (!currentSizeDetails) return;
    setIsSubmitting(true);

    const oldId = editingCartItem
      ? editingCartItem.variantId || editingCartItem.lineItemId
      : null;
    const targetVariantId = oldId || `${currentVariantId}_custom_${Date.now()}`;

    try {
      let frontImageId =
        podState.front.file === "existing" ? podState.front.previewUrl : null;
      let backImageId =
        podState.back.file === "existing" ? podState.back.previewUrl : null;

      if (podState.front.file && podState.front.file !== "existing") {
        const frontForm = new FormData();
        frontForm.append("file", podState.front.file);
        const frontRes = await axios.post(
          `${process.env.REACT_APP_API_PROD_URL}/image/upload`,
          frontForm
        );
        frontImageId = frontRes.data.url;

        await persistFile(`${targetVariantId}_front`, podState.front.file);
      }

      if (podState.back.file && podState.back.file !== "existing") {
        const backForm = new FormData();
        backForm.append("file", podState.back.file);
        const backRes = await axios.post(
          `${process.env.REACT_APP_API_PROD_URL}/image/upload`,
          backForm
        );
        backImageId = backRes.data.url;

        await persistFile(`${targetVariantId}_back`, podState.back.file);
      }

      const hasFront = !!frontImageId;
      const hasBack = !!backImageId;

      const printSideKeyword =
        hasFront && hasBack
          ? "double"
          : hasBack
            ? "back"
            : hasFront
              ? "front"
              : "blank";

      const baseApparelCost = currentSizeDetails?.sellingPrice || 0;

      const garmentDims = getGarmentDimensions(
        product.name,
        selectedSize,
        product.sizeChart
      );

      const frontMetrics = calculatePhysicalMetrics(
        podState.front.scale,
        garmentDims.B,
        garmentDims.A,
        podState.front.aspectRatio || 1
      );

      const backMetrics = calculatePhysicalMetrics(
        podState.back.scale,
        garmentDims.B,
        garmentDims.A,
        podState.back.aspectRatio || 1
      );

      const frontPrintCost = (() => {
        if (!podState.front.file && !podState.front.previewUrl) return 0;
        return getRawPrintCost(frontMetrics.width, frontMetrics.height) + 50;
      })();

      const backPrintCost = (() => {
        if (!podState.back.file && !podState.back.previewUrl) return 0;
        return getRawPrintCost(backMetrics.width, backMetrics.height);
      })();

      const customizationData = {
        printSide: printSideKeyword,
        baseGarmentCost: baseApparelCost,
        printCost: frontPrintCost + backPrintCost,
        front: hasFront
          ? {
              imageId: frontImageId,
              imageUrl: frontImageId,
              originalImageId: frontImageId,
              originalImageUrl: frontImageId,
              x: podState.front.x,
              y: podState.front.y,
              width: parseFloat(frontMetrics.width.toFixed(1)),
              height: parseFloat(frontMetrics.height.toFixed(1)),
              rotation: podState.front.rotation,
              templateUrl: currentAvailability?.podFrontTemplateId
                ? `${process.env.REACT_APP_API_PROD_URL}/image/raw/${currentAvailability.podFrontTemplateId}`
                : null,
            }
          : null,
        back: hasBack
          ? {
              imageId: backImageId,
              imageUrl: backImageId,
              originalImageId: backImageId,
              originalImageUrl: backImageId,
              x: podState.back.x,
              y: podState.back.y,
              width: parseFloat(backMetrics.width.toFixed(1)),
              height: parseFloat(backMetrics.height.toFixed(1)),
              rotation: podState.back.rotation,
              templateUrl: currentAvailability?.podBackTemplateId
                ? `${process.env.REACT_APP_API_PROD_URL}/image/raw/${currentAvailability.podBackTemplateId}`
                : null,
            }
          : null,
      };

      if (editingCartItem) {
        dispatch(updateCartQuantity({ variantId: oldId, quantity: 0 }));
      }

      onAddToCart({
        product,
        productId: product._id,
        title: product.name,
        variantId: targetVariantId,
        color: selectedColor,
        size: selectedSize,
        sellingPrice: finalPrice,
        imageId: currentAvailability.imageId,
        quantity: editingCartItem ? editingCartItem.quantity : 1,
        podCustomization: customizationData,
      });

      setPodState({
        side: "front",
        front: {
          file: null,
          previewUrl: null,
          scale: 80,
          x: 50,
          y: 50,
          rotation: 0,
          aspectRatio: 1,
        },
        back: {
          file: null,
          previewUrl: null,
          scale: 80,
          x: 50,
          y: 50,
          rotation: 0,
          aspectRatio: 1,
        },
      });
      setWizardStep(1);
      setEditingCartItem(null);
      if (onClose) onClose();
    } catch (error) {
      console.error("Customization failed:", error);
      alert("Failed to submit design, try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DetailContainer
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BlurredBackdrop
          $imgUrl={imagesMap[activePodTemplateId] || imagesMap[activeImageId]}
        />
        <GradientOverlay />

        <RelativeContent>
          {isPod && (
            <PodStepIndicator currentStep={wizardStep} isArabic={isArabic} />
          )}

          <SplitGrid>
            {/* LEFT SIDE */}
            <div>
              {isPod && wizardStep >= 2 ? (
                <PodCanvasPreview
                  baseImageUrl={
                    imagesMap[activePodTemplateId] || imagesMap[activeImageId]
                  }
                  podState={podState}
                  setPodState={setPodState}
                  productName={product.name}
                  selectedSize={selectedSize}
                />
              ) : (
                <GallerySection>
                  {imagesMap[activeImageId] && (
                    <BlurBackground $imgUrl={imagesMap[activeImageId]} />
                  )}
                  {(showViews || showSaves) && (
                    <FloatingSocialProof>
                      {showViews ? (
                        <ProofBadge>
                          <FaEye /> {product.viewsCount}
                        </ProofBadge>
                      ) : null}
                      {showSaves ? (
                        <ProofBadge>
                          <FaBookmark /> {product.savesCount}
                        </ProofBadge>
                      ) : null}
                    </FloatingSocialProof>
                  )}

                  <MainImageWrapper onClick={() => setIsLightboxOpen(true)}>
                    <AnimatePresence mode="wait">
                      {imagesMap[activeImageId] && (
                        <SharpForegroundImage
                          key={activeImageId}
                          src={imagesMap[activeImageId]}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </AnimatePresence>

                    <ImageOverlayScrim $isArabic={isArabic}>
                      {product.brand && <Brand>{product.brand}</Brand>}
                      <ProductName>{product.name}</ProductName>
                      <Price>
                        {parseInt(currentSizeDetails?.sellingPrice || 0)}{" "}
                        {t("zd", "DA")}
                      </Price>
                    </ImageOverlayScrim>

                    <ZoomHint>
                      <FaExpand />
                    </ZoomHint>
                  </MainImageWrapper>

                  {galleryImages.length > 1 && (
                    <AltImagesRow>
                      {galleryImages.map((id, index) => (
                        <AltThumbnail
                          key={index}
                          $active={activeImageId === id}
                          onClick={() => setActiveImageId(id)}
                        >
                          <img src={imagesMap[id]} alt="Alt view" />
                        </AltThumbnail>
                      ))}
                    </AltImagesRow>
                  )}
                </GallerySection>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div>
              {!isPod ? (
                <InfoSection>
                  <ProductName>{product.name}</ProductName>
                  <ActionPanelRow>
                    <PanelSection>
                      <SectionLabel>{t("color_prefix")}</SectionLabel>
                      <PillsContainer>
                        {product.availabilities.map((av) => (
                          <ColorSwatch
                            key={av.color}
                            $active={selectedColor === av.color}
                            $colorCode={
                              COLOR_MAP[av.color.toLowerCase()] || av.color
                            }
                            onClick={() => setSelectedColor(av.color)}
                          />
                        ))}
                      </PillsContainer>
                    </PanelSection>

                    {currentAvailability && (
                      <PanelSection>
                        <SectionLabel>{t("size_prefix")}</SectionLabel>
                        <PillsContainer>
                          {currentAvailability.sizes.map((s) => (
                            <SizePill
                              key={s.size}
                              $active={selectedSize === s.size}
                              onClick={() => setSelectedSize(s.size)}
                            >
                              {s.size}
                            </SizePill>
                          ))}
                        </PillsContainer>
                      </PanelSection>
                    )}
                  </ActionPanelRow>
                  <AddToCartBtn onClick={handleAdd}>
                    {t("add_to_cart")}
                  </AddToCartBtn>
                </InfoSection>
              ) : (
                <div
                  style={{
                    minHeight: "350px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {wizardStep === 1 && (
                    <InfoSection style={{ padding: 0 }}>
                      <div style={{ marginBottom: "1rem" }}>
                        <Brand>{product.brand}</Brand>
                        <ProductName
                          style={{ fontSize: "1.6rem", marginTop: "4px" }}
                        >
                          {product.name}
                        </ProductName>
                        <Price style={{ fontSize: "1.4rem", marginTop: "4px" }}>
                          {currentSizeDetails?.sellingPrice} DA
                        </Price>
                      </div>

                      <ActionPanelRow>
                        <PanelSection>
                          <SectionLabel
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaPalette /> Colors
                          </SectionLabel>
                          <PillsContainer>
                            {product.availabilities.map((av) => {
                              const hex =
                                COLOR_MAP[av.color.toLowerCase()] || av.color;
                              return (
                                <ColorSwatch
                                  key={av.color}
                                  $active={selectedColor === av.color}
                                  $colorCode={hex}
                                  onClick={() => setSelectedColor(av.color)}
                                >
                                  {selectedColor === av.color && (
                                    <FaCheck
                                      size={10}
                                      color={
                                        av.color.toLowerCase() === "white"
                                          ? "#000"
                                          : "#fff"
                                      }
                                    />
                                  )}
                                </ColorSwatch>
                              );
                            })}
                          </PillsContainer>
                        </PanelSection>

                        {currentAvailability && (
                          <PanelSection>
                            <SectionLabel>Sizes</SectionLabel>
                            <PillsContainer>
                              {currentAvailability.sizes.map((s) => (
                                <SizePill
                                  key={s.size}
                                  $active={selectedSize === s.size}
                                  onClick={() => setSelectedSize(s.size)}
                                >
                                  {s.size}
                                </SizePill>
                              ))}
                            </PillsContainer>
                          </PanelSection>
                        )}
                      </ActionPanelRow>

                      <NavigationRow style={{ marginTop: "2rem" }}>
                        <WizardBtn
                          type="button"
                          $primary
                          onClick={() => setWizardStep(2)}
                        >
                          Customize Garment{" "}
                          {isArabic ? <FaChevronLeft /> : <FaChevronRight />}
                        </WizardBtn>
                      </NavigationRow>
                    </InfoSection>
                  )}

                  {wizardStep === 2 && (
                    <PodStepTwoControls
                      podState={podState}
                      setPodState={setPodState}
                      product={product}
                      isArabic={isArabic}
                      onBack={() => setWizardStep(1)}
                      onNext={() => setWizardStep(3)}
                    />
                  )}

                  {wizardStep === 3 && (
                    <PodStepThreeControls
                      podState={podState}
                      product={product}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      currentSizeDetails={currentSizeDetails}
                      isArabic={isArabic}
                      isSubmitting={isSubmitting}
                      onBack={() => setWizardStep(2)}
                      onSubmit={handleFinalSubmit}
                    />
                  )}
                </div>
              )}
            </div>
          </SplitGrid>
        </RelativeContent>

        {onClose && (
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        )}
      </DetailContainer>

      <AnimatePresence>
        {isLightboxOpen && imagesMap[activeImageId] && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.img
              src={imagesMap[activeImageId]}
              alt={product.name}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default InlineProductDetails;