import React, { useRef, useState, useMemo } from "react";
import styled from "styled-components";
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
} from "react-icons/fa";
import axios from "axios";

// --- Progress steps bar on top ---
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
  opacity: ${(props) => (props.$active ? 1 : 0.4)};
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

// ============================================================================
// STYLED WORKSPACE
// ============================================================================

export const PodCanvasContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e5e5;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.05);
  user-select: none;
`;

const GarmentWorkspace = styled.div`
  position: relative;
  height: 100%;
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

const PrintableArea = styled.div`
  position: absolute;
  top: 15%;
  left: 20%;
  width: 60%;
  height: 70%;
  border: 1px dashed ${(props) => props.theme.primaryColor || "#39A170"};
  z-index: 2;
  overflow: hidden;
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

const InteractiveContainer = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: move;
  z-index: 5;
  user-select: none;
  touch-action: none;
  border: 1px dashed rgba(255, 255, 255, 0.4);
`;

const SharpArtwork = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  pointer-events: none;
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
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 8px 12px;
  border-radius: 50px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  transition: all 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
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
    width: 60px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
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

const SegmentedControl = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 12px;
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

// ============================================================================
// THE LINEAR INTERPOLATION ENGINE (CONTINUOUS PRICING SCALER)
// ============================================================================

const interpolateValue = (x, nodes) => {
  if (x <= nodes[0].x) return nodes[0].y;
  if (x >= nodes[nodes.length - 1].x) return nodes[nodes.length - 1].y;

  for (let i = 0; i < nodes.length - 1; i++) {
    const p1 = nodes[i];
    const p2 = nodes[i + 1];
    if (x >= p1.x && x <= p2.x) {
      return p1.y + ((x - p1.x) / (p2.x - p1.x)) * (p2.y - p1.y);
    }
  }
  return nodes[nodes.length - 1].y;
};

// --- FIX: Returns RAW print cost strictly (decoupled from transfer fees) ---
export const getRawPrintCost = (widthCm, heightCm) => {
  const largestSide = Math.max(widthCm, heightCm);
  const smallestSide = Math.min(widthCm, heightCm);

  let printCost = 0;

  if (widthCm <= 30 || heightCm <= 30) {
    // Category 1: Small Formats - Linear Interpolation Nodes
    const x = largestSide;
    const nodes = [
      { x: 0, y: 20 },
      { x: 5, y: 60 },
      { x: 10, y: 110 },
      { x: 15, y: 180 },
      { x: 20, y: 270 },
      { x: 25, y: 380 },
      { x: 30, y: 440 },
      { x: 35, y: 500 },
      { x: 40, y: 560 },
      { x: 45, y: 610 },
      { x: 50, y: 680 },
      { x: 55, y: 740 },
      { x: 60, y: 800 },
    ];
    printCost = interpolateValue(x, nodes);
  } else {
    // Category 2: Large Formats - Linear Interpolation Nodes
    const x = smallestSide;
    const nodes = [
      { x: 30, y: 860 },
      { x: 35, y: 960 },
      { x: 40, y: 1100 },
      { x: 45, y: 1220 },
      { x: 50, y: 1460 },
      { x: 60, y: 1600 },
    ];
    printCost = interpolateValue(x, nodes);
  }

  return Math.round(printCost);
};

// ============================================================================
// COMPONENT RENDER SECTIONS
// ============================================================================

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

export const PodCanvasPreview = ({ baseImageUrl, podState, setPodState }) => {
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
            Math.max(0, Math.round(startXVal + percentageChangeX)),
          ),
          y: Math.min(
            100,
            Math.max(0, Math.round(startYVal + percentageChangeY)),
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
            100,
            Math.max(15, Math.round(startScale * scaleFactor)),
          ),
        },
      }));
    } else if (type === "rotate") {
      const center = {
        x: bounds.left + bounds.width / 2,
        top: bounds.top + bounds.height / 2,
      };
      const angle =
        Math.atan2(e.clientY - center.top, e.clientX - center.x) *
        (180 / Math.PI);
      const startAngle =
        Math.atan2(startY - center.top, startX - center.x) * (180 / Math.PI);

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
          <BaseGarmentImage src={baseImageUrl} alt="Base Product" />
        ) : (
          <div style={{ color: "#888" }}>Loading templates...</div>
        )}

        <PrintableArea>
          <GridOverlay $visible={showGrid} />
          {config.previewUrl && (
            <InteractiveContainer
              style={{
                left: `${config.x}%`,
                top: `${config.y}%`,
                width: `${config.scale}%`,
                aspectRatio: "1/1",
                transform: `translate(-50%, -50%) rotate(${config.rotation}deg)`,
              }}
              onPointerDown={(e) => handlePointerDown(e, "drag")}
            >
              <SharpArtwork src={config.previewUrl} alt="Artwork" />
              <ScaleHandle
                onPointerDown={(e) => handlePointerDown(e, "scale")}
              />
              <RotateHandle
                onPointerDown={(e) => handlePointerDown(e, "rotate")}
              />
            </InteractiveContainer>
          )}
        </PrintableArea>
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
  const currentSide = podState.side;
  const config = podState[currentSide];

  // Dynamic real-time dimensions in cm
  const printWidthCm = useMemo(() => {
    const maxW = (product.printableAreaWidthMm || 280) / 10;
    return ((config.scale / 100) * maxW).toFixed(1);
  }, [config.scale, product]);

  const printHeightCm = useMemo(() => {
    const maxH = (product.printableAreaHeightMm || 350) / 10;
    return ((config.scale / 100) * maxH).toFixed(1);
  }, [config.scale, product]);

  // Real-time linear print cost calculation (fully continuous)
  const livePrintCost = useMemo(() => {
    const w = parseFloat(printWidthCm);
    const h = parseFloat(printHeightCm);
    // Raw cost + single side transfer fee (+50 DA)
    return getRawPrintCost(w, h) + 50;
  }, [printWidthCm, printHeightCm]);

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

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    let numericValue = Math.round(parseFloat(value) || 0);
    if (name === "scale")
      numericValue = Math.min(100, Math.max(15, numericValue));
    else numericValue = Math.min(100, Math.max(0, numericValue));

    setPodState((prev) => ({
      ...prev,
      [currentSide]: { ...prev[currentSide], [name]: numericValue },
    }));
  };

  const clearSide = () => {
    setPodState((prev) => ({
      ...prev,
      [currentSide]: {
        file: null,
        previewUrl: null,
        scale: 80,
        x: 50,
        y: 50,
        rotation: 0,
      },
    }));
  };

  return (
    <ControlsWrapper>
      {product.hasBackPrintSurface && (
        <SegmentedControl>
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
        </SegmentedControl>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "0.85rem", color: "#a1a1aa", fontWeight: 700 }}
            >
              Artwork Configured
            </span>
            <button
              onClick={clearSide}
              style={{
                background: "transparent",
                border: "none",
                color: "#EF4444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              <FaRedo /> Reset Side
            </button>
          </div>

          {/* --- ENFORCED LIVE SPECS & LINEAR COST METRICS BAR --- */}
          <LiveSpecsCard>
            <SpecMetric>
              <span className="label">Width</span>
              <span className="value">{printWidthCm} cm</span>
            </SpecMetric>
            <SpecMetric>
              <span className="label">Height</span>
              <span className="value">{printHeightCm} cm</span>
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

          <SliderGroup>
            <label>Scale Percentage</label>
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
                name="scale"
                value={config.scale}
                onChange={handleNumericChange}
              />
              <span style={{ fontSize: "0.8rem" }}>%</span>
            </div>
          </SliderGroup>

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
              <input
                type="number"
                name="x"
                value={config.x}
                onChange={handleNumericChange}
              />
              <span style={{ fontSize: "0.8rem" }}>%</span>
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
              <input
                type="number"
                name="y"
                value={config.y}
                onChange={handleNumericChange}
              />
              <span style={{ fontSize: "0.8rem" }}>%</span>
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
              <input
                type="number"
                name="rotation"
                value={config.rotation}
                onChange={handleNumericChange}
              />
              <span style={{ fontSize: "0.8rem" }}>°</span>
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
