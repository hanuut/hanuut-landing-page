import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const StickyWrapper = styled.div`
  position: sticky;
  top: ${(props) => props.theme.navHeight || "5rem"};
  z-index: 90;
  width: 100%;
  background: rgba(5, 5, 5, 0.9); /* Darker for better readability */
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 2rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  /* Match padding of the main content */
  padding: 1rem; 
  box-sizing: border-box;
  
  /* RTL Logic */
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  
  /* Scroll Container styling */
  overflow-x: auto;
  white-space: nowrap;
  
  /* Hide scrollbar */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const List = styled.div`
  display: flex;
  gap: 0.8rem;
  /* Ensure items align correctly based on direction */
  justify-content: flex-start;
  width: max-content;
`;

const CategoryPill = styled(motion.button)`
  position: relative;
  padding: 0.6rem 1.2rem;
  border-radius: 99px;
  border: 1px solid ${(props) => props.$isActive ? props.theme.primaryColor : "#27272a"};
  background: ${(props) => props.$isActive ? "rgba(240, 122, 72, 0.15)" : "transparent"};
  color: ${(props) => props.$isActive ? props.theme.primaryColor : "#a1a1aa"};
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Tajawal', sans-serif;
  flex-shrink: 0;

  &:hover {
    color: white;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const StickyCategoryNav = ({ categories, activeCategory, onSelect }) => {
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <StickyWrapper>
      <NavContainer $isArabic={isArabic}>
        <List>
          <CategoryPill 
            $isActive={!activeCategory}
            onClick={() => onSelect(null)}
          >
            {t("All", "All")}
          </CategoryPill>

          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              $isActive={activeCategory === cat.id}
              onClick={() => onSelect(cat.id)}
              whileTap={{ scale: 0.95 }}
            >
              {isArabic ? cat.name : (cat.nameFr || cat.name)}
            </CategoryPill>
          ))}
        </List>
      </NavContainer>
    </StickyWrapper>
  );
};

export default StickyCategoryNav;