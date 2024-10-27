import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { light } from "../../../config/Themes";
import CartIcon from "../../../assets/icons/cart.svg";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import {
  ActionButton,
  AddToCartButton,
} from "../../../components/ActionButton";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Cart/state/reducers";
// Updated import

const Card = styled.div`
  width: 30%;
  border: 1px solid rgba(${(props) => props.theme.textRgba}, 0.3);
  border-radius: ${(props) => props.theme.smallRadius};
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  transition: transform 0.3s ease;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  flex: 5;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const Name = styled.h3`
  font-family: "Tajawal", sans-serif;
  margin-bottom: 0.5rem;
`;

const Ingredients = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

const Ingredient = styled.h5`
  font-family: "Tajawal", sans-serif;
  font-weight: 100;
  min-width: fit-content;
`;

const PriceContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 5px;
  font-weight: bold;
`;

const Price = styled.h3``;

const Dish = ({ dish }) => {
  const { i18n } = useTranslation();
  const { name, sellingPrice } = dish;
  const { ingredients } = dish;
  const filteredIngredients =
    ingredients && ingredients.length > 0
      ? ingredients.filter((item) => item.trim() !== "")
      : [];
  // const dispatch = useDispatch();

  // const onAddToCartClick = () => {
  //   dispatch(addToCart(dish));
  // };

  return (
    <Card isArabic={i18n.language === "ar"}>
      <ContentRow>
        <Name>{name}</Name>
        <Body>
          {filteredIngredients.length > 0 && (
            <Ingredients>
              {filteredIngredients.map((ingredient, index) => (
                <Ingredient key={index}>
                  {ingredient}
                  {index !== filteredIngredients.length - 1 ? "  " : ""}
                </Ingredient>
              ))}
            </Ingredients>
          )}
        </Body>
      </ContentRow>
      <PriceContainer isArabic={i18n.language === "ar"}>
        <Price>
          {sellingPrice} {t("dzd")}
        </Price>
        {/* <AddToCartButton key={dish._id} onClick={onAddToCartClick}>
          +
        </AddToCartButton> */}
      </PriceContainer>
    </Card>
  );
};

export default Dish;
