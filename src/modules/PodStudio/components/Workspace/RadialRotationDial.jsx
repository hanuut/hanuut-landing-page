import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FaUndo } from "react-icons/fa";

const DialContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.85rem 1.25rem;
  box-sizing: border-box;
`;

const DialLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: start;

  .label {
    font-size: 0.75rem;
    color: #a1a1aa;
    font-weight: 800;
    text-transform: uppercase;
    font-family: "Tajawal", sans-serif;
  }

  .angle-val {
    font-size: 1.25rem;
    font-weight: 800;
    font-family: monospace;
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const DialControlArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RotaryKnob = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #18181b;
  border: 2px solid rgba(255, 255, 255, 0.15);
  position: relative;
  cursor: grab;
  touch-action: none;
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.8),
    0 4px 15px rgba(0, 0, 0, 0.4);
  transition: border-color 0.2s;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }

  &:active {
    cursor: grabbing;
  }
`;

const KnobIndicator = styled.div`
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 12px;
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  border-radius: 2px;
  box-shadow: 0 0 8px ${(props) => props.theme.primaryColor || "#F07A48"};
`;

const ResetButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a1a1aa;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
  }
`;

export const RadialRotationDial = ({ rotation, onChange }) => {
  const { t } = useTranslation();
  const knobRef = useRef(null);

  const handlePointerDown = (e) => {
    e.preventDefault();
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!knobRef.current) return;
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let deg = Math.round(rad * (180 / Math.PI)) + 90;
    if (deg < 0) deg += 360;

    const snapAngles = [0, 90, 180, 270, 360];
    snapAngles.forEach((snap) => {
      if (Math.abs(deg - snap) < 5) deg = snap % 360;
    });

    onChange(deg);
  };

  const handlePointerUp = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
  };

  return (
    <DialContainer>
      <DialLeft>
        <span className="label">{t("pod_studio_angle_rotation", "Rotation")}</span>
        <span className="angle-val">{rotation}°</span>
      </DialLeft>

      <DialControlArea>
        <RotaryKnob
          ref={knobRef}
          onPointerDown={handlePointerDown}
          onDoubleClick={() => onChange(0)}
          title="Drag to rotate, double-click to reset"
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `rotate(${rotation}deg)`,
              position: "relative",
            }}
          >
            <KnobIndicator />
          </div>
        </RotaryKnob>

        <ResetButton
          type="button"
          onClick={() => onChange(0)}
          title="Reset angle to 0°"
        >
          <FaUndo size={12} />
        </ResetButton>
      </DialControlArea>
    </DialContainer>
  );
};

RadialRotationDial.propTypes = {
  rotation: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RadialRotationDial;