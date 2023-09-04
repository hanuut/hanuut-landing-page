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

const Section = styled.div`
  background-color: ${(props) => props.theme.body};
  width: 100%;
  height: ${(props) => `calc(100vh - ${props.theme.navHeight} - 11rem)`};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: scroll;
  margin-top: 0.5rem;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;
const CategoriesContainer = ({ shopData }) => {
  const dispatch = useDispatch();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector(selectCategories);
  const { dishes } = useSelector(selectDishes);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadedCategories, setLoadedCategories] = useState([]);

  const filterAvailableCategories = (categories, hiddenCategories) => {
    const availableCategories = categories.filter(
      (category) => !hiddenCategories.includes(category)
    );
    return availableCategories;
  };

  useEffect(() => {
    const availableCategories = filterAvailableCategories(
      shopData.categories,
      shopData.hiddenCategories
    );
    dispatch(fetchCategories(availableCategories));
  }, [dispatch, shopData.categories]);

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (!loadedCategories.includes(categoryId)) {
      dispatch(fetchDishesByCategory({ shopId: shopData.id, categoryId }));
      setLoadedCategories([...loadedCategories, categoryId]);
    }
  };

  if (categoriesLoading) return <Loader />;
  if (categoriesError) return <div>Error: {categoriesError}</div>;

  return (
    <Section>
      {categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          shopId={shopData.id}
          onCategoryClick={handleCategoryClick}
          dishes={dishes}
        />
      ))}
    </Section>
  );
};

export default CategoriesContainer;
