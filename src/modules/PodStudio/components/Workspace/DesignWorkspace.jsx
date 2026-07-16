import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { usePalette } from "color-thief-react";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import PreviewStage from "./PreviewStage";
import DesignControls from "./DesignControls";
import ProductionSummary from "./ProductionSummary";
import PartnerSizingWidget from "./PartnerSizingWidget";
import { retrieveFile } from "../../utils/indexedDbHelper";
import { getGarmentDimensions, getTemplateConfig } from "../../hooks/usePrintableArea";

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

const COLOR_MAP = {
  black: "#000000", noir: "#000000", white: "#FFFFFF", blanc: "#FFFFFF",
  red: "#EF4444", rouge: "#EF4444", blue: "#3B82F6", bleu: "#3B82F6",
  green: "#10B981", vert: "#10B981", yellow: "#F59E0B", jaune: "#F59E0B",
  purple: "#8B5CF6", pink: "#EC4899", rose: "#EC4899", grey: "#6B7280",
  gris: "#6B7280", beige: "#F5F5DC", navy: "#1E3A8A", charcoal: "#374151"
};

const getDisplayColorHex = (colorName) => {
  const normalized = String(colorName || "").trim().toLowerCase();
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  if (normalized.includes("rose") || normalized.includes("pink")) return "#EC4899";
  if (normalized.includes("noir") || normalized.includes("black")) return "#111111";
  if (normalized.includes("blanc") || normalized.includes("white")) return "#FFFFFF";
  if (normalized.includes("gris") || normalized.includes("grey")) return "#6B7280";
  if (normalized.includes("bleu") || normalized.includes("blue")) return "#3B82F6";
  if (normalized.includes("rouge") || normalized.includes("red")) return "#EF4444";
  return "#27272a";
};

const DesignWorkspace = ({ canvas, onClose, shopId, editingCartItem, onCommitSuccess }) => {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(canvas.availableColors[0]?.colorName || "");
  const [selectedSize, setSelectedSize] = useState(canvas.sizes[0]?.sizeCode || "");
  const [activeSide, setActiveSide] = useState("front");
  const [templateUrl, setTemplateUrl] = useState(null);

  const [colorsExpanded, setColorsExpanded] = useState(false);
  const [sizesExpanded, setSizesExpanded] = useState(false);

  const [showGrid, setShowGrid] = useState(false);
  const [showSolidBg, setShowSolidBg] = useState(false);
  const [solidBgColor, setSolidBgColor] = useState("#FFFFFF");

  const [frontDesign, setFrontDesign] = useState({ file: null, previewUrl: null, x: 50, y: 50, scale: 50, rotation: 0 });
  const [backDesign, setBackDesign] = useState({ file: null, previewUrl: null, x: 50, y: 50, scale: 50, rotation: 0 });

  const activeDesignState = activeSide === "back" ? backDesign : frontDesign;
  const setActiveDesignState = activeSide === "back" ? setBackDesign : setFrontDesign;

  useEffect(() => {
    if (selectedColor) {
      const lowerCol = String(selectedColor).toLowerCase();
      if (
        lowerCol.includes("black") || lowerCol.includes("noir") || lowerCol.includes("navy") ||
        lowerCol.includes("charcoal") || lowerCol.includes("gray") || lowerCol.includes("gris") ||
        lowerCol.includes("green") || lowerCol.includes("vert")
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
                    originalImageUrl: adaptedCustom.front.artworkUrl || adaptedCustom.front.originalImageUrl,
                    width: adaptedCustom.front.widthPercent ?? adaptedCustom.front.width,
                    x:   adaptedCustom.front.xOffsetPercent ?? adaptedCustom.front.x,
                    y:   adaptedCustom.front.yOffsetPercent ?? adaptedCustom.front.y,
                    rotation: adaptedCustom.front.rotation,
                  }
                : null,
              back: adaptedCustom.back
                ? {
                    originalImageUrl: adaptedCustom.back.artworkUrl || adaptedCustom.back.originalImageUrl,
                    width: adaptedCustom.back.widthPercent ?? adaptedCustom.back.width,
                    x:   adaptedCustom.back.xOffsetPercent ?? adaptedCustom.back.x,
                    y:   adaptedCustom.back.yOffsetPercent ?? adaptedCustom.back.y,
                    rotation: adaptedCustom.back.rotation,
                  }
                : null,
            }
          : null);

      if (custom) {
        const stableId = editingCartItem.variantId || editingCartItem.lineItemId;

        setSelectedColor(editingCartItem.colorSelected || editingCartItem.color || canvas.availableColors[0]?.colorName || "");
        setSelectedSize(editingCartItem.sizeSelected || editingCartItem.size || canvas.sizes[0]?.sizeCode || "");

        const loadDesignUrls = async () => {
          let frontPreview = custom.front ? custom.front.originalImageUrl : null;
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

          // --- SYNCHRONOUS SIZE-AWARE SELF-HEALING ADAPTER ---
          const cfg = getTemplateConfig(canvas.title);
          const garmentDims = getGarmentDimensions(
            canvas.title, 
            editingCartItem.sizeSelected || editingCartItem.size || canvas.sizes[0]?.sizeCode || "M"
          );
          const printWidthRatio = cfg.printW_ref / cfg.B_ref;
          const maxPrintWidthCm = garmentDims.B * printWidthRatio;

          const resolveInitialScale = (designNode) => {
            if (!designNode) return 50;
            const currentWidth = designNode.width;
            
            // If width < 15, it's a legacy physical centimeter value (e.g. 12.2 cm)
            if (currentWidth < 15) {
              const healedScale = (currentWidth / maxPrintWidthCm) * 100;
              return Math.min(100, Math.max(15, Math.round(healedScale)));
            }
            // Otherwise, it represents the scale percentage directly
            return currentWidth;
          };

          const frontScale = resolveInitialScale(custom.front);
          const backScale = resolveInitialScale(custom.back);

          if (isMounted) {
            setFrontDesign(
              custom.front
                ? {
                    file: "existing",
                    previewUrl: frontPreview,
                    scale: frontScale, 
                    x: custom.front.x,
                    y: custom.front.y,
                    rotation: custom.front.rotation || 0,
                  }
                : { file: null, previewUrl: null, scale: 50, x: 50, y: 50, rotation: 0 }
            );

            setBackDesign(
              custom.back
                ? {
                    file: "existing",
                    previewUrl: backPreview,
                    scale: backScale, 
                    x: custom.back.x,
                    y: custom.back.y,
                    rotation: custom.back.rotation || 0,
                  }
                : { file: null, previewUrl: null, scale: 50, x: 50, y: 50, rotation: 0 }
            );

            setActiveSide(custom.printSide === "back" ? "back" : "front");
          }
        };

        loadDesignUrls();
      }
    } else {
      setFrontDesign({ file: null, previewUrl: null, scale: 50, x: 50, y: 50, rotation: 0 });
      setBackDesign({ file: null, previewUrl: null, scale: 50, x: 50, y: 50, rotation: 0 });
      setActiveSide("front");
    }

    return () => {
      isMounted = false;
      if (freshFrontUrl) URL.revokeObjectURL(freshFrontUrl);
      if (freshBackUrl) URL.revokeObjectURL(freshBackUrl);
    };
  }, [editingCartItem, canvas]);

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
    return () => { isMounted = false; };
  }, [activeTemplateId]);

  useEffect(() => {
    if (!hasBackTemplate && activeSide === "back") {
      setActiveSide("front");
    }
  }, [hasBackTemplate, activeSide]);

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
          <div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, fontFamily: "Tajawal", marginBottom: "0.15rem", color: "white" }}>
              {canvas.title}
            </h2>
            <span style={{ fontFamily: "monospace", color: "#F07A48", fontWeight: 700, fontSize: "0.85rem" }}>
              {canvas.serialNumber}
            </span>
          </div>

          <OptionRow>
            <OptionSection>
              <SectionLabel>{t("pod_studio.colors_title")}</SectionLabel>
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
              <SectionLabel>{t("pod_studio.sizes_title")}</SectionLabel>
              <CollapsiblePills $expanded={sizesExpanded}>
                {canvas.sizes.map((s) => (
                  <SizePill key={s.sizeCode} $active={selectedSize === s.sizeCode} onClick={() => setSelectedSize(s.sizeCode)}>
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

          {canvas.specifications.printableSurfaces.length > 1 && hasBackTemplate && (
            <OptionSection>
              <SectionLabel>{t("pod_studio.print_side")}</SectionLabel>
              <SegmentedSideControl>
                <SegmentButton $active={activeSide === "front"} onClick={() => setActiveSide("front")}>
                  {t("pod_studio.front_side")}
                </SegmentButton>
                <SegmentButton $active={activeSide === "back"} onClick={() => setActiveSide("back")}>
                  {t("pod_studio.back_side")}
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
      <PartnerSizingWidget canvas={canvas} selectedSize={selectedSize} />
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