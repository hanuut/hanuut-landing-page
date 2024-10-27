import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "../state/reducers";
import ArrowUp from "../../../assets/icons/arrowUp.svg";
import ArrowDown from "../../../assets/icons/arrowDown.svg";
import DeleteIcon from "../../../assets/icons/delete.svg";

const CartItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  border-bottom: 1px solid black;
  padding-bottom: 1rem;
  transition: box-shadow 0.3s ease;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const TitleRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const ItemTitle = styled.span`
  width: 100%;
  font-size: ${(props) => props.theme.fontlg};
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;

const ItemBrand = styled.span`
  font-size: ${(props) => props.theme.fontmd};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
`;

const ItemColorSize = styled.span`
  font-size: ${(props) => props.theme.fontsm};
  color: rgba(${(props) => props.theme.textRgba}, 0.5);
  margin-top: 0.25rem;
`;

const TotalItemPrice = styled.div`
  margin-right: 1rem;
  font-size: ${(props) => props.theme.fontxl};
  font-weight: bold;
  color: ${(props) => props.theme.textColor};
`;

const QuantityControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Quantity = styled.span`
  font-size: ${(props) => props.theme.fontlg};
  font-weight: bold;
  margin: 0.5rem 0;
  color: ${(props) => props.theme.textColor};
`;

const QuantityControlsButton = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const DeleteButton = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const CartElement = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { productId, title, brand, color, size, sellingPrice, quantity } =
    cartItem;

  const handleIncrement = () => {
    dispatch(incrementQuantity(productId));
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity(productId));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(productId));
  };

  return (
    <CartItemContainer>
      <ContentContainer>
        <ItemDetails>
          <TitleRow>
            <ItemTitle>
              {title} - {brand}
            </ItemTitle>
            <DeleteButton src={DeleteIcon} onClick={handleRemove} alt="delete"/>
          </TitleRow>
          <ItemColorSize>Color: {color}</ItemColorSize>
          <ItemColorSize>Size: {size}</ItemColorSize>
        </ItemDetails>
        <TotalItemPrice>{sellingPrice * quantity} DZD</TotalItemPrice>
      </ContentContainer>
      <QuantityControls>
        <QuantityControlsButton src={ArrowUp} onClick={handleIncrement} alt="-"/>
        <Quantity>{quantity}</Quantity>
        <QuantityControlsButton src={ArrowDown} onClick={handleDecrement} alt="+"/>
      </QuantityControls>
    </CartItemContainer>
  );
};

export default CartElement;
