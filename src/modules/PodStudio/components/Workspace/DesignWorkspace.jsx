import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { usePalette } from "color-thief-react";
import { FaBookOpen, FaUndo, FaRedo } from "react-icons/fa";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import PreviewStage from "./PreviewStage";
import DesignControls from "./DesignControls";
import ProductionSummary from "./ProductionSummary";
import PartnerSizingWidget from "./PartnerSizingWidget";
import { retrieveFile } from "../../utils/indexedDbHelper";
import {
  getGarmentDimensions,
  getTemplateConfig,
} from "../../hooks/usePrintableArea";
import { useDesignHistory } from "../../hooks/useDesignHistory";

const WorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 2rem;
  width: 100%;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

const ExpandLink = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  padding: 2px 0 0 0;
  font-family: "Tajawal", sans-serif;
`;

const SegmentedSideControl = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 12px;
  width: 100%;
  max-width: 320px;
`;

const SegmentButton = styled.button`
  background: ${(props) =>
    props.$active ? props.theme.primaryColor || "#F07A48" : "transparent"};
  color: ${(props) => (props.$active ? "#000000" : "white")};
  border: none;
  padding: 0.6rem;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
`;

const SizingScrollButton = styled.button`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
  margin-top: 0.5rem;
  width: fit-content;

  &:hover {
    background: rgba(240, 122, 72, 0.1);
    border-color: #f07a48;
    color: #f07a48;
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

const COLOR_MAP = {
  black: "#000000",
  noir: "#000000",
  white: "#FFFFFF",
  blanc: "#FFFFFF",
  red: "#EF4444",
  rouge: "#EF4444",
  blue: "#3B82F6",
  bleu: "#3B82F6",
  green: "#10B981",
  vert: "#10B981",
  yellow: "#F59E0B",
  jaune: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  rose: "#EC4899",
  grey: "#6B7280",
  gris: "#6B7280",
  beige: "#F5F5DC",
  navy: "#1E3A8A",
  charcoal: "#374151",
};

const getDisplayColorHex = (colorName) => {
  const normalized = String(colorName || "")
    .trim()
    .toLowerCase();
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  if (normalized.includes("rose") || normalized.includes("pink"))
    return "#EC4899";
  if (normalized.includes("noir") || normalized.includes("black"))
    return "#111111";
  if (normalized.includes("blanc") || normalized.includes("white"))
    return "#FFFFFF";
  if (normalized.includes("gris") || normalized.includes("grey"))
    return "#6B7280";
  if (normalized.includes("bleu") || normalized.includes("blue"))
    return "#3B82F6";
  if (normalized.includes("rouge") || normalized.includes("red"))
    return "#EF4444";
  return "#27272a";
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
    canvas.availableColors[0]?.colorName || "",
  );
  const [selectedSize, setSelectedSize] = useState(
    canvas.sizes[0]?.sizeCode || "",
  );
  const [activeSide, setActiveSide] = useState("front");
  const [templateUrl, setTemplateUrl] = useState(null);

  const [colorsExpanded, setColorsExpanded] = useState(false);
  const [sizesExpanded, setSizesExpanded] = useState(false);

  const [showGrid, setShowGrid] = useState(false);
  const [showSolidBg, setShowSolidBg] = useState(false);
  const [solidBgColor, setSolidBgColor] = useState("#FFFFFF");

  // --- S2: INCORPORATING CONTINUOUS HISTORY TRACKING HOOKS ---
  const [
    frontDesign,
    setFrontDesign,
    undoFront,
    redoFront,
    canUndoFront,
    canRedoFront,
    resetFront,
  ] = useDesignHistory({
    file: null,
    previewUrl: null,
    x: 50,
    y: 50,
    scale: 50,
    rotation: 0,
  });

  const [
    backDesign,
    setBackDesign,
    undoBack,
    redoBack,
    canUndoBack,
    canRedoBack,
    resetBack,
  ] = useDesignHistory({
    file: null,
    previewUrl: null,
    x: 50,
    y: 50,
    scale: 50,
    rotation: 0,
  });

  const activeDesignState = activeSide === "back" ? backDesign : frontDesign;
  const setActiveDesignState =
    activeSide === "back" ? setBackDesign : setFrontDesign;

  // KEYBOARD EVENT LISTENERS FOR FLUID UNDO/REDO HOTKEYS
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isUndo =
        (e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === "z" && !e.shiftKey;
      const isRedo =
        ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === "y") ||
        ((e.ctrlKey || e.metaKey) &&
          e.key?.toLowerCase() === "z" &&
          e.shiftKey);

      if (isUndo) {
        e.preventDefault();
        if (activeSide === "front") {
          if (canUndoFront) undoFront();
        } else {
          if (canUndoBack) undoBack();
        }
      } else if (isRedo) {
        e.preventDefault();
        if (activeSide === "front") {
          if (canRedoFront) redoFront();
        } else {
          if (canRedoBack) redoBack();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeSide,
    undoFront,
    undoBack,
    redoFront,
    redoBack,
    canUndoFront,
    canUndoBack,
    canRedoFront,
    canRedoBack,
  ]);

  // Enforce scrolling viewport directly to the top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [canvas]);

  const handleScrollToSizeChart = () => {
    const el = document.getElementById("sizing-spec-widget");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    if (selectedColor) {
      const lowerCol = String(selectedColor).toLowerCase();
      if (
        lowerCol.includes("black") ||
        lowerCol.includes("noir") ||
        lowerCol.includes("navy") ||
        lowerCol.includes("charcoal") ||
        lowerCol.includes("gray") ||
        lowerCol.includes("gris") ||
        lowerCol.includes("green") ||
        lowerCol.includes("vert")
      ) {
        setShowSolidBg(true);
        setSolidBgColor("#FFFFFF");
      } else {
        setShowSolidBg(false);
      }
    }
  }, [selectedColor]);

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

        setSelectedColor(
          editingCartItem.colorSelected ||
            editingCartItem.color ||
            canvas.availableColors[0]?.colorName ||
            "",
        );
        setSelectedSize(
          editingCartItem.sizeSelected ||
            editingCartItem.size ||
            canvas.sizes[0]?.sizeCode ||
            "",
        );

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

          const cfg = getTemplateConfig(canvas.title);
          const garmentDims = getGarmentDimensions(
            canvas.title,
            editingCartItem.sizeSelected ||
              editingCartItem.size ||
              canvas.sizes[0]?.sizeCode ||
              "M",
          );
          const printWidthRatio = cfg.printW_ref / cfg.B_ref;
          const maxPrintWidthCm = garmentDims.B * printWidthRatio;

          const resolveInitialScale = (designNode) => {
            if (!designNode) return 50;
            const currentWidth = designNode.width;

            if (currentWidth < 15) {
              const healedScale = (currentWidth / maxPrintWidthCm) * 100;
              return Math.min(100, Math.max(15, Math.round(healedScale)));
            }
            return currentWidth;
          };

          const frontScale = resolveInitialScale(custom.front);
          const backScale = resolveInitialScale(custom.back);

          if (isMounted) {
            resetFront(
              custom.front
                ? {
                    file: "existing",
                    previewUrl: frontPreview,
                    scale: frontScale,
                    x: custom.front.x,
                    y: custom.front.y,
                    rotation: custom.front.rotation || 0,
                  }
                : {
                    file: null,
                    previewUrl: null,
                    scale: 50,
                    x: 50,
                    y: 50,
                    rotation: 0,
                  },
            );

            resetBack(
              custom.back
                ? {
                    file: "existing",
                    previewUrl: backPreview,
                    scale: backScale,
                    x: custom.back.x,
                    y: custom.back.y,
                    rotation: custom.back.rotation || 0,
                  }
                : {
                    file: null,
                    previewUrl: null,
                    scale: 50,
                    x: 50,
                    y: 50,
                    rotation: 0,
                  },
            );

            setActiveSide(custom.printSide === "back" ? "back" : "front");
          }
        };

        loadDesignUrls();
      }
    } else {
      resetFront({
        file: null,
        previewUrl: null,
        scale: 50,
        x: 50,
        y: 50,
        rotation: 0,
      });
      resetBack({
        file: null,
        previewUrl: null,
        scale: 50,
        x: 50,
        y: 50,
        rotation: 0,
      });
      setActiveSide("front");
    }

    return () => {
      isMounted = false;
      if (freshFrontUrl) URL.revokeObjectURL(freshFrontUrl);
      if (freshBackUrl) URL.revokeObjectURL(freshBackUrl);
    };
  }, [editingCartItem, canvas, resetFront, resetBack]);

  const activeColorObj = useMemo(() => {
    if (!canvas?.availableColors || !selectedColor) return null;
    const target = String(selectedColor).trim().toLowerCase();
    return canvas.availableColors.find(
      (c) => String(c.colorName).trim().toLowerCase() === target,
    );
  }, [canvas, selectedColor]);

  const activeTemplateId =
    activeSide === "back"
      ? activeColorObj?.podBackTemplateId
      : activeColorObj?.podFrontTemplateId;
  const hasBackTemplate = !!activeColorObj?.podBackTemplateId;

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

  useEffect(() => {
    if (!hasBackTemplate && activeSide === "back") {
      setActiveSide("front");
    }
  }, [hasBackTemplate, activeSide]);

  // Dynamic values resolved based on current active print surface
  const canUndoActive = activeSide === "front" ? canUndoFront : canUndoBack;
  const canRedoActive = activeSide === "front" ? canRedoFront : canRedoBack;
  const activeUndoHandler = activeSide === "front" ? undoFront : undoBack;
  const activeRedoHandler = activeSide === "front" ? redoFront : redoBack;

  return (
    <div style={{ width: "100%" }}>
      <WorkspaceGrid>
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

        <ControlPanel>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  fontFamily: "Tajawal",
                  marginBottom: "0.15rem",
                  color: "white",
                }}
              >
                {canvas.title}
              </h2>
              <span
                style={{
                  fontFamily: "monospace",
                  color: "#F07A48",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                {canvas.serialNumber}
              </span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <SizingScrollButton onClick={handleScrollToSizeChart}>
                  <FaBookOpen /> {t("pod_studio_blank_specifications")}
                </SizingScrollButton>
              </div>
            </div>

            {/* Desktop Action Toolbar for Undo / Redo */}
            <ActionToolbar style={{ direction: isArabic ? "rtl" : "ltr" }}>
              <ToolbarBtn
                disabled={!canUndoActive}
                onClick={activeUndoHandler}
                title="Undo (Ctrl+Z)"
              >
                <FaUndo /> {isArabic ? "تراجع" : "Undo"}
              </ToolbarBtn>
              <ToolbarBtn
                disabled={!canRedoActive}
                onClick={activeRedoHandler}
                title="Redo (Ctrl+Y)"
              >
                <FaRedo /> {isArabic ? "إعادة" : "Redo"}
              </ToolbarBtn>
            </ActionToolbar>
          </div>

          <OptionRow>
            <OptionSection>
              <SectionLabel>{t("pod_studio_colors_title")}</SectionLabel>
              <CollapsiblePills $expanded={colorsExpanded}>
                {canvas.availableColors.map((col) => {
                  const hex = getDisplayColorHex(col.colorName);
                  return (
                    <ColorSwatch
                      key={col.colorName}
                      $active={selectedColor === col.colorName}
                      $hex={hex}
                      onClick={() => setSelectedColor(col.colorName)}
                      title={col.colorName}
                    />
                  );
                })}
              </CollapsiblePills>
              {canvas.availableColors.length > 8 && (
                <ExpandLink onClick={() => setColorsExpanded(!colorsExpanded)}>
                  {colorsExpanded ? t("hide") : t("show")}
                </ExpandLink>
              )}
            </OptionSection>

            <OptionSection>
              <SectionLabel>{t("pod_studio_sizes_title")}</SectionLabel>
              <CollapsiblePills $expanded={sizesExpanded}>
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
              {canvas.sizes.length > 6 && (
                <ExpandLink onClick={() => setSizesExpanded(!sizesExpanded)}>
                  {sizesExpanded ? t("hide") : t("show")}
                </ExpandLink>
              )}
            </OptionSection>
          </OptionRow>

          {canvas.specifications.printableSurfaces.length > 1 &&
            hasBackTemplate && (
              <OptionSection>
                <SectionLabel>{t("pod_studio_print_side")}</SectionLabel>
                <SegmentedSideControl>
                  <SegmentButton
                    $active={activeSide === "front"}
                    onClick={() => setActiveSide("front")}
                  >
                    {t("pod_studio_front_side")}
                  </SegmentButton>
                  <SegmentButton
                    $active={activeSide === "back"}
                    onClick={() => setActiveSide("back")}
                  >
                    {t("pod_studio_back_side")}
                  </SegmentButton>
                </SegmentedSideControl>
              </OptionSection>
            )}

          <DesignControls
            designState={activeDesignState}
            setDesignState={setActiveDesignState}
            canvasName={canvas.title}
            selectedSize={selectedSize}
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
      <PartnerSizingWidget canvas={canvas} />
    </div>
  );
};

DesignWorkspace.propTypes = {
  canvas: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  shopId: PropTypes.string.isRequired,
  editingCartItem: PropTypes.object,
  onCommitSuccess: PropTypes.func,
};

export default DesignWorkspace;
