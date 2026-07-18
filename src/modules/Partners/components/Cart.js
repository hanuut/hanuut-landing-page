import React, { useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import { light } from "../../../config/Themes";
import CartIcon from "../../../assets/icons/cart.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCart,
  selectIsCartOpen,
  openCart,
  closeCart,
  updateCartQuantity,
} from "../../Cart/state/reducers";
import { ActionButton } from "../../../components/ActionButton";
import CartElementsGrid from "../../Cart/components/CartElementsGrid";
import AddressesDropDown from "../../../components/AddressesDropDown";
import { useTranslation } from "react-i18next";
import {
  fetchImage,
  selectSelectedShopImage,
} from "../../Images/state/reducers";
import { getImageUrl } from "../../../utils/imageUtils";
import { getImage } from "../../Images/services/imageServices";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../components/Loader";
import {
  FaTimes,
  FaLocationArrow,
  FaUtensils,
  FaMotorcycle,
  FaGlobeAfrica,
  FaBoxOpen,
  FaEdit,
  FaExpand,
  FaShieldAlt,
} from "react-icons/fa";
import {
  detectUserLocation,
  setManualLocation,
  selectLocation,
} from "../../Location/state/reducers";
import useDeliveryCalculator from "../../../hooks/useDeliveryCalculator";
import { retrieveFile } from "../../PodStudio/utils/indexedDbHelper";
import {
  getFittedPrintZoneRatios,
  getGarmentDimensions,
} from "../../PodStudio/hooks/usePrintableArea";
import PodMockupPreview from "../../PodStudio/components/Workspace/PodMockupPreview";

// Swiper.js Imports (Reused from MyHanuutAppCarousel)
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

// ============================================================================
// STYLED COMPONENTS (NATIVELY COMPLIANT WITH OUR PREMIUM THEME TOKENS)
// ============================================================================

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
    ${(props) => (props.$error ? "#EF4444" : "rgba(255, 255, 255, 0.05)")};
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
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;
`;

const LightboxContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  justify-content: center;
  align-items: center;
`;

const LightboxPreviewsRow = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const GrowableImageWrapper = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  overflow: hidden;
  background: #e5e5e5;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: zoom-in;
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const MiniWorkspace = styled.div`
  position: relative;
  width: 54px;
  height: 54px;
  background-color: #0c0c0e;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MiniBaseShirt = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  z-index: 1;
`;

const DynamicMiniPrintArea = styled.div`
  position: absolute;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;

  /* Precision positioning and sizing based on getFittedPrintZoneRatios output */
  top: ${(props) => props.$top}%;
  left: ${(props) => props.$left}%;
  width: ${(props) => props.$width}%;
  height: ${(props) => props.$height}%;
`;

const MiniDesign = styled.img`
  position: absolute;
  transform: translate(-50%, -50%);
  object-fit: contain;
`;

const ZoomOverlayIcon = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.6rem;
  padding: 2px;
  border-radius: 4px;
  z-index: 5;
`;

const LbWorkspace = styled.div`
  position: relative;
  width: 380px;
  height: 380px;
  background: #0c0c0e;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);

  @media (max-width: 500px) {
    width: 280px;
    height: 280px;
  }
`;

const DynamicLbPrintArea = styled.div`
  position: absolute;
  border: 1px dashed rgba(57, 161, 112, 0.4);
  z-index: 2;
  overflow: hidden;
  pointer-events: none;

  /* Precision positioning and sizing */
  top: ${(props) => props.$top}%;
  left: ${(props) => props.$left}%;
  width: ${(props) => props.$width}%;
  height: ${(props) => props.$height}%;
`;

const LightboxActions = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  z-index: 10;
  pointer-events: auto;
`;

const CustomItemEditBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
  width: fit-content;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.primaryColor};
    color: #000;
    border-color: transparent;
  }
`;

const LbButton = styled.button`
  padding: 0.8rem 1.8rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-family: "Tajawal", sans-serif;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$primary
      ? `
    background: ${props.theme.primaryColor};
    color: #000;
  `
      : `
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `}
`;

// ============================================================================
// NEW STYLED COMPONENTS FOR CONFIRMATION & POLICY MODALS
// ============================================================================

const ConfirmModalBackdrop = styled(ModalBackdrop)`
  z-index: 1400; /* Must sit on top of Cart modal */
`;

const ConfirmModalContent = styled(ModalContent)`
  max-width: 600px;
  z-index: 1450;
  background-color: #0c0c0e;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.25rem;
`;

const ConfirmCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  direction: ltr; /* Force LTR for layout alignment consistency */
`;

const ConfirmDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;

  .name {
    font-size: 1rem;
    font-weight: 800;
    color: white;
    font-family: "Tajawal", sans-serif;
    margin: 0;
  }
  .variant {
    font-size: 0.8rem;
    color: #a1a1aa;
    margin: 0;
  }
  .price-details {
    font-size: 0.78rem;
    color: #39a170;
    margin: 2px 0 0 0;
    line-height: 1.4;
  }
  .total-price {
    font-size: 1.1rem;
    font-weight: 800;
    color: #f07a48;
    margin: 4px 0 0 0;
  }
`;

const PolicyCheckboxRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(240, 122, 72, 0.04);
  border: 1px solid rgba(240, 122, 72, 0.15);
  padding: 1rem;
  border-radius: 12px;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #f07a48;
    cursor: pointer;
    flex-shrink: 0;
    margin-top: 2px;
  }

  label {
    font-size: 0.85rem;
    color: #e4e4e7;
    line-height: 1.5;
    font-family: "Cairo", sans-serif;

    button.policy-link {
      background: none;
      border: none;
      color: #f07a48;
      font-weight: 800;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
      font-family: inherit;
      margin: 0 4px;
    }
  }
`;

const PolicyModalBackdrop = styled(ModalBackdrop)`
  z-index: 1500; /* Sits on top of Confirmation Modal */
`;

const PolicyModalContent = styled(ModalContent)`
  max-width: 650px;
  z-index: 1550;
  background-color: #111214;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 2.5rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const PolicyScrollBlock = styled.div`
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 10px;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }
`;

const PolicySection = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 800;
    color: #f07a48;
    margin: 0 0 0.5rem 0;
    font-family: "Tajawal", sans-serif;
  }
  p {
    font-size: 0.88rem;
    color: #a1a1aa;
    line-height: 1.6;
    margin: 0;
    font-family: "Cairo", sans-serif;
  }
`;

const NavigationRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

const WizardBtn = styled.button`
  flex: 1;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;
  border: none;

  ${(props) =>
    props.$primary
      ? `
    background: ${props.theme.primaryColor || "#F07A48"};
    color: #000;
    &:hover { transform: translateY(-2px); filter: brightness(1.1); }
  `
      : `
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255,255,255,0.08);
    &:hover { background: rgba(255, 255, 255, 0.1); }
  `}

  &:disabled {
    background: #27272a;
    color: #71717a;
    border-color: transparent;
    cursor: not-allowed;
    transform: none;
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
  onEditCustomItem,
  orderSuccessData,
  onClearSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isCartOpen = useSelector(selectIsCartOpen);
  const locationState = useSelector(selectLocation);
  const isArabic = i18n.language === "ar";

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [note, setNote] = useState("");

  const [fulfillmentType, setFulfillmentType] = useState("home");
  const [selectedDeliveryIndex, setSelectedDeliveryIndex] = useState(0);
  const [selectedStopDeskOffice, setSelectedStopDeskOffice] = useState("");
  const [zoomedItem, setZoomedItem] = useState(null);
  const [manualAddressLine, setManualAddressLine] = useState("");

  const [zoomFrontUrl, setZoomFrontUrl] = useState(null);
  const [zoomBackUrl, setZoomBackUrl] = useState(null);

  // --- CONFIRMATION & POLICY MODAL STATE HOOKS ---
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyConsent, setPolicyConsent] = useState(false);
  const [pendingOrderDetails, setPendingOrderDetails] = useState(null);

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

  const itemsTotal = useMemo(
    () =>
      cleanItems.reduce((sum, item) => {
        return sum + parseInt(item.sellingPrice, 10) * item.quantity;
      }, 0),
    [cleanItems],
  );

  const shouldCalculate = isCartOpen && cleanItems.length > 0;
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

    const hasGps =
      typeof locationState.lat === "number" &&
      typeof locationState.lng === "number";

    const orderDetails = {
      customerName,
      customerPhone,
      note: finalNote,
      tableNumber: isDineIn ? tableNumber : null,
      gpsLocation: hasGps
        ? { lat: locationState.lat, lng: locationState.lng }
        : undefined,
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
      healedProducts: cleanItems,
    };

    // Intercept checkout and prompt the mandatory Design Policy confirmation overlay
    setPendingOrderDetails(orderDetails);
    setPolicyConsent(false);
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = () => {
    if (!policyConsent || !pendingOrderDetails) return;
    setShowConfirmModal(false);
    onSubmitOrder(pendingOrderDetails);
  };

  function renderDeliverySection() {
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
                  {opt.price === 0 ? "Free" : `${opt.price} ${t("zd")}`}
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
                        {opt.price} {t("zd")}
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
  }

  function renderContent() {
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
                {shopDomain === "global" && item.podCustomization ? (
                  <MiniMockupPreview
                    item={item}
                    onClick={() => {
                      setZoomedItem(item);
                    }}
                  />
                ) : (
                  shopDomain === "global" &&
                  item.imageId && (
                    <GrowableImageWrapper
                      onClick={() =>
                        setZoomedItem({ singleUrl: getImageUrl(item.imageId) })
                      }
                    >
                      <ZoomOverlayIcon>
                        <FaExpand />
                      </ZoomOverlayIcon>
                      <img
                        src={getImageUrl(item.imageId)}
                        alt={item.title || item.product?.name}
                      />
                    </GrowableImageWrapper>
                  )
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
                      {item.podCustomization && (
                        <span
                          style={{
                            display: "block",
                            color: "#39A170",
                            fontWeight: "bold",
                            marginTop: "4px",
                            fontSize: "0.75rem",
                          }}
                        >
                          ✨ Custom Print ({item.podCustomization.printSide})
                        </span>
                      )}
                      {item.podCustomization && onEditCustomItem && (
                        <CustomItemEditBtn
                          type="button"
                          onClick={() => onEditCustomItem(item)}
                        >
                          <FaEdit /> Edit Design
                        </CustomItemEditBtn>
                      )}
                    </ItemVariant>
                  )}

                  {/* PRINT SIZING & ITEM PRICING BREAKDOWN DETAILS UNDER TOTAL */}
                  {item.podCustomization ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        marginTop: "4px",
                      }}
                    >
                      <span style={{ fontSize: "0.8rem", color: "#888" }}>
                        {t("pod_studio_apparel_base")}:{" "}
                        {parseInt(item.podCustomization.baseGarmentCost || 0)}{" "}
                        {t("zd")}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#39A170" }}>
                        {t("pod_studio_custom_print")}: +
                        {parseInt(item.podCustomization.printCost || 0)}{" "}
                        {t("zd")}
                      </span>
                    </div>
                  ) : null}

                  <ItemPrice style={{ marginTop: "6px" }}>
                    {parseInt(item.sellingPrice)} {t("zd")}
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
              {finalTotal} {t("zd")}
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
  }

  function renderLightboxContent() {
    if (!zoomedItem) return null;

    if (zoomedItem.singleUrl) {
      return (
        <LightboxContent onClick={(e) => e.stopPropagation()}>
          <LbWorkspace>
            <img
              src={zoomedItem.singleUrl}
              alt="Zoomed view"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </LbWorkspace>
          <LightboxActions>
            <LbButton onClick={() => setZoomedItem(null)}>
              <FaTimes /> {t("back_to_cart", "Back to Cart")}
            </LbButton>
          </LightboxActions>
        </LightboxContent>
      );
    }

    return (
      <LightboxComponent
        item={zoomedItem}
        onClose={() => setZoomedItem(null)}
        onEdit={onEditCustomItem}
      />
    );
  }

  const MiniMockupPreview = ({ item, onClick }) => {
    const custom = item?.podCustomization;
    if (!custom) return null;

    return (
      <GrowableImageWrapper onClick={onClick}>
        <ZoomOverlayIcon>
          <FaExpand />
        </ZoomOverlayIcon>
        {custom.front && (
          <PodMockupPreview
            item={item}
            side="front"
            width="54px"
            height="54px"
            borderRadius="10px"
          />
        )}
        {custom.back && (
          <PodMockupPreview
            item={item}
            side="back"
            width="54px"
            height="54px"
            borderRadius="10px"
          />
        )}
      </GrowableImageWrapper>
    );
  };

  function LightboxComponent({ item, onClose, onEdit }) {
    const { t } = useTranslation();
    const custom = item?.podCustomization;
    if (!custom) return null;

    return (
      <LightboxContent onClick={(e) => e.stopPropagation()}>
        <LightboxPreviewsRow>
          {custom.front && (
            <PodMockupPreview
              item={item}
              side="front"
              width="380px"
              height="380px"
              borderRadius="24px"
            />
          )}
          {custom.back && (
            <PodMockupPreview
              item={item}
              side="back"
              width="380px"
              height="380px"
              borderRadius="24px"
            />
          )}
        </LightboxPreviewsRow>
        <LightboxActions>
          {onEdit && (
            <LbButton
              $primary
              onClick={() => {
                onEdit(item);
                onClose();
              }}
            >
              <FaEdit /> {t("edit_design", "Edit Design")}
            </LbButton>
          )}
          <LbButton onClick={onClose}>
            <FaTimes /> {t("back_to_cart", "Back to Cart")}
          </LbButton>
        </LightboxActions>
      </LightboxContent>
    );
  }

  // --- REUSED INFINITE SWIPER CAROUSEL ELEMENT RENDERER ---
  const renderConfirmationItemCard = (item) => {
    const custom = item.podCustomization;
    return (
      <ConfirmCard key={item.variantId}>
        {custom ? (
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            {custom.front && (
              <PodMockupPreview
                item={item}
                side="front"
                width="110px"
                height="110px"
                borderRadius="14px"
              />
            )}
            {custom.back && (
              <PodMockupPreview
                item={item}
                side="back"
                width="110px"
                height="110px"
                borderRadius="14px"
              />
            )}
          </div>
        ) : (
          item.imageId && (
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.05)",
                flexShrink: 0,
              }}
            >
              <img
                src={getImageUrl(item.imageId)}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )
        )}

        <ConfirmDetails>
          <span className="name">{item.title || item.product?.name}</span>
          <span className="variant">
            {t("color_prefix")}: {item.color} / {t("size_prefix")}: {item.size}
          </span>
          <span className="variant">
            {t("pod_studio_quantity_label")}: {item.quantity}
          </span>

          {custom ? (
            <div className="price-details">
              <div>
                {t("pod_studio_apparel_base")}:{" "}
                {parseInt(custom.baseGarmentCost || 0)} {t("zd")}
              </div>
              <div>
                {t("pod_studio_custom_print")}: +
                {parseInt(custom.printCost || 0)} {t("zd")}
              </div>
            </div>
          ) : (
            <div className="price-details">
              {t("pod_studio_unit_price")}: {parseInt(item.sellingPrice)}{" "}
              {t("zd")}
            </div>
          )}

          <span className="total-price">
            {t("pod_studio_total_price")}:{" "}
            {parseInt(item.sellingPrice) * item.quantity} {t("zd")}
          </span>
        </ConfirmDetails>
      </ConfirmCard>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <ModalContent
              className="hanuut-cart-modal"
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
        {zoomedItem && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedItem(null)}
          >
            {renderLightboxContent()}
          </LightboxOverlay>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* MANDATORY ORDER CONFIRMATION MODAL (System-Interception Layer) */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmModal(false)}
          >
            <ConfirmModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
            >
              <CartHeader style={{ marginBottom: "1rem" }}>
                <CartTitle>
                  {t("pod_studio_confirm_order_title", "Confirm your order")}
                </CartTitle>
                <CloseButton onClick={() => setShowConfirmModal(false)}>
                  &times;
                </CloseButton>
              </CartHeader>

              <p
                style={{
                  color: "#a1a1aa",
                  fontSize: "0.92rem",
                  lineHeight: "1.5",
                  margin: 0,
                  fontFamily: "Cairo, sans-serif",
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {t(
                  "pod_studio_confirm_order_desc",
                  "Before we start producing your products, please verify your order and confirm that your uploaded designs respect our policies.",
                )}
              </p>

              {/* Renders dynamic Infinte Autoplay Swiper Carousel if multiple items exist */}
              <div style={{ width: "100%", overflow: "hidden" }}>
                {cleanItems.length > 1 ? (
                  <Swiper
                    modules={[Autoplay]}
                    loop={true}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    speed={1200}
                    slidesPerView={1}
                    spaceBetween={20}
                  >
                    {cleanItems.map((item) => (
                      <SwiperSlide key={item.variantId}>
                        {renderConfirmationItemCard(item)}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  cleanItems.length === 1 &&
                  renderConfirmationItemCard(cleanItems[0])
                )}
              </div>

              {/* Mandatory Policy Consent Box */}
              <PolicyCheckboxRow $isArabic={isArabic}>
                <input
                  type="checkbox"
                  id="policy-consent"
                  checked={policyConsent}
                  onChange={(e) => setPolicyConsent(e.target.checked)}
                />
                <label htmlFor="policy-consent">
                  {t(
                    "pod_studio_design_policy_agreement",
                    "I confirm that every uploaded design follows AURAS LAB Design Policy.",
                  )}
                  <button
                    type="button"
                    className="policy-link"
                    onClick={() => setShowPolicyModal(true)}
                  >
                    ({t("pod_studio_read_design_policy", "Read Design Policy")})
                  </button>
                </label>
              </PolicyCheckboxRow>

              <NavigationRow style={{ direction: isArabic ? "rtl" : "ltr" }}>
                <WizardBtn
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                >
                  {t("pod_studio_cancel", "Cancel")}
                </WizardBtn>
                <WizardBtn
                  type="button"
                  $primary
                  disabled={!policyConsent}
                  onClick={handleConfirmOrder}
                >
                  {t("pod_studio_create_order", "Create Order")}
                </WizardBtn>
              </NavigationRow>
            </ConfirmModalContent>
          </ConfirmModalBackdrop>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* D2C SUB-MODAL DESIGN POLICY (Intellectual Property & Content Guidelines) */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showPolicyModal && (
          <PolicyModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPolicyModal(false)}
          >
            <PolicyModalContent
              $isArabic={isArabic}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <CartHeader style={{ marginBottom: "0.5rem" }}>
                <CartTitle style={{ fontSize: "1.3rem" }}>
                  {t(
                    "pod_studio_policy_title",
                    "AURAS LAB | Design Policy & Guidelines",
                  )}
                </CartTitle>
                <CloseButton onClick={() => setShowPolicyModal(false)}>
                  &times;
                </CloseButton>
              </CartHeader>

              <PolicyScrollBlock>
                <PolicySection>
                  <h4>{t("pod_studio_policy_sec1_title")}</h4>
                  <p>{t("pod_studio_policy_sec1_text")}</p>
                </PolicySection>

                <PolicySection>
                  <h4>{t("pod_studio_policy_sec2_title")}</h4>
                  <p>{t("pod_studio_policy_sec2_text")}</p>
                </PolicySection>

                <PolicySection>
                  <h4>{t("pod_studio_policy_sec3_title")}</h4>
                  <p>{t("pod_studio_policy_sec3_text")}</p>
                </PolicySection>

                <PolicySection>
                  <h4>{t("pod_studio_policy_sec4_title")}</h4>
                  <p>{t("pod_studio_policy_sec4_text")}</p>
                </PolicySection>

                <PolicySection>
                  <h4>{t("pod_studio_policy_sec5_title")}</h4>
                  <p>{t("pod_studio_policy_sec5_text")}</p>
                </PolicySection>

                <PolicySection>
                  <h4>{t("pod_studio_policy_sec6_title")}</h4>
                  <p>{t("pod_studio_policy_sec6_text")}</p>
                </PolicySection>

                <PolicySection>
                  <h4>{t("pod_studio_policy_sec7_title")}</h4>
                  <p>{t("pod_studio_policy_sec7_text")}</p>
                </PolicySection>

                <PolicySection>
                  <h4>{t("pod_studio_policy_sec8_title")}</h4>
                  <p>{t("pod_studio_policy_sec8_text")}</p>
                </PolicySection>
              </PolicyScrollBlock>

              <WizardBtn
                type="button"
                $primary
                onClick={() => setShowPolicyModal(false)}
                style={{ marginTop: "2rem", width: "100%" }}
              >
                {isArabic ? "موافق" : "Close"}
              </WizardBtn>
            </PolicyModalContent>
          </PolicyModalBackdrop>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
