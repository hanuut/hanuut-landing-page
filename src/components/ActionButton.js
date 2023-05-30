import React from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: ${(props) => props.theme.primaryColor};
  color: ${(props) => props.theme.body};
  border: none;
  padding: ${(props) => props.theme.actionButtonPadding};
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: ${(props) => props.theme.fontxxxl};
  cursor: pointer;
  transition: all 0.5s ease;
  
  &:hover {
    transform: scale(1.03);
  }

  &:active {
    background-color: ${(props) => props.theme.secondaryColor};
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
  }
`;

const ActionButton = ({ children, onClick }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default ActionButton;
