// src/modules/PodStudio/components/Workspace/DesignWorkspace.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  FaEyeSlash,
} from "react-icons/fa";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import PreviewStage from "./PreviewStage";
import DesignControls from "./DesignControls";
import ProductionSummary from "./ProductionSummary";
import PartnerSizingWidget from "./PartnerSizingWidget";
import { useDesignHistory } from "../../hooks/useDesignHistory";
import { motion, AnimatePresence } from "framer-motion";
import PrePreparedDesignsTab from "./PrePreparedDesignsTab";
import CollapsibleSizingWidget from "./CollapsibleSizingWidget";

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
    display: flex;
    flex-direction: column;
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

const SwitchTrack = styled.div`
  width: 66px;
  height: 30px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 15px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px;
  box-sizing: border-box;
  cursor: pointer;
  pointer-events: auto !important;
`;

const SwitchThumb = styled(motion.div)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.$active ? "#39A170" : props.theme.primaryColor || "#F07A48"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #050505;
  font-size: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const SubStageCTA = styled(motion.button)`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    width: calc(100% - 24px);
    margin: 10px auto;
    height: 44px;
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #050505;
    border: none;
    border-radius: 22px;
    font-weight: 800;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 6px 20px rgba(240, 122, 72, 0.35);
    font-family: "Tajawal", sans-serif;
    z-index: 1002;
    cursor: pointer;
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

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
  
  const artistDesign = canvas.initialArtistDesign;
  const isArtistLocked = !!artistDesign;
  const preferredSide = artistDesign?.preferredSide || "front";

  const [activeSide, setActiveSide] = useState(preferredSide);
  const [templateUrl, setTemplateUrl] = useState(null);

  // SINGLE SHARED SOURCE OF TRUTH ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState("transform");

  // WORKSPACE VISUAL TOGGLES STATE
  const [showGrid, setShowGrid] = useState(false);
  const [showSolidBg, setShowSolidBg] = useState(false);
  const [solidBgColor, setSolidBgColor] = useState("#FFFFFF");

  // MOBILE ACCURATE 10% OPACITY & LOCK-STATE SWITCH VARIABLES
  const [uiOpacity, setUiOpacity] = useState(1);
  const [isLockedToZero, setIsLockedToZero] = useState(false);

  // Front Design Initialization
  const [frontDesign, setFrontDesign, undoFront, redoFront, canUndoFront, canRedoFront, resetFront] =
    useDesignHistory({
      file: (isArtistLocked && preferredSide === "front") ? "artist_locked" : null,
      previewUrl: (artistDesign && preferredSide === "front") ? artistDesign.front?.imageUrl : null,
      x: preferredSide === "front" ? (artistDesign?.front?.x ?? 50) : 50,
      y: preferredSide === "front" ? (artistDesign?.front?.y ?? 35) : 50,
      scale: preferredSide === "front" ? (artistDesign?.front?.width ?? 55) : 50,
      rotation: preferredSide === "front" ? (artistDesign?.front?.rotation ?? 0) : 0,
    });

  // Back Design Initialization
  const [backDesign, setBackDesign, undoBack, redoBack, canUndoBack, canRedoBack, resetBack] =
    useDesignHistory({
      file: (isArtistLocked && preferredSide === "back") ? "artist_locked" : null,
      previewUrl: (artistDesign && preferredSide === "back") ? artistDesign.back?.imageUrl : null,
      x: preferredSide === "back" ? (artistDesign?.back?.x ?? 50) : 50,
      y: preferredSide === "back" ? (artistDesign?.back?.y ?? 35) : 50,
      scale: preferredSide === "back" ? (artistDesign?.back?.width ?? 55) : 50,
      rotation: preferredSide === "back" ? (artistDesign?.back?.rotation ?? 0) : 0,
    });

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

  // 🔴 FIX: Dynamically fetch front or back template asset URL matching the active color & side
  const activeTemplateId = useMemo(() => {
    if (!activeColorObj) return null;
    return activeSide === "back"
      ? activeColorObj.podBackTemplateId
      : activeColorObj.podFrontTemplateId || activeColorObj.imageId;
  }, [activeColorObj, activeSide]);

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

  // Handle Switch slide drag gesture to execute locking
  const handleDragEnd = (event, info) => {
    if (isLockedToZero) return;
    const threshold = isArabic ? -12 : 12;
    const offset = info.offset.x;

    if ((isArabic && offset < threshold) || (!isArabic && offset > threshold)) {
      setIsLockedToZero(true);
      setUiOpacity(0); // Lock panel completely
    } else {
      setUiOpacity(1); // Snap back to 100%
    }
  };

  const handleSwitchClick = () => {
    if (isLockedToZero) {
      setIsLockedToZero(false);
      setUiOpacity(1);
    }
  };

  // Determine current active opacity value based on gesture state
  const computedOpacity = isLockedToZero ? 0 : uiOpacity;

  const isCurrentSideLocked = isArtistLocked && preferredSide === activeSide;

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

          {/* 🔴 INJECTED: Collapsible Sizing Matrix sits perfectly under the preview */}
          <CollapsibleSizingWidget
            canvas={canvas}
            selectedSize={selectedSize}
          />
          
          {/* Context-Aware CTA showing directly under the preview when panels are locked to 0 */}
          <AnimatePresence>
            {activeTab !== "cart" && isLockedToZero && (
              <SubStageCTA
                type="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => {
                  setIsLockedToZero(false);
                  setUiOpacity(1);
                  setActiveTab("cart");
                }}
              >
                <FaShoppingCart />
                <span>{isArabic ? "إكمال وتأكيد الطلبية ➔" : "Proceed with Order ➔"}</span>
              </SubStageCTA>
            )}
          </AnimatePresence>
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
            isArtistLocked={isCurrentSideLocked} // Only lock the specific side selected by the artist
          />

          {/* INJECTED: CURATED COLLABORATIVE DESIGN SELECTOR */}
          {activeTab === "transform" && isArtistLocked && (
            <div style={{ marginTop: "1rem" }}>
              <PrePreparedDesignsTab
                activeCategory={artistDesign.collectionName} // Filters by current collection
                onSelectArtwork={(artworkUrl, defaultPlacement) => {
                  setActiveDesignState({
                    file: "artist_locked",
                    previewUrl: artworkUrl,
                    scale: defaultPlacement?.scale || 55,
                    x: defaultPlacement?.x || 50,
                    y: defaultPlacement?.y || 35,
                    rotation: defaultPlacement?.rotation || 0,
                  });
                }}
              />
            </div>
          )}

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
            animate={{ y: 0, opacity: computedOpacity }}
            exit={{ y: "100%", opacity: 0 }}
            style={{ opacity: computedOpacity, transition: "opacity 0.15s ease", pointerEvents: isLockedToZero ? "none" : "auto" }}
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
              <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "10px" }}>
                {/* PHYSICAL SLIDE-TO-LOCK SWITCH BUTTON */}
                <SwitchTrack onClick={handleSwitchClick}>
                  <SwitchThumb
                    drag="x"
                    dragElastic={0.08}
                    dragConstraints={isArabic ? { left: -32, right: 0 } : { left: 0, right: 32 }}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    onPointerDown={() => !isLockedToZero && setUiOpacity(0.1)} // Dims to 10% on hold
                    onPointerUp={() => !isLockedToZero && setUiOpacity(1)} // Resets to 100% on release
                    onTouchStart={() => !isLockedToZero && setUiOpacity(0.1)}
                    onTouchEnd={() => !isLockedToZero && setUiOpacity(1)}
                    $active={isLockedToZero}
                    animate={{ x: isLockedToZero ? (isArabic ? -32 : 32) : 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  >
                    {isLockedToZero ? <FaEyeSlash /> : <FaEye />}
                  </SwitchThumb>
                </SwitchTrack>

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

              {/* ADAPTIVE MOBILE PRE-PREPARED DESIGNS VIEW */}
              {activeTab === "transform" && isArtistLocked && (
                <div style={{ marginBottom: "1rem" }}>
                  <PrePreparedDesignsTab
                    activeCategory={artistDesign.collectionName}
                    onSelectArtwork={(artworkUrl, defaultPlacement) => {
                      setActiveDesignState({
                        file: "artist_locked",
                        previewUrl: artworkUrl,
                        scale: defaultPlacement?.scale || 55,
                        x: defaultPlacement?.x || 50,
                        y: defaultPlacement?.y || 35,
                        rotation: defaultPlacement?.rotation || 0,
                      });
                    }}
                  />
                </div>
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
            isArtistLocked={isCurrentSideLocked}
          />
              )}
            </div>
          </MobileToolPanel>
        )}
      </AnimatePresence>

      <MobileFloatingPurchaseCTA
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          setIsLockedToZero(false);
          setUiOpacity(1);
          setActiveTab("cart");
        }}
        style={{ opacity: computedOpacity, transition: "opacity 0.15s ease", pointerEvents: isLockedToZero ? "none" : "auto" }}
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
      <MobileBottomDock style={{ opacity: computedOpacity, transition: "opacity 0.15s ease", pointerEvents: isLockedToZero ? "none" : "auto" }}>
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

      {/* FIXED PERSISTENT FLOATING TOGGLE FOR LOCK RECOVERY MODE */}
      {isLockedToZero && (
        <div
          style={{
            position: "fixed",
            bottom: "18px",
            right: isArabic ? "auto" : "18px",
            left: isArabic ? "18px" : "auto",
            zIndex: 1010,
          }}
        >
          <SwitchTrack onClick={handleSwitchClick}>
            <SwitchThumb $active={isLockedToZero} animate={{ x: isArabic ? -32 : 32 }}>
              <FaEyeSlash />
            </SwitchThumb>
          </SwitchTrack>
        </div>
      )}
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