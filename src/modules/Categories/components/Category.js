// src/pages/Categories/components/Category.js

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const CategoryButton = styled.button`
  // --- Layout & Spacing ---
  // This adds the padding you were missing.
  padding: 0.75rem 1.5rem;
  flex-shrink: 0; // Prevents buttons from shrinking when the container is full.

  // --- Typography ---
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 500;
  white-space: nowrap;

  // --- Appearance & Styling ---
  border-radius: ${(props) => props.theme.defaultRadius};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  // --- Conditional Styling (This is the key part) ---
  
  // 1. Set background color: Hanuut Green if selected, otherwise the subtle surface color.
  background-color: ${(props) =>
    props.isSelected ? props.theme.primary : props.theme.surface};
  
  // 2. Set text color: The light background color if selected, otherwise the main dark text color.
  color: ${(props) =>
    props.isSelected ? props.theme.body : props.theme.text};
  
  // 3. Set border color: The same as the background if selected, otherwise the subtle border color.
  border: 1px solid ${(props) => 
    props.isSelected ? props.theme.primary : props.theme.surfaceBorder};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

const Category = ({ category, selectedCategory, onCategoryClick }) => {
 
  const categoryIsSelected = selectedCategory === category.id;
  const { i18n } = useTranslation();
  const isArabic= i18n.language === "ar";
  const categoryName = !isArabic && category.nameFr !==null ? category.nameFr : category.name;

  return (
    <CategoryButton
      isSelected={categoryIsSelected}
      onClick={() => onCategoryClick(category.id)}
    >
      {categoryName}
    </CategoryButton>
  );
};

export default Category;