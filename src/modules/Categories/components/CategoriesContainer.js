// src/modules/Categories/components/CategoriesContainer.js

import React, { useEffect, useState } from "react";
import {
  selectCategories,
  fetchCategories,
} from "../../Categories/state/reducers";
import { selectDishes, fetchDishesByCategory } from "../../Dish/state/reducers";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Category from "./Category.js";
import Loader from "../../../components/Loader";
import DishesContainer from "../../Dish/components/DishesContainer.js";
import { useTranslation } from "react-i18next";

const Section = styled.div`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
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

const CategoriesContainer = ({ shopData, isSubscribed }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { categories, loading: categoriesLoading } = useSelector(selectCategories);
  // --- THE FIX: We now get the loading state for dishes directly from Redux ---
  const { dishes, loading: dishesLoading } = useSelector(selectDishes);

  const [dishesPerCategory, setDishesPerCategory] = useState([]);
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (!shopData) return;
    const availableCategories = shopData.categories.filter(
      (category) => !shopData.hiddenCategories?.includes(category)
    );
    dispatch(fetchCategories(availableCategories));
  }, [dispatch, shopData]);

  // This useEffect now ONLY filters the dishes when the Redux 'dishes' state changes.
  useEffect(() => {
    if (!shopData) return;
    const filteredDishes = dishes.filter(
      (dish) =>
        dish.dish.categoryId === selectedCategory && dish.dish.shopId === shopData._id
    );
    setDishesPerCategory(filteredDishes);
  }, [selectedCategory, dishes, shopData]);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setExpanded(false);
      setSelectedCategory("");
    } else {
      setExpanded(true);
      setSelectedCategory(categoryId);
      if (!loadedCategories.includes(categoryId)) {
        dispatch(fetchDishesByCategory({ shopId: shopData._id, categoryId }));
        setLoadedCategories((prev) => [...prev, categoryId]);
      }
    }
  };

  if (categoriesLoading) {
    return <Loader fullscreen={false} />;
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
          isSubscribed={isSubscribed}
          // --- THE FIX: We pass the Redux loading state directly ---
          isLoading={dishesLoading}
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