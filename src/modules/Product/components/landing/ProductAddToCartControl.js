import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const ControlWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const BaseButton = styled.button`
  min-width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  font-size: 1.2rem; // Emoji size
  padding: 0;

  &:hover {
    transform: scale(1.1);
  }
`;

const AddButton = styled(BaseButton)`
  background-color: ${props => props.theme.primaryColor};
  color: #FFFFFF; // Emoji color
`;

const QuantityButton = styled(BaseButton)`
  background-color: transparent;
  color: ${props => props.theme.primaryColor};
  border: 1px solid ${props => props.theme.primaryColor};
`;

const QuantityDisplay = styled.span`
  font-size: ${props => props.theme.fontlg};
  font-weight: 600;
  color: ${props => props.theme.text};
  min-width: 40px;
  text-align: center;
`;

// ***** UPDATE COMPONENT LOGIC & UI *****
const ProductAddToCartControl = ({ product, cartItem, onAddToCart, onUpdateQuantity }) => {
  const { t } = useTranslation();

  // If the item is not in the cart, show the "Add" button
  if (!cartItem || cartItem.quantity === 0) {
    return (
      <ControlWrapper>
        {/* On Click will now open the modal by calling the prop from the card */}
        <AddButton onClick={() => onAddToCart(product)}>
          🛒
        </AddButton>
      </ControlWrapper>
    );
  }

  // If the item IS in the cart, show the quantity controls
  return (
    <ControlWrapper>
      <QuantityButton onClick={() => onUpdateQuantity(product, cartItem.quantity - 1)}>
        {cartItem.quantity === 1 ? '🗑️' : '−'}
      </QuantityButton>
      <QuantityDisplay>{cartItem.quantity}</QuantityDisplay>
      <QuantityButton onClick={() => onUpdateQuantity(product, cartItem.quantity + 1)}>
        +
      </QuantityButton>
    </ControlWrapper>
  );
};

export default ProductAddToCartControl;