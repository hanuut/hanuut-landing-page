// src/modules/Product/components/landing/ProductFilterBar.js

import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaTimes,
  FaFilter,
  FaThList,
  FaThLarge,
  FaTh,
} from "react-icons/fa";

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 10;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  flex-wrap: wrap;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  min-width: 260px;
`;

const SearchInput = styled.input`
  width: 100%;
  background-color: #2c2c2e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 0.95rem;
  padding: 0.8rem 2.8rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-family: "Tajawal", sans-serif;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    background-color: #3a3a3c;
  }
  &::placeholder {
    color: #8e8e93;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${(props) => (props.$isArabic ? "auto" : "1rem")};
  right: ${(props) => (props.$isArabic ? "1rem" : "auto")};
  top: 50%;
  transform: translateY(-50%);
  color: #8e8e93;
  font-size: 1rem;
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: ${(props) => (props.$isArabic ? "auto" : "1rem")};
  left: ${(props) => (props.$isArabic ? "1rem" : "auto")};
  top: 50%;
  transform: translateY(-50%);
  background: rgba(142, 142, 147, 0.2);
  border: none;
  color: #d1d1d6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
`;

const ControlToolsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

const LayoutToggleBar = styled.div`
  display: flex;
  align-items: center;
  background: #1c1c1e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 3px;
  gap: 2px;
`;

const LayoutBtn = styled.button`
  background: ${(props) =>
    props.$active ? props.theme.primaryColor || "#F07A48" : "transparent"};
  color: ${(props) => (props.$active ? "#050505" : "#a1a1aa")};
  border: none;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => (props.$active ? "#050505" : "#ffffff")};
  }
`;

const FilterDrawerBtn = styled.button`
  background: ${(props) =>
    props.$hasActive ? "rgba(240, 122, 72, 0.15)" : "#1c1c1e"};
  color: ${(props) =>
    props.$hasActive ? props.theme.primaryColor || "#F07A48" : "#ffffff"};
  border: 1px solid
    ${(props) =>
      props.$hasActive
        ? props.theme.primaryColor || "#F07A48"
        : "rgba(255, 255, 255, 0.08)"};
  padding: 0.65rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const CategoryList = styled.div`
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  padding: 4px 4px 8px 4px;
  justify-content: flex-start;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryPill = styled(motion.button)`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-family: "Tajawal", sans-serif;

  border: 1px solid
    ${(props) =>
      props.$isActive
        ? props.theme.primaryColor || "#F07A48"
        : "transparent"};
  background-color: ${(props) =>
    props.$isActive ? "rgba(240, 122, 72, 0.15)" : "#2C2C2E"};
  color: ${(props) =>
    props.$isActive ? props.theme.primaryColor || "#F07A48" : "#D1D1D6"};

  &:hover {
    background-color: #3a3a3c;
    color: white;
  }
`;

const ProductFilterBar = ({
  searchQuery,
  setSearchQuery,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  isPodShop = false,
  layoutMode = "list", // 🔴 DEFAULT SET TO LIST VIEW
  setLayoutMode = () => {},
  onToggleFilterDrawer,
  hasActiveFilters = false,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <Wrapper>
      <TopRow $isArabic={isArabic}>
        <SearchContainer>
          <SearchIcon $isArabic={isArabic}>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder={
              isPodShop
                ? t("pod_studio_search_placeholder", "Search blank canvases or SKUs...")
                : t("search_products", "Search products...")
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dir={isArabic ? "rtl" : "ltr"}
          />
          {searchQuery && (
            <ClearButton
              $isArabic={isArabic}
              onClick={() => setSearchQuery("")}
            >
              <FaTimes />
            </ClearButton>
          )}
        </SearchContainer>

        <ControlToolsGroup>
          {onToggleFilterDrawer && (
            <FilterDrawerBtn
              type="button"
              $hasActive={hasActiveFilters}
              onClick={onToggleFilterDrawer}
            >
              <FaFilter />
              <span>{t("filter_title", "Filters")}</span>
            </FilterDrawerBtn>
          )}

          <LayoutToggleBar>
            <LayoutBtn
              type="button"
              $active={layoutMode === "list"}
              onClick={() => setLayoutMode("list")}
              title="Row List View"
            >
              <FaThList />
            </LayoutBtn>
            <LayoutBtn
              type="button"
              $active={layoutMode === "grid-compact"}
              onClick={() => setLayoutMode("grid-compact")}
              title="Compact Grid"
            >
              <FaTh />
            </LayoutBtn>
            <LayoutBtn
              type="button"
              $active={layoutMode === "grid-featured"}
              onClick={() => setLayoutMode("grid-featured")}
              title="Featured Cards"
            >
              <FaThLarge />
            </LayoutBtn>
          </LayoutToggleBar>
        </ControlToolsGroup>
      </TopRow>

      {categories && categories.length > 0 && (
        <CategoryList style={{ direction: isArabic ? "rtl" : "ltr" }}>
          <CategoryPill
            $isActive={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
            whileTap={{ scale: 0.95 }}
          >
            {isPodShop ? t("pod_studio_all_items", "All Canvases") : t("all_products", "All")}
          </CategoryPill>

          {categories.map((cat) => {
            const catId = cat.id || cat._id;
            return (
              <CategoryPill
                key={catId}
                $isActive={selectedCategory === catId}
                onClick={() => setSelectedCategory(catId)}
                whileTap={{ scale: 0.95 }}
              >
                {isArabic ? cat.name : cat.nameFr || cat.name}
              </CategoryPill>
            );
          })}
        </CategoryList>
      )}
    </Wrapper>
  );
};

ProductFilterBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  categories: PropTypes.array,
  selectedCategory: PropTypes.string,
  setSelectedCategory: PropTypes.func.isRequired,
  isPodShop: PropTypes.bool,
  layoutMode: PropTypes.string,
  setLayoutMode: PropTypes.func,
  onToggleFilterDrawer: PropTypes.func,
  hasActiveFilters: PropTypes.bool,
};

export default ProductFilterBar;