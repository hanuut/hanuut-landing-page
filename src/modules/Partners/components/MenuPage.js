import React, { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { usePalette } from "color-thief-react";
import Loader from "../../../components/Loader";
import CategoriesContainer from "../../Categories/components/CategoriesContainer";
import ShopHeader from "./ShopHeader";
import Cart from "./Cart";

import { createPosOrder } from "../services/orderServices";

const PageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1rem;
`;

const MenuContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  padding: 2rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  ${(props) =>
    props.$isPremium
      ? css`
          background-color: #121212;
          border-radius: ${(props) => props.theme.defaultRadius};
        `
      : css`
          ${(props) => props.theme.glassmorphism};
          border: 1px solid ${(props) => props.theme.surfaceBorder};
          border-radius: ${(props) => props.theme.defaultRadius};
        `}

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

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

const MenuPage = ({ selectedShop, selectedShopImage }) => {
  const { i18n } = useTranslation();

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(null);

  const handleAddToCart = (dishToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.dish._id === dishToAdd._id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.dish._id === dishToAdd._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { dish: dishToAdd, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (dishId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.dish._id !== dishId)
      );
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.dish._id === dishId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handlePlaceOrder = async (customerDetails) => {
    if (isSubmitting === "submitting") return;
    setIsSubmitting("submitting");

    // Prepare the payload as defined in the API's DTO
    const orderPayload = {
      ...customerDetails,
      shopId: selectedShop._id,
      products: cartItems.map((item) => ({
        productId: item.dish._id,
        title: item.dish.name,
        quantity: item.quantity,
        sellingPrice: item.dish.sellingPrice,
        categoryId: item.dish.categoryId, // Field you requested
      })),
    };

    try {
      await createPosOrder(orderPayload);
      setIsSubmitting("success"); // Set to success state

      // Automatically close the modal and clear the cart after a short delay
      setTimeout(() => {
        setIsCartOpen(false);
        setCartItems([]);
        setIsSubmitting(null); // Reset for next time
      }, 2000);
    } catch (error) {
      console.error("Failed to submit order:", error);
      setIsSubmitting("error"); // Set to error state

      // Give the user a chance to see the error, then reset
      setTimeout(() => {
        setIsSubmitting(null);
      }, 3000);
    }
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    // If the cart is closed after a submission, reset the state
    if (isSubmitting === "success" || isSubmitting === "error") {
      setIsSubmitting(null);
    }
  };

  const imageUrl = useMemo(
    () => bufferToUrl(selectedShopImage),
    [selectedShopImage]
  );

  const { data: logoPalette } = usePalette(imageUrl, 2, "hex", {
    crossOrigin: "Anonymous",
    quality: 10,
  });

  if (!selectedShop) return <Loader />;

  const isSubscribed = selectedShop.subscriptionPlanId !== null;
  const isShopOpen = selectedShop.isOpen;
  const brandColors = {
    main: selectedShop.styles?.mainColor || (logoPalette && logoPalette[0]),
    accent:
      selectedShop.styles?.secondaryColor || (logoPalette && logoPalette[1]),
  };

  return (
    <PageWrapper>
      <MenuContainer
        isArabic={i18n.language === "ar"}
        $isPremium={isSubscribed}
      >
        <ShopHeader
          shop={selectedShop}
          imageData={imageUrl}
          isSubscribed={isSubscribed}
          brandColors={brandColors}
        />
        <CategoriesContainer
          shopData={selectedShop}
          isSubscribed={isSubscribed}
          onAddToCart={handleAddToCart}
          brandColors={brandColors}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          isShopOpen={isShopOpen}
        />
      </MenuContainer>
      {isSubscribed && (
        <Cart
          items={cartItems}
          isOpen={isCartOpen}
          onOpen={() => setIsCartOpen(true)}
          onClose={() => handleCloseCart}
          onUpdateQuantity={handleUpdateQuantity}
          isShopOpen={isShopOpen}
          onSubmitOrder={handlePlaceOrder}
          isPremium={isSubscribed}
          brandColors={brandColors}
          isSubmitting={isSubmitting}
        />
      )}
    </PageWrapper>
  );
};

export default MenuPage;
