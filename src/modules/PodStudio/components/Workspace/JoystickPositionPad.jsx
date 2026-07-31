import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaCrosshairs,
} from "react-icons/fa";

const PadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Tighter */
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.75rem 1rem; /* Tighter */
  box-sizing: border-box;
`;

const PadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 0.75rem;
    color: #a1a1aa;
    font-weight: 800;
    text-transform: uppercase;
    font-family: "Tajawal", sans-serif;
  }

  .coords {
    font-size: 0.8rem;
    font-family: monospace;
    font-weight: 700;
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const JoystickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px; /* Tighter */
  width: 120px; /* Reduced from 140px */
  height: 120px; /* Reduced from 140px */
  margin: 0 auto;
`;

const DPadButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d4d4d8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }

  &:active {
    transform: scale(0.92);
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #050505;
  }

  &.center-btn {
    background: ${(props) =>
      props.$isCentered
        ? "rgba(57, 161, 112, 0.2)"
        : "rgba(255, 255, 255, 0.06)"};
    border-color: ${(props) =>
      props.$isCentered ? "#39A170" : "rgba(255, 255, 255, 0.15)"};
    color: ${(props) => (props.$isCentered ? "#39A170" : "#ffffff")};
  }
`;

const PresetRow = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PresetPill = styled.button`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

export const JoystickPositionPad = ({ x, y, onChange, isArabic }) => {
  const { t } = useTranslation();

  const handleNudge = (dx, dy) => {
    const newX = Math.min(100, Math.max(0, x + dx));
    const newY = Math.min(100, Math.max(0, y + dy));
    onChange({ x: newX, y: newY });
  };

  const setPreset = (presetX, presetY) => {
    onChange({ x: presetX, y: presetY });
  };

  const isCentered = x === 50 && y === 50;

  return (
    <PadContainer>
      <PadHeader>
        <span className="label">{t("position_title", "Position Pad")}</span>
        <span className="coords">
          X: {x}% | Y: {y}%
        </span>
      </PadHeader>

      <JoystickGrid>
        <div />
        <DPadButton
          type="button"
          onClick={() => handleNudge(0, -3)}
          title="Move Up"
        >
          <FaChevronUp />
        </DPadButton>
        <div />

        <DPadButton
          type="button"
          onClick={() => handleNudge(-3, 0)}
          title="Move Left"
        >
          <FaChevronLeft />
        </DPadButton>

        <DPadButton
          type="button"
          className="center-btn"
          $isCentered={isCentered}
          onClick={() => setPreset(50, 50)}
          title="Center Alignment"
        >
          <FaCrosshairs />
        </DPadButton>

        <DPadButton
          type="button"
          onClick={() => handleNudge(3, 0)}
          title="Move Right"
        >
          <FaChevronRight />
        </DPadButton>

        <div />
        <DPadButton
          type="button"
          onClick={() => handleNudge(0, 3)}
          title="Move Down"
        >
          <FaChevronDown />
        </DPadButton>
        <div />
      </JoystickGrid>

      <PresetRow>
        <PresetPill type="button" onClick={() => setPreset(50, 50)}>
          {isArabic ? "المركز" : "Center"}
        </PresetPill>
        <PresetPill type="button" onClick={() => setPreset(50, 25)}>
          {isArabic ? "أعلى الصدر" : "Top Chest"}
        </PresetPill>
        <PresetPill type="button" onClick={() => setPreset(35, 28)}>
          {isArabic ? "الجيب الأيسر" : "Left Pocket"}
        </PresetPill>
        <PresetPill type="button" onClick={() => setPreset(50, 75)}>
          {isArabic ? "الحافة السفلى" : "Lower Hem"}
        </PresetPill>
      </PresetRow>
    </PadContainer>
  );
};

JoystickPositionPad.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  isArabic: PropTypes.bool,
};

export default JoystickPositionPad;