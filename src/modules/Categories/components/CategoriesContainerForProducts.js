// src/modules/Categories/components/CategoriesContainerForProducts.js

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Category from "./Category";
import Loader from "../../../components/Loader";
import { useTranslation } from "react-i18next";
import {
  fetchProductByShopAndCategory,
  selectProducts,
} from "../../Product/state/reducers";
import ProductsContainer from "../../Product/components/ProductsContainer";

const Section = styled.div`
  margin-top: 1rem;
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight} - 11rem)`};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const Categories = styled.div`
  max-width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 1em;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0.5em;
  }
`;

const SelectCategory = styled.div`
  margin-top: 1rem;
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight} - 11rem)`};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.p`
  font-size: 2.5rem;
  @media (max-width: 768px) {
    margin-top: 1rem;
    font-size: ${(props) => props.theme.fontxxl};
  }
`;

const CategoriesContainerForProducts = ({
  categories,
  setSelectedCategory,
  selectedCategory,
  shopId,
  loadedCategories,
  setLoadedCategories,
}) => {
  const { t } = useTranslation();
  const [productsPerCategory, setProductsPerCategory] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  // --- FIX #1: REMOVED unused 'errorProducts' variable ---
  const {
    products,
    loading: loadingProducts,
  } = useSelector(selectProducts);

  useEffect(() => {
    // This effect is fine as it is, but for consistency we add shopId.
    if (products.length > 0) {
      const filteredProducts = products.filter(
        (product) =>
          product.categoryId === selectedCategory && product.shopId === shopId
      );
      setProductsPerCategory(filteredProducts);
    }
    // --- FIX #2: ADDED 'shopId' to the dependency array ---
  }, [selectedCategory, products, shopId]);

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (!loadedCategories.includes(categoryId)) {
      dispatch(fetchProductByShopAndCategory({ shopId: shopId, categoryId }));
      setLoadedCategories((prevLoadedCategories) => [
        ...prevLoadedCategories,
        categoryId,
      ]);
    }
    if (selectedCategory === categoryId) {
      setExpanded(false);
      setSelectedCategory("");
    } else {
      setExpanded(true);
      setSelectedCategory(categoryId);
    }
  };

  if (loadingProducts) {
    return <Loader />;
  }

  return (
    <Section>
      <Categories>
        {categories.length > 0 ? (
          categories.map((category) => (
            <Category
              key={category.id}
              category={category}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          ))
        ) : (
          <SelectCategory>
            <Content>{t("noCategories")}</Content>
          </SelectCategory>
        )}
      </Categories>
      {expanded ? (
        <ProductsContainer
          products={productsPerCategory}
          expanded={expanded}
          selectedCategory={selectedCategory}
        ></ProductsContainer>
      ) : (
        <SelectCategory>
          <Content> {t("selectCategory")} </Content>{" "}
        </SelectCategory>
      )}
    </Section>
  );
};

export default CategoriesContainerForProducts;