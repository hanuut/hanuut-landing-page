import React from "react";
import styled from "styled-components";

const Button = styled.button`
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.secondaryColor};
  border: 1px solid ${(props) => props.theme.secondaryColor};
  padding: ${(props) => props.theme.actionButtonPadding};
  border-radius: ${(props) => props.theme.defaultRadius};
  font-size: ${(props) => props.theme.fontxxl};
  cursor: pointer;
  transition: all 0.5s ease;
  
  &:hover {
    transform: scale(1.03);
    background-color: ${(props) => props.theme.secondaryColor};
    color: ${(props) => props.theme.body};
  }

  &:active {
    background-color: ${(props) => props.theme.secondaryColor};
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
  }
`;

const SecondaryButton = ({ children, onClick }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default SecondaryButton;
