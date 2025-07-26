// src/modules/Categories/components/CategoriesContainer.js

import React, { useEffect, useState } from "react";
import {
  selectCategories,
  fetchCategories,
} from "../../Categories/state/reducers";
import { selectDishes, fetchDishesByCategory } from "../../Dish/state/reducers";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Category from "./Category.js"; // Use .js for consistency
import Loader from "../../../components/Loader";
import DishesContainer from "../../Dish/components/DishesContainer.js"; // Use .js for consistency
import { useTranslation } from "react-i18next";

const Section = styled.div`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    gap: 0.5em;
  }
`;

const SelectCategory = styled.div`
  margin-top: 1rem;
  padding: 4rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.p`
  font-size: ${(props) => props.theme.fontxxl};
  color: ${(props) => props.theme.secondaryText};
  text-align: center;
`;

// THE FIX: Accept isSubscribed as a prop
const CategoriesContainer = ({ shopData, isSubscribed }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Cleaned up selector to remove unused error variable
  const { categories, loading: categoriesLoading } = useSelector(selectCategories);
  const { dishes } = useSelector(selectDishes);

  const [dishesPerCategory, setDishesPerCategory] = useState([]);
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const filterAvailableCategories = (allCategories, hiddenCategories) => {
    if (!allCategories) {
      return [];
    }
    return allCategories.filter((category) => !hiddenCategories?.includes(category));
  };

  useEffect(() => {
    // Add a guard clause for safety
    if (!shopData) return;

    const availableCategories = filterAvailableCategories(
      shopData.categories,
      shopData.hiddenCategories
    );
    dispatch(fetchCategories(availableCategories));
    
    // THE FIX: Added dependencies to the array
  }, [dispatch, shopData]);

  useEffect(() => {
    // Add a guard clause for safety
    if (!shopData) return;

    const filteredDishes = dishes.filter(
      (dish) =>
        dish.categoryId === selectedCategory && dish.shopId === shopData._id
    );
    setDishesPerCategory(filteredDishes);

    // THE FIX: Added 'shopData' to the dependency array
  }, [selectedCategory, dishes, shopData]);

  const handleCategoryClick = (categoryId) => {
    if (!loadedCategories.includes(categoryId)) {
      dispatch(fetchDishesByCategory({ shopId: shopData._id, categoryId }));
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

  if (categoriesLoading) {
    return <Loader />;
  }

  return (
    <Section>
      <Categories>
        {categories.map((category) => (
          <Category
            key={category.id}
            category={category}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />
        ))}
      </Categories>
      
      {expanded ? (
        <DishesContainer
          dishes={dishesPerCategory}
          expanded={expanded}
          // THE FIX: Pass the isSubscribed prop down to the next component
          isSubscribed={isSubscribed}
        />
      ) : (
        <SelectCategory>
          <Content>{t("selectCategory")}</Content>
        </SelectCategory>
      )}
    </Section>
  );
};

export default CategoriesContainer;