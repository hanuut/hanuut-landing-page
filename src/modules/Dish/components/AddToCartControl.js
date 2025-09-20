// src/modules/Dish/components/AddToCartControl.js

import React from "react";
import styled, { css } from "styled-components";

// --- Styled Components for the new control ---

const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const BaseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  font-size: 1.5rem; /* Emoji size */

  &:hover {
    transform: scale(1.1);
  }
`;

const AddButton = styled(BaseButton)`
  background-color: ${({ $color }) => $color};
  color: #1c1c1e;
  text-shadow: 0 0 8px ${({ $shadowColor }) => `${$shadowColor}99`};
`;

const QuantityButton = styled(BaseButton)`
  background-color: transparent;
  color: #ffffff;
  border: 1px solid ${({ $color }) => $color};
  font-size: 1.2rem;
  
  /* --- THE FIX: Trash can emoji color and shadow --- */
  ${(props) =>
    props.$isTrash &&
    css`
      border-color: #ff4d4d;
      text-shadow: 0 0 8px #ff4d4d99;
    `}
`;

const QuantityDisplay = styled.span`
  font-size: ${(props) => props.theme.fontlg};
  font-weight: 600;
  color: #ffffff;
  min-width: 40px;
  text-align: center;
`;

const AddToCartControl = ({ dish, cartItem, onAddToCart, onUpdateQuantity, isPremium, brandColors }) => {
  const accentColor = brandColors?.accent || "#FFD700"; // Fallback accent
  const primaryColor = brandColors?.main || "#39A170"; // Fallback primary

  // Determine the correct colors based on theme
  const standardColor = isPremium ? accentColor : primaryColor;
  const premiumAddShadow = isPremium ? accentColor : primaryColor;
  
  if (!cartItem) {
    // If the item is not in the cart, show the "Add" button
    return (
      <ControlWrapper>
        <AddButton
          $color={standardColor}
          $shadowColor={premiumAddShadow}
          onClick={() => onAddToCart(dish)}
        >
          🛒
        </AddButton>
      </ControlWrapper>
    );
  }

  // If the item IS in the cart, show the quantity controls
  return (
    <ControlWrapper>
      <QuantityButton
        $color={accentColor}
        $isTrash={cartItem.quantity === 1}
        onClick={() => onUpdateQuantity(dish._id, cartItem.quantity - 1)}
      >
        {cartItem.quantity === 1 ? '🗑️' : '−'}
      </QuantityButton>
      <QuantityDisplay>{cartItem.quantity}</QuantityDisplay>
      <QuantityButton
        $color={accentColor}
        onClick={() => onUpdateQuantity(dish._id, cartItem.quantity + 1)}
      >
        +
      </QuantityButton>
    </ControlWrapper>
  );
};

export default AddToCartControl;