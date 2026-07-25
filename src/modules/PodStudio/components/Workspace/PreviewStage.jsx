import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaBorderAll, FaFillDrip } from "react-icons/fa";
import {
  getFittedPrintZoneRatios,
  useGarmentAlphaBounds,
} from "../../hooks/usePrintableArea";
import PrintableArea from "./PrintableArea";

const StageOuter = styled.div`
  width: 100%;
  height: 480px;
  background-color: #0c0c0e;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  user-select: none;
`;

const SolidColorBackground = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${(props) => props.$color || "#ffffff"};
  opacity: ${(props) => (props.$active ? 1 : 0)};
  z-index: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const StageFloatingControls = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
  flex-wrap: wrap;
`;

const FloatingToggleBtn = styled.button`
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid
    ${(props) =>
      props.$active
        ? props.theme.primaryColor || "#F07A48"
        : "rgba(255, 255, 255, 0.15)"};
  color: ${(props) =>
    props.$active ? props.theme.primaryColor || "#F07A48" : "#ffffff"};
  padding: 0.5rem 0.9rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const FloatingColorWheel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 8px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  input[type="color"] {
    border: none;
    background: none;
    width: 20px;
    height: 20px;
    cursor: pointer;
    padding: 0;
  }
`;

const WorkspaceContainer = styled.div`
  position: relative;
  width: 95%;
  height: 95%;
  max-width: 440px;
  max-height: 440px;
  aspect-ratio: 1 / 1;
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 2;
`;

const BackgroundTemplate = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
`;

const BoundingBox = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  box-sizing: border-box;
  pointer-events: none;
  overflow: hidden;
  border-radius: 24px;
  background: transparent !important;
`;

const GridSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: ${(props) => (props.$visible ? 0.85 : 0)};
  transition: opacity 0.2s ease;
`;

const GridLines = ({ visible, ratios }) => {
  if (!visible) return null;

  const centerY = ratios
    ? ratios.absolutePrintArea.top + ratios.absolutePrintArea.height / 2
    : 50;

  return (
    <GridSvg $visible={visible}>
      {[20, 40, 60, 80].map((pct) => (
        <React.Fragment key={`v-${pct}`}>
          <line
            x1={`${pct}%`}
            y1="0"
            x2={`${pct}%`}
            y2="100%"
            stroke="#000"
            strokeWidth="3"
          />
          <line
            x1={`${pct}%`}
            y1="0"
            x2={`${pct}%`}
            y2="100%"
            stroke={pct === 40 || pct === 60 ? "#397FF9" : "#FF4D4D"}
            strokeWidth="1"
          />
        </React.Fragment>
      ))}

      {[20, 40, 60, 80].map((pct) => (
        <React.Fragment key={`h-${pct}`}>
          <line
            x1="0"
            y1={`${pct}%`}
            x2="100%"
            y2={`${pct}%`}
            stroke="#000"
            strokeWidth="3"
          />
          <line
            x1="0"
            y1={`${pct}%`}
            x2="100%"
            y2={`${pct}%`}
            stroke={pct === 40 || pct === 60 ? "#397FF9" : "#FF4D4D"}
            strokeWidth="1"
          />
        </React.Fragment>
      ))}

      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#000" strokeWidth="4" />
      <line
        x1="50%"
        y1="0"
        x2="50%"
        y2="100%"
        stroke="#397FF9"
        strokeWidth="2"
      />

      <line
        x1="0"
        y1={`${centerY}%`}
        x2="100%"
        y2={`${centerY}%`}
        stroke="#000"
        strokeWidth="4"
      />
      <line
        x1="0"
        y1={`${centerY}%`}
        x2="100%"
        y2={`${centerY}%`}
        stroke="#397FF9"
        strokeWidth="2"
      />
    </GridSvg>
  );
};

GridLines.propTypes = { visible: PropTypes.bool, ratios: PropTypes.object };

const PreviewStage = ({
  canvas,
  activeTemplateUrl,
  activeSide,
  designState,
  setDesignState,
  selectedSize = "M",
  showGrid,
  setShowGrid,
  showSolidBg,
  setShowSolidBg,
  solidBgColor,
  setSolidBgColor,
}) => {
  const { t } = useTranslation();

  // Scan non-transparent bounds of the active template PNG
  const alphaBounds = useGarmentAlphaBounds(activeTemplateUrl);

  const ratios = useMemo(() => {
    return getFittedPrintZoneRatios(
      canvas.title,
      selectedSize,
      activeSide,
      canvas.sizeChart,
      alphaBounds,
    );
  }, [canvas.title, selectedSize, activeSide, canvas.sizeChart, alphaBounds]);

  return (
    <StageOuter>
      <SolidColorBackground $active={showSolidBg} $color={solidBgColor} />

      <StageFloatingControls onClick={(e) => e.stopPropagation()}>
        <FloatingToggleBtn
          type="button"
          $active={showGrid}
          onClick={() => setShowGrid(!showGrid)}
        >
          <FaBorderAll /> {t("pod_studio_toggle_grid", "Show Alignment Grid")}
        </FloatingToggleBtn>
        <FloatingToggleBtn
          type="button"
          $active={showSolidBg}
          onClick={() => setShowSolidBg(!showSolidBg)}
        >
          <FaFillDrip /> {t("pod_studio_toggle_bg", "Custom Canvas Color")}
        </FloatingToggleBtn>

        {showSolidBg && (
          <FloatingColorWheel>
            <input
              type="color"
              value={solidBgColor}
              onChange={(e) => setSolidBgColor(e.target.value)}
            />
          </FloatingColorWheel>
        )}
      </StageFloatingControls>

      <WorkspaceContainer>
        {activeTemplateUrl ? (
          <BackgroundTemplate
            src={activeTemplateUrl}
            alt="Active Substrate Template"
          />
        ) : (
          <div style={{ color: "#333", fontSize: "4rem", zIndex: 3 }}>👕</div>
        )}
        <BoundingBox>
          <PrintableArea
            ratios={ratios}
            designState={designState}
            setDesignState={setDesignState}
            activeTemplateUrl={activeTemplateUrl}
          />
          <GridLines visible={showGrid} ratios={ratios} />
        </BoundingBox>
      </WorkspaceContainer>
    </StageOuter>
  );
};

PreviewStage.propTypes = {
  canvas: PropTypes.object.isRequired,
  activeTemplateUrl: PropTypes.string,
  activeSide: PropTypes.oneOf(["front", "back"]).isRequired,
  designState: PropTypes.object.isRequired,
  setDesignState: PropTypes.func.isRequired,
  selectedSize: PropTypes.string,
  showGrid: PropTypes.bool.isRequired,
  setShowGrid: PropTypes.func.isRequired,
  showSolidBg: PropTypes.bool.isRequired,
  setShowSolidBg: PropTypes.func.isRequired,
  solidBgColor: PropTypes.string.isRequired,
  setSolidBgColor: PropTypes.func.isRequired,
};

export default PreviewStage;
