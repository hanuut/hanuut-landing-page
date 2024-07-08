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
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight} - 11rem)`};
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
  flex-wrap: no-wrap; /* Change flex-wrap to nowrap */
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
      return (
        <Section>
          <Loader />
        </Section>
      );
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
        dish.categoryId === selectedCategory && dish.shopId === shopData._id
    );
    setDishesPerCategory(filteredDishes);
  }, [selectedCategory, dishes]);

  const handleCategoryClick = async (categoryId) => {
    if (!loadedCategories.includes(categoryId)) {
      // console.log(categoryId);
      // console.log(shopData._id);
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

  if (categoriesLoading)
    return (
      <Section>
        <Loader />
      </Section>
    );

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
          <Content> {t("selectCategory")} </Content>{" "}
        </SelectCategory>
      )}
    </Section>
  );
};

export default CategoriesContainer;
