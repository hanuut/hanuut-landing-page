import React, { useRef, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const TemplateContentArea = styled.div`
  position: absolute;
  z-index: 2;
  overflow: visible;
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
  border: 1.5px dashed
    ${(props) => (props.$hasOverflow ? "#F07A48" : "rgba(255, 255, 255, 0.65)")};
  box-shadow: ${(props) =>
    props.$hasOverflow
      ? "0 0 12px rgba(240, 122, 72, 0.3)"
      : "0 0 10px rgba(240, 122, 72, 0.15)"};
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
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);

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
  z-index: 8;
  pointer-events: none;
  background: transparent;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &.vertical {
    left: 50%;
    top: -30%;
    bottom: -30%;
    width: 2px;
    border-left: 2px
      ${(props) => (props.$state === "exact" ? "solid #39A170" : "dashed #F07A48")};
    box-shadow: ${(props) =>
      props.$state === "exact" ? "0 0 12px #39A170" : "none"};
  }

  &.horizontal {
    top: 50%;
    left: -30%;
    right: -30%;
    height: 2px;
    border-top: 2px
      ${(props) => (props.$state === "exact" ? "solid #39A170" : "dashed #F07A48")};
    box-shadow: ${(props) =>
      props.$state === "exact" ? "0 0 12px #39A170" : "none"};
  }
`;

/* Relocated notice badge pinned cleanly to top corner of the stage, away from artwork handles */
const CornerNoticeBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(24, 24, 27, 0.85);
  border: 1px solid rgba(240, 122, 72, 0.4);
  color: #f07a48;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 50;
  backdrop-filter: blur(8px);
  font-family: "Tajawal", sans-serif;
`;

const PrintableArea = ({
  ratios,
  designState,
  setDesignState,
  activeTemplateUrl,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const interactionRef = useRef({ type: "none", startX: 0, startY: 0 });

  const isOutsideStandardZone = useMemo(() => {
    if (!designState.previewUrl) return false;
    const halfScale = designState.scale / 2;
    const leftEdge = designState.x - halfScale;
    const rightEdge = designState.x + halfScale;
    const topEdge = designState.y - halfScale;
    const bottomEdge = designState.y + halfScale;

    return leftEdge < 0 || rightEdge > 100 || topEdge < 0 || bottomEdge > 100;
  }, [designState.x, designState.y, designState.scale, designState.previewUrl]);

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
        x: Math.round(targetX * 10) / 10,
        y: Math.round(targetY * 10) / 10,
        isSnappedX,
        isSnappedY,
      }));
    } else if (interaction.type === "scale") {
      const factor = 1 + deltaX / 150;
      setDesignState((prev) => ({
        ...prev,
        scale: Math.min(
          120,
          Math.max(15, Math.round(interaction.initialScale * factor))
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
          interaction.startX - center.x
        ) *
        (180 / Math.PI);

      let targetRot = Math.round(
        (interaction.initialRotation + (currentAngle - initialAngle)) % 360
      );
      if (targetRot < 0) targetRot += 360;

      setDesignState((prev) => ({
        ...prev,
        rotation: targetRot,
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
      {isOutsideStandardZone && (
        <CornerNoticeBadge>
          {t("pod_studio_reviewed_notice", "Reviewed before production")}
        </CornerNoticeBadge>
      )}

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
      </TemplateContentArea>

      <InteractivePrintArea ref={containerRef} $area={ratios.absolutePrintArea}>
        {designState.isSnappedX && (
          <SnapGuideline className="vertical" $state="exact" />
        )}
        {designState.isSnappedY && (
          <SnapGuideline className="horizontal" $state="exact" />
        )}

        {designState.previewUrl && (
          <TransformableBox
            $hasOverflow={isOutsideStandardZone}
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