// src/modules/Dish/components/Dish.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
// THE FIX: Use a correct relative path to find the service.
import { getImage } from "../../Images/services/imageServices.js";

const bufferToUrl = (imageObject) => {
  if (!imageObject || !imageObject.buffer || !imageObject.buffer.data) {
    return null;
  }
  const imageData = imageObject.buffer.data;
  const base64String = btoa(
    new Uint8Array(imageData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );
  const format = imageObject.originalname.split('.').pop().toLowerCase();
  const mimeType = format === 'jpg' ? 'jpeg' : format;
  return `data:image/${mimeType};base64,${base64String}`;
};

const DishImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: ${(props) => props.theme.smallRadius};
  background-color: #eee;
  margin-bottom: 0.5rem;
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.surfaceBorder};
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 1.5rem;
  break-inside: avoid;
  &:hover {
    ${(props) => props.theme.cardHoverEffect};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const Name = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.text};
  font-weight: 600;
  line-height: 1.3;
`;

const Price = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.primary};
  font-weight: 600;
  white-space: nowrap;
`;

const Ingredients = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  color: ${(props) => props.theme.secondaryText};
  line-height: 1.5;
  flex-grow: 1; 
`;

// const ActionRow = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   margin-top: 1rem;
// `;

// const AddToCartButton = styled.button`
//   background-color: ${(props) => props.theme.primary};
//   color: ${(props) => props.theme.body};
//   font-size: ${(props) => props.theme.fontlg};
//   font-weight: 500;
//   padding: 0.5rem 1rem;
//   border: none;
//   border-radius: ${(props) => props.theme.smallRadius};
//   cursor: pointer;
//   transition: all 0.2s ease-in-out;
//   &:hover {
//     opacity: 0.9;
//     transform: scale(1.05);
//   }
// `;

const DishCard = ({ dish, isSubscribed }) => {
  const { i18n, t } = useTranslation();
  const [imageUrl, setImageUrl] = useState(null);

  // THE FIX: The useEffect hook is now called *after* the main hooks,
  // but *before* any early returns.
  useEffect(() => {
    if (isSubscribed && dish && dish.imageId) {
      const fetchImageData = async () => {
        try {
          const response = await getImage(dish.imageId);
          const url = bufferToUrl(response.data);
          setImageUrl(url);
        } catch (error) {
          console.error("Failed to fetch dish image:", error);
          setImageUrl(null);
        }
      };
      fetchImageData();
    }
  }, [dish, isSubscribed]); // Simplified dependency array

  // THE FIX: The early return is now AFTER the hooks.
  if (!dish) {
    return null;
  }
  
  const { name, nameFr, sellingPrice, ingredients, } = dish;
  const isArabic = i18n.language === "ar";
  const dishName = (!isArabic && nameFr && nameFr.length > 0) ? nameFr : name;
  const ingredientString = ingredients?.filter(item => item.trim() !== "").join(' · ');

  return (
    <Card>
      {isSubscribed && imageUrl && (
        <DishImage src={imageUrl} alt={dishName} />
      )}
      <CardHeader>
        <Name>{dishName}</Name>
        <Price>
          {parseInt(sellingPrice)} {t("dzd")}
        </Price>
      </CardHeader>
      {ingredientString && (
        <Ingredients>{ingredientString}</Ingredients>
      )}
      {/* {isSubscribed && (
        <ActionRow>
          <AddToCartButton>{t("addToCart")}</AddToCartButton>
        </ActionRow>
      )} */}
    </Card>
  );
};

// Renamed component back to Dish to match your file structure.
export default DishCard;