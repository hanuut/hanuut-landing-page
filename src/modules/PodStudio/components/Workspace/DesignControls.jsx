import React, { useRef, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaCloudUploadAlt,
  FaTrash,
  FaCropAlt,
  FaSlidersH,
  FaCompass,
  FaPalette,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  getGarmentDimensions,
  calculatePhysicalMetrics,
  calculateScaleFromPhysicalWidth,
} from "../../hooks/usePrintableArea";

import JoystickPositionPad from "./JoystickPositionPad";
import RadialRotationDial from "./RadialRotationDial";

// ===========================================================================
// STYLED COMPONENTS - PRO INSPECTOR PANEL (PHOTOSHOP / FIGMA STYLE)
// ===========================================================================

const ControlsCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-sizing: border-box;
  width: 100%;
`;

const CompactUploadRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CompactUploadZone = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem;
  border: 1.5px dashed ${(props) => props.theme.primaryColor || "#F07A48"};
  border-radius: 12px;
  background: rgba(240, 122, 72, 0.05);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Tajawal", sans-serif;

  &:hover {
    background: rgba(240, 122, 72, 0.12);
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }

  input[type="file"] {
    display: none;
  }
`;

const ArtistSelectBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Tajawal", sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

// 🔴 3D STACKED HOVER & 5s TIMER ANIMATED ARTWORK WIDGET
const StackedWidgetWrapper = styled(motion.div)`
  background: rgba(18, 18, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 0.6rem 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  &:hover {
    border-color: rgba(240, 122, 72, 0.6);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
  }
`;

const StackedImageContainer = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
`;

const StackLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #18181b;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 2px;
    box-sizing: border-box;
  }
`;

const ActiveArtDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  overflow: hidden;

  .title {
    font-size: 0.82rem;
    font-weight: 800;
    color: #ffffff;
    font-family: "Tajawal", sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dpi-badge {
    font-size: 0.68rem;
    font-weight: 700;
    font-family: monospace;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    width: fit-content;
    padding: 1px 5px;
    border-radius: 4px;
  }

  .dpi-good {
    background: rgba(57, 161, 112, 0.15);
    color: #39a170;
  }

  .dpi-low {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }
`;

const WidgetActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const IconActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #d4d4d8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.85rem;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.25);
  }

  &.palette:hover {
    background: #f07a48;
    color: #000000;
    border-color: #f07a48;
  }

  &.danger:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border-color: #ef4444;
  }
`;

// 🔴 SEGMENTED INSPECTOR TAB BAR
const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: rgba(0, 0, 0, 0.4);
  padding: 3px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const TabButton = styled.button`
  background: ${(props) =>
    props.$active ? props.theme.primaryColor || "#F07A48" : "transparent"};
  color: ${(props) => (props.$active ? "#050505" : "#a1a1aa")};
  border: none;
  padding: 0.45rem 0.2rem;
  border-radius: 7px;
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => (props.$active ? "#050505" : "#ffffff")};
  }
`;

const SingleRowDimension = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.45rem 0.65rem;
  direction: ltr;

   .dim-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: #a1a1aa;
    min-width: 42px;
    text-transform: uppercase;
    font-family: "Tajawal", sans-serif;
  }

  input[type="range"] {
    flex: 1;
    accent-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    outline: none;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    gap: 3px;

    input[type="number"] {
      width: 48px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: white;
      padding: 3px;
      font-size: 0.75rem;
      text-align: center;
      outline: none;
      font-family: monospace;
      font-weight: 700;
      &:focus {
        border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
      }
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    span {
      font-size: 0.65rem;
      color: #a1a1aa;
      font-weight: 700;
    }
  }
`;

const DesignControls = ({
  designState,
  setDesignState,
  canvasName,
  selectedSize = "M",
  sizeChart = null,
  activeTab,
  setActiveTab,
  onOpenDesignLibrary = () => {},
  activePanel = "layer",
  hideTabs = false,
}) => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);
  const replacementInputRef = useRef(null);
  const isArabic = i18n.language === "ar";

  const [aspectRatio, setAspectRatio] = useState(1);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [isWidgetHovered, setIsWidgetHovered] = useState(false);
  const [autoFanTrigger, setAutoFanTrigger] = useState(false);

  const garmentDims = useMemo(() => {
    return getGarmentDimensions(canvasName, selectedSize, sizeChart);
  }, [canvasName, selectedSize, sizeChart]);

  // 🔴 5-SECOND AUTOMATED FANNING ANIMATION TIMER
  useEffect(() => {
    if (!designState.previewUrl) return;
    const timer = setInterval(() => {
      setAutoFanTrigger(true);
      setTimeout(() => setAutoFanTrigger(false), 1200);
    }, 5000);

    return () => clearInterval(timer);
  }, [designState.previewUrl]);

  useEffect(() => {
    let isMounted = true;
    if (designState.previewUrl) {
      const img = new Image();
      img.src = designState.previewUrl;
      img.onload = () => {
        if (isMounted) {
          const ratio = img.naturalWidth / img.naturalHeight;
          setAspectRatio(ratio);
          setImgDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }
      };
    } else {
      setAspectRatio(1);
      setImgDimensions({ width: 0, height: 0 });
    }
    return () => {
      isMounted = false;
    };
  }, [designState.previewUrl]);

  const physicalMetrics = useMemo(() => {
    return calculatePhysicalMetrics(
      designState.scale,
      garmentDims.B,
      garmentDims.A,
      aspectRatio
    );
  }, [designState.scale, garmentDims, aspectRatio]);

  const dpiValue = useMemo(() => {
    if (!imgDimensions.width || !physicalMetrics.width) return 0;
    const widthInInches = physicalMetrics.width / 2.54;
    return Math.round(imgDimensions.width / widthInInches);
  }, [imgDimensions, physicalMetrics.width]);

  // 🔴 ZERO ROUTE NAVIGATION HANDLER FOR PALETTE & LAYER CARD
  const handleOpenLibraryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenDesignLibrary) {
      onOpenDesignLibrary();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setDesignState((prev) => ({ ...prev, file, previewUrl }));
    }
  };

  const handleScaleChange = (newScale) => {
    setDesignState((prev) => ({ ...prev, scale: newScale }));
  };

  const handlePhysicalWidthInput = (e) => {
    const val = parseFloat(e.target.value) || 0;
    const targetScalePct = calculateScaleFromPhysicalWidth(val, garmentDims.B);
    setDesignState((prev) => ({
      ...prev,
      scale: Math.min(120, Math.max(15, Math.round(targetScalePct))),
    }));
  };

  const handleReset = () => {
    setDesignState({
      file: null,
      previewUrl: null,
      x: 50,
      y: 50,
      scale: 50,
      rotation: 0,
    });
  };

  // 🔴 STRICT SEGMENTED TAB INSPECTOR (Applied to both Desktop & Mobile)
  const showTransform = activeTab === "transform";
  const showPosition = activeTab === "position";
  const showRotation = activeTab === "rotation";

  const isFanned = isWidgetHovered || autoFanTrigger;

  return (
    <div id="design-controls-section" style={{ width: "100%" }}>
      {activePanel === "layer" && (
        !designState.previewUrl ? (
          <CompactUploadRow>
            <CompactUploadZone>
              <FaCloudUploadAlt
                style={{ fontSize: "1.1rem", color: "#F07A48" }}
              />
              <span>{isArabic ? "رفع تصميم PNG" : "Upload PNG"}</span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/*"
                onChange={handleFileChange}
              />
            </CompactUploadZone>

            <ArtistSelectBtn
              type="button"
              onClick={handleOpenLibraryClick}
            >
              <FaPalette style={{ color: "#39A170" }} />
              <span>{isArabic ? "تصاميم الفنانين" : "Artist Designs"}</span>
            </ArtistSelectBtn>
          </CompactUploadRow>
        ) : (
          <StackedWidgetWrapper
            $isArabic={isArabic}
            onMouseEnter={() => setIsWidgetHovered(true)}
            onMouseLeave={() => setIsWidgetHovered(false)}
            onClick={handleOpenLibraryClick}
            title={isArabic ? "تغيير التصميم" : "Change Artwork"}
          >
            <StackedImageContainer>
              <StackLayer
                animate={
                  isFanned
                    ? { x: -8, rotate: -6, opacity: 0.5 }
                    : { x: 0, rotate: 0, opacity: 0.3 }
                }
                transition={{ duration: 0.25 }}
              >
                <img src={designState.previewUrl} alt="" />
              </StackLayer>

              <StackLayer
                animate={
                  isFanned
                    ? { x: -4, rotate: -3, opacity: 0.75 }
                    : { x: 0, rotate: 0, opacity: 0.6 }
                }
                transition={{ duration: 0.25 }}
              >
                <img src={designState.previewUrl} alt="" />
              </StackLayer>

              <StackLayer style={{ zIndex: 5, opacity: 1 }}>
                <img src={designState.previewUrl} alt="Active Artwork" />
              </StackLayer>
            </StackedImageContainer>

            <ActiveArtDetails $isArabic={isArabic}>
              <span className="title">
                {designState.file?.name
                  ? designState.file.name.substring(0, 15) + "..."
                  : "Artwork Layer"}
              </span>

              {dpiValue > 0 && (
                <span
                  className={`dpi-badge ${
                    dpiValue >= 150 ? "dpi-good" : "dpi-low"
                  }`}
                >
                  {dpiValue >= 150 ? <FaCheckCircle /> : <FaExclamationTriangle />}
                  DPI {dpiValue}
                </span>
              )}
            </ActiveArtDetails>

            <WidgetActionGroup>
              <IconActionButton
                type="button"
                className="palette"
                title={isArabic ? "تغيير التصميم" : "Change Artwork"}
                onClick={handleOpenLibraryClick}
              >
                <FaPalette />
              </IconActionButton>

              <IconActionButton
                type="button"
                title="Replace File"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  replacementInputRef.current?.click();
                }}
              >
                <FaCloudUploadAlt />
                <input
                  type="file"
                  ref={replacementInputRef}
                  accept="image/png, image/jpeg, image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </IconActionButton>

              <IconActionButton
                type="button"
                className="danger"
                title="Remove Artwork"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleReset();
                }}
              >
                <FaTrash />
              </IconActionButton>
            </WidgetActionGroup>
          </StackedWidgetWrapper>
        )
      )}

      {activePanel === "transform" && (
        <ControlsCard style={{ padding: hideTabs ? "0" : "0.75rem", border: hideTabs ? "none" : "1px solid rgba(255, 255, 255, 0.06)", background: hideTabs ? "transparent" : "rgba(255, 255, 255, 0.02)" }}>
          {!hideTabs && (
            <TabBar>
              <TabButton
                type="button"
                $active={activeTab === "transform"}
                onClick={() => setActiveTab("transform")}
              >
                <FaCropAlt /> {isArabic ? "الحجم" : "Size"}
              </TabButton>

              <TabButton
                type="button"
                $active={activeTab === "position"}
                onClick={() => setActiveTab("position")}
              >
                <FaCompass /> {isArabic ? "الموقع" : "Position"}
              </TabButton>

              <TabButton
                type="button"
                $active={activeTab === "rotation"}
                onClick={() => setActiveTab("rotation")}
              >
                <FaSlidersH /> {isArabic ? "الدوران" : "Rotate"}
              </TabButton>
            </TabBar>
          )}

          {showTransform && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <SingleRowDimension>
                <span className="dim-label">
                  {isArabic ? "العرض" : "Width"}
                </span>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={designState.scale}
                  onChange={(e) =>
                    handleScaleChange(parseInt(e.target.value, 10))
                  }
                />
                <div className="input-wrap">
                  <input
                    type="number"
                    step="0.1"
                    value={physicalMetrics.width}
                    onChange={handlePhysicalWidthInput}
                  />
                  <span>cm</span>
                </div>
              </SingleRowDimension>

              <SingleRowDimension>
                <span className="dim-label">
                  {isArabic ? "الارتفاع" : "Height"}
                </span>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={designState.scale}
                  onChange={(e) =>
                    handleScaleChange(parseInt(e.target.value, 10))
                  }
                />
                <div className="input-wrap">
                  <input
                    type="number"
                    disabled
                    value={physicalMetrics.height}
                  />
                  <span>cm</span>
                </div>
              </SingleRowDimension>
            </div>
          )}

          {showPosition && (
            <div style={{ marginTop: "0.1rem" }}>
              <JoystickPositionPad
                x={designState.x}
                y={designState.y}
                isArabic={isArabic}
                onChange={({ x, y }) =>
                  setDesignState((prev) => ({ ...prev, x, y }))
                }
              />
            </div>
          )}

          {showRotation && (
            <div style={{ marginTop: "0.1rem" }}>
              <RadialRotationDial
                rotation={designState.rotation}
                onChange={(rot) =>
                  setDesignState((prev) => ({ ...prev, rotation: rot }))
                }
              />
            </div>
          )}
        </ControlsCard>
      )}
    </div>
  );
};

DesignControls.propTypes = {
  designState: PropTypes.object.isRequired,
  setDesignState: PropTypes.func.isRequired,
  canvasName: PropTypes.string.isRequired,
  selectedSize: PropTypes.string,
  sizeChart: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  onOpenDesignLibrary: PropTypes.func,
  activePanel: PropTypes.string,
  hideTabs: PropTypes.bool,
};

export default DesignControls;