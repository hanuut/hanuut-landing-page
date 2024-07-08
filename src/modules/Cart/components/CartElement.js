import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../state/reducers";
import {
  DecrementQuantityButton,
  IncrementQuantityButton,
} from "../../../components/ActionButton";
import ArrowUp from "../../../assets/icons/arrowUp.svg";
import ArrowDown from "../../../assets/icons/arrowDown.svg";

const CartItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 95%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: transparent;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;
const ContentContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 0.5rem;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemTitle = styled.span`
  font-size: ${(props) => props.theme.fontlg};
`;

const TotalItemPrice = styled.p`
  margin-left: 1rem;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: bold;
`;

const ItemPrice = styled.span`
  font-size: ${(props) => props.theme.fontmd};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
`;

const QuantityControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-size: ${(props) => props.theme.fontmd};
  padding: 0.5rem;
`;

const Quantity = styled.span`
  margin: 0 0.5rem;
  font-size: ${(props) => props.theme.fontlg};
  font-weight: bold;
`;

const QuantityControlsButton = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const CartElement = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { productId, title, shopId, sellingPrice } = cartItem;

  const handleIncrement = () => {
    console.log("increment", cartItem);
    const dish = {
      _id: productId,
      name: title,
      sellingPrice: sellingPrice,
      shopId: shopId,
    };
    dispatch(addToCart(dish));
  };

  const handleDecrement = () => {
    dispatch(removeFromCart(cartItem.productId));
  };

  return (
    <CartItemContainer>
      <ContentContainer>
        <Quantity>{cartItem.quantity}</Quantity>
        <ItemDetails>
          <ItemTitle>{cartItem.title}</ItemTitle>
          <ItemPrice>{cartItem.sellingPrice} DZD</ItemPrice>
        </ItemDetails>
      </ContentContainer>
      <QuantityControls>
        <TotalItemPrice>
          {cartItem.quantity * cartItem.sellingPrice}
        </TotalItemPrice>{" "}
        <QuantityControlsButton
          src={ArrowUp}
          onClick={handleIncrement}
        ></QuantityControlsButton>
        <QuantityControlsButton
          src={ArrowDown}
          onClick={handleDecrement}
        ></QuantityControlsButton>
      </QuantityControls>
    </CartItemContainer>
  );
};

export default CartElement;
