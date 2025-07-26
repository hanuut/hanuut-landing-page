// src/pages/Shop/components/MenuPage.js (previously FoodShop.js)

import React ,{ useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/Loader";
import CategoriesContainer from "../../Categories/components/CategoriesContainer";
import ShopHeader from "./ShopHeader"; 

const PageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding: 2rem 1rem; // Add some padding for smaller screens
`;

const MenuContainer = styled.div`
  width: 95%;
  max-width: 1280px; // A max-width for large screens
  padding: 2rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  // Here's our glassmorphism!
  ${(props) => props.theme.glassmorphism};
  border: 1px solid ${(props) => props.theme.surfaceBorder};
  border-radius: ${(props) => props.theme.defaultRadius};
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem 1rem;
  }
`;

const bufferToUrl = (imageObject) => {
  if (!imageObject || !imageObject.buffer || !imageObject.buffer.data) {
    return null; // Return null if the data is invalid
  }

  // Get the raw byte data from the buffer
  const imageData = imageObject.buffer.data;

  // Convert the byte array to a Base64 string
  const base64String = btoa(
    new Uint8Array(imageData).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );

  // Determine the image format (MIME type) from the original filename
  const format = imageObject.originalname.split('.').pop().toLowerCase();
  const mimeType = format === 'jpg' ? 'jpeg' : format;

  // Return the complete data URL
  return `data:image/${mimeType};base64,${base64String}`;
};


const MenuPage = ({ selectedShop, selectedShopImage }) => {
  const { i18n } = useTranslation();

  // 3. USE useMemo TO CREATE THE IMAGE URL
  // This memoized value will only be recalculated when selectedShopImage changes.
  const imageUrl = useMemo(() => {
    return bufferToUrl(selectedShopImage);
  }, [selectedShopImage]);


  if (!selectedShop) {
    return <Loader />;
  }

  const isSubscribed = selectedShop.subscriptionPlanId !== null;

  return (
    <PageWrapper>
      <MenuContainer isArabic={i18n.language === "ar"}>
        <ShopHeader
          shop={selectedShop}
          // 4. PASS THE NEW imageUrl INSTEAD OF THE OLD OBJECT
          imageData={imageUrl}
          isSubscribed={isSubscribed}
        />

        <CategoriesContainer
          shopData={selectedShop}
          isSubscribed={isSubscribed}
        />
      </MenuContainer>
    </PageWrapper>
  );
};

export default MenuPage;
