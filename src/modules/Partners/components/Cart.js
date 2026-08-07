import React, { useEffect, useState, useMemo, useRef } from "react";
import styled, { css, keyframes } from "styled-components";
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
import { getImageUrl } from "../../../utils/imageUtils";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../../components/Loader";
import { useNavigate } from "react-router-dom";
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
  FaHistory,
  FaEye,
  FaTrashAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
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

// Swiper.js Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// ===========================================================================
// STYLED COMPONENTS
// ===========================================================================

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 1300;
`;

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  width: auto;
  display: flex;
  z-index: 1310;
  pointer-events: none;
  flex-direction: ${(props) => (props.$isArabic ? "row-reverse" : "row")};
  ${(props) => (props.$isArabic ? "left: 0;" : "right: 0;")}
`;

const MainCartPanel = styled(motion.div)`
  width: 380px;
  height: 100%;
  background-color: rgba(24, 24, 27, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: ${(props) =>
    props.$isArabic ? "none" : "1px solid rgba(255, 255, 255, 0.1)"};
  border-right: ${(props) =>
    props.$isArabic ? "1px solid rgba(255, 255, 255, 0.1)" : "none"};
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  pointer-events: auto;
  z-index: 1320;

  @media (max-width: 480px) {
    width: 100%;
    /* 🔴 MOBILE UX OVERHAUL: USE 100DVH TO ELIMINATE KEYBOARD/NAV CUTOFFS */
    height: 100dvh;
    padding: 1.25rem 1rem;
  }
`;

const FormPanel = styled(motion.div)`
  width: 380px;
  height: 100%;
  background-color: rgba(20, 20, 22, 0.98);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-left: ${(props) =>
    props.$isArabic ? "none" : "1px solid rgba(255, 255, 255, 0.08)"};
  border-right: ${(props) =>
    props.$isArabic ? "1px solid rgba(255, 255, 255, 0.08)" : "none"};
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: -15px 0 35px rgba(0, 0, 0, 0.6);
  color: #ffffff;
  pointer-events: auto;
  overflow-y: auto;
  z-index: 1315;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100dvh;
    z-index: 1330;
  }
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const ScrollableFormBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* 🔴 PREVENT KEYBOARD CUTOFF: Bottom spacing clearance */
  padding-bottom: calc(140px + env(safe-area-inset-bottom));

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.75rem;
  flex-shrink: 0;
`;

const CartTitle = styled.h2`
  font-size: 1.15rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  text-align: start;
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
  gap: 0.35rem;
  text-align: start;
  position: relative;
`;

const InputLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 10px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primaryColor};
  }
  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.05);
    color: #a1a1aa;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 10px;
  box-sizing: border-box;
  resize: vertical;
  min-height: 60px;
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
  border-radius: 10px;
  margin-bottom: 0.5rem;
`;

const SegmentButton = styled.button`
  background: ${(props) =>
    props.$active ? props.theme.primaryColor : "transparent"};
  color: ${(props) => (props.$active ? "#000" : "white")};
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
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
  padding: 0.75rem;
`;

const DeliveryOptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border-radius: 12px;
  background: ${(props) =>
    props.$selected ? "rgba(240, 122, 72, 0.15)" : "transparent"};
  border: 1px solid
    ${(props) => (props.$selected ? "#F07A48" : "rgba(255, 255, 255, 0.05)")};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.35rem;
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

const OptionText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
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

// 🔴 STICKY CONSOLE-SAFE BOTTOM FOOTER GROUP FOR MAXIMUM CONVERSION
const StickyMobileFooter = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #141416;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem 0;
  z-index: 100;
  box-shadow: 0 -15px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-sizing: border-box;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
`;

const TotalLabel = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const TotalValue = styled.p`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${(props) => props.theme.primaryColor};
  margin: 0;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 800;
  background-color: ${(props) => props.theme.primaryColor};
  color: #111;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  font-family: "Tajawal", sans-serif;
  box-sizing: border-box;

  &:hover {
    filter: brightness(1.15);
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

const HistorySection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #a1a1aa;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  &:hover {
    color: #fff;
  }
`;

const HistoryList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  overflow: hidden;
`;

const HistoryItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
`;

const HistoryText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: start;
  span.shop {
    font-weight: 700;
    color: white;
  }
  span.meta {
    font-size: 0.72rem;
    color: #a1a1aa;
  }
`;

const HistoryActions = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const HistoryButton = styled.button`
  background: ${(props) =>
    props.$primary ? props.theme.primaryColor : "rgba(255, 255, 255, 0.05)"};
  color: ${(props) => (props.$primary ? "#000" : "#ef4444")};
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.9;
  }
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

const LightboxActions = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  z-index: 10;
  pointer-events: auto;
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

const TrashAltIcon = () => <FaTrashAlt style={{ fontSize: "0.8rem" }} />;

const SummaryCardButton = styled.button`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
  pointer-events: auto;
  text-decoration: none;
  box-sizing: border-box;
  margin: 0;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    transform: translateY(-2px);
  }
`;

const ImageStackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  position: relative;
  flex-shrink: 0;
`;

const StackedImage = styled.img`
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  background-color: #1c1c1e;
  transition: transform 0.2s ease;

  transform: translate(
      ${(props) => props.$offsetX}px,
      ${(props) => props.$offsetY}px
    )
    rotate(${(props) => props.$rotation}deg);
  z-index: ${(props) => props.$zIndex};
`;

const SummaryCardText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-grow: 1;
  text-align: start;

  span.count {
    font-size: 0.85rem;
    color: #a1a1aa;
    font-weight: 700;
    font-family: "Tajawal", sans-serif;
  }

  span.total {
    font-size: 1.35rem;
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
    font-weight: 800;
    font-family: "Tajawal", sans-serif;
  }
`;

const HintArrow = styled.div`
  color: ${(props) => props.theme.primaryColor || "#F07A48"};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;

  ${SummaryCardButton}:hover & {
    transform: ${(props) =>
      props.$isArabic ? "translateX(-4px)" : "translateX(4px)"};
  }
`;

const PromoSection = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1rem;
`;

const PromoInput = styled(Input)`
  flex: 1;
`;

const PromoButton = styled.button`
  background: ${(props) =>
    props.$applied ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.05)"};
  color: ${(props) => (props.$applied ? "#ef4444" : "white")};
  border: 1px solid
    ${(props) => (props.$applied ? "#ef4444" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 10px;
  padding: 0.65rem 1.25rem;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  font-family: "Tajawal", sans-serif;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$applied ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.1)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PromoFeedback = styled.div`
  font-size: 0.8rem;
  margin-top: 0.25rem;
  text-align: start;
  font-weight: 600;
  color: ${(props) => (props.$isError ? "#ef4444" : "#39A170")};
`;

const PolicyConfirmModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  pointer-events: auto;
`;

const PolicyConfirmCard = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  background-color: #141416;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  max-h: 90vh;
  color: #fff;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const PolicyConfirmHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const PolicyConfirmBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PolicyConfirmFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.15);
`;

const PolicySwiperWrapper = styled.div`
  width: 100%;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const PolicySlideCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
`;

const PolicySlideImage = styled.div`
  width: 140px;
  height: 140px;
  background: #09090b;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 1.25rem;
  background: rgba(240, 122, 72, 0.04);
  border: 1px solid rgba(240, 122, 72, 0.12);
  border-radius: 16px;
  text-align: start;

  input[type="checkbox"] {
    accent-color: #f07a48;
    width: 18px;
    height: 18px;
    margin-top: 2px;
    cursor: pointer;
  }

  label {
    font-size: 0.85rem;
    color: #e4e4e7;
    line-height: 1.4;
    cursor: pointer;
    font-family: "Tajawal", sans-serif;
  }
`;

const NestedPolicyOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  pointer-events: auto;
`;

const NestedPolicyCard = styled(motion.div)`
  width: 100%;
  max-width: 550px;
  background: #111215;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  max-h: 85vh;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const PolicyScrollBlock = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: start;
`;

const LockBadge = styled.div`
  position: absolute;
  ${(props) => (props.$isArabic ? "left: 12px;" : "right: 12px;")}
  top: calc(50% + 8px);
  transform: translateY(-50%);
  color: #39a170;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const slideVariants = {
  hidden: (isArabic) => ({
    x: isArabic ? "-100%" : "100%",
    transition: { type: "tween", duration: 0.3, ease: "easeInOut" },
  }),
  visible: {
    x: 0,
    transition: { type: "tween", duration: 0.3, ease: "easeInOut" },
  },
};

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
  const navigate = useNavigate();
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

  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [designPolicyChecked, setDesignPolicyChecked] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");

  const [isHandshakeLocked, setIsHandshakeLocked] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) {
      setIsCheckoutFormOpen(false);
    }
  }, [isCartOpen]);

  useEffect(() => {
    if (isCartOpen) {
      try {
        const cached = localStorage.getItem("hanuut_order_history");
        if (cached) {
          setOrderHistory(JSON.parse(cached));
        }
      } catch (err) {
        console.error("Failed to parse cached order history:", err);
      }
    }
  }, [isCartOpen]);

  useEffect(() => {
    if (orderSuccessData) {
      try {
        const history =
          JSON.parse(localStorage.getItem("hanuut_order_history")) || [];
        const orderId = orderSuccessData.orderId || orderSuccessData.id || "";

        if (orderId && !history.some((item) => item.orderId === orderId)) {
          const newEntry = {
            orderId,
            customerPhone:
              customerPhone || orderSuccessData.customerPhone || "",
            shopName: orderSuccessData.shopName || "AURAS LAB",
            totalPrice: finalTotal,
            createdAt: new Date().toISOString(),
          };
          const updatedHistory = [newEntry, ...history].slice(0, 20);
          localStorage.setItem(
            "hanuut_order_history",
            JSON.stringify(updatedHistory),
          );
          setOrderHistory(updatedHistory);
        }
      } catch (err) {
        console.error("Failed to save order metadata to cache:", err);
      }
    }
  }, [orderSuccessData]);

  useEffect(() => {
    if (isCartOpen) {
      const queryParams = new URLSearchParams(window.location.search);
      const phone = queryParams.get("phone");
      const firstName = queryParams.get("firstName");
      const familyName = queryParams.get("familyName");
      const wilaya = queryParams.get("wilaya");
      const commune = queryParams.get("commune");
      const addressLine = queryParams.get("addressLine");

      if (
        phone ||
        firstName ||
        familyName ||
        wilaya ||
        commune ||
        addressLine
      ) {
        setIsHandshakeLocked(true);

        if (firstName || familyName) {
          setCustomerName(`${firstName || ""} ${familyName || ""}`.trim());
        }
        if (phone) {
          setCustomerPhone(phone);
        }
        if (addressLine) {
          setManualAddressLine(addressLine);
        }

        if (wilaya || commune) {
          dispatch(
            setManualLocation({
              wilayaCode: "",
              wilayaName: wilaya || "",
              communeName: commune || "",
            }),
          );
        }
      }
    }
  }, [isCartOpen, dispatch]);

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

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === "percent") {
      return itemsTotal * (appliedDiscount.value / 100);
    }
    return appliedDiscount.value;
  }, [appliedDiscount, itemsTotal]);

  const finalTotal = Math.max(
    0,
    itemsTotal + (isDineIn ? 0 : deliveryPrice) - discountAmount,
  );

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

  const handleTrackHistoryItem = (phoneVal, idVal) => {
    dispatch(closeCart());
    navigate(`/track/${phoneVal}/${idVal}`);
  };

  const handleHideHistoryItem = (e, orderId) => {
    e.stopPropagation();
    try {
      const updated = orderHistory.filter((item) => item.orderId !== orderId);
      setOrderHistory(updated);
      localStorage.setItem("hanuut_order_history", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete order entry from history:", err);
    }
  };

  const handleBackNavigation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCheckoutFormOpen(false);
  };

  // --- PROMO CODE INTEGRATION ---
  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsVerifyingPromo(true);
    setPromoError("");
    setAppliedDiscount(null);
    setAppliedCode("");

    // 🔴 RESOLVED: Pull the absolute backend production API URL
    const apiProdUrl =
      process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";

    try {
      const params = new URLSearchParams();
      // Pass phone number as customerId fallback for guest checkouts to prevent duplicate use
      if (customerPhone) {
        params.append("customerId", customerPhone);
      }

      // 🔴 RESOLVED: Correct route path (giftCard) and added absolute target URL
      const response = await fetch(
        `${apiProdUrl}/giftCard/verify/${promoCode.trim().toUpperCase()}?${params.toString()}`,
      );

      if (response.ok) {
        const data = await response.json();
        setAppliedDiscount(data);
        setAppliedCode(promoCode.trim().toUpperCase());
      } else {
        const errData = await response.json().catch(() => ({}));
        setPromoError(
          errData.message ||
            (isArabic ? "رمز ترويجي غير صالح" : "Code promo invalide"),
        );
      }
    } catch (err) {
      setPromoError(
        isArabic
          ? "حدث خطأ في الاتصال بالخادم"
          : "Connection error checking promo code",
      );
    } finally {
      setIsVerifyingPromo(false);
    }
  };

  const handleRemovePromo = (e) => {
    e.preventDefault();
    setAppliedDiscount(null);
    setAppliedCode("");
    setPromoCode("");
    setPromoError("");
  };

  const handleCheckoutSubmit = (event) => {
    event.preventDefault();

    if (!designPolicyChecked) {
      alert(
        isArabic
          ? "يرجى الموافقة على شروط الملكية الفكرية للمتابعة."
          : "Please agree to the design policy.",
      );
      return;
    }

    if (!customerName || !customerPhone) {
      alert(
        isArabic
          ? "يرجى ملء جميع البيانات الأساسية."
          : "Please complete required fields.",
      );
      return;
    }

    // Execute order submission directly without opening a second modal
    executeOrderCreation();
  };

  const executeOrderCreation = () => {
    if (!designPolicyChecked) return;

    const finalNote =
      selectedDeliveryOption?.type === "STOP_DESK"
        ? `[STOP DESK OFFICE: ${selectedStopDeskOffice}] ${note}`
        : note;

    const hasGps =
      typeof locationState.lat === "number" &&
      typeof locationState.lng === "number";

    onSubmitOrder({
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
      discount: discountAmount,
      discountCode: appliedCode || undefined,
    });
  };

  const getStackTransform = (index, totalCount) => {
    if (totalCount === 1) {
      return { rotation: 0, offsetX: 0, offsetY: 0, zIndex: 10 };
    }
    const configs = [
      { rotation: -6, offsetX: -8, offsetY: -6, zIndex: 10 },
      { rotation: 4, offsetX: 0, offsetY: 0, zIndex: 20 },
      { rotation: -3, offsetX: 8, offsetY: 4, zIndex: 30 },
      { rotation: 2, offsetX: 16, offsetY: 8, zIndex: 40 },
    ];
    return configs[index % configs.length];
  };

  const resolvedImages = useMemo(() => {
    return cleanItems
      .map((item) => {
        if (item.imageId) return getImageUrl(item.imageId);
        return null;
      })
      .filter(Boolean)
      .slice(0, 4);
  }, [cleanItems]);

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
                  <div style={{ color: "#F07A48", fontSize: "1.2rem" }}>
                    <FaMotorcycle />
                  </div>
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
          {isHandshakeLocked ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <FormGroup>
                <InputLabel>{t("wiz_label_wilaya")}</InputLabel>
                <Input
                  type="text"
                  value={locationState.wilayaName || ""}
                  disabled
                />
                <LockBadge $isArabic={isArabic} style={{ top: "50%" }}>
                  <FaLock size={12} />
                </LockBadge>
              </FormGroup>
              <FormGroup>
                <InputLabel>{t("wiz_label_commune")}</InputLabel>
                <Input
                  type="text"
                  value={locationState.communeName || ""}
                  disabled
                />
                <LockBadge $isArabic={isArabic} style={{ top: "50%" }}>
                  <FaLock size={12} />
                </LockBadge>
              </FormGroup>
            </div>
          ) : (
            <AddressesDropDown
              target="partners"
              onChooseAddress={handleAddressChange}
            />
          )}

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
              <SegmentedControl
                style={
                  isHandshakeLocked
                    ? { pointerEvents: "none", opacity: 0.85 }
                    : {}
                }
              >
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
                      onClick={() =>
                        !isHandshakeLocked && setSelectedDeliveryIndex(idx)
                      }
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
      <FormWrapper onSubmit={handleCheckoutSubmit}>
        <AnimatePresence mode="wait">
          {!isCheckoutFormOpen ? (
            /* ======================================================================== */
            /* VIEW 1: PRODUCT LIST & CART STATE                                         */
            /* ======================================================================== */
            <motion.div
              key="cart-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <ScrollableFormBody>
                {orderHistory.length > 0 && (
                  <HistorySection>
                    <HistoryHeader onClick={() => setShowHistory(!showHistory)}>
                      <span>
                        <FaHistory
                          style={{ marginRight: "6px", marginLeft: "6px" }}
                        />{" "}
                        {t("recent_orders_title", "Recent Orders")} (
                        {orderHistory.length})
                      </span>
                      <span>{showHistory ? "▲" : "▼"}</span>
                    </HistoryHeader>
                    {showHistory && (
                      <HistoryList>
                        {orderHistory.map((hOrder) => (
                          <HistoryItem key={hOrder.orderId}>
                            <HistoryText>
                              <span className="shop">{hOrder.shopName}</span>
                              <span className="meta">
                                {t("payment_order_id")}: {hOrder.orderId}
                              </span>
                              <span className="meta">
                                {hOrder.totalPrice} DA •{" "}
                                {new Date(
                                  hOrder.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </HistoryText>
                            <HistoryActions>
                              <HistoryButton
                                type="button"
                                $primary
                                onClick={() =>
                                  handleTrackHistoryItem(
                                    hOrder.customerPhone,
                                    hOrder.orderId,
                                  )
                                }
                              >
                                <FaEye />
                              </HistoryButton>
                              <HistoryButton
                                type="button"
                                onClick={(e) =>
                                  handleHideHistoryItem(e, hOrder.orderId)
                                }
                              >
                                <TrashAltIcon />
                              </HistoryButton>
                            </HistoryActions>
                          </HistoryItem>
                        ))}
                      </HistoryList>
                    )}
                  </HistorySection>
                )}

                <Column>
                  <div
                    style={{
                      paddingBottom: "0.5rem",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <TotalValue
                      style={{ fontSize: "1.8rem", color: "#39A170" }}
                    >
                      zd {finalTotal}
                    </TotalValue>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#a1a1aa",
                        fontWeight: "700",
                      }}
                    >
                      {t("total", "Total")} •{" "}
                      {cleanItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      {t("cart_items_count", "Items")}
                    </span>
                  </div>

                  {cleanItems.map((item) => (
                    <CartItem key={item.dish ? item.dish._id : item.variantId}>
                      <ItemInfo>
                        {shopDomain === "global" && item.podCustomization ? (
                          <MiniMockupPreview
                            item={item}
                            onClick={() => setZoomedItem(item)}
                          />
                        ) : (
                          shopDomain === "global" &&
                          item.imageId && (
                            <GrowableImageWrapper
                              onClick={() =>
                                setZoomedItem({
                                  singleUrl: getImageUrl(item.imageId),
                                })
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
                              {t("color_prefix")}: {item.color},{" "}
                              {t("size_prefix")}: {item.size}
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
                                  ✨ Custom Print (
                                  {item.podCustomization.printSide})
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

                          {item.podCustomization && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                                marginTop: "4px",
                              }}
                            >
                              <span
                                style={{ fontSize: "0.8rem", color: "#888" }}
                              >
                                {t("pod_studio_apparel_base")}:{" "}
                                {parseInt(
                                  item.podCustomization.baseGarmentCost || 0,
                                )}{" "}
                                {t("zd")}
                              </span>
                              <span
                                style={{ fontSize: "0.8rem", color: "#39A170" }}
                              >
                                {t("pod_studio_custom_print")}: +
                                {parseInt(item.podCustomization.printCost || 0)}{" "}
                                {t("zd")}
                              </span>
                            </div>
                          )}

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
                </Column>
              </ScrollableFormBody>

              <SubmitButton
                type="button"
                onClick={() => setIsCheckoutFormOpen(true)}
                disabled={cleanItems.length === 0}
                style={{ marginTop: "auto" }}
              >
                {t("place_order_button", "Confirm Order")}
              </SubmitButton>
            </motion.div>
          ) : (
            /* ======================================================================== */
            /* VIEW 2: CHECKOUT FULFILLMENT FORM STATE                                   */
            /* ======================================================================== */
            <motion.div
              key="checkout-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <ScrollableFormBody>
                <SummaryCardButton
                  type="button"
                  $isArabic={isArabic}
                  onClick={handleBackNavigation}
                >
                  <ImageStackContainer>
                    {resolvedImages.length > 0 ? (
                      resolvedImages.map((imgUrl, idx) => {
                        const transform = getStackTransform(
                          idx,
                          resolvedImages.length,
                        );
                        return (
                          <StackedImage
                            key={idx}
                            src={imgUrl}
                            alt="Custom print stack"
                            $offsetX={transform.offsetX}
                            $offsetY={transform.offsetY}
                            $rotation={transform.rotation}
                            $zIndex={transform.zIndex}
                          />
                        );
                      })
                    ) : (
                      <span style={{ fontSize: "2rem" }}>👕</span>
                    )}
                  </ImageStackContainer>
                  <SummaryCardText>
                    <span className="count">
                      {cleanItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                      {t("cart_items_count", "Items")}
                    </span>
                    <span className="total">
                      {finalTotal} {t("dzd", "DA")}
                    </span>
                  </SummaryCardText>
                  <HintArrow $isArabic={isArabic}>
                    {isArabic ? (
                      <FaArrowLeft size={14} />
                    ) : (
                      <FaArrowRight size={14} />
                    )}
                  </HintArrow>
                </SummaryCardButton>

                <Column style={{ marginTop: "1rem" }}>
                  <FormGroup>
                    <InputLabel>{t("form_full_name")}</InputLabel>
                    <Input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={isHandshakeLocked}
                      required
                    />
                    {isHandshakeLocked && (
                      <LockBadge $isArabic={isArabic}>
                        <FaLock size={12} />
                      </LockBadge>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <InputLabel>{t("form_phone_number")}</InputLabel>
                    <Input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      disabled={isHandshakeLocked}
                      required
                    />
                    {isHandshakeLocked && (
                      <LockBadge $isArabic={isArabic}>
                        <FaLock size={12} />
                      </LockBadge>
                    )}
                  </FormGroup>
                  {renderDeliverySection()}
                  <FormGroup>
                    <InputLabel>{t("form_preparation_note")}</InputLabel>
                    <TextArea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </FormGroup>
                </Column>

                <PromoSection>
                  <PromoInput
                    type="text"
                    placeholder={t("promo_code_placeholder", "Code Promo")}
                    value={promoCode}
                    disabled={appliedCode.length > 0}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError("");
                    }}
                  />
                  {appliedCode ? (
                    <PromoButton
                      type="button"
                      $applied
                      onClick={handleRemovePromo}
                    >
                      {isArabic ? "سحب" : "Retirer"}
                    </PromoButton>
                  ) : (
                    <PromoButton
                      type="button"
                      disabled={isVerifyingPromo || !promoCode.trim()}
                      onClick={handleApplyPromo}
                    >
                      {isVerifyingPromo
                        ? "..."
                        : isArabic
                          ? "تطبيق"
                          : "Appliquer"}
                    </PromoButton>
                  )}
                </PromoSection>

                {promoError && (
                  <PromoFeedback $isError>{promoError}</PromoFeedback>
                )}
                {appliedCode && (
                  <PromoFeedback>
                    <FaCheckCircle
                      style={{ marginRight: "4px", marginLeft: "4px" }}
                    />
                    {isArabic
                      ? `تم تطبيق الكود ${appliedCode} بنجاح !`
                      : `Code ${appliedCode} appliqué avec succès !`}
                  </PromoFeedback>
                )}
                {/* 🔴 FRICTION REDUCTION: INLINE IP POLICY CHECKBOX */}
                <CheckboxContainer style={{ marginTop: "1.5rem" }}>
                  <input
                    type="checkbox"
                    id="direct-ip-policy-check"
                    checked={designPolicyChecked}
                    onChange={(e) => setDesignPolicyChecked(e.target.checked)}
                  />
                  <label htmlFor="direct-ip-policy-check">
                    {isArabic ? (
                      <>
                        أوافق على{" "}
                        <span
                          style={{
                            color: "#F07A48",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsPolicyModalOpen(true);
                          }}
                        >
                          شروط استخدام الحقوق والملكية الفكرية
                        </span>
                      </>
                    ) : (
                      <>
                        I agree to the{" "}
                        <span
                          style={{
                            color: "#F07A48",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsPolicyModalOpen(true);
                          }}
                        >
                          Design & IP Terms
                        </span>
                      </>
                    )}
                  </label>
                </CheckboxContainer>
              </ScrollableFormBody>

              {/* 🔴 DIRECT ONE-TAP SUBMISSION */}
              <StickyMobileFooter>
                <TotalContainer>
                  <TotalLabel>{t("total")}</TotalLabel>
                  <TotalValue>
                    {finalTotal} {t("zd")}
                  </TotalValue>
                </TotalContainer>

                <SubmitButton
                  type="submit"
                  disabled={
                    isSubmitting === "submitting" ||
                    !designPolicyChecked ||
                    !customerName ||
                    !customerPhone
                  }
                >
                  {isSubmitting === "submitting"
                    ? isArabic
                      ? "جاري إرسال الطلب..."
                      : "Placing Order..."
                    : isArabic
                      ? "تأكيد وإتمام الطلب ➔"
                      : "Complete Order ➔"}
                </SubmitButton>
              </StickyMobileFooter>
            </motion.div>
          )}
        </AnimatePresence>
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            $isArabic={isArabic}
          >
            <DrawerContainer $isArabic={isArabic}>
              <MainCartPanel
                className="hanuut-cart-modal"
                onClick={(e) => e.stopPropagation()}
                variants={slideVariants}
                custom={isArabic}
                initial="hidden"
                animate="visible"
                exit="hidden"
                $isArabic={isArabic}
              >
                <CartHeader>
                  <CartTitle>{t("your_order")}</CartTitle>
                  <CloseButton onClick={handleClose}>&times;</CloseButton>
                </CartHeader>
                {renderContent()}
              </MainCartPanel>
            </DrawerContainer>
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

      <AnimatePresence>
        {isPolicyModalOpen && (
          <NestedPolicyOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPolicyModalOpen(false)}
          >
            <NestedPolicyCard
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              $isArabic={isArabic}
            >
              <PolicyConfirmHeader>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#f07a48",
                  }}
                >
                  <FaShieldAlt />
                  <h4 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                    {t("pod_studio_policy_title")}
                  </h4>
                </div>
                <CloseButton onClick={() => setIsPolicyModalOpen(false)}>
                  &times;
                </CloseButton>
              </PolicyConfirmHeader>
              <PolicyScrollBlock>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div
                    key={num}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <h5
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        fontSize: "0.9rem",
                      }}
                    >
                      {t(`pod_studio_policy_sec${num}_title`)}
                    </h5>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#a1a1aa",
                        lineHeight: "1.5",
                      }}
                    >
                      {t(`pod_studio_policy_sec${num}_text`)}
                    </p>
                  </div>
                ))}
              </PolicyScrollBlock>
              <PolicyConfirmFooter>
                <LbButton
                  $primary
                  style={{ width: "100%" }}
                  onClick={() => setIsPolicyModalOpen(false)}
                >
                  {isArabic ? "موافق" : "Fermer"}
                </LbButton>
              </PolicyConfirmFooter>
            </NestedPolicyCard>
          </NestedPolicyOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Cart;
