import React, { useRef, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  FaCloudUploadAlt,
  FaTrash,
  FaCropAlt,
  FaSlidersH,
  FaCompass,
  FaPalette,
} from "react-icons/fa";
import {
  getGarmentDimensions,
  calculatePhysicalMetrics,
  calculateScaleFromPhysicalWidth,
} from "../../hooks/usePrintableArea";

import JoystickPositionPad from "./JoystickPositionPad";
import RadialRotationDial from "./RadialRotationDial";

const ControlsCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-sizing: border-box;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 0.5rem;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const TabButton = styled.button`
  flex: 1;
  background: ${(props) =>
    props.$active ? props.theme.primaryColor || "#F07A48" : "transparent"};
  color: ${(props) => (props.$active ? "#050505" : "#a1a1aa")};
  border: none;
  padding: 0.55rem 0.25rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => (props.$active ? "#050505" : "#ffffff")};
  }
`;

// 🔴 COMPACT UPLOAD ROW (2-COLUMN GRID)
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
  padding: 0.85rem 1rem;
  border: 1.5px dashed ${(props) => props.theme.primaryColor || "#F07A48"};
  border-radius: 14px;
  background: rgba(240, 122, 72, 0.05);
  color: #ffffff;
  font-size: 0.85rem;
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
  padding: 0.85rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Tajawal", sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const SingleRowDimension = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.6rem 0.75rem;
  direction: ltr;

  .dim-label {
    font-size: 0.75rem;
    font-weight: 800;
    color: #a1a1aa;
    min-width: 50px;
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
    gap: 4px;

    input[type="number"] {
      width: 55px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: white;
      padding: 4px;
      font-size: 0.8rem;
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
      font-size: 0.7rem;
      color: #a1a1aa;
      font-weight: 700;
    }
  }
`;

const ArtworkManager = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.5rem 0.75rem;
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
  width: 38px;
  height: 38px;
  border-radius: 8px;
  overflow: hidden;
  background: #27272a;
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

const DesignControls = ({
  designState,
  setDesignState,
  canvasName,
  selectedSize = "M",
  sizeChart = null,
  activeTab,
  setActiveTab,
  isArtistLocked = false,
  onToggleArtistTab,
}) => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);
  const replacementInputRef = useRef(null);
  const isArabic = i18n.language === "ar";

  const [aspectRatio, setAspectRatio] = useState(1);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const garmentDims = useMemo(() => {
    return getGarmentDimensions(canvasName, selectedSize, sizeChart);
  }, [canvasName, selectedSize, sizeChart]);

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

  const isDesktop = typeof window !== "undefined" && window.innerWidth > 1024;
  const showTransform = isDesktop || activeTab === "transform";
  const showPosition = isDesktop || activeTab === "position";
  const showRotation = isDesktop || activeTab === "rotation";

  return (
    <div id="design-controls-section" style={{ width: "100%" }}>
      {!designState.previewUrl ? (
        isArtistLocked ? (
          <div
            style={{ color: "#71717a", textAlign: "center", padding: "2rem" }}
          >
            {isArabic
              ? "هذا التصميم محمي بواسطة الفنان."
              : "This original artwork is protected by the artist."}
          </div>
        ) : (
          <CompactUploadRow>
            <CompactUploadZone>
              <FaCloudUploadAlt
                style={{ fontSize: "1.2rem", color: "#F07A48" }}
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
              onClick={() => onToggleArtistTab && onToggleArtistTab()}
            >
              <FaPalette style={{ color: "#39A170" }} />
              <span>{isArabic ? "تصاميم الفنانين" : "Artist Designs"}</span>
            </ArtistSelectBtn>
          </CompactUploadRow>
        )
      ) : (
        <ControlsCard>
          {showTransform && (
            <ArtworkManager $isArabic={isArabic}>
              <ArtworkInfo>
                <ArtworkThumbnailWrap>
                  <img src={designState.previewUrl} alt="Thumbnail" />
                </ArtworkThumbnailWrap>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    textAlign: "start",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: "#FFF",
                    }}
                  >
                    {isArtistLocked
                      ? isArabic
                        ? "تصميم محمي"
                        : "Original Design"
                      : designState.file?.name
                      ? designState.file.name.substring(0, 14) + "..."
                      : "Artwork Layer"}
                  </span>

                  {dpiValue > 0 && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: dpiValue >= 150 ? "#39A170" : "#ef4444",
                        fontWeight: "700",
                      }}
                    >
                      {dpiValue} DPI (
                      {dpiValue >= 150
                        ? t("pod_studio_status_artwork_ok", "High Quality")
                        : "Low Quality"}
                      )
                    </span>
                  )}
                </div>
              </ArtworkInfo>

              <ActionRow>
                
              <MiniActionButton
                type="button"
                title="Replace Artwork"
                onClick={() => replacementInputRef.current?.click()}
              >
                <FaCloudUploadAlt />
                <input
                  type="file"
                  ref={replacementInputRef}
                  accept="image/png, image/jpeg, image/*"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    width: "0.1px",
                    height: "0.1px",
                    opacity: 0,
                    zIndex: -1,
                  }}
                />
              </MiniActionButton>
              
              {/* Add the Artist Catalog Button right next to it! */}
              <MiniActionButton
                type="button"
                title="Artist Catalog"
                onClick={() => onToggleArtistTab && onToggleArtistTab()}
              >
                <FaPalette style={{ color: "#39A170" }} />
              </MiniActionButton>

              <MiniActionButton
                type="button"
                className="danger"
                title="Remove Artwork"
                onClick={handleReset}
              >
                <FaTrash />
              </MiniActionButton>
            </ActionRow>

            </ArtworkManager>
          )}

          <TabBar>
            <TabButton
              type="button"
              $active={activeTab === "transform"}
              onClick={() => setActiveTab("transform")}
            >
              <FaCropAlt /> {isArabic ? "الحجم" : "Scale"}
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

          {showTransform && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
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
            <div style={{ marginTop: isDesktop ? "0.5rem" : "0" }}>
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
            <div style={{ marginTop: isDesktop ? "0.5rem" : "0" }}>
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
  isArtistLocked: PropTypes.bool,
  onToggleArtistTab: PropTypes.func,
};

export default DesignControls;