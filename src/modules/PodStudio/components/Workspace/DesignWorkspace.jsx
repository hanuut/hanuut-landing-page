import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import {
  FaBookOpen,
  FaUndo,
  FaRedo,
  FaArrowsAlt,
  FaExpandAlt,
  FaSyncAlt,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import PreviewStage from "./PreviewStage";
import DesignControls from "./DesignControls";
import ProductionSummary from "./ProductionSummary";
import PartnerSizingWidget from "./PartnerSizingWidget";
import { useDesignHistory } from "../../hooks/useDesignHistory";
import { motion, AnimatePresence } from "framer-motion";

const MobilePageLock = createGlobalStyle`
  @media (max-width: 768px) {
    body {
      overflow: hidden !important;
      position: fixed;
      width: 100%;
      height: 100%;
    }
  }
`;

const WorkspaceWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    height: calc(100vh - 120px);
    overflow: hidden;
  }
`;

const WorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 2rem;
  width: 100%;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0;
  }
`;

const MobileStageWrapper = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    height: 48%;
    flex-shrink: 0;
    padding: 4px;
    box-sizing: border-box;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const OptionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  width: 100%;
`;

const OptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Tajawal", sans-serif;
`;

const CollapsiblePills = styled.div`
  max-height: ${(props) => (props.$expanded ? "none" : "76px")};
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  transition: max-height 0.25s ease-in-out;
`;

const SizePill = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$active ? "#ffffff" : "rgba(255, 255, 255, 0.03)"};
  border: 1px solid
    ${(props) =>
      props.$active
        ? props.theme.primaryColor || "#F07A48"
        : "rgba(255, 255, 255, 0.1)"};
  color: ${(props) => (props.$active ? "#000000" : "#d4d4d8")};

  &:hover {
    background: ${(props) =>
      props.$active ? "#ffffff" : "rgba(255, 255, 255, 0.08)"};
  }
`;

const ColorSwatch = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => props.$hex};
  border: 2px solid
    ${(props) => (props.$active ? "#ffffff" : "rgba(0,0,0,0.4)")};
  box-shadow: ${(props) =>
    props.$active
      ? `0 0 8px ${props.theme.primaryColor || "#F07A48"}`
      : "none"};

  &:hover {
    transform: scale(1.1);
  }
`;

const ActionToolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ToolbarBtn = styled.button`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: #f07a48;
    color: #f07a48;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

// MOBILE DOCK BAR
const MobileBottomDock = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(18, 18, 20, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1000;
    justify-content: space-around;
    align-items: center;
    padding: 0 0.5rem;
  }
`;

const DockTab = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => (props.$active ? "#F07A48" : "#a1a1aa")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  transition: color 0.2s ease;

  svg {
    font-size: 1.1rem;
  }
`;

// MOBILE FLOATING EDITING TOOL PANEL
const MobileToolPanel = styled(motion.div)`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 125px;
    left: 10px;
    right: 10px;
    max-height: 38%;
    background: rgba(18, 18, 20, 0.95);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    z-index: 999;
    padding: 1rem;
    box-sizing: border-box;
    overflow-y: auto;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const MobileFloatingPurchaseCTA = styled(motion.button)`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 70px;
    left: 12px;
    right: 12px;
    height: 48px;
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #050505;
    border: none;
    border-radius: 25px;
    font-weight: 800;
    font-size: 0.95rem;
    align-items: center;
    justify-content: center;
    gap: 8px;
    z-index: 1000;
    box-shadow: 
      0 8px 25px rgba(240, 122, 72, 0.4),
      0 0 15px rgba(240, 122, 72, 0.2);
    cursor: pointer;
    font-family: "Tajawal", sans-serif;
  }
`;

const EyeIconButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: background 0.2s, transform 0.1s;
  pointer-events: auto !important; /* Ensure always clickable even at 2% parent opacity */

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &:active {
    transform: scale(0.9);
  }
