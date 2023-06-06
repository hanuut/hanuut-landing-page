import React from "react";
import styled from "styled-components";
import Flag from "react-flagkit";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  top: 100%;
  z-index: 99;
  background-color: #fff;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 0.5rem 1rem;
  display: none;

  ${Container}:hover & {
    display: block;
  }
  @media (max-width: 768px) {
    right: -11%;
  }
`;

const MenuItem = styled.div` 
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  &:hover {
    background-color: rgba(${(props) => props.theme.textRgba}, 0.06);
    border-radius: ${(props) => props.theme.defaultRadius};
  }
`;

const MenuItemHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
`;

const LanguagesDropDown = ({handleChooseLanguage}) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("preferredLang", lang);
    handleChooseLanguage();
  };

  return (
    <Container>
      <MenuItemHeader>
        <Flag country={i18n.language === "ar" ? "DZ" : "GB"} andValue />
        {i18n.language === "ar" ? t("العربية") : t("English")}
      </MenuItemHeader>
      <Menu>
        <MenuItem onClick={() => handleLanguageChange("ar")}>
          <Flag country="DZ" />
          {t("العربية")}
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("en")}>
          <Flag country="GB" />
          {t("English")}
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default LanguagesDropDown;
