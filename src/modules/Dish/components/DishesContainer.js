// src/pages/Dish/components/DishesContainer.js

import React, { useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Dish from "./Dish.js"; // This should match your dish component file name
import Loader from "../../../components/Loader";

// This helper function converts the image buffer into a usable Data URL
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

const MasonryLayout = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-top: 2rem;
  column-width: 320px;
  column-gap: 1.5rem;
  opacity: ${(props) => (props.expanded ? 1 : 0)};
  transform: ${(props) => (props.expanded ? "translateY(0)" : "translateY(20px)")};
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const NoAvailableDishes = styled.div`
  padding: 4rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.p`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.secondaryText};
`;

const DishesContainer = ({ dishes, expanded, isSubscribed }) => {
  const { t } = useTranslation();

  // useMemo will re-calculate this list ONLY when the 'dishes' prop changes.
  const dishesWithImageUrls = useMemo(() => {
    if (!dishes) {
      return [];
    }
    // Map over the dishes to process their images
    return dishes.map(dishWrapper => {
      const dish = dishWrapper.dish;
      // Your 'dish' object likely has an 'image' property with the buffer
      const imageUrl = dish && dish.image ? bufferToUrl(dish.image) : null;
      
      // Return a new object with the processed imageUrl
      return {
        ...dishWrapper,
        dish: {
          ...dish,
          imageUrl: imageUrl,
        },
      };
    });
  }, [dishes]);

  if (!dishes) {
    return <Loader />;
  }

  return (
    <MasonryLayout expanded={expanded}>
      {/* We now map over the processed list */}
      {dishesWithImageUrls.length > 0 ? (
        dishesWithImageUrls.map((dishWrapper) => (
          dishWrapper.isHidden !== true ? (
            <Dish
              key={dishWrapper.id}
              dish={dishWrapper.dish}
              isSubscribed={isSubscribed}
            />
          ) : null
        ))
      ) : (
        <NoAvailableDishes>
          <Content>{t("noDishesAvailable")}</Content>
        </NoAvailableDishes>
      )}
    </MasonryLayout>
  );
};

export default DishesContainer;