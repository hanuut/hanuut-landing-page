import React, { useMemo, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBorderAll,
  FaFillDrip,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaShoppingCart,
} from "react-icons/fa";
import {
  getFittedPrintZoneRatios,
  useGarmentAlphaBounds,
} from "../../hooks/usePrintableArea";
import PrintableArea from "./PrintableArea";
import { analyzeProductImageLuminance } from "../../utils/colorLuminanceAnalyzer";

// 🔴 DYNAMIC CONTRAST BACKGROUND
const StageOuter = styled.div`
  width: 100%;
  height: 100%;
  min-height: 480px;
  background-color: ${(props) => (props.$isDarkGarment ? "#2d2e36" : "#0c0c0e")};
  border-radius: 24px;
  border: 1px solid ${(props) => (props.$isDarkGarment ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)")};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  user-select: none;
  transition: background-color 0.4s ease, border-color 0.4s ease;

  @media (max-width: 1024px) {
    border-radius: 0;
    border: none;
    min-height: auto;
  }
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
  right: 15px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    top: auto;
    bottom: 60px;
    right: 15px;
    flex-direction: column;
  }
`;

const FloatingToggleBtn = styled.button`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid ${(props) => (props.$active ? props.theme.primaryColor || "#F07A48" : "rgba(255, 255, 255, 0.2)")};
  color: ${(props) => (props.$active ? props.theme.primaryColor || "#F07A48" : "#ffffff")};
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
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

const ZoomControls = styled.div`
  position: absolute;
  left: 15px;
  bottom: 15px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  padding: 4px 10px;
  z-index: 100;
  gap: 8px;

  @media (max-width: 1024px) {
    bottom: 60px;
  }
`;

const ZoomBtn = styled.button`
  background: transparent;
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
  }
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  width: 60%;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 2px 0;
`;

const ZoomText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #a1a1aa;
  min-width: 45px;
  cursor: pointer;
  font-family: monospace;
  transition: color 0.2s;
  &:hover {
    color: white;
  }
`;

const WorkspaceContainer = styled.div`
  position: relative;
  width: 95%;
  height: 95%;
  max-width: 600px;
  max-height: 600px;
  aspect-ratio: 1 / 1;
  background: transparent;
  box-sizing: border-box;
  z-index: 2;
  overflow: hidden;
  border-radius: 16px;
`;

const ZoomableStage = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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
          <line x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%" stroke="#000" strokeWidth="3" />
          <line x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%" stroke={pct === 40 || pct === 60 ? "#397FF9" : "#FF4D4D"} strokeWidth="1" />
        </React.Fragment>
      ))}
      {[20, 40, 60, 80].map((pct) => (
        <React.Fragment key={`h-${pct}`}>
          <line x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`} stroke="#000" strokeWidth="3" />
          <line x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`} stroke={pct === 40 || pct === 60 ? "#397FF9" : "#FF4D4D"} strokeWidth="1" />
        </React.Fragment>
      ))}
      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#000" strokeWidth="4" />
      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#397FF9" strokeWidth="2" />
      <line x1="0" y1={`${centerY}%`} x2="100%" y2={`${centerY}%`} stroke="#000" strokeWidth="4" />
      <line x1="0" y1={`${centerY}%`} x2="100%" y2={`${centerY}%`} stroke="#397FF9" strokeWidth="2" />
    </GridSvg>
  );
};

GridLines.propTypes = { visible: PropTypes.bool, ratios: PropTypes.object };

const FullscreenOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const FullscreenCard = styled(motion.div)`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
`;

const FullscreenStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${(props) => (props.$isDarkGarment ? "#2d2e36" : "#050505")};
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: background-color 0.4s ease;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

const ModalBtn = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;
  border: none;

  ${(props) =>
    props.$primary
      ? `
    background: ${props.theme.primaryColor || "#F07A48"};
    color: #000;
    &:hover { filter: brightness(1.1); transform: translateY(-2px); }
  `
      : `
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    &:hover { background: rgba(255, 255, 255, 0.1); }
  `}
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
  onAddToCart,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const stageRef = useRef(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkGarment, setIsDarkGarment] = useState(false);

  // 🔴 DYNAMIC GARMENT LUMINANCE DETECTION
  useEffect(() => {
    let isMounted = true;
    if (activeTemplateUrl) {
      analyzeProductImageLuminance(activeTemplateUrl).then((analysis) => {
        if (isMounted) {
          setIsDarkGarment(analysis.isDark);
        }
      });
    } else {
      setIsDarkGarment(false);
    }
    return () => {
      isMounted = false;
    };
  }, [activeTemplateUrl]);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };
  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.25));
  };
  const handleZoomReset = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  const alphaBounds = useGarmentAlphaBounds(activeTemplateUrl);

  const ratios = useMemo(() => {
    return getFittedPrintZoneRatios(
      canvas.title,
      selectedSize,
      activeSide,
      canvas.sizeChart,
      alphaBounds
    );
  }, [canvas.title, selectedSize, activeSide, canvas.sizeChart, alphaBounds]);

  return (
    <>
      <StageOuter $isDarkGarment={isDarkGarment}>
        <SolidColorBackground $active={showSolidBg} $color={solidBgColor} />

        <StageFloatingControls onClick={(e) => e.stopPropagation()}>
          <FloatingToggleBtn
            type="button"
            $active={showGrid}
            onClick={() => setShowGrid(!showGrid)}
          >
            <FaBorderAll /> {t("pod_studio_toggle_grid", "Grid")}
          </FloatingToggleBtn>
          <FloatingToggleBtn
            type="button"
            $active={showSolidBg}
            onClick={() => setShowSolidBg(!showSolidBg)}
          >
            <FaFillDrip /> {t("pod_studio_toggle_bg", "Bg")}
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

        <ZoomControls onClick={(e) => e.stopPropagation()}>
          <ZoomBtn onClick={() => setIsFullscreen(true)} title="Full Preview">
            <FaExpand size={14} />
          </ZoomBtn>
          <Divider />
          <ZoomBtn onClick={handleZoomIn} disabled={zoomLevel >= 3}>
            <FaSearchPlus size={14} />
          </ZoomBtn>
          <ZoomText onClick={handleZoomReset} title="Click to reset zoom">
            {Math.round(zoomLevel * 100)}%
          </ZoomText>
          <ZoomBtn onClick={handleZoomOut} disabled={zoomLevel <= 0.25}>
            <FaSearchMinus size={14} />
          </ZoomBtn>
        </ZoomControls>

        <WorkspaceContainer ref={stageRef}>
          <ZoomableStage
            drag={zoomLevel !== 1}
            dragConstraints={{ top: -600, bottom: 600, left: -600, right: 600 }}
            dragElastic={0.1}
            dragMomentum={false}
            animate={{
              scale: zoomLevel,
              ...(zoomLevel === 1 ? { x: 0, y: 0 } : {}),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              cursor: zoomLevel !== 1 ? "grab" : "default",
              touchAction: zoomLevel !== 1 ? "none" : "auto",
            }}
            whileDrag={{ cursor: "grabbing" }}
          >
            {activeTemplateUrl ? (
              <BackgroundTemplate
                src={activeTemplateUrl}
                alt="Active Substrate Template"
              />
            ) : (
              <div style={{ color: "#333", fontSize: "4rem", zIndex: 3 }}>
                👕
              </div>
            )}
            <BoundingBox>
              <PrintableArea
                ratios={ratios}
                designState={designState}
                setDesignState={setDesignState}
              />
              <GridLines visible={showGrid} ratios={ratios} />
            </BoundingBox>
          </ZoomableStage>
        </WorkspaceContainer>
      </StageOuter>

      <AnimatePresence>
        {isFullscreen && (
          <FullscreenOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <FullscreenCard
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  textAlign: "center",
                  direction: isArabic ? "rtl" : "ltr",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    fontFamily: "Tajawal",
                  }}
                >
                  {isArabic ? "معاينة التصميم" : "Design Preview"}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#a1a1aa",
                    fontSize: "0.85rem",
                    fontFamily: "Cairo",
                  }}
                >
                  {canvas.title} -{" "}
                  {activeSide === "front"
                    ? isArabic
                      ? "الواجهة"
                      : "Front"
                    : isArabic
                    ? "الظهر"
                    : "Back"}
                </p>
              </div>

              <FullscreenStage $isDarkGarment={isDarkGarment}>
                {activeTemplateUrl ? (
                  <BackgroundTemplate
                    src={activeTemplateUrl}
                    alt="Garment Base"
                  />
                ) : (
                  <div style={{ color: "#333", fontSize: "4rem", zIndex: 3 }}>
                    👕
                  </div>
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
                    {designState.previewUrl && (
                      <img
                        src={designState.previewUrl}
                        alt="Custom Print"
                        style={{
                          position: "absolute",
                          left: `${designState.x}%`,
                          top: `${designState.y}%`,
                          width: `${designState.scale}%`,
                          transform: `translate(-50%, -50%) rotate(${
                            designState.rotation || 0
                          }deg)`,
                          objectFit: "contain",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                </TemplateContentArea>
              </FullscreenStage>

              <ModalActions style={{ direction: isArabic ? "rtl" : "ltr" }}>
                <ModalBtn
                  onClick={() => {
                    setIsFullscreen(false);
                    if (onAddToCart) onAddToCart();
                  }}
                >
                  <FaShoppingCart />{" "}
                  {t("pod_studio_btn_commit_tray", "Add to Cart")}
                </ModalBtn>
                <ModalBtn $primary onClick={() => setIsFullscreen(false)}>
                  {isArabic ? "مواصلة التصميم" : "Continue Design"}
                </ModalBtn>
              </ModalActions>
            </FullscreenCard>
          </FullscreenOverlay>
        )}
      </AnimatePresence>
    </>
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
  onAddToCart: PropTypes.func,
};

export default PreviewStage;