import React, { useEffect, useState } from "react";
import {
  selectCategories,
  fetchCategories,
} from "../../Categories/state/reducers";
import { selectDishes, fetchDishesByCategory } from "../../Dish/state/reducers";
import { fetchDishesImages } from "../../Images/state/reducers";
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
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;
const CategoriesContainer = ({ shopData }) => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(selectCategories);
  const { dishes } = useSelector(selectDishes);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadedCategories, setLoadedCategories] = useState([]);

  const filterAvailableCategories = (allCategories, hiddenCategories) => {
    const availableCategories = allCategories.filter(
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
  useEffect(() => {
    console.log(loadedCategories);
  }, [loadedCategories]);

  if (loading) return <Loader />;
  if (error) return <div>error ${error}</div>;

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    console.log(shopData.id, categoryId);
    if (!loadedCategories.includes(categoryId)) {
      const categoryDishes = dishes.filter(
        (dish) => dish.categoryId === categoryId && dish.shopId === shopData.id
      );
      if (categoryDishes.length === 0) {
        dispatch(fetchDishesByCategory({ shopId: shopData.id, categoryId }));
        dispatch(fetchDishesImages(dishes));
        console.log(dishes)
      }
      setLoadedCategories([...loadedCategories, categoryId]);
    }
  };

  return (
    <Section>
      {categories.map((category) => (
        <Category
          key={category.id}
          category={category}
          shopId={shopData.id}
          onCategoryClick={handleCategoryClick}
          dishes= {dishes}
        />
      ))}
    </Section>
  );
};

export default CategoriesContainer;