`;

const COLOR_MAP = {
  black: "#000000",
  noir: "#000000",
  white: "#FFFFFF",
  blanc: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  grey: "#6B7280",
};

const getDisplayColorHex = (colorName) => {
  const normalized = String(colorName || "").trim().toLowerCase();
  return COLOR_MAP[normalized] || "#27272a";
};

const DesignWorkspace = ({
  canvas,
  onClose,
  shopId,
  editingCartItem,
  onCommitSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [selectedColor, setSelectedColor] = useState(
    canvas.availableColors[0]?.colorName || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    canvas.sizes[0]?.sizeCode || ""
  );
  const [activeSide, setActiveSide] = useState("front");
  const [templateUrl, setTemplateUrl] = useState(null);

  // SINGLE SHARED SOURCE OF TRUTH ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState("transform");

  // WORKSPACE VISUAL TOGGLES STATE
  const [showGrid, setShowGrid] = useState(false);
  const [showSolidBg, setShowSolidBg] = useState(false);
  const [solidBgColor, setSolidBgColor] = useState("#FFFFFF");

  // DYNAMIC OPACITY STATE FOR THE LIGHTWEIGHT OVERLAY PREVIEW MODE
  const [uiOpacity, setUiOpacity] = useState(1);

  const [frontDesign, setFrontDesign, undoFront, redoFront, canUndoFront, canRedoFront, resetFront] =
    useDesignHistory({ file: null, previewUrl: null, x: 50, y: 50, scale: 50, rotation: 0 });

  const [backDesign, setBackDesign, undoBack, redoBack, canUndoBack, canRedoBack, resetBack] =
    useDesignHistory({ file: null, previewUrl: null, x: 50, y: 50, scale: 50, rotation: 0 });

  const activeDesignState = activeSide === "back" ? backDesign : frontDesign;
  const setActiveDesignState = activeSide === "back" ? setBackDesign : setFrontDesign;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      const step = e.shiftKey ? 5 : 1;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveDesignState((prev) => ({ ...prev, x: Math.max(0, prev.x - step) }));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveDesignState((prev) => ({ ...prev, x: Math.min(100, prev.x + step) }));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveDesignState((prev) => ({ ...prev, y: Math.max(0, prev.y - step) }));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveDesignState((prev) => ({ ...prev, y: Math.min(100, prev.y + step) }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveDesignState]);

  const activeColorObj = useMemo(() => {
    if (!canvas?.availableColors || !selectedColor) return null;
    const target = String(selectedColor).trim().toLowerCase();
    return canvas.availableColors.find(
      (c) => String(c.colorName).trim().toLowerCase() === target
    );
  }, [canvas, selectedColor]);

  const activeTemplateId =
    activeSide === "back"
      ? activeColorObj?.podBackTemplateId
      : activeColorObj?.podFrontTemplateId;

  useEffect(() => {
    let isMounted = true;
    if (activeTemplateId) {
      getImage(activeTemplateId).then((res) => {
        if (isMounted && res.data) {
          setTemplateUrl(getImageUrl(res.data));
        }
      });
    } else {
      setTemplateUrl(null);
    }
    return () => {
      isMounted = false;
    };
  }, [activeTemplateId]);

  return (
    <WorkspaceWrapper>
      <MobilePageLock />
      <WorkspaceGrid>
        <MobileStageWrapper>
          <PreviewStage
            canvas={canvas}
            activeTemplateUrl={templateUrl}
            activeSide={activeSide}
            designState={activeDesignState}
            setDesignState={setActiveDesignState}
            selectedSize={selectedSize}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showSolidBg={showSolidBg}
            setShowSolidBg={setShowSolidBg}
            solidBgColor={solidBgColor}
            setSolidBgColor={setSolidBgColor}
          />
        </MobileStageWrapper>

        {/* DESKTOP PANEL */}
        <ControlPanel>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "white", margin: "0 0 2px 0" }}>
                {canvas.title}
              </h2>
              <span style={{ fontFamily: "monospace", color: "#F07A48", fontWeight: 700, fontSize: "0.85rem" }}>
                {canvas.serialNumber}
              </span>
            </div>

            <ActionToolbar style={{ direction: isArabic ? "rtl" : "ltr" }}>
              <ToolbarBtn disabled={!canUndoFront} onClick={undoFront}>
                <FaUndo /> {isArabic ? "تراجع" : "Undo"}
              </ToolbarBtn>
              <ToolbarBtn disabled={!canRedoFront} onClick={redoFront}>
                <FaRedo /> {isArabic ? "إعادة" : "Redo"}
              </ToolbarBtn>
            </ActionToolbar>
          </div>

          <OptionRow>
            <OptionSection>
              <SectionLabel>{t("pod_studio_colors_title", "Colors")}</SectionLabel>
              <CollapsiblePills $expanded={true}>
                {canvas.availableColors.map((col) => (
                  <ColorSwatch
                    key={col.colorName}
                    $active={selectedColor === col.colorName}
                    $hex={getDisplayColorHex(col.colorName)}
                    onClick={() => setSelectedColor(col.colorName)}
                  />
                ))}
              </CollapsiblePills>
            </OptionSection>

            <OptionSection>
              <SectionLabel>{t("pod_studio_sizes_title", "Sizes")}</SectionLabel>
              <CollapsiblePills $expanded={true}>
                {canvas.sizes.map((s) => (
                  <SizePill
                    key={s.sizeCode}
                    $active={selectedSize === s.sizeCode}
                    onClick={() => setSelectedSize(s.sizeCode)}
                  >
                    {s.sizeCode}
                  </SizePill>
                ))}
              </CollapsiblePills>
            </OptionSection>
          </OptionRow>

          <DesignControls
            designState={activeDesignState}
            setDesignState={setActiveDesignState}
            canvasName={canvas.title}
            selectedSize={selectedSize}
            sizeChart={canvas.sizeChart}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <ProductionSummary
            canvas={canvas}
            frontDesign={frontDesign}
            backDesign={backDesign}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            shopId={shopId}
            onCommitSuccess={onCommitSuccess}
            editingCartItem={editingCartItem}
          />
        </ControlPanel>
      </WorkspaceGrid>

      {/* MOBILE ACTIVE TOOL PANEL */}
      <AnimatePresence mode="wait">
        {activeTab !== "cart" && (
          <MobileToolPanel
            key={activeTab}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: uiOpacity }}
            exit={{ y: "100%", opacity: 0 }}
            style={{ opacity: uiOpacity, transition: "opacity 0.15s ease" }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                paddingBottom: "0.5rem",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "8px" }}>
                {/* 🔴 Hold-to-View UI Opacity toggle (Fades interface to 2% to reveal full canvas) */}
                <EyeIconButton
                  type="button"
                  onPointerDown={() => setUiOpacity(0.02)}
                  onPointerUp={() => setUiOpacity(1)}
                  onTouchStart={() => setUiOpacity(0.02)}
                  onTouchEnd={() => setUiOpacity(1)}
                  onMouseDown={() => setUiOpacity(0.02)}
                  onMouseUp={() => setUiOpacity(1)}
                  onMouseLeave={() => setUiOpacity(1)}
                  title="Hold to see preview clearly"
                >
                  <FaEye />
                </EyeIconButton>

                {activeTab === "transform" && (isArabic ? "حجم التصميم" : "SCALE CONTROLS")}
                {activeTab === "position" && (isArabic ? "موقع التصميم" : "POSITION CONTROLS")}
                {activeTab === "rotation" && (isArabic ? "زاوية الدوران" : "ROTATION CONTROLS")}
                {activeTab === "info" && (isArabic ? "المواصفات الفنية" : "SPECIFICATIONS")}
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: canUndoFront ? "#FFF" : "#555",
                    cursor: "pointer",
                  }}
                  disabled={!canUndoFront}
                  onClick={undoFront}
                >
                  <FaUndo size={14} />
                </button>
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: canRedoFront ? "#FFF" : "#555",
                    cursor: "pointer",
                  }}
                  disabled={!canRedoFront}
                  onClick={redoFront}
                >
                  <FaRedo size={14} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activeTab === "info" && (
                <>
                  <OptionRow>
                    <OptionSection>
                      <SectionLabel>{t("pod_studio_colors_title", "Colors")}</SectionLabel>
                      <CollapsiblePills $expanded={true}>
                        {canvas.availableColors.map((col) => (
                          <ColorSwatch
                            key={col.colorName}
                            $active={selectedColor === col.colorName}
                            $hex={getDisplayColorHex(col.colorName)}
                            onClick={() => setSelectedColor(col.colorName)}
                          />
                        ))}
                      </CollapsiblePills>
                    </OptionSection>

                    <OptionSection>
                      <SectionLabel>{t("pod_studio_sizes_title", "Sizes")}</SectionLabel>
                      <CollapsiblePills $expanded={true}>
                        {canvas.sizes.map((s) => (
                          <SizePill
                            key={s.sizeCode}
                            $active={selectedSize === s.sizeCode}
                            onClick={() => setSelectedSize(s.sizeCode)}
                          >
                            {s.sizeCode}
                          </SizePill>
                        ))}
                      </CollapsiblePills>
                    </OptionSection>
                  </OptionRow>
                  <PartnerSizingWidget canvas={canvas} selectedSize={selectedSize} />
                </>
              )}

              {(activeTab === "transform" || activeTab === "position" || activeTab === "rotation") && (
                <DesignControls
                  designState={activeDesignState}
                  setDesignState={setActiveDesignState}
                  canvasName={canvas.title}
                  selectedSize={selectedSize}
                  sizeChart={canvas.sizeChart}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              )}
            </div>
          </MobileToolPanel>
        )}
      </AnimatePresence>

      <MobileFloatingPurchaseCTA
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => setActiveTab("cart")}
        style={{ opacity: uiOpacity, transition: "opacity 0.15s ease" }}
      >
        <FaShoppingCart />
        <span>{isArabic ? "إكمال وتأكيد الطلبية ➔" : "Proceed with Order ➔"}</span>
      </MobileFloatingPurchaseCTA>

      {/* MOBILE TRAY OVERLAY SHEET */}
      <AnimatePresence>
        {activeTab === "cart" && (
          <OverlayBackdrop onClick={() => setActiveTab("transform")}>
            <SummaryModalSheet onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  paddingBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: 800 }}>BILLING & FULFILLMENT</span>
                <button
                  style={{ background: "transparent", border: "none", color: "#a1a1aa", fontSize: "1.25rem", cursor: "pointer" }}
                  onClick={() => setActiveTab("transform")}
                >
                  &times;
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                <ProductionSummary
                  canvas={canvas}
                  frontDesign={frontDesign}
                  backDesign={backDesign}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  shopId={shopId}
                  onCommitSuccess={onCommitSuccess}
                  editingCartItem={editingCartItem}
                />
              </div>
            </SummaryModalSheet>
          </OverlayBackdrop>
        )}
      </AnimatePresence>

      {/* FIXED MOBILE BOTTOM DOCK NAVIGATION */}
      <MobileBottomDock style={{ opacity: uiOpacity, transition: "opacity 0.15s ease" }}>
        <DockTab
          $active={activeTab === "info"}
          onClick={() => setActiveTab("info")}
        >
          <FaBookOpen />
          <span>{t("pod_studio_blank_specifications", "Specs")}</span>
        </DockTab>

        <DockTab
          $active={activeTab === "rotation"}
          onClick={() => setActiveTab("rotation")}
        >
          <FaSyncAlt />
          <span>{t("pod_studio_angle_rotation", "Rotate")}</span>
        </DockTab>

        <DockTab
          $active={activeTab === "transform"}
          onClick={() => setActiveTab("transform")}
        >
          <FaExpandAlt />
          <span>{t("pod_studio_scale_percentage", "Scale")}</span>
        </DockTab>

        <DockTab
          $active={activeTab === "position"}
          onClick={() => setActiveTab("position")}
        >
          <FaArrowsAlt />
          <span>{t("position_title", "Position")}</span>
        </DockTab>

        <DockTab
          $active={activeTab === "cart"}
          onClick={() => setActiveTab("cart")}
        >
          <FaShoppingCart />
          <span>{t("pod_studio_tray_title", "Bag")}</span>
        </DockTab>
      </MobileBottomDock>
    </WorkspaceWrapper>
  );
};

const OverlayBackdrop = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1100;
    align-items: flex-end;
  }
`;

const SummaryModalSheet = styled.div`
  width: 100%;
  max-height: 75vh;
  background: #141416;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px 24px 0 0;
  padding: 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -15px 40px rgba(0, 0, 0, 0.8);
`;

DesignWorkspace.propTypes = {
  canvas: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  shopId: PropTypes.string.isRequired,
  editingCartItem: PropTypes.object,
  onCommitSuccess: PropTypes.func,
};

export default DesignWorkspace;