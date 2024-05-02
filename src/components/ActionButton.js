import React from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: ${(props) => props.theme.primaryColor};
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: ${(props) => props.theme.actionButtonPaddingMobile};
  font-size: ${(props) => props.theme.fontxl};
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.03);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: all !important;
  }

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
    padding: ${(props) => props.theme.smallPadding};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${(props) => props.theme.secondaryColor};
`;

const TextStyleButton = styled(Button)`
  background-color: transparent;
  color: ${(props) => props.theme.primaryColor};
  border: 1px solid ${(props) => props.theme.primaryColor};
  padding: ${(props) => props.theme.smallPadding};
`;

const BlueSecondaryButtonStyle = styled(Button)`
  background-color: transparent;
  color: ${(props) => props.theme.secondaryColor};
  border: 1px solid ${(props) => props.theme.secondaryColor};
  padding: ${(props) => props.theme.smallPadding};
`;

const BlueTextButtonStyle = styled(Button)`
  background-color: ${(props) =>
    props.isSelected ? props.theme.secondaryColor : "transparent"};
  color: ${(props) =>
    props.isSelected ? props.theme.body : props.theme.secondaryColor};
  font-weight: ${(props) => (props.isSelected ? "bold" : "")};
  transform: ${(props) => (props.isSelected ? "scale(1.1)" : "scale(1)")};
`;

const ActionButton = ({ children, onClick, disabled }) => {
  return (
    <Button disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
};

const BlueActionButton = ({ children, onClick, disabled }) => {
  return (
    <SecondaryButton disabled={disabled} onClick={onClick}>
      {children}
    </SecondaryButton>
  );
};

const TextButton = ({ children, onClick, disabled }) => {
  return (
    <TextStyleButton disabled={disabled} onClick={onClick}>
      {children}
    </TextStyleButton>
  );
};

const BlueSecondaryButton = ({ children, onClick, disabled }) => {
  return (
    <BlueSecondaryButtonStyle disabled={disabled} onClick={onClick}>
      {children}
    </BlueSecondaryButtonStyle>
  );
};

const BlueTextButton = ({ children, onClick, disabled, isSelected }) => {
  return (
    <BlueTextButtonStyle
      disabled={disabled}
      onClick={onClick}
      isSelected={isSelected}
    >
      {children}
    </BlueTextButtonStyle>
  );
};

export {
  ActionButton,
  BlueActionButton,
  TextButton,
  BlueSecondaryButton,
  BlueTextButton,
};
