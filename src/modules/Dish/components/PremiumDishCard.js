import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { getImage } from "../../Images/services/imageServices.js";
import CartIcon from "../../../assets/icons/cart.svg"; // Using a more appropriate icon
import AddToCartControl from "./AddToCartControl";

const bufferToUrl = (imageObject) => {
  if (!imageObject || !imageObject.buffer?.data) return null;
  const imageData = imageObject.buffer.data;
  const base64String = btoa(
    new Uint8Array(imageData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  const format = imageObject.originalname.split(".").pop().toLowerCase();
  const mimeType = format === "jpg" ? "jpeg" : format;
  return `data:image/${mimeType};base64,${base64String}`;
};

const Card = styled.div`
  background-color: #1e1f1e; /* Slightly lighter than pure black */
  border-radius: ${(props) => props.theme.defaultRadius};
  display: flex;
  flex-direction: column; 
  width: 100%;
  margin-bottom: 1.5rem; /* This creates the vertical gap */
  border: 1px solid rgba(255, 255, 255, 0.1);
  break-inside: avoid; /* Prevents the card from breaking across columns */
  overflow: hidden; /* Ensures image corners are rounded */
`;

const DishImage = styled.img`
  width: 100%;
  height: 180px; /* A taller, more appealing image */
  object-fit: cover;
  background-color: #333;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  flex-grow: 1;
`;

const Name = styled.h3`
  font-size: ${(props) => props.theme.fontlg};
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Ingredients = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 1rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const Price = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  color: ${({ $accentColor, theme }) => $accentColor || theme.accent};
  font-weight: 700;
`;

const PremiumDishCard = ({
  dish,
  brandColors,
  onAddToCart,
  cartItem,
  onUpdateQuantity,
  isShopOpen
}) => {
  const { i18n, t } = useTranslation();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (dish?.imageId) {
      const fetchImageData = async () => {
        try {
          const response = await getImage(dish.imageId);
          const url = bufferToUrl(response.data);
          setImageUrl(url);
        } catch (error) {
          console.error("Failed to fetch dish image:", error);
        }
      };
      fetchImageData();
    }
  }, [dish]);

  if (!dish) return null;

  const { name, nameFr, sellingPrice, ingredients } = dish;
  const isArabic = i18n.language === "ar";
  const dishName = !isArabic && nameFr ? nameFr : name;
  const ingredientString = ingredients
    ?.filter((item) => item.trim() !== "")
    .join(" · ");

  return (
    <Card>
      {imageUrl && <DishImage src={imageUrl} alt={dishName} />}
      <CardBody>
        <Name>{dishName}</Name>
        {ingredientString && <Ingredients>{ingredientString}</Ingredients>}
        <CardFooter>
          <Price $accentColor={brandColors?.accentColor}>
            {parseInt(sellingPrice)} {t("dzd")}
          </Price>
          {isShopOpen && <AddToCartControl
            dish={dish}
            cartItem={cartItem}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            isPremium={true}
            brandColors={brandColors}
          />}
        </CardFooter>
      </CardBody>
    </Card>
  );
};

export default PremiumDishCard;
