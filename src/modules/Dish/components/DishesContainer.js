// src/modules/Dish/components/DishesContainer.js

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import DishCard from "./Dish.js";
import PremiumDishCard from "./PremiumDishCard.js";
import Loader from "../../../components/Loader";
import NothingFoundImage from "../../../assets/nothing.png";


const MasonryLayout = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-top: 2rem;
  
  column-count: 3;
  column-gap: 1.5rem;

  @media (max-width: 992px) {
    column-count: 2;
  }
  @media (max-width: 576px) {
    column-count: 1;
  }
`;

const NoAvailableDishes = styled.div`
  padding: 4rem 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const EmptyStateImage = styled.img`
  width: 500px;
  max-width: 40%;
  opacity: 0.7;
`;

const Content = styled.p`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.secondaryText};
  text-align: center;
`;

const DishesContainer = ({ dishes, isSubscribed, isLoading, onAddToCart, onUpdateQuantity, brandColors, cartItems,isShopOpen }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <Loader fullscreen={false} />;
  }

   const visibleDishes = dishes.filter(dishWrapper => dishWrapper.dish.isHidden !== true);
console.log(visibleDishes)

  if (visibleDishes.length === 0) {
    return (
      <NoAvailableDishes>
        <EmptyStateImage src={NothingFoundImage} alt="No items found" />
        <Content>{t("noDishesAvailable")}</Content>
      </NoAvailableDishes>
    );
  }

  return (
    <MasonryLayout>
      {visibleDishes.map((dishWrapper) => {
        const cartItem = cartItems.find(item => item.dish._id === dishWrapper.dish._id);
        
        return isSubscribed ? (
          <PremiumDishCard
            key={dishWrapper.id}
            dish={dishWrapper.dish}
            brandColors={brandColors}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            cartItem={cartItem}
            isShopOpen={isShopOpen}
          />
        ) : (
          <DishCard
            key={dishWrapper.id}
            dish={dishWrapper.dish}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            cartItem={cartItem} 
          />
        );
      })}
    </MasonryLayout>
  );
};

export default DishesContainer;