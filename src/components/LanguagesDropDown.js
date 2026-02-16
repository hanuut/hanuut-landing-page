import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import Flag from "react-flagkit";
import { motion, AnimatePresence } from "framer-motion";

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
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  /* Match navbar menu items styling */
  font-size: 1rem;
  font-weight: 500;
  color: ${({ $textColor }) => $textColor || "#FFFFFF"};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  /* Flag sizing */
  img {
    width: 20px;
    height: 15px;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const DropDownContent = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 180px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  
  ${(props) =>
    props.$isPremium
      ? css`
          background-color: rgba(28, 28, 30, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
        `
      : css`
          background-color: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(0, 0, 0, 0.1);
        `}
`;

const DropDownItem = styled.div`
  padding: 0.85rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;

  /* Active indicator */
  ${(props) =>
    props.$isActive &&
    css`
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        background-color: ${props.$isPremium ? "#FFFFFF" : "#111217"};
        border-radius: 0 2px 2px 0;
      }
    `}

  /* Conditional Premium Styling */
  ${(props) =>
    props.$isPremium
      ? css`
          color: ${props.$isActive ? "#FFFFFF" : "#D4D4D8"};
          &:hover {
            background-color: rgba(255, 255, 255, 0.12);
            color: #FFFFFF;
          }
        `
      : css`
          color: ${props.$isActive ? "#111217" : "#666666"};
          &:hover {
            background-color: #f5f5f5;
            color: #111217;
          }
        `}
  
  img {
    width: 24px;
    height: 18px;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

// Animation variants for dropdown
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

const LanguagesDropDown = ({ handleChooseLanguage, textColor }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "ar", name: "العربية", flag: "DZ" },
    { code: "en", name: "English", flag: "GB" },
    { code: "fr", name: "Français", flag: "FR" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    // Store the language preference in localStorage
    localStorage.setItem("preferredLanguage", code);
    setIsOpen(false);
    if (handleChooseLanguage) {
      handleChooseLanguage();
    }
  };

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = () => {
      // Priority 1: Check localStorage for saved preference
      const savedLanguage = localStorage.getItem("preferredLanguage");
      if (savedLanguage && languages.some((lang) => lang.code === savedLanguage)) {
        i18n.changeLanguage(savedLanguage);
        return;
      }

      // Priority 2: Detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      const detectedLangCode = browserLang.split("-")[0]; // e.g., "en-US" -> "en"

      // Check if detected language is supported
      const supportedLang = languages.find((lang) => lang.code === detectedLangCode);
      if (supportedLang) {
        i18n.changeLanguage(supportedLang.code);
        localStorage.setItem("preferredLanguage", supportedLang.code);
      } else {
        // Priority 3: Default to Arabic if nothing matches
        i18n.changeLanguage("ar");
        localStorage.setItem("preferredLanguage", "ar");
      }
    };

    initializeLanguage();
  }, []); // Only run once on mount

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine if premium theme should be used
  const isPremium = !!textColor;

  return (
    <DropDownContainer ref={dropdownRef}>
      <DropDownButton onClick={toggleDropdown} $textColor={textColor}>
        {currentLanguage?.name || "Language"} 
        {currentLanguage && <Flag country={currentLanguage.flag} />}
      </DropDownButton>
      
      <AnimatePresence>
        {isOpen && (
          <DropDownContent
            $isPremium={isPremium}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {languages.map((lang) => (
              <DropDownItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                $isPremium={isPremium}
                $isActive={lang.code === i18n.language}
              >
                <span>{lang.name}</span>
                <Flag country={lang.flag} />
              </DropDownItem>
            ))}
          </DropDownContent>
        )}
      </AnimatePresence>
    </DropDownContainer>
  );
};

export default LanguagesDropDown;