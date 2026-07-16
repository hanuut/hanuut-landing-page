import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const TemplateContentArea = styled.div`
  position: absolute;
  z-index: 2;
  overflow: hidden; /* THE PHYSICAL PRODUCT BOUNDARY CLIPPING CONTAINER */
  top: ${props => props.$area.top}%;
  left: ${props => props.$area.left}%;
  width: ${props => props.$area.width}%;
  height: ${props => props.$area.height}%;
  pointer-events: none;
`;

const InteractivePrintArea = styled.div`
  position: absolute;
  top: ${props => props.$area.top}%;
  left: ${props => props.$area.left}%;
  width: ${props => props.$area.width}%;
  height: ${props => props.$area.height}%;
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

const UploadedDesignImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  pointer-events: none;
`;

const ActionNode = styled.div`
  position: absolute;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border: 2px solid ${(props) => props.theme.primaryColor || "#F07A48"};
  border-radius: 50%;
  z-index: 20;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);
  transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: scale(1.3);
  }
`;

const ScaleCorner = styled(ActionNode)`
  bottom: -7px;
  right: -7px;
  cursor: se-resize;
`;

const RotateNode = styled(ActionNode)`
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  cursor: grab;

  &::after {
    content: "";
    position: absolute;
    top: 12px;
    left: 4px;
    width: 2px;
    height: 12px;
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const PrintableArea = ({ ratios, designState, setDesignState }) => {
  const containerRef = useRef(null);
  const interactionRef = useRef({ type: "none", startX: 0, startY: 0 });

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
    const bounds = containerRef.current.getBoundingClientRect(); // Measures live rendered pixels of the active print zone

    if (interaction.type === "drag") {
      const percentageChangeX = (deltaX / bounds.width) * 100;
      const percentageChangeY = (deltaY / bounds.height) * 100;

      setDesignState((prev) => ({
        ...prev,
        x: Math.min(100, Math.max(0, Math.round(interaction.initialX + percentageChangeX))),
        y: Math.min(100, Math.max(0, Math.round(interaction.initialY + percentageChangeY))),
      }));
    } else if (interaction.type === "scale") {
      const factor = 1 + deltaX / 150;
      setDesignState((prev) => ({
        ...prev,
        scale: Math.min(100, Math.max(15, Math.round(interaction.initialScale * factor))),
      }));
    } else if (interaction.type === "rotate") {
      const center = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
      const currentAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
      const initialAngle = Math.atan2(interaction.startY - center.y, interaction.startX - center.x) * (180 / Math.PI);

      setDesignState((prev) => ({
        ...prev,
        rotation: Math.round((interaction.initialRotation + (currentAngle - initialAngle)) % 360),
      }));
    }
  };

  const handlePointerUp = () => {
    interactionRef.current.type = "none";
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  return (
    <>
      {/* 1. VISUAL PORTION (Sits inside the TemplateContentArea clipping container) */}
      <TemplateContentArea $area={ratios.contentArea}>
        <div style={{
          position: "absolute",
          top: `${ratios.printArea.top}%`,
          left: `${ratios.printArea.left}%`,
          width: `${ratios.printArea.width}%`,
          height: `${ratios.printArea.height}%`,
          overflow: "visible"
        }}>
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
                pointerEvents: "none"
              }}
            />
          )}
        </div>
      </TemplateContentArea>

      {/* 2. INTERACTIVE PORTION (Guides and Drag/Rotate handles are drawn unclipped) */}
      <InteractivePrintArea ref={containerRef} $area={ratios.absolutePrintArea}>
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
            {/* Transparent Hit Box */}
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
};

export default PrintableArea;