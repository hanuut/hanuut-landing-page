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
  gap: 0.5rem;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CardHeader = styled.div`
  width: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

const Name = styled.h3``;

const Price = styled.h3``;

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
      <CardHeader>
        <Name>{name}</Name>
        <Price>
          {sellingPrice} {t("dzd")}
        </Price>
      </CardHeader>
      <CardBody>
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
      </CardBody>
    </Card>
  );
};

export default Dish;
