import React, { useRef, useState, useMemo, useEffect } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import {
  FaUpload,
  FaRedo,
  FaChevronRight,
  FaChevronLeft,
  FaShoppingCart,
  FaPalette,
  FaEye,
  FaSpinner,
  FaBorderAll,
  FaTshirt,
  FaArrowsAltH,
  FaArrowsAltV,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { 
  getGarmentDimensions, 
  getTemplateConfig, 
  getRawPrintCost, 
  getFittedPrintZoneRatios,
  calculatePhysicalMetrics,
  calculateScaleFromPhysicalWidth
} from "../../../PodStudio/hooks/usePrintableArea";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// STYLED COMPONENTS - UNIFIED LAYOUT LAYERS
// ============================================================================

const TemplateContentArea = styled.div`
  position: absolute;
  z-index: 2;
  overflow: hidden; /* THE PHYSICAL PRODUCT BOUNDARY CLIPPING CONTAINER */
  top: ${props => props.$area.top}%;
  left: ${props => props.$area.left}%;
  width: ${props => props.$area.width}%;
  height: ${props => props.$area.height}%;
  pointer-events: none;
`;

const InteractivePrintArea = styled.div`
  position: absolute;
  top: ${props => props.$area.top}%;
  left: ${props => props.$area.left}%;
  width: ${props => props.$area.width}%;
  height: ${props => props.$area.height}%;
  pointer-events: auto;
  z-index: 3;
`;

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
  color: ${(props) => (props.$active ? "#000" : "#FFF")};
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

const PodCanvasContainer = styled.div`
  width: 100%;
  height: 440px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 
    radial-gradient(circle at center, rgba(240, 122, 72, 0.1) 0%, rgba(12, 12, 14, 0.98) 100%),
    linear-gradient(45deg, #141416 25%, transparent 25%), 
    linear-gradient(-45deg, #141416 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #141416 75%), 
    linear-gradient(-45deg, transparent 75%, #141416 75%);
  background-size: 100% 100%, 16px 16px, 16px 16px, 16px 16px, 16px 16px;
  background-position: center, 0 0, 0 8px, 8px -8px, -8px 0px;
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
  background-image:
    linear-gradient(to right, rgba(57, 161, 112, 0.6) 1px, transparent 1px),
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

// --- WORKSPACE BLUEPRINT LEGEND KEY ---
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
  font-family: 'Cairo', sans-serif;
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
    background: ${props => props.$color || "#fff"};
  }
  
  .label {
    font-weight: 700;
    color: #ffffff;
    font-family: 'Tajawal', sans-serif;
  }

  .value {
    font-family: monospace;
    font-weight: 700;
    color: ${props => props.$valColor || "#a1a1aa"};
  }
`;

// --- STYLED COMPONENTS FOR CONTROLS ---

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
  font-family: 'Tajawal', sans-serif;
`;

const OptionSegment = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 12px;
`;

const NavigationRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

const WizardBtn = styled.button`
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
      ? `
    background: ${props.theme.primaryColor};
    color: #000;
    &:hover { transform: translateY(-2px); filter: brightness(1.1); }
  `
      : `
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255,255,255,0.08);
    &:hover { background: rgba(255, 255, 255, 0.1); }
  `}

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

const OptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: start;
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Tajawal", sans-serif;
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
  background-image: 
    linear-gradient(45deg, #18181b 25%, transparent 25%), 
    linear-gradient(-45deg, #18181b 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #18181b 75%), 
    linear-gradient(-45deg, transparent 75%, #18181b 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
  background-color: #27272a; /* Checkered grid pattern */
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
`;

const LightboxCard = styled(motion.div)`
  width: 90%;
  max-width: 450px;
  aspect-ratio: 1;
  background-image: 
    linear-gradient(45deg, #18181b 25%, transparent 25%), 
    linear-gradient(-45deg, #18181b 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #18181b 75%), 
    linear-gradient(-45deg, transparent 75%, #18181b 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: #27272a;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
  position: relative;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

// ============================================================================
// COMPONENT LOGIC IMPLEMENTATIONS
// ============================================================================

const PodStepIndicator = ({ currentStep, isArabic }) => {
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

const PodCanvasPreview = ({ baseImageUrl, podState, setPodState, productName, selectedSize = "M" }) => {
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

  // Real-world physical dimensions lookup
  const garmentDims = useMemo(() => {
    return getGarmentDimensions(productName, selectedSize);
  }, [productName, selectedSize]);

  const cfg = useMemo(() => {
    return getTemplateConfig(productName);
  }, [productName]);

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
          x: Math.min(100, Math.max(0, Math.round(startXVal + percentageChangeX))),
          y: Math.min(100, Math.max(0, Math.round(startYVal + percentageChangeY))),
        },
      }));
    } else if (type === "scale") {
      const scaleFactor = 1 + deltaX / 150;
      setPodState((prev) => ({
        ...prev,
        [currentSide]: {
          ...prev[currentSide],
          scale: Math.min(100, Math.max(15, Math.round(startScale * scaleFactor))),
        },
      }));
    } else if (type === "rotate") {
      const center = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
      const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
      const startAngle = Math.atan2(startY - center.y, startX - center.x) * (180 / Math.PI);

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
        <ToggleGridBtn type="button" onClick={() => setShowGrid(!showGrid)} >
          <FaBorderAll /> Grid
        </ToggleGridBtn>

        {baseImageUrl ? (
          <BaseGarmentImage src={baseImageUrl} alt="Base Product Substrate" />
        ) : (
          <div style={{ color: "#888" }}>Loading templates...</div>
        )}

        {/* 1. VISUAL PORTION (Sits inside the TemplateContentArea clipping container) */}
        <TemplateContentArea $area={ratios.contentArea}>
          <div style={{
            position: "absolute",
            top: `${ratios.printArea.top}%`,
            left: `${ratios.printArea.left}%`,
            width: `${ratios.printArea.width}%`,
            height: `${ratios.printArea.height}%`,
            overflow: "visible"
          }}>
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
                  pointerEvents: "none"
                }}
              />
            )}
          </div>
        </TemplateContentArea>

        {/* 2. INTERACTIVE CONTROLS OVERLAY LAYER (Crisp figma-like selection guidelines and handles) */}
        <InteractivePrintArea ref={containerRef} $area={ratios.absolutePrintArea}>
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
              {/* Fully transparent touch target hitbox */}
              <div style={{ width: "100%", height: "100%", opacity: 0 }} />
              <ScaleHandle onPointerDown={(e) => handlePointerDown(e, "scale")} />
              <RotateHandle onPointerDown={(e) => handlePointerDown(e, "rotate")} />
            </TransformableBox>
          )}
        </InteractivePrintArea>

        {/* BLUEPRINT PHYSICAL SPECIFICATION KEY/LEGEND */}
        {garmentDims && cfg && (
          <CanvasLegend>
            <LegendItem $color="#ffffff" $valColor="#ffffff">
              <span className="dot" />
              <span className="label">Garment (Body):</span>
              <span className="value">A: {garmentDims.A}cm {garmentDims.B ? `× B: ${garmentDims.B}cm` : ""}</span>
            </LegendItem>
            <LegendItem $color="#39a170" $valColor="#39a170">
              <span className="dot" />
              <span className="label">Print Area (Zone):</span>
              <span className="value">{(cfg.printW_ref / cfg.B_ref * garmentDims.B).toFixed(1)}cm × {(cfg.printH_ref / cfg.A_ref * garmentDims.A).toFixed(1)}cm</span>
            </LegendItem>
          </CanvasLegend>
        )}
      </GarmentWorkspace>
    </PodCanvasContainer>
  );
};

const PodStepTwoControls = ({
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

  const cfg = useMemo(() => getTemplateConfig(product.name), [product.name]);
  const garmentDims = useMemo(() => getGarmentDimensions(product.name, "M"), [product.name]);

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
        }
      };
    } else {
      setAspectRatio(1);
    }
    return () => { isMounted = false; };
  }, [config.previewUrl]);

  // Compute live real-world physical coordinates scaled EXACTLY to the print zone limits
  const physicalMetrics = useMemo(() => {
    const printWidthRatio = cfg.printW_ref / cfg.B_ref;
    const printHeightRatio = cfg.printH_ref / cfg.A_ref;
    return calculatePhysicalMetrics(config.scale, garmentDims.B, garmentDims.A, printWidthRatio, printHeightRatio, aspectRatio);
  }, [config.scale, garmentDims, cfg, aspectRatio]);

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
    const printWidthRatio = cfg.printW_ref / cfg.B_ref;
    const targetScalePct = calculateScaleFromPhysicalWidth(val, garmentDims.B, printWidthRatio);

    setPodState((prev) => ({
      ...prev,
      [currentSide]: {
        ...prev[currentSide],
        scale: Math.min(100, Math.max(15, Math.round(targetScalePct)))
      }
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

  const currentActiveVal = refDimension === "width" ? physicalMetrics.width : physicalMetrics.height;

  // Real-time linear print cost calculation (fully continuous)
  const livePrintCost = useMemo(() => {
    const w = parseFloat(physicalMetrics.width);
    const h = parseFloat(physicalMetrics.height);
    // Raw cost + single side transfer fee (+50 DA)
    return getRawPrintCost(w, h) + 50;
  }, [physicalMetrics.width, physicalMetrics.height]);

  return (
    <ControlsWrapper>
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
          <FaUpload size={24} />
          <span style={{ fontWeight: 800 }}>
            Upload Design for {currentSide === "front" ? "Front" : "Back"}
          </span>
          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
            Transparent background PNG required
          </span>
          <input type="file" accept="image/png" onChange={handleFileChange} />
        </UploadBox>
      ) : (
        <>
          {/* Checkered Artwork Asset Manager Header */}
          <ArtworkManager $isArabic={isArabic}>
            <ArtworkInfo>
              <ArtworkThumbnailWrap>
                <img src={config.previewUrl} alt="Thumbnail" />
              </ArtworkThumbnailWrap>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF" }}>
                {config.file?.name ? (
                  config.file.name.substring(0, 12) + (config.file.name.length > 12 ? "..." : "")
                ) : "Artwork File"}
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
                <FaUpload />
                <input
                  type="file"
                  ref={replacementInputRef}
                  accept="image/png"
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
            <SectionLabel>{t("pod_studio.scale_percentage")}</SectionLabel>
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
                <span>{refDimension === "width" ? t("width_prefix", "Width") : t("height_prefix", "Height")}</span>
                <span>{currentActiveVal} cm</span>
              </label>
              <div className="row-input">
                <input
                  type="range"
                  name="scale"
                  min="15"
                  max="100"
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
        <WizardBtn
          type="button"
          $primary
          onClick={onNext}
          disabled={!podState.front.file && !podState.back.file}
        >
          Continue {isArabic ? <FaChevronLeft /> : <FaChevronRight />}
        </WizardBtn>
      </NavigationRow>

      {/* Full-Screen Artwork Lightbox Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
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
                  justifyContent: "center"
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

const PodStepThreeControls = ({ 
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
  const baseApparelCost = currentSizeDetails?.sellingPrice || 0;

  const frontPrintCost = useMemo(() => {
    if (!podState.front.file) return 0;
    const wCm =
      (podState.front.scale / 100) *
      ((product.printableAreaWidthMm || 280) / 10);
    const hCm =
      (podState.front.scale / 100) *
      ((product.printableAreaHeightMm || 350) / 10);
    // Raw Front printing cost + Front transfer fee (+50 DA)
    return getRawPrintCost(wCm, hCm) + 50;
  }, [podState.front, product]);

  const backPrintCost = useMemo(() => {
    if (!podState.back.file) return 0;
    const wCm =
      (podState.back.scale / 100) *
      ((product.printableAreaWidthMm || 280) / 10);
    const hCm =
      (podState.back.scale / 100) *
      ((product.printableAreaHeightMm || 350) / 10);
    // Raw Back printing cost only (avoids duplicate transfer fee)
    return getRawPrintCost(wCm, hCm);
  }, [podState.back, product]);

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
          fontFamily: "Tajawal"
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

export {
  PodStepIndicator,
  PodCanvasPreview,
  PodStepTwoControls,
  PodStepThreeControls,
  NavigationRow,
  WizardBtn,
  PodCanvasContainer,
};