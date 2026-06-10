import React, { useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

// --- Redux & Hooks ---
import { closeCart, selectIsCartOpen, updateCartQuantity } from "../../Cart/state/reducers";
import {
  detectUserLocation,
  setManualLocation,
  selectLocation,
} from "../../Location/state/reducers";
import useDeliveryCalculator from "../../../hooks/useDeliveryCalculator";
import { getImageUrl } from "../../../utils/imageUtils";

// --- Components ---
import Loader from "../../../components/Loader";
import AddressesDropDown from "../../../components/AddressesDropDown";
import {
  FaTimes,
  FaLocationArrow,
  FaUtensils,
  FaMotorcycle,
  FaGlobeAfrica,
  FaBoxOpen,
} from "react-icons/fa";

// --- Styled Components ---
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1300;
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
  border-radius: 24px;
  padding: 2.5rem;
  max-height: 90vh;
  overflow-y: auto;
  color: #ffffff;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-height: 95vh;
  }
`;

const FormWrapper = styled.form`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 3rem;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column-reverse;
    gap: 2rem;
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
  font-weight: 800;
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
  gap: 1rem;
`;

const GrowableImageWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: zoom-in;
  flex-shrink: 0;
  transition: transform 0.2s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const ItemTextDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const ItemVariant = styled.p`
  font-size: 0.8rem;
  color: #a1a1aa;
  margin: 4px 0 0 0;
`;

const ItemPrice = styled.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme.primaryColor};
  font-weight: 700;
  margin: 4px 0 0 0;
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
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

const SegmentedControl = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 14px;
  margin-bottom: 0.5rem;
`;

const SegmentButton = styled.button`
  background: ${(props) =>
    props.$active ? props.theme.primaryColor : "transparent"};
  color: ${(props) => (props.$active ? "#000" : "white")};
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
`;

const DeliveryCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid
    ${(props) => (props.$error ? "#EF4444" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 16px;
  padding: 1rem;
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
  &:last-child {
    margin-bottom: 0;
  }
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

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);
  }
`;

const Cart = ({
  items,
  onUpdateQuantity,
  onSubmitOrder,
  isSubmitting,
  shopDomain,
  shopId,
  orderErrorMsg,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsCartOpen);
  const locationState = useSelector(selectLocation);
  const isArabic = i18n.language === "ar";

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [note, setNote] = useState("");
  
  const [fulfillmentType, setFulfillmentType] = useState("home");
  const [selectedDeliveryIndex, setSelectedDeliveryIndex] = useState(0);
  const [selectedStopDeskOffice, setSelectedStopDeskOffice] = useState("");
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);
  const [manualAddressLine, setManualAddressLine] = useState("");

  // Clean corrupted items safely
  const cleanItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    return items.filter(
      (item) =>
        item &&
        item.variantId &&
        (item.title || item.product?.name || item.dish?.name) &&
        !isNaN(item.sellingPrice) &&
        item.sellingPrice !== null &&
        item.sellingPrice !== undefined &&
        !isNaN(item.quantity) &&
        item.quantity > 0,
    );
  }, [items]);

  useEffect(() => {
    if (items && cleanItems.length !== items.length) {
      items.forEach((item) => {
        const isValid = cleanItems.some((c) => c.variantId === item.variantId);
        if (!isValid && item.variantId) {
          dispatch(
            updateCartQuantity({ variantId: item.variantId, quantity: 0 }),
          );
        }
      });
    }
  }, [items, cleanItems, dispatch]);

  const itemsTotal = useMemo(
    () =>
      cleanItems.reduce((sum, item) => {
        const price = item.dish ? item.dish.sellingPrice : item.sellingPrice;
        return sum + parseInt(price, 10) * item.quantity;
      }, 0),
    [cleanItems],
  );

  const shouldCalculate = isOpen && cleanItems.length > 0;
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

  const filteredDeliveryOptions = useMemo(() => {
    if (shopDomain !== "global") return deliveryOptions;
    return deliveryOptions.filter((opt) => {
      if (fulfillmentType === "home") return opt.type === "NATIONAL_HOME";
      return opt.type === "STOP_DESK";
    });
  }, [deliveryOptions, shopDomain, fulfillmentType]);

  useEffect(() => {
    if (filteredDeliveryOptions.length > 0) setSelectedDeliveryIndex(0);
  }, [filteredDeliveryOptions]);

  const selectedDeliveryOption = filteredDeliveryOptions[selectedDeliveryIndex];
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
      setManualAddressLine(addr.addressLine || "");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const finalNote =
      selectedDeliveryOption?.type === "STOP_DESK"
        ? `[STOP DESK OFFICE: ${selectedStopDeskOffice}] ${note}`
        : note;

    const hasGps = typeof locationState.lat === "number" && typeof locationState.lng === "number";

    const orderDetails = {
      customerName,
      customerPhone,
      note: finalNote,
      tableNumber: isDineIn ? tableNumber : null,
      gpsLocation: hasGps ? { lat: locationState.lat, lng: locationState.lng } : undefined,
      deliveryOption: isDineIn
        ? { type: "dine_in", price: 0 }
        : selectedDeliveryOption,
      address: isDineIn
        ? null
        : {
            wilaya: locationState.wilayaName,
            commune: locationState.communeName,
            addressLine: manualAddressLine || "Home Delivery",
          },
    };
    onSubmitOrder(orderDetails);
  };

  const renderDeliverySection = () => {
    if (shopDomain === "food") {
      if (locationState.status === "idle" || locationState.status === "error") {
        return (
          <FormGroup>
            <InputLabel>{t("delivery_destination_label")}</InputLabel>
            <LocationTriggerBtn
              onClick={handleLocationRequest}
              disabled={locationState.status === "loading"}
            >
              {locationState.status === "loading" ? (
                <Loader fullscreen={false} />
              ) : (
                <FaLocationArrow />
              )}
              <span>{t("locate_me")}</span>
            </LocationTriggerBtn>
            {locationState.error && (
              <ErrorBanner>
                <FaTimes /> {t("location_error")}
              </ErrorBanner>
            )}
          </FormGroup>
        );
      }
      if (calcLoading) {
        return (
          <DeliveryCard>
            <div style={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
              <Loader fullscreen={false} />
            </div>
          </DeliveryCard>
        );
      }
      if (calcError) {
        return (
          <DeliveryCard $error>
            <ErrorBanner>
              <FaTimes /> {calcError.message}
            </ErrorBanner>
          </DeliveryCard>
        );
      }
      if (isDineIn) {
        return (
          <>
            <DineInBanner>
              <FaUtensils style={{ marginBottom: "5px" }} />
              <br />
              {t("you_are_at_shop")}
            </DineInBanner>
            <FormGroup>
              <InputLabel>{t("form_table_number")}</InputLabel>
              <Input
                type="text"
                placeholder="Ex: 5"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </FormGroup>
          </>
        );
      }
      return (
        <FormGroup>
          <InputLabel>{t("delivery_company_label")}</InputLabel>
          <DeliveryCard>
            {deliveryOptions.map((opt, idx) => (
              <DeliveryOptionRow
                key={idx}
                $selected={selectedDeliveryIndex === idx}
                onClick={() => setSelectedDeliveryIndex(idx)}
              >
                <OptionLeft>
                  <OptionIcon>
                    <FaMotorcycle />
                  </OptionIcon>
                  <OptionText>
                    <OptionTitle>{opt.name}</OptionTitle>
                    <OptionDesc>{opt.estimatedTime}</OptionDesc>
                  </OptionText>
                </OptionLeft>
                <OptionPrice>
                  {opt.price === 0 ? "Free" : `${opt.price} ${t("dzd")}`}
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

          {deliveryOptions.length > 0 && !calcLoading && (
            <div style={{ marginTop: "1.5rem" }}>
              <InputLabel style={{ marginBottom: "0.5rem" }}>
                {t("delivery_destination_label")}
              </InputLabel>
              <SegmentedControl>
                <SegmentButton
                  type="button"
                  $active={fulfillmentType === "home"}
                  onClick={() => setFulfillmentType("home")}
                >
                  {t("destination_home")}
                </SegmentButton>
                <SegmentButton
                  type="button"
                  $active={fulfillmentType === "stop_desk"}
                  onClick={() => setFulfillmentType("stop_desk")}
                >
                  {t("destination_stop_desk")}
                </SegmentButton>
              </SegmentedControl>

              {filteredDeliveryOptions.length > 0 ? (
                <DeliveryCard>
                  <InputLabel
                    style={{ marginBottom: "0.5rem", fontSize: "0.75rem" }}
                  >
                    {t("delivery_company_label")}
                  </InputLabel>
                  {filteredDeliveryOptions.map((opt, idx) => (
                    <DeliveryOptionRow
                      key={idx}
                      $selected={selectedDeliveryIndex === idx}
                      onClick={() => setSelectedDeliveryIndex(idx)}
                    >
                      <OptionLeft>
                        {opt.type === "STOP_DESK" ? (
                          <FaBoxOpen />
                        ) : (
                          <FaGlobeAfrica />
                        )}
                        <OptionText>
                          <OptionTitle>
                            {opt.company} - {opt.name}
                          </OptionTitle>
                          <OptionDesc>{opt.estimatedTime}</OptionDesc>
                        </OptionText>
                      </OptionLeft>
                      <OptionPrice>
                        {opt.price} {t("dzd")}
                      </OptionPrice>
                    </DeliveryOptionRow>
                  ))}
                </DeliveryCard>
              ) : (
                <ErrorBanner style={{ marginTop: "0.5rem" }}>
                  <FaTimes /> {t("delivery_unavailable")}
                </ErrorBanner>
              )}

              {selectedDeliveryOption?.type === "STOP_DESK" && (
                <FormGroup style={{ marginTop: "1rem" }}>
                  <InputLabel>{t("select_yalidine_desk")}</InputLabel>
                  <Input
                    type="text"
                    placeholder={t("agency_desk_placeholder")}
                    value={selectedStopDeskOffice}
                    onChange={(e) => setSelectedStopDeskOffice(e.target.value)}
                    required
                  />
                </FormGroup>
              )}
            </div>
          )}
        </>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (isSubmitting === "submitting") {
      return (
        <StatusContainer>
          <Loader fullscreen={false} />
        </StatusContainer>
      );
    }
    if (isSubmitting === "error") {
      return (
        <StatusContainer>
          <StatusTitle>❌ {t("order_error_title")}</StatusTitle>
          <StatusMessage style={{ color: "#ef4444" }}>
            {orderErrorMsg || t("order_error_message")}
          </StatusMessage>
        </StatusContainer>
      );
    }

    return (
      <FormWrapper onSubmit={handleSubmit}>
        <Column>
          {cleanItems.map((item) => (
            <CartItem key={item.dish ? item.dish._id : item.variantId}>
              <ItemInfo>
                {shopDomain === "global" && item.imageId && (
                  <GrowableImageWrapper
                    onClick={() => setZoomedImageUrl(getImageUrl(item.imageId))}
                  >
                    <img
                      src={getImageUrl(item.imageId)}
                      alt={item.title || item.product?.name}
                    />
                  </GrowableImageWrapper>
                )}
                <ItemTextDetails>
                  <ItemName>
                    {item.dish
                      ? item.dish.name
                      : item.title || item.product?.name}
                  </ItemName>
                  {shopDomain === "global" && (
                    <ItemVariant>
                      {t("color_prefix")}: {item.color}, {t("size_prefix")}:{" "}
                      {item.size}
                    </ItemVariant>
                  )}
                  <ItemPrice>
                    {parseInt(
                      item.dish ? item.dish.sellingPrice : item.sellingPrice,
                    )}{" "}
                    {t("dzd")}
                  </ItemPrice>
                </ItemTextDetails>
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
                <span>{item.quantity}</span>
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
            <InputLabel>{t("form_preparation_note")}</InputLabel>
            <TextArea value={note} onChange={(e) => setNote(e.target.value)} />
          </FormGroup>
        </Column>
        <Column>
          <FormGroup>
            <InputLabel>{t("form_full_name")}</InputLabel>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <InputLabel>{t("form_phone_number")}</InputLabel>
            <Input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </FormGroup>
          {renderDeliverySection()}
          <TotalContainer>
            <TotalLabel>{t("total")}</TotalLabel>
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
            {isSubmitting === "submitting"
              ? t("placing_order")
              : t("place_order_button")}
          </SubmitButton>
        </Column>
      </FormWrapper>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <CartHeader>
                <CartTitle>{t("your_order")}</CartTitle>
                <CloseButton onClick={handleClose}>&times;</CloseButton>
              </CartHeader>
              {renderContent()}
            </ModalContent>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomedImageUrl && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImageUrl(null)}
          >
            <motion.img
              src={zoomedImageUrl}
              alt="Zoomed view"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;