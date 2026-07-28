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
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

  @media (max-width: 768px) {
    display: none; /* Hide duplicate desktop tab headers on mobile */
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

const UploadZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 1.25rem;
  border: 2px dashed ${(props) => props.theme.primaryColor || "#F07A48"}80;
  border-radius: 16px;
  background: ${(props) => props.theme.primaryColor || "#F07A48"}04;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    background: ${(props) => props.theme.primaryColor || "#F07A48"}0a;
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }

  input {
    display: none;
  }
`;

const UploadLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  font-family: "Tajawal", sans-serif;
`;

const UploadSub = styled.span`
  font-size: 0.7rem;
  color: #71717a;
  font-family: "Cairo", sans-serif;
`;

const SingleRowDimension = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  direction: ltr;

  .dim-label {
    font-size: 0.8rem;
    font-weight: 800;
    color: #a1a1aa;
    min-width: 60px;
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
      width: 60px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      color: white;
      padding: 4px 6px;
      font-size: 0.85rem;
      text-align: center;
      outline: none;
      font-family: monospace;
      font-weight: 700;
      &:focus {
        border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
      }
    }

    span {
      font-size: 0.75rem;
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
  width: 44px;
  height: 44px;
  border-radius: 10px;
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
}) => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);
  const replacementInputRef = useRef(null);
  const isArabic = i18n.language === "ar";

  const [aspectRatio, setAspectRatio] = useState(1);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const garmentDims = useMemo(
    () => getGarmentDimensions(canvasName, selectedSize, sizeChart),
    [canvasName, selectedSize, sizeChart]
  );

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
    const targetScalePct = calculateScaleFromPhysicalWidth(
      val,
      garmentDims.B
    );
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

  return (
    <div id="design-controls-section" style={{ width: "100%" }}>
      {!designState.previewUrl ? (
        // If locked, do not allow uploading a new design
        isArtistLocked ? (
          <div style={{ color: "#71717a", textAlign: "center", padding: "2rem" }}>
            {isArabic ? "هذا التصميم محمي بواسطة الفنان." : "This original artwork is protected by the artist."}
          </div>
        ) : (
          <UploadZone onClick={() => fileInputRef.current?.click()}>
            <FaCloudUploadAlt style={{ fontSize: "2rem", color: "#F07A48" }} />
            <UploadLabel>{t("pod_studio_upload_design_title", "Import Artwork")}</UploadLabel>
            <UploadSub>{t("pod_studio_upload_requirements", "PNG image with transparent background")}</UploadSub>
            <input
              id="primary-upload-input"
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
            />
          </UploadZone>
        )
      ) : (
        <ControlsCard>
          <ArtworkManager $isArabic={isArabic}>
            <ArtworkInfo>
              <ArtworkThumbnailWrap>
                <img src={designState.previewUrl} alt="Thumbnail" />
              </ArtworkThumbnailWrap>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "start" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF" }}>
                  {isArtistLocked 
                    ? (isArabic ? "تصميم محمي" : "Original Design") 
                    : (designState.file?.name ? designState.file.name.substring(0, 14) + "..." : "Artwork Layer")
                  }
                </span>
                
                {dpiValue > 0 && (
                  <span style={{ fontSize: "0.72rem", color: dpiValue >= 150 ? "#39A170" : "#ef4444", fontWeight: "700" }}>
                    {dpiValue} DPI ({dpiValue >= 150 ? t("pod_studio_status_artwork_ok", "High Quality") : "Low Quality"})
                  </span>
                )}
              </div>
            </ArtworkInfo>
            
            {/* 🔴 HIDE ACTION BUTTONS FOR PROTECTED ARTIST DESIGNS */}
            {!isArtistLocked && (
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
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
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
            )}
          </ArtworkManager>

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

          {activeTab === "transform" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <SingleRowDimension>
                <span className="dim-label">{isArabic ? "العرض" : "Width"}</span>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={designState.scale}
                  onChange={(e) => handleScaleChange(parseInt(e.target.value, 10))}
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
                <span className="dim-label">{isArabic ? "الارتفاع" : "Height"}</span>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={designState.scale}
                  onChange={(e) => handleScaleChange(parseInt(e.target.value, 10))}
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

          {activeTab === "position" && (
            <JoystickPositionPad
              x={designState.x}
              y={designState.y}
              isArabic={isArabic}
              onChange={({ x, y }) =>
                setDesignState((prev) => ({ ...prev, x, y }))
              }
            />
          )}

          {activeTab === "rotation" && (
            <RadialRotationDial
              rotation={designState.rotation}
              onChange={(rot) =>
                setDesignState((prev) => ({ ...prev, rotation: rot }))
              }
            />
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
};

export default DesignControls;