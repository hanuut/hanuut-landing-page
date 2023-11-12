import React, { useEffect, useState } from "react";
import {
  selectCategories,
  fetchCategories,
} from "../../Categories/state/reducers";

import { selectDishes, fetchDishesByCategory } from "../../Dish/state/reducers";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Category from "./Category";
import Loader from "../../../components/Loader";
import DishesContainer from "../../Dish/components/DishesContainer";
import { useTranslation } from "react-i18next";
const Section = styled.div`
  margin-top: 1rem;
  background-color: ${(props) => props.theme.body};
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight} - 11rem)`};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: flex-start;
  justify-content: flex-start;
`;

const Categories = styled.div`
  background-color: ${(props) => props.theme.body};
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap; /* Change flex-wrap to nowrap */
  gap: 1em;
  align-items: center;
  justify-content: flex-start; 
  overflow-x: auto; 
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 0.5em;
    overflow-x: auto;
  }
`;

const SelectCategory = styled.div`
  margin-top: 1rem;
  background-color: ${(props) => props.theme.body};
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight} - 11rem)`};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  justify-content: center;
`;

const Content = styled.h1`
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
`;

const CategoriesContainer = ({ shopData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector(selectCategories);
  const { dishes } = useSelector(selectDishes);
  const [loadedCategories, setLoadedCategories] = useState([]);
  const [dishesPerCategory, setDishesPerCategory] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const filterAvailableCategories = (categories, hiddenCategories) => {
    if (categories) {
      const availableCategories = categories.filter(
        (category) => !hiddenCategories.includes(category)
      );
      return availableCategories;
    } else {
      return <Loader />;
    }
  };

  useEffect(() => {
    const availableCategories = filterAvailableCategories(
      shopData.categories,
      shopData.hiddenCategories
    );
    dispatch(fetchCategories(availableCategories));
  }, [dispatch, shopData.categories, shopData.hiddenCategories]);

  useEffect(() => {
    const filteredDishes = dishes.filter(
      (dish) =>
        dish.categoryId === selectedCategory && dish.shopId === shopData.id
    );
    setDishesPerCategory(filteredDishes);
  }, [selectedCategory, dishes]);

  const handleCategoryClick = async (categoryId) => {
    if (!loadedCategories.includes(categoryId)) {
      dispatch(fetchDishesByCategory({ shopId: shopData.id, categoryId }));
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

  if (categoriesLoading) return <Loader />;
  if (categoriesError) return <div>Error: No categories available</div>;

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
        ></DishesContainer>
      ) : (
        <SelectCategory>
          {" "}
          <Content> {t('selectCategory')} </Content>{" "}
        </SelectCategory>
      )}
    </Section>
  );
};

export default CategoriesContainer;
