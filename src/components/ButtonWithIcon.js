import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: ${(props) => props.backgroundColor || props.theme.downloadButtonColor};
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: ${(props) => props.theme.actionButtonPadding};
  font-size: ${(props) => props.theme.fontxl};
  cursor: pointer;
  transition: all 0.5s ease;
  margin-bottom: 0.5rem;
  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontmd};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
  }
`;

const Icon = styled.img`
  height: 1.5rem;
  object-fit: cover;
  -webkit-transform: ${(props) => (props.isArabic ? "scaleX(-1)" : "")};
  transform: ${(props) => (props.isArabic ? "scaleX(-1)" : "")};
  @media (max-width: 768px) {
    width: auto;
  }
`;

const ButtonWithIcon = ({ children, image, onClick, backgroundColor }) => {
  const { i18n } = useTranslation();
  return (
    <Button onClick={onClick} backgroundColor={backgroundColor}>
      <Icon src={image} isArabic={i18n.language === "ar"} /> {children}
    </Button>
  );
};

export default ButtonWithIcon;