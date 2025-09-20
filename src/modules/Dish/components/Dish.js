import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { getImage } from "../../Images/services/imageServices.js";
import PlusIcon from '../../../assets/icons/cart.svg'; // We'll use an icon for the button


const bufferToUrl = (imageObject) => {
  if (!imageObject || !imageObject.buffer?.data) return null;
  const imageData = imageObject.buffer.data;
  const base64String = btoa(new Uint8Array(imageData).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  const format = imageObject.originalname.split('.').pop().toLowerCase();
  const mimeType = format === 'jpg' ? 'jpeg' : format;
  return `data:image/${mimeType};base64,${base64String}`;
};

// const Card = styled.div`
//  
//   border: 1px solid #EAEAEA;
//    border-radius: ${(props) => props.theme.defaultRadius}; 
//    padding: 1rem;
//     display: flex;
//      flex-direction: column;
//       transition: all 0.3s ease;
//        width: 100%;
//         margin-bottom: 1.5rem;
//          break-inside: avoid;
//           &:hover { transform: translateY(-5px);
//            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.07); } `;

const Card = styled.div`
  background-color: #FFFFFF; 
  border-radius: ${(props) => props.theme.defaultRadius};
  display: flex;
  flex-direction: column; /* THIS IS THE CORE FIX: The card is now vertical */
  width: 100%;
  margin-bottom: 1.5rem; /* This creates the vertical gap */
  border: 1px solid rgba(255, 255, 255, 0.1);
  break-inside: avoid; /* Prevents the card from breaking across columns */
  overflow: hidden; /* Ensures image corners are rounded */
`;

// const DishImage = styled.img` width: 100%; height: 180px; object-fit: cover; border-radius: ${(props) => props.theme.smallRadius}; background-color: #F5F5F5; margin-bottom: 1rem; `;
// const CardBody = styled.div` display: flex; flex-direction: column; flex-grow: 1; gap: 0.5rem; `;
// const Name = styled.h3` font-size: ${(props) => props.theme.fontlg}; color: ${(props) => props.theme.text}; font-weight: 600; line-height: 1.4; `;
// const Ingredients = styled.p` font-size: ${(props) => props.theme.fontsm}; color: ${(props) => props.theme.secondaryText}; line-height: 1.5; flex-grow: 1; `; 
// const CardFooter = styled.div` display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; `;
// const Price = styled.h3` font-size: ${(props) => props.theme.fontxl}; color: ${(props) => props.theme.primaryColor}; font-weight: 700; `;
// const AddButton = styled.button` background-color: ${(props) => props.theme.primaryColor}; color: #FFFFFF; width: 40px; height: 40px; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease-in-out; &:hover { transform: scale(1.1); } `;
const PlusIconStyled = styled.img` width: 20px; height: 20px; `;

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
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Ingredients = styled.p`
  font-size: ${(props) => props.theme.fontsm};
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 0rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding: 0 1rem 1rem ;
`;

const Price = styled.h3`
  font-size: ${(props) => props.theme.fontxl};
  color: ${({ $primaryColor, theme }) => $primaryColor || theme.primaryColor};
  font-weight: 700;
`;

const DishCard = ({ dish, onAddToCart }) => {
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
  const dishName = (!isArabic && nameFr) ? nameFr : name;
  const ingredientString = ingredients?.filter(item => item.trim() !== "").join(' · ');

  return (
    <Card>
      {imageUrl && <DishImage src={imageUrl} alt={dishName} />}
      <CardBody>
        <Name>{dishName}</Name>
        {ingredientString && <Ingredients>{ingredientString}</Ingredients>}
      </CardBody>
      <CardFooter>
        <Price>
          {parseInt(sellingPrice)} {t("dzd")}
        </Price>
      </CardFooter>
    </Card>
  );
};

export default DishCard;