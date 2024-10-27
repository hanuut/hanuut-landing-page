import React, { useEffect, useState } from "react";
import EmptyCartIllustration from "../../../assets/illustrations/emptyCart.svg";
import styled from "styled-components";
import CartElement from "./CartElement";

const CartElementContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
  flex: 8;
  padding: 1rem 0;
  @media (max-width: 768px) {
  }
`;

const MissionIllutstrationContainer = styled.img`
  max-width: 100%;
  object-fit: fill;
  @media (max-width: 768px) {
  }
`;
const CartElementsGrid = ({ filteredCartItems }) => {
  const [cartItems, setCartItems] = useState(filteredCartItems);

  useEffect(() => {
    setCartItems(filteredCartItems);
  }, [filteredCartItems]);

  return (
    <CartElementContainer>
      {cartItems.length > 0 ? (
        cartItems.map((cartItem) => {
          return <CartElement key={cartItem.productId} cartItem={cartItem} />;
        })
      ) : (
        <MissionIllutstrationContainer src={EmptyCartIllustration} alt="empty-cart"/>
      )}
    </CartElementContainer>
  );
};

export default CartElementsGrid;
