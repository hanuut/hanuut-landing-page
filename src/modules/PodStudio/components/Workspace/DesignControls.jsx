import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  FaCloudUploadAlt,
  FaEye,
  FaTrash,
  FaTimes,
  FaArrowsAltH,
  FaArrowsAltV,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  getTemplateConfig,
  getGarmentDimensions,
  calculatePhysicalMetrics,
  calculateScaleFromPhysicalWidth,
} from "../../hooks/usePrintableArea";
import { motion, AnimatePresence } from "framer-motion";

// Helper: Convert Base64 payload from Flutter back to a Web File object
const base64ToFile = (base64String, mimeType, fileName) => {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType || "image/png" });
  return new File([blob], fileName || "artwork.png", { type: mimeType || "image/png" });
};

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

const SliderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  direction: ltr;

  label {
    font-size: 0.75rem;
    color: #a1a1aa;
    font-weight: 700;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    font-family: "Tajawal", sans-serif;
  }

  .range-row {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  input[type="range"] {
    flex: 1;
    accent-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    outline: none;
  }

  input[type="number"] {
    width: 65px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 6px;
    color: white;
    padding: 4px 6px;
    font-size: 0.85rem;
    text-align: center;
    outline: none;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    &:focus {
      border-color: ${(props) => props.theme.primaryColor};
    }
  }
`;

const DimensionSegment = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2px;
  border-radius: 10px;
  margin-bottom: 0.5rem;
`;

const SegmentButton = styled.button`
  background: ${(props) =>
    props.$active ? "rgba(240, 122, 72, 0.15)" : "transparent"};
  color: ${(props) => (props.$active ? "#F07A48" : "#A1A1AA")};
  border: 1px solid ${(props) => (props.$active ? "#F07A48" : "transparent")};
  padding: 0.5rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;
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
  width: 46px;
  height: 46px;
  border-radius: 10px;
  overflow: hidden;
  background-image:
    linear-gradient(45deg, #18181b 25%, transparent 25%),
    linear-gradient(-45deg, #18181b 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #18181b 75%),
    linear-gradient(-45deg, transparent 75%, #18181b 75%);
  background-size: 10px 10px;
  background-position:
    0 0,
    0 5px,
    5px -5px,
    -5px 0px;
  background-color: #27272a;
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

const ResolutionWidget = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: ${(props) =>
    props.$isHigh ? "rgba(57, 161, 112, 0.08)" : "rgba(239, 68, 68, 0.08)"};
  border: 1px solid
    ${(props) =>
      props.$isHigh ? "rgba(57, 161, 112, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  color: ${(props) => (props.$isHigh ? "#39A170" : "#ef4444")};
  font-family: "Cairo", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  width: 100%;
  box-sizing: border-box;

  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #a1a1aa;
    font-size: 0.8rem;
    font-family: "Tajawal", sans-serif;
  }
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
`;

const LightboxCard = styled(motion.div)`
  width: 90%;
  max-width: 450px;
  aspect-ratio: 1;
  background-image:
    linear-gradient(45deg, #18181b 25%, transparent 25%),
    linear-gradient(-45deg, #18181b 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #18181b 75%),
    linear-gradient(-45deg, transparent 75%, #18181b 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;
  background-color: #27272a;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const OptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: start;
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Tajawal", sans-serif;
`;

const DesignControls = ({
  designState,
  setDesignState,
  canvasName,
  selectedSize = "M",
}) => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);
  const replacementInputRef = useRef(null);
  const isArabic = i18n.language === "ar";

  const [aspectRatio, setAspectRatio] = useState(1);
  const [refDimension, setRefDimension] = useState("width");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  // --- REGISTER FLUTTER NATIVE HANDSHAKE HANDLER ---
  useEffect(() => {
    window.handleNativeImage = (base64Image, mimeType, fileName) => {
      try {
        const file = base64ToFile(base64Image, mimeType, fileName);
        const previewUrl = URL.createObjectURL(file);
        setDesignState((prev) => ({ ...prev, file, previewUrl }));
      } catch (err) {
        console.error("Failed to parse native Flutter image payload:", err);
      }
    };

    return () => {
      delete window.handleNativeImage;
    };
  }, [setDesignState]);

  // Unified trigger logic (calls JS Channel if inside Flutter app, or DOM click if browser)
  const triggerImageUpload = useCallback(() => {
    if (window.HanuutMediaBridge) {
      window.HanuutMediaBridge.postMessage("pickImage");
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const triggerReplacementUpload = useCallback(() => {
    if (window.HanuutMediaBridge) {
      window.HanuutMediaBridge.postMessage("pickImage");
    } else if (replacementInputRef.current) {
      replacementInputRef.current.click();
    }
  }, []);

  const cfg = useMemo(() => getTemplateConfig(canvasName), [canvasName]);
  const garmentDims = useMemo(
    () => getGarmentDimensions(canvasName, selectedSize),
    [canvasName, selectedSize],
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
          setRefDimension(ratio >= 1 ? "width" : "height");
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
    const printWidthRatio = cfg.printW_ref / cfg.B_ref;
    const printHeightRatio = cfg.printH_ref / cfg.A_ref;

    return calculatePhysicalMetrics(
      designState.scale,
      garmentDims.B,
      garmentDims.A,
      printWidthRatio,
      printHeightRatio,
      aspectRatio,
    );
  }, [designState.scale, garmentDims, cfg, aspectRatio]);

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

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setDesignState((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handlePhysicalSizeChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    const printWidthRatio = cfg.printW_ref / cfg.B_ref;
    const targetScalePct = calculateScaleFromPhysicalWidth(
      val,
      garmentDims.B,
      printWidthRatio,
    );

    setDesignState((prev) => ({
      ...prev,
      scale: Math.min(100, Math.max(15, Math.round(targetScalePct))),
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
    setRefDimension("width");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (replacementInputRef.current) replacementInputRef.current.value = "";
  };

  const maxLimit = useMemo(() => {
    return refDimension === "width"
      ? physicalMetrics.maxPrintWidthCm
      : physicalMetrics.maxPrintHeightCm;
  }, [refDimension, physicalMetrics]);

  const currentActiveVal =
    refDimension === "width" ? physicalMetrics.width : physicalMetrics.height;

  return (
    <div id="design-controls-section" style={{ width: "100%" }}>
      {!designState.previewUrl ? (
        <UploadZone onClick={triggerImageUpload}>
          <FaCloudUploadAlt style={{ fontSize: "1.75rem", color: "#a1a1aa" }} />
          <UploadLabel>{t("pod_studio_upload_design_title")}</UploadLabel>
          <UploadSub>{t("pod_studio_upload_requirements")}</UploadSub>
          <input
            id="primary-upload-input"
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
        </UploadZone>
      ) : (
        <ControlsCard>
          <ArtworkManager $isArabic={isArabic}>
            <ArtworkInfo>
              <ArtworkThumbnailWrap>
                <img src={designState.previewUrl} alt="Thumbnail" />
              </ArtworkThumbnailWrap>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  color: "#FFF",
                }}
              >
                {designState.file?.name
                  ? designState.file.name.substring(0, 12) +
                    (designState.file.name.length > 12 ? "..." : "")
                  : "Artwork File"}
              </span>
            </ArtworkInfo>
            <ActionRow>
              <MiniActionButton
                type="button"
                title="View Alone"
                onClick={() => setIsLightboxOpen(true)}
              >
                <FaEye />
              </MiniActionButton>
              <MiniActionButton
                type="button"
                title="Replace Image"
                onClick={triggerReplacementUpload}
              >
                <FaCloudUploadAlt />
                <input
                  id="replace-upload-input"
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
                title="Remove Design"
                onClick={handleReset}
              >
                <FaTrash />
              </MiniActionButton>
            </ActionRow>
          </ArtworkManager>

          {dpiValue > 0 && (
            <ResolutionWidget $isHigh={dpiValue >= 150}>
              <span className="label">
                {dpiValue >= 150 ? (
                  <FaCheckCircle />
                ) : (
                  <FaExclamationTriangle />
                )}
                {t("pod_studio_printable_surface")}
              </span>
              <span>
                {dpiValue} DPI (
                {dpiValue >= 150
                  ? t("pod_studio_status_artwork_ok")
                  : "Low Quality"}
                )
              </span>
            </ResolutionWidget>
          )}

          <OptionSection>
            <SectionLabel>{t("pod_studio_scale_percentage")}</SectionLabel>
            <DimensionSegment>
              <SegmentButton
                type="button"
                $active={refDimension === "width"}
                onClick={() => setRefDimension("width")}
              >
                <FaArrowsAltH /> {isArabic ? "العرض" : "Width"}
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={refDimension === "height"}
                onClick={() => setRefDimension("height")}
              >
                <FaArrowsAltV /> {isArabic ? "الارتفاع" : "Height"}
              </SegmentButton>
            </DimensionSegment>

            <SliderGroup>
              <label>
                <span>
                  {refDimension === "width"
                    ? isArabic
                      ? "العرض"
                      : "Width"
                    : isArabic
                      ? "الارتفاع"
                      : "Height"}
                </span>
                <span>{currentActiveVal} cm</span>
              </label>
              <div className="range-row">
                <input
                  type="range"
                  name="scale"
                  min="15"
                  max="100"
                  value={designState.scale}
                  onChange={handleSliderChange}
                />
                <input
                  type="number"
                  name="scale_cm"
                  step="0.1"
                  min={(0.15 * maxLimit).toFixed(1)}
                  max={maxLimit.toFixed(1)}
                  value={currentActiveVal}
                  onChange={handlePhysicalSizeChange}
                />
                <span style={{ fontSize: "0.8rem", color: "white" }}>cm</span>
              </div>
            </SliderGroup>
          </OptionSection>

          <SliderGroup>
            <label>
              <span>{t("pod_studio_x_alignment")}</span>
              <span>{designState.x}%</span>
            </label>
            <div className="range-row">
              <input
                type="range"
                name="x"
                min="0"
                max="100"
                value={designState.x}
                onChange={handleSliderChange}
              />
            </div>
          </SliderGroup>

          <SliderGroup>
            <label>
              <span>{t("pod_studio_y_alignment")}</span>
              <span>{designState.y}%</span>
            </label>
            <div className="range-row">
              <input
                type="range"
                name="y"
                min="0"
                max="100"
                value={designState.y}
                onChange={handleSliderChange}
              />
            </div>
          </SliderGroup>

          <SliderGroup>
            <label>
              <span>{t("pod_studio_angle_rotation")}</span>
              <span>{designState.rotation}°</span>
            </label>
            <div className="range-row">
              <input
                type="range"
                name="rotation"
                min="0"
                max="359"
                value={designState.rotation}
                onChange={handleSliderChange}
              />
            </div>
          </SliderGroup>
        </ControlsCard>
      )}

      <AnimatePresence>
        {isLightboxOpen && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <LightboxCard
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={designState.previewUrl} alt="Bespoke Design view" />
              <button
                onClick={() => setIsLightboxOpen(false)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTimes />
              </button>
            </LightboxCard>
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </div>
  );
};

DesignControls.propTypes = {
  designState: PropTypes.shape({
    previewUrl: PropTypes.string,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    rotation: PropTypes.number.isRequired,
  }).isRequired,
  setDesignState: PropTypes.func.isRequired,
  canvasName: PropTypes.string.isRequired,
  selectedSize: PropTypes.string,
};

export default DesignControls;