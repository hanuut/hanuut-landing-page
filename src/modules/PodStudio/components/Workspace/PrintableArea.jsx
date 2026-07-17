import React, { useRef, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const TemplateContentArea = styled.div`
  position: absolute;
  z-index: 2;
  overflow: hidden; /* S3: Master Crop Boundary Mask */
  top: ${(props) => props.$area.top}%;
  left: ${(props) => props.$area.left}%;
  width: ${(props) => props.$area.width}%;
  height: ${(props) => props.$area.height}%;
  pointer-events: none;
`;

const InteractivePrintArea = styled.div`
  position: absolute;
  top: ${(props) => props.$area.top}%;
  left: ${(props) => props.$area.left}%;
  width: ${(props) => props.$area.width}%;
  height: ${(props) => props.$area.height}%;
  pointer-events: auto;
  z-index: 3;
`;

const TransformableBox = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: move;
  box-sizing: border-box;
  border: 1.5px dashed rgba(255, 255, 255, 0.65);
  box-shadow: 0 0 15px rgba(240, 122, 72, 0.25);
  touch-action: none;
  z-index: 10;
`;

const ScaleCorner = styled.div`
  position: absolute;
  bottom: -7px;
  right: -7px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 2px solid #f07a48;
  border-radius: 50%;
  z-index: 20;
  cursor: se-resize;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);
`;

const RotateNode = styled.div`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 2px solid #397ff9;
  border-radius: 50%;
  z-index: 20;
  cursor: grab;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);

  &::after {
    content: "";
    position: absolute;
    top: 12px;
    left: 4px;
    width: 2px;
    height: 12px;
    background: #397ff9;
  }
`;

const SnapGuideline = styled.div`
  position: absolute;
  z-index: 5;
  pointer-events: none;
  background: transparent;

  &.vertical {
    left: 50%;
    top: -20%;
    bottom: -20%;
    width: 1.5px;
    border-left: 1.5px dashed #f07a48;
  }

  &.horizontal {
    top: 50%;
    left: -20%;
    right: -20%;
    height: 1.5px;
    border-top: 1.5px dashed #f07a48;
  }
`;

const PrintableArea = ({
  ratios,
  designState,
  setDesignState,
  activeTemplateUrl,
}) => {
  const containerRef = useRef(null);
  const interactionRef = useRef({ type: "none", startX: 0, startY: 0 });

  // Fabric Shading Map Calibration (Using Soft-Light to preserve white inks)
  const inverseShadingStyle = useMemo(() => {
    if (!ratios?.contentArea) return {};
    const { top, left, width, height } = ratios.contentArea;
    return {
      position: "absolute",
      top: `-${(top / height) * 100}%`,
      left: `-${(left / width) * 100}%`,
      width: `${(100 / width) * 100}%`,
      height: `${(100 / height) * 100}%`,
      objectFit: "contain",
      mixBlendMode: "soft-light", // Preserves absolute white and black colors perfectly
      pointerEvents: "none",
      zIndex: 5,
      opacity: 0.85,
    };
  }, [ratios?.contentArea]);

  const handlePointerDown = (e, actionType) => {
    e.stopPropagation();
    e.preventDefault();
    if (!designState.previewUrl) return;

    interactionRef.current = {
      type: actionType,
      startX: e.clientX,
      startY: e.clientY,
      initialX: designState.x,
      initialY: designState.y,
      initialScale: designState.scale,
      initialRotation: designState.rotation,
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    const interaction = interactionRef.current;
    if (interaction.type === "none" || !containerRef.current) return;

    const deltaX = e.clientX - interaction.startX;
    const deltaY = e.clientY - interaction.startY;
    const bounds = containerRef.current.getBoundingClientRect();

    if (interaction.type === "drag") {
      const percentageChangeX = (deltaX / bounds.width) * 100;
      const percentageChangeY = (deltaY / bounds.height) * 100;

      let targetX = interaction.initialX + percentageChangeX;
      let targetY = interaction.initialY + percentageChangeY;

      const snapTolerance = 2.5;
      let isSnappedX = false;
      let isSnappedY = false;

      if (Math.abs(targetX - 50) < snapTolerance) {
        targetX = 50;
        isSnappedX = true;
      }
      if (Math.abs(targetY - 50) < snapTolerance) {
        targetY = 50;
        isSnappedY = true;
      }

      setDesignState((prev) => ({
        ...prev,
        x: Math.min(100, Math.max(0, Math.round(targetX))),
        y: Math.min(100, Math.max(0, Math.round(targetY))),
        isSnappedX,
        isSnappedY,
      }));
    } else if (interaction.type === "scale") {
      const factor = 1 + deltaX / 150;
      setDesignState((prev) => ({
        ...prev,
        scale: Math.min(
          100,
          Math.max(15, Math.round(interaction.initialScale * factor)),
        ),
      }));
    } else if (interaction.type === "rotate") {
      const center = {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      };
      const currentAngle =
        Math.atan2(e.clientY - center.y, e.clientX - center.x) *
        (180 / Math.PI);
      const initialAngle =
        Math.atan2(
          interaction.startY - center.y,
          interaction.startX - center.x,
        ) *
        (180 / Math.PI);

      setDesignState((prev) => ({
        ...prev,
        rotation: Math.round(
          (interaction.initialRotation + (currentAngle - initialAngle)) % 360,
        ),
      }));
    }
  };

  const handlePointerUp = () => {
    interactionRef.current.type = "none";
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    setDesignState((prev) => ({
      ...prev,
      isSnappedX: false,
      isSnappedY: false,
    }));
  };

  return (
    <>
      {/* 1. CLIPPED VISUAL AREA */}
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
              alt="Custom Print Layer"
              style={{
                position: "absolute",
                left: `${designState.x}%`,
                top: `${designState.y}%`,
                width: `${designState.scale}%`,
                transform: `translate(-50%, -50%) rotate(${designState.rotation}deg)`,
                objectFit: "contain",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* CSS Fabric Shading Overlay Layer */}
        {activeTemplateUrl && designState.previewUrl && (
          <img
            src={activeTemplateUrl}
            alt="Texture Overlay"
            style={inverseShadingStyle}
          />
        )}
      </TemplateContentArea>

      {/* 2. S3 ALIGNED VISUAL INTERACTION OVERLAY LAYER */}
      <InteractivePrintArea ref={containerRef} $area={ratios.absolutePrintArea}>
        {designState.isSnappedX && <SnapGuideline className="vertical" />}
        {designState.isSnappedY && <SnapGuideline className="horizontal" />}

        {designState.previewUrl && (
          <TransformableBox
            style={{
              left: `${designState.x}%`,
              top: `${designState.y}%`,
              width: `${designState.scale}%`,
              aspectRatio: "1/1",
              transform: `translate(-50%, -50%) rotate(${designState.rotation}deg)`,
            }}
            onPointerDown={(e) => handlePointerDown(e, "drag")}
          >
            <div style={{ width: "100%", height: "100%", opacity: 0 }} />
            <ScaleCorner onPointerDown={(e) => handlePointerDown(e, "scale")} />
            <RotateNode onPointerDown={(e) => handlePointerDown(e, "rotate")} />
          </TransformableBox>
        )}
      </InteractivePrintArea>
    </>
  );
};

PrintableArea.propTypes = {
  ratios: PropTypes.object.isRequired,
  designState: PropTypes.object.isRequired,
  setDesignState: PropTypes.func.isRequired,
  activeTemplateUrl: PropTypes.string,
};

export default PrintableArea;
