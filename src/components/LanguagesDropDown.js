import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import Flag from "react-flagkit";

// --- Styled Components for the Redesigned Dropdown ---

const DropDownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropDownButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${(props) => props.theme.fontmd};
  font-weight: 500;
  /* --- THE FIX: Use passed-in text color --- */
  color: ${({ theme, $textColor }) => $textColor || theme.text};
`;

const DropDownContent = styled.div`
  display: block;
  position: absolute;
  top: 140%;
  right: 50%;
  transform: translateX(50%);
  min-width: 160px;
  border-radius: ${(props) => props.theme.defaultRadius};
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1;
  overflow: hidden;

  /* --- THE FIX: Conditional Premium Styling --- */
  ${(props) =>
    props.$isPremium
      ? css`
          background-color: #2c2c2e; /* Dark background */
          border: 1px solid rgba(255, 255, 255, 0.15);
        `
      : css`
          background-color: #ffffff; /* Standard light background */
          border: 1px solid ${(props) => props.theme.surfaceBorder};
        `}
`;

const DropDownItem = styled.div`
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s ease;

  /* --- THE FIX: Conditional Premium Styling --- */
  ${(props) =>
    props.$isPremium
      ? css`
          color: #ffffff;
          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `
      : css`
          color: ${(props) => props.theme.text};
          &:hover {
            background-color: #f5f5f5;
          }
        `}
`;

const LanguagesDropDown = ({ handleChooseLanguage, textColor }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "ar", name: "العربية", flag: "DZ" },
    { code: "en", name: "English", flag: "GB" },
    { code: "fr", name: "French", flag: "FR" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    if (handleChooseLanguage) {
      handleChooseLanguage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // This determines if the premium theme should be used
  const isPremium = !!textColor;

  return (
    <DropDownContainer ref={dropdownRef}>
      <DropDownButton onClick={toggleDropdown} $textColor={textColor}>
        {currentLanguage.name} <Flag country={currentLanguage.flag} />
      </DropDownButton>
      {isOpen && (
        <DropDownContent $isPremium={isPremium}>
          {languages.map((lang) => (
            <DropDownItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              $isPremium={isPremium}
            >
              <span>{lang.name}</span>
              <Flag country={lang.flag} />
            </DropDownItem>
          ))}
        </DropDownContent>
      )}
    </DropDownContainer>
  );
};

export default LanguagesDropDown;