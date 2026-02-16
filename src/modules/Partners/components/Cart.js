import React, { useState, useRef, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

// --- Redux & Hooks ---
import { closeCart, selectIsCartOpen } from "../../Cart/state/reducers";
import {
  detectUserLocation,
  setManualLocation,
  selectLocation,
} from "../../Location/state/reducers";
import useDeliveryCalculator from "../../../hooks/useDeliveryCalculator";

// --- Components ---
import Loader from "../../../components/Loader";
import AddressesDropDown from "../../../components/AddressesDropDown";
import {
  FaTimes,
  FaLocationArrow,
  FaUtensils,
  FaMotorcycle,
  FaGlobeAfrica,
} from "react-icons/fa";

// --- Styled Components (Preserved) ---
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContent = styled(motion.div)`
  width: 90%;
  max-width: 850px;
  background-color: rgba(24, 24, 27, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: 2.5rem;
  max-height: 90vh;
  overflow-y: auto;
  color: #ffffff;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(255, 255, 255, 0.06),
      transparent 40%
    );
    z-index: 0;
    pointer-events: none;
  }
`;
const ContentRelative = styled.div`
  position: relative;
  z-index: 1;
`;
const FormWrapper = styled.form`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 3rem;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column-reverse;
  }
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
`;
const CartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  font-family: "Tajawal", sans-serif;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #a1a1aa;
  &:hover {
    color: #fff;
  }
`;
const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;
const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
const ItemName = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
`;
const ItemVariant = styled.p`
  font-size: 0.8rem;
  color: #a1a1aa;
  margin-top: 0.25rem;
`;
const ItemPrice = styled.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme.primaryColor};
  font-weight: 600;
`;
const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const InputLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: #a1a1aa;
  text-align: start;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 12px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 12px;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
`;
const DeliveryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid
    ${(props) => (props.$error ? "#EF4444" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 16px;
  padding: 1rem;
  margin-top: 0.5rem;
`;
const DeliveryOptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  border-radius: 12px;
  background: ${(props) =>
    props.$selected ? "rgba(240, 122, 72, 0.15)" : "transparent"};
  border: 1px solid
    ${(props) => (props.$selected ? "#F07A48" : "rgba(255, 255, 255, 0.05)")};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
  &:hover {
    border-color: #f07a48;
  }
`;
const OptionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;
const OptionIcon = styled.div`
  color: ${(props) => props.theme.primaryColor};
  font-size: 1.2rem;
`;
const OptionText = styled.div`
  display: flex;
  flex-direction: column;
`;
const OptionTitle = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: white;
`;
const OptionDesc = styled.span`
  font-size: 0.8rem;
  color: #a1a1aa;
`;
const OptionPrice = styled.span`
  font-weight: 700;
  color: white;
`;
const LocationTriggerBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${(props) => props.theme.primaryColor};
  color: #111;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.02);
  }
  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;
const ErrorBanner = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const DineInBanner = styled.div`
  background: rgba(57, 161, 112, 0.1);
  border: 1px dashed #39a170;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  color: #39a170;
  font-weight: 600;
  margin-bottom: 1rem;
`;
const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;
const TotalLabel = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
`;
const TotalValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.primaryColor};
`;
const SubmitButton = styled.button`
  width: 100%;
  padding: 1.1rem;
  font-size: 1.1rem;
  font-weight: 700;
  background-color: ${(props) => props.theme.primaryColor};
  color: #111;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
  &:disabled {
    background-color: #333;
    color: #777;
    cursor: not-allowed;
    transform: none;
  }
`;
const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
`;
const StatusTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
`;
const StatusMessage = styled.p`
  color: #a1a1aa;
`;

const Cart = ({
  items,
  onUpdateQuantity,
  onSubmitOrder,
  isSubmitting,
  shopDomain,
  shopId,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const isOpen = useSelector(selectIsCartOpen);
  const locationState = useSelector(selectLocation);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [note, setNote] = useState("");
  const [selectedDeliveryIndex, setSelectedDeliveryIndex] = useState(0);

  const itemsTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.dish ? item.dish.sellingPrice : item.sellingPrice;
        return sum + parseInt(price, 10) * item.quantity;
      }, 0),
    [items],
  );

  const shouldCalculate = isOpen && items.length > 0;
  const {
    isLoading: calcLoading,
    error: calcError,
    deliveryOptions,
    distanceKm,
    isCalculated,
  } = useDeliveryCalculator(shopId, itemsTotal, shouldCalculate);

  const isDineIn = useMemo(() => {
    if (shopDomain !== "food") return false;
    return distanceKm !== null && distanceKm < 0.1;
  }, [distanceKm, shopDomain]);

  useEffect(() => {
    if (deliveryOptions.length > 0) setSelectedDeliveryIndex(0);
  }, [deliveryOptions]);

  const selectedDeliveryOption = deliveryOptions[selectedDeliveryIndex];
  const deliveryPrice = selectedDeliveryOption
    ? selectedDeliveryOption.price
    : 0;
  const finalTotal = itemsTotal + (isDineIn ? 0 : deliveryPrice);

  const handleClose = () => dispatch(closeCart());
  const handleLocationRequest = (e) => {
    e.preventDefault();
    dispatch(detectUserLocation());
  };
  const handleAddressChange = (addr) => {
    if (addr.wilayaCode) {
      dispatch(
        setManualLocation({
          wilayaCode: addr.wilayaCode,
          wilayaName: addr.wilaya,
          communeName: addr.commune,
        }),
      );
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const orderDetails = {
      customerName,
      customerPhone,
      note,
      tableNumber: isDineIn ? tableNumber : null,
      gpsLocation: { lat: locationState.lat, lng: locationState.lng },
      deliveryOption: isDineIn
        ? { type: "dine_in", price: 0 }
        : selectedDeliveryOption,
      address: isDineIn
        ? null
        : {
            wilaya: locationState.wilayaName,
            commune: locationState.communeName,
            addressLine: locationState.communeName,
          },
    };
    onSubmitOrder(orderDetails);
  };

  const handleMouseMove = (e) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    modalRef.current.style.setProperty("--mouse-x", `${x}px`);
    modalRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const renderDeliverySection = () => {
    if (shopDomain === "food") {
      if (locationState.status === "idle" || locationState.status === "error") {
        return (
          <FormGroup>
            <InputLabel>
              {t("delivery_location", "Delivery Location")}
            </InputLabel>
            <LocationTriggerBtn
              onClick={handleLocationRequest}
              disabled={locationState.status === "loading"}
            >
              {locationState.status === "loading" ? (
                <Loader fullscreen={false} />
              ) : (
                <FaLocationArrow />
              )}
              <span>
                {t("locate_me", "Share Location to see Delivery Price")}
              </span>
            </LocationTriggerBtn>
            {locationState.error && (
              <ErrorBanner>
                <FaTimes /> {t("location_error", "Could not detect location")}
              </ErrorBanner>
            )}
          </FormGroup>
        );
      }
      if (calcLoading)
        return (
          <DeliveryCard>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem",
              }}
            >
              <Loader fullscreen={false} />
            </div>
          </DeliveryCard>
        );
      if (calcError)
        return (
          <DeliveryCard $error>
            <ErrorBanner>
              <FaTimes />
              <span>
                {calcError.message ||
                  t("delivery_unavailable", "Delivery not available here.")}
              </span>
            </ErrorBanner>
            {distanceKm > 0 && (
              <small
                style={{ color: "#aaa", display: "block", marginTop: "5px" }}
              >
                {distanceKm} km away
              </small>
            )}
          </DeliveryCard>
        );
      if (isDineIn)
        return (
          <>
            <DineInBanner>
              <FaUtensils style={{ marginBottom: "5px" }} />
              <br />
              {t("you_are_at_shop", "You are at the shop!")}
            </DineInBanner>
            <FormGroup>
              <InputLabel>{t("form_table_number", "Table Number")}</InputLabel>
              <Input
                type="text"
                placeholder="Ex: 5"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </FormGroup>
          </>
        );
      return (
        <FormGroup>
          <InputLabel>
            {t("delivery_method", "Delivery Method")} ({distanceKm} km)
          </InputLabel>
          <DeliveryCard>
            {deliveryOptions.map((opt, idx) => (
              <DeliveryOptionRow
                key={idx}
                $selected={selectedDeliveryIndex === idx}
                onClick={() => setSelectedDeliveryIndex(idx)}
              >
                <OptionLeft>
                  <OptionIcon>
                    {opt.type === "pickup" ? <FaUtensils /> : <FaMotorcycle />}
                  </OptionIcon>
                  <OptionText>
                    <OptionTitle>{opt.name}</OptionTitle>
                    <OptionDesc>{opt.estimatedTime}</OptionDesc>
                  </OptionText>
                </OptionLeft>
                <OptionPrice>
                  {opt.price === 0
                    ? t("free", "Free")
                    : `${opt.price} ${t("dzd")}`}
                </OptionPrice>
              </DeliveryOptionRow>
            ))}
          </DeliveryCard>
        </FormGroup>
      );
    }
    if (shopDomain === "global") {
      return (
        <>
          <AddressesDropDown
            target="partners"
            onChooseAddress={handleAddressChange}
          />
          {calcLoading && (
            <div style={{ padding: "1rem", textAlign: "center" }}>
              <Loader fullscreen={false} />
            </div>
          )}
          {calcError && (
            <DeliveryCard $error>
              <ErrorBanner>
                <FaTimes /> {calcError.message}
              </ErrorBanner>
            </DeliveryCard>
          )}
          {deliveryOptions.length > 0 && (
            <DeliveryCard>
              <p
                style={{
                  color: "#aaa",
                  fontSize: "0.8rem",
                  marginBottom: "0.5rem",
                }}
              >
                {t("select_shipping_method", "Select Shipping")}
              </p>
              {deliveryOptions.map((opt, idx) => (
                <DeliveryOptionRow
                  key={idx}
                  $selected={selectedDeliveryIndex === idx}
                  onClick={() => setSelectedDeliveryIndex(idx)}
                >
                  <OptionLeft>
                    {opt.type === "NATIONAL" ? (
                      <FaGlobeAfrica size={14} />
                    ) : (
                      <FaMotorcycle size={14} />
                    )}
                    <OptionText>
                      <OptionTitle>{opt.name}</OptionTitle>
                      <OptionDesc>{opt.estimatedTime}</OptionDesc>
                    </OptionText>
                  </OptionLeft>
                  <OptionPrice>
                    {opt.price} {t("dzd")}
                  </OptionPrice>
                </DeliveryOptionRow>
              ))}
            </DeliveryCard>
          )}
        </>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (isSubmitting === "submitting")
      return (
        <StatusContainer>
          <Loader fullscreen={false} />
        </StatusContainer>
      );
    if (isSubmitting === "error")
      return (
        <StatusContainer>
          <StatusTitle>❌ {t("order_error_title")}</StatusTitle>
          <StatusMessage>{t("order_error_message")}</StatusMessage>
        </StatusContainer>
      );

    return (
      <FormWrapper onSubmit={handleSubmit}>
        <Column>
          {items.map((item) => (
            <CartItem key={item.dish ? item.dish._id : item.variantId}>
              <ItemInfo>
                <ItemName>{item.dish ? item.dish.name : item.title}</ItemName>
                {shopDomain === "global" && (
                  <ItemVariant>
                    Color: {item.color}, Size: {item.size}
                  </ItemVariant>
                )}
                <ItemPrice>
                  {parseInt(
                    item.dish ? item.dish.sellingPrice : item.sellingPrice,
                  )}{" "}
                  {t("dzd")}
                </ItemPrice>
              </ItemInfo>
              <QuantityControl>
                <QuantityButton
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(
                      item.dish ? item.dish._id : item.variantId,
                      item.quantity - 1,
                    )
                  }
                >
                  −
                </QuantityButton>
                <span style={{ color: "white" }}>{item.quantity}</span>
                <QuantityButton
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(
                      item.dish ? item.dish._id : item.variantId,
                      item.quantity + 1,
                    )
                  }
                >
                  +
                </QuantityButton>
              </QuantityControl>
            </CartItem>
          ))}
          <FormGroup style={{ marginTop: "auto" }}>
            <InputLabel>Preparation Note (Optional)</InputLabel>
            <TextArea value={note} onChange={(e) => setNote(e.target.value)} />
          </FormGroup>
        </Column>
        <Column>
          <FormGroup>
            <InputLabel>Full Name</InputLabel>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>Phone Number</InputLabel>
            <Input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </FormGroup>
          {renderDeliverySection()}
          <TotalContainer>
            <TotalLabel>Total</TotalLabel>
            <TotalValue>
              {finalTotal} {t("dzd")}
            </TotalValue>
          </TotalContainer>
          <SubmitButton
            type="submit"
            disabled={
              isSubmitting ||
              calcError ||
              (!isDineIn && !isCalculated && shopDomain !== "global")
            }
          >
            {isSubmitting === "submitting" ? "Placing Order..." : "Place Order"}
          </SubmitButton>
        </Column>
      </FormWrapper>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            ref={modalRef}
            onMouseMove={handleMouseMove}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <ContentRelative>
              <CartHeader>
                <CartTitle>{t("your_order")}</CartTitle>
                <CloseButton onClick={handleClose}>&times;</CloseButton>
              </CartHeader>
              {renderContent()}
            </ContentRelative>
          </ModalContent>
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default Cart;
