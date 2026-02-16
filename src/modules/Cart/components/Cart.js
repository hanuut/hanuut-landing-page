import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import { light } from "../../../config/Themes";
import CartIcon from "../../../assets/icons/cart.svg";
import { useSelector } from "react-redux";
import { selectCart } from "../state/reducers";
import { ActionButton } from "../../../components/ActionButton";
import CartElementsGrid from "./CartElementsGrid";
import AddressesDropDown from "../../../components/AddressesDropDown";
import { useTranslation } from "react-i18next";

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CartContent = styled.div`
  width: 100%;
  position: absolute;
  top: 110%;
  right: ${(props) => (props.isopen ? "8%" : "-100%")};
  width: ${(props) => (props.isopen ? "33%" : "0")};
  height: 80vh;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  border: 1px solid black;
  transition: all 0.2s ease;
  background: transparent;
  backdrop-filter: blur(50px);
  border-radius: 10px;

  overflow-y: scroll;
  @media (max-width: 768px) {
  }
`;

// const CartElementContainer = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
//   flex-direction: column;
//   overflow: scroll;
//   flex: 8;
//   padding: 1rem 0;
//   @media (max-width: 768px) {
//   }
// `;

const CartDetails = styled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex: 2;
  border-top: 2px solid rgba(${(props) => props.theme.textRgba}, 0.5);
  padding: 1rem 0;
`;

const CartDetailRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

const FormContainer = styled.form`
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  transition: all 0.5s ease;
  height: 100%;
  @media (max-width: 768px) {
    align-self: flex-start;
    width: 100%;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid;
  border-radius: ${(props) => props.theme.smallRadius};
  font-size: ${(props) => props.theme.fontxl};
  background-color: rgba(${(props) => props.theme.bodyRgba}, 0.7);
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.secondaryColor};
  }
  @media (max-width: 768px) {
    position: static;
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.div`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;

  p {
    background-color: #ffbaba;
    color: #d8000c;
    padding: 0.5rem 1rem;
    border: 1px solid #d8000c;
    border-radius: ${(props) => props.theme.defaultRadius};
    font-size: ${(props) => props.theme.fontmd};
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.secondaryColor};
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: ${(props) => props.theme.actionButtonPadding};
  font-size: ${(props) => props.theme.fontxl};
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.03);
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
    margin-top: 10px;
  }
`;

const Cart = ({ shopId }) => {
  const { t } = useTranslation();
  const { cart } = useSelector(selectCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filteredCartItems, setFilteredCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedForm, setSelectedForm] = useState(0);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [successMessage, setSuccessMessage] = useState("");
  // const [isAccepted, setIsAccepted] = useState(false);

  const handleChooseAddress = (newAddress) => {
    setAddress(newAddress);
  };

  // const handleSubscribe = async (event) => {
  //   event.preventDefault();
  //   if (
  //     !fullName ||
  //     !phone ||
  //     !address ||
  //     !email ||
  //     !address.wilaya ||
  //     !address.commune
  //   ) {
  //     setErrorMessage(t("errorFillAllFields"));
  //     return;
  //   }
  //   if (!isValidPhone(phone)) {
  //     setErrorMessage(t("errorPhoneNotValid"));
  //     return;
  //   }
  //   if (!isValidEmail(email)) {
  //     setErrorMessage(t("errorEmailNotValid"));
  //     return;
  //   }
  //   setErrorMessage("");
  //   setIsSubmitting(true);

  //   const isPhoneUsed = await checkPhoneNumberAvailability(phone);

  //   if (isPhoneUsed === true) {
  //     const subscribeRequest = await getSubscribeRequest(phone);
  //     if (subscribeRequest.isAccepted === true) {
  //       setSuccessMessage(t("clickToDownloadApp"));
  //       setIsAccepted(true);
  //     } else {
  //       setSuccessMessage(t("messagePhoneIsUsed"));
  //       setIsAccepted(false);
  //     }
  //     setIsSubmitting(false);
  //     return;
  //   } else {
  //     setIsAccepted(false);
  //     const data = {
  //       fullName: fullName,
  //       phone: phone,
  //       email: email,
  //       wilaya: address.wilaya,
  //       commune: address.commune,
  //       type: "driver",
  //     };

  //     const response = postSubscribeRequest(data);
  //     if (!response) {
  //       setErrorMessage(t("errorCouldNotSubscribe"));
  //     } else {
  //       setErrorMessage("");
  //       setSuccessMessage(t("partnersFormThankYouSubTitle"));
  //     }
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubscribe = async (event) => {};
  const onCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  useEffect(() => {
    const filteredCartItemsPerShop = cart.filter((cartItem) => {
      return (cartItem.shopId || item.product?.shopId) === shopId;
    });
    setFilteredCartItems(filteredCartItemsPerShop);
  }, [shopId, cart]);

  useEffect(() => {
    const totalPriceInstance = filteredCartItems.reduce(
      (total, cartItem) => total + cartItem.sellingPrice * cartItem.quantity,
      0,
    );
    setTotalPrice(totalPriceInstance);
  }, [filteredCartItems]);

  const onProceedClick = (e) => {
    setSelectedForm(1);
  };
  return (
    <Section>
      <ButtonWithIcon
        image={CartIcon}
        backgroundColor={light.primaryColor}
        text1={"Cart"}
        className="homeDownloadButton"
        onClick={onCartClick}
      ></ButtonWithIcon>
      <CartContent isopen={isCartOpen}>
        {selectedForm === 0 && (
          <>
            {" "}
            <CartElementsGrid filteredCartItems={filteredCartItems} />
            {filteredCartItems.length > 0 ? (
              <CartDetails>
                <CartDetailRow>
                  <p>Total</p>
                  <p>{totalPrice} dzd</p>
                </CartDetailRow>
                <CartDetailRow>
                  <p></p>
                  <ActionButton onClick={(e) => onProceedClick(e)}>
                    proceed
                  </ActionButton>
                </CartDetailRow>
              </CartDetails>
            ) : (
              <></>
            )}
          </>
        )}
        {selectedForm === 1 && (
          <>
            <FormContainer onSubmit={handleSubscribe}>
              <FormGroup>
                <Input
                  type="text"
                  placeholder={t("partnerInputTextFullName")}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="email"
                  placeholder={t("partnerInputText")}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="phone"
                  placeholder={t("partnerInputTextPhone")}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </FormGroup>
              <AddressesDropDown
                target="tawsila"
                onChooseAddress={handleChooseAddress}
              />
              {errorMessage ? (
                <ErrorMessage>
                  {errorMessage && <p>{errorMessage}</p>}
                </ErrorMessage>
              ) : (
                ""
              )}

              <Button
                onClick={handleSubscribe}
                className={isSubmitting ? "submitting" : ""}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("buttonIsSubmitting")
                  : t("partnerInputButton")}
              </Button>
            </FormContainer>
          </>
        )}
      </CartContent>
    </Section>
  );
};

export default Cart;
