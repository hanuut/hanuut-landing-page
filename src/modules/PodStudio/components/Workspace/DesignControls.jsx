import React, { useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  FaCloudUploadAlt,
  FaTrash,
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
  padding: 1rem; /* Reduced from 1.25rem */
  display: flex;
  flex-direction: column;
  gap: 0.85rem; /* Reduced from 1.25rem */
  box-sizing: border-box;
`;


const UploadZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
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

  /* Safe WebView Hidden Input */
  input[type="file"] {
    position: absolute;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    z-index: -1;
  }
`;


const UploadLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  font-family: "Tajawal", sans-serif;
`;

const UploadSub = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-family: "Cairo", sans-serif;
`;

const SingleRowDimension = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.6rem 0.75rem; /* Tighter padding for mobile */
  direction: ltr;

  .dim-label {
    font-size: 0.75rem; /* Slightly smaller */
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
      width: 55px; /* Tighter */
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
      &:focus { border-color: ${(props) => props.theme.primaryColor || "#F07A48"}; }
      &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
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
  padding: 0.5rem 0.75rem; /* Tighter padding */
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
  width: 38px; /* Reduced from 44px */
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
  activeTab, // Kept for mobile dock routing
  isArtistLocked = false, 
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const garmentDims = useMemo(
    () => getGarmentDimensions(canvasName, selectedSize, sizeChart),
    [canvasName, selectedSize, sizeChart]
  );

  const aspectRatio = useMemo(() => {
    return designState.aspectRatio || 1;
  }, [designState.aspectRatio]);

  const physicalMetrics = useMemo(() => {
    return calculatePhysicalMetrics(
      designState.scale,
      garmentDims.B,
      garmentDims.A,
      aspectRatio
    );
  }, [designState.scale, garmentDims, aspectRatio]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        setDesignState((prev) => ({ ...prev, file, previewUrl, aspectRatio: ratio }));
      };
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
      aspectRatio: 1,
    });
  };

  // We expose specific tools based on Mobile Tab logic, but on Desktop everything is visible
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 1024;
  const showTransform = isDesktop || activeTab === "transform";
  const showPosition = isDesktop || activeTab === "position";
  const showRotation = isDesktop || activeTab === "rotation";

  return (
    <div id="design-controls-section" style={{ width: "100%" }}>
      {!designState.previewUrl ? (
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
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/*"
              onChange={handleFileChange}
            />
          </UploadZone>
        )
      ) : (
        <ControlsCard>
          {showTransform && (
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
                </div>
              </ArtworkInfo>
              
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
                      accept="image/png, image/jpeg, image/*"
                      onChange={handleFileChange}
                      style={{ position: 'absolute', width: '0.1px', height: '0.1px', opacity: 0, zIndex: -1 }}
                    />
                  </MiniActionButton>
                  
                  <MiniActionButton type="button" className="danger" title="Remove Artwork" onClick={handleReset}>
                    <FaTrash />
                  </MiniActionButton>
                </ActionRow>
              )}
            </ArtworkManager>
          )}

          {showTransform && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
              <SingleRowDimension>
                <span className="dim-label">{isArabic ? "العرض" : "Width"}</span>
                <input type="range" min="15" max="120" value={designState.scale} onChange={(e) => handleScaleChange(parseInt(e.target.value, 10))} />
                <div className="input-wrap">
                  <input type="number" step="0.1" value={physicalMetrics.width} onChange={handlePhysicalWidthInput} />
                  <span>cm</span>
                </div>
              </SingleRowDimension>

              <SingleRowDimension>
                <span className="dim-label">{isArabic ? "الارتفاع" : "Height"}</span>
                <input type="range" min="15" max="120" value={designState.scale} onChange={(e) => handleScaleChange(parseInt(e.target.value, 10))} />
                <div className="input-wrap">
                  <input type="number" disabled value={physicalMetrics.height} />
                  <span>cm</span>
                </div>
              </SingleRowDimension>
            </div>
          )}

          {showPosition && (
            <div style={{ marginTop: isDesktop ? "0.5rem" : "0" }}>
              <JoystickPositionPad
                x={designState.x} y={designState.y} isArabic={isArabic}
                onChange={({ x, y }) => setDesignState((prev) => ({ ...prev, x, y }))}
              />
            </div>
          )}

          {showRotation && (
            <div style={{ marginTop: isDesktop ? "0.5rem" : "0" }}>
              <RadialRotationDial
                rotation={designState.rotation}
                onChange={(rot) => setDesignState((prev) => ({ ...prev, rotation: rot }))}
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
};

export default DesignControls;