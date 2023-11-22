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

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
    padding: ${(props) => props.theme.smallPadding};
  }
  
`;

const SecondaryButton = styled(Button)`
  background-color: ${(props) => props.theme.secondaryColor};
`;

const ActionButton = ({ children, onClick }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

const BlueActionButton = ({ children, onClick }) => {
  return <SecondaryButton onClick={onClick}>{children}</SecondaryButton>;
};

export { ActionButton, BlueActionButton };