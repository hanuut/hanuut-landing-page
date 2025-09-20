import React from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";

const CategoryButton = styled.button`
  padding: 0.75rem 1.5rem;
  flex-shrink: 0;
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 500;
  white-space: nowrap;
  border-radius: ${(props) => props.theme.defaultRadius};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  position: relative; /* Required for the pseudo-element */
  overflow: hidden; /* Keeps the blur contained */
  
  /* --- Base styles for premium buttons --- */
  ${(props) =>
    props.$isPremium &&
    css`
      background-color: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.2);

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
    `}

  /* --- THE NEW GLOWING/BLURRY EFFECT for selected premium buttons --- */
  ${(props) =>
    props.$isPremium &&
    props.$isSelected &&
    css`
      color: #FFFFFF; /* Ensure text is white */
      background-color: transparent; /* Make the button itself transparent */
      border: 1px solid ${(props) => props.$accentColor || props.theme.accent}; /* Solid border */
      box-shadow: 0 0 15px ${(props) => props.$accentColor || props.theme.accent}70; /* Neon glow */
      text-shadow: 0 0 5px rgba(0,0,0,0.5); /* Text shadow for contrast */

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${(props) => props.$accentColor || props.theme.accent};
        filter: blur(15px); /* The blur effect */
        opacity: 0.6; /* Controls the intensity of the blurred background */
        z-index: -1; /* Place it behind the text */
      }
    `}

  /* --- Standard (non-premium) button styles --- */
  ${(props) =>
    !props.$isPremium &&
    css`
      background-color: ${props.$isSelected
        ? props.theme.primaryColor
        : props.theme.surface};
      color: ${props.$isSelected ? "#FFFFFF" : props.theme.text};
      border-color: ${props.$isSelected
        ? props.theme.primaryColor
        : props.theme.surfaceBorder};
        
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    `}
`;

const Category = ({
  category,
  selectedCategory,
  onCategoryClick,
  isSubscribed,
  brandColors,
}) => {
  const { i18n } = useTranslation();
  const isSelected = selectedCategory === category.id;
  const isArabic = i18n.language === "ar";
  const categoryName = !isArabic && category.nameFr ? category.nameFr : category.name;

  return (
    <CategoryButton
      $isSelected={isSelected}
      $isPremium={isSubscribed}
      $accentColor={brandColors?.accent}
      onClick={() => onCategoryClick(category.id)}
    >
      {categoryName}
    </CategoryButton>
  );
};

export default Category;