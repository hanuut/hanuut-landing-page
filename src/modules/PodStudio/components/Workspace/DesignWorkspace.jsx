import React, { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import styled, { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaUndo,
  FaRedo,
  FaArrowsAlt,
  FaExpandAlt,
  FaSyncAlt,
  FaShoppingCart,
  FaTimes,
  FaTshirt,
  FaPalette,
  FaSlidersH,
  FaEye,
  FaEyeSlash,
  FaBookOpen,
} from "react-icons/fa";

// Redux & State Imports (FIXED ESLINT ERRORS)
import { selectCart, addToCart, updateCartQuantity, openCart, closeCart } from "../../../Cart/state/reducers";
import { fetchPaginatedProducts, selectProducts, fetchProductById } from "../../../Product/state/reducers";
import { createGlobalOrder } from "../../../Partners/services/orderServices";

import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import { retrieveFile, persistFile } from "../../utils/indexedDbHelper";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import { getGarmentDimensions, getTemplateConfig, getRawPrintCost, calculatePhysicalMetrics, calculateScaleFromPhysicalWidth } from "../../hooks/usePrintableArea";
import { useDesignHistory } from "../../hooks/useDesignHistory";

import PreviewStage from "./PreviewStage";
import DesignControls from "./DesignControls";
import ProductionSummary from "./ProductionSummary";
import CollapsibleSizingWidget from "./CollapsibleSizingWidget";
import PrePreparedDesignsTab from "./PrePreparedDesignsTab";
import ArtistDesignProductModal from "./ArtistDesignProductModal";
import { motion, AnimatePresence } from "framer-motion";

const MobilePageLock = createGlobalStyle`
  @media (max-width: 1024px) {
    body { overflow: hidden !important; position: fixed; width: 100%; height: 100%; }
  }
`;

// ============================================================================
// STYLED COMPONENTS (DESKTOP & RESPONSIVE STRUCTURE)
// ============================================================================

const InspectorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.55);

  @media (max-width: 1024px) {
    border: none;
    background: transparent;
    border-radius: 0;
  }
`;

const ControlDrawer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.25rem;
  overflow: hidden;
  height: 100%;

  @media (max-width: 1024px) {
    display: none; /* Desktop controls hidden on mobile */
  }
`;

const CanvaDock = styled.div`
  width: 72px;
  height: 100%;
  background: #09090b;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0;
  gap: 1.75rem;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const DockItem = styled.button`
  background: transparent;
  border: none;
  width: 100%;
  max-width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: ${props => props.$active ? props.theme.primaryColor || "#F07A48" : "#a1a1aa"};
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    color: ${props => props.$active ? props.theme.primaryColor || "#F07A48" : "white"};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.35rem;
  }

  span {
    font-size: 11px;
    font-weight: ${props => props.$active ? "700" : "400"};
    text-align: center;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
`;

const InlineHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.85rem;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const HeaderLeftGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: start;
  
  h2 {
    font-size: 0.95rem !important;
    font-weight: 600 !important;
    color: #e4e4e7 !important;
    margin: 0;
  }
  
  span.sku {
    font-size: 10px !important;
    font-weight: 500 !important;
    color: #71717a !important;
    font-family: monospace;
  }
`;

const HeaderRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TopCartButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  height: 42px;
  border-radius: 50px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .badge {
    background: #F07A48;
    color: #000;
    font-weight: 800;
    border-radius: 20px;
    padding: 2px 6px;
    font-size: 0.75rem;
  }
`;

const SideViewToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const CompactViewBtn = styled.button`
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: ${props => props.$active ? "rgba(240, 122, 72, 0.12)" : "rgba(255,255,255,0.03)"};
  border: 1px solid ${props => props.$active ? props.theme.primaryColor || "#F07A48" : "rgba(255,255,255,0.08)"};
  color: ${props => props.$active ? props.theme.primaryColor || "#F07A48" : "#a1a1aa"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255,255,255,0.06);
    border-color: ${props => props.theme.primaryColor || "#F07A48"};
  }
`;

const MiniOverlayThumbnail = styled.img`
  position: absolute;
  width: 18px;
  height: 18px;
  object-fit: contain;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  bottom: -2px;
  right: -2px;
  background: #111214;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
`;

const ShirtIcon = ({ side }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46L16 1.7a2 2 0 0 0-1.42 0l-1.92.77a2 2 0 0 1-1.32 0l-1.92-.77a2 2 0 0 0-1.42 0L3.62 3.46a2 2 0 0 0-1.24 1.84v4.54a2 2 0 0 0 1.24 1.84L6 12.6V20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7.4l2.38-1a2 2 0 0 0 1.24-1.84V5.3a2 2 0 0 0-1.24-1.84z" />
    {side === 'back' && <path d="M12 4v4M10 5h4" />}
  </svg>
);

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LibraryModalCard = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  height: 85vh;
  background: #0b0b0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.95);
  color: white;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    border-radius: 24px 24px 0 0;
    height: 92vh;
  }
`;

const LibraryModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: #111214;
  flex-shrink: 0;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 900;
    font-family: "Tajawal", sans-serif;
  }
`;

const LibraryModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 10px; }
`;

const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.12); color: white; }
`;

const ScrollableInspector = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }
`;

const WorkspaceWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100vh - 100px);
  max-height: 900px;

  @media (max-width: 1024px) {
    height: 100vh;
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
  }
`;

 const WorkspaceGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 2rem;
  width: 100%;
  height: 100%;
  align-items: stretch;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    height: auto;
    gap: 0;
  }
`;

const StageArea = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  position: relative;

  @media (max-width: 1024px) {
    height: calc(100dvh - 80px);
    flex-shrink: 0;
    padding: 0;
    border-radius: 0;
  }
`;

const OptionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const OptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  color: #a1a1aa;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: "Tajawal", sans-serif;
  display: flex;
  justify-content: space-between;
`;

const CollapsiblePills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SizePill = styled.button`
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: ${(props) => props.$active ? "700" : "500"};
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$active ? "#ffffff" : "rgba(255, 255, 255, 0.03)"};
  border: 1px solid
    ${(props) =>
      props.$active
        ? props.theme.primaryColor || "#F07A48"
        : "rgba(255, 255, 255, 0.1)"};
  color: ${(props) => (props.$active ? "#000000" : "#a1a1aa")};

  &:hover {
    background: ${(props) =>
      props.$active ? "#ffffff" : "rgba(255, 255, 255, 0.08)"};
    color: ${(props) => (props.$active ? "#000000" : "#ffffff")};
  }
`;

const ColorSwatch = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => props.$hex};
  border: 2px solid
    ${(props) => (props.$active ? "#ffffff" : "rgba(0,0,0,0.4)")};
  box-shadow: ${(props) =>
    props.$active
      ? `0 0 10px ${props.theme.primaryColor || "#F07A48"}`
      : "none"};

  &:hover {
    transform: scale(1.1);
  }
`;

// ============================================================================
// MOBILE-SPECIFIC STYLED COMPONENTS
// ============================================================================

const MobileHeaderOverlay = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    z-index: 100;
    pointer-events: none;
  }
`;

const MobileHeaderContent = styled.div`
  pointer-events: auto;
  text-align: start;
  h2 {
    font-size: 0.95rem;
    font-weight: 600;
    color: #e4e4e7;
    margin: 0;
    font-family: "Tajawal", sans-serif;
    text-shadow: 0 2px 10px rgba(0,0,0,0.6);
  }
  span {
    font-size: 10px;
    font-family: monospace;
    color: #d4d4d8;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
    font-weight: 500;
  }
`;

const HeaderCircleBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 42px;
  width: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
  pointer-events: auto;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #F07A48;
  color: #000;
  font-size: 10px;
  font-weight: 800;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0c0c0e;
`;

const FloatingToolbar = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    background: #09090b;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding: 10px 0;
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 -10px 30px rgba(0,0,0,0.8);
  }
`;

const ToolIconButton = styled.button`
  background: ${(props) => (props.$active ? "rgba(240, 122, 72, 0.15)" : "transparent")};
  color: ${(props) => (props.$active ? props.theme.primaryColor || "#F07A48" : "#a1a1aa")};
  border: 1px solid ${(props) => (props.$active ? props.theme.primaryColor || "#F07A48" : "transparent")};
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  &:hover {
    color: white;
  }
`;

const MobileToolPanel = styled(motion.div)`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    position: absolute; /* Using absolute inside WorkspaceWrapper */
    bottom: calc(75px + env(safe-area-inset-bottom));
    left: 12px;
    right: 12px;
    height: auto;
    max-height: 45vh; 
    background: rgba(17, 18, 20, 0.95);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    z-index: 980;
    padding: 1.25rem 1rem;
    box-sizing: border-box;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    overflow-y: auto;
    &::-webkit-scrollbar { display: none; }
  }
`;

const MobileSummaryBox = styled(motion.div)`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: calc(75px + env(safe-area-inset-bottom));
    left: 12px;
    right: 12px;
    background: rgba(15, 15, 18, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 1rem;
    z-index: 100;
    pointer-events: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #a1a1aa;
  font-family: "Cairo", sans-serif;
  
  &.total {
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
    padding-top: 0.5rem;
    margin-bottom: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const MobileFloatingPurchaseCTA = styled.button`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    width: 100%;
    margin-top: 1rem;
    min-height: 48px; 
    background: ${(props) => props.theme.primaryColor || "#F07A48"};
    color: #050505;
    border: none;
    border-radius: 14px;
    font-weight: 800;
    font-size: 1.05rem;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    font-family: "Tajawal", sans-serif;
  }
`;

const COLOR_MAP = {
  black: "#000000",
  noir: "#000000",
  white: "#FFFFFF",
  blanc: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  grey: "#6B7280",
};

const getDisplayColorHex = (colorName) => {
  const normalized = String(colorName || "")
    .trim()
    .toLowerCase();
  return COLOR_MAP[normalized] || colorName;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DesignWorkspace = ({
  canvas,
  onClose,
  shopId,
  editingCartItem,
  onCommitSuccess,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";

  const { cart } = useSelector(selectCart);
  
  const shopCartItems = useMemo(() => {
    if (!shopId) return [];
    return cart.filter((item) => item.shopId === shopId);
  }, [cart, shopId]);

  const [isDesignLibraryOpen, setIsDesignLibraryOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("variants"); // Desktop
  const [activeMobilePanel, setActiveMobilePanel] = useState(null); // Mobile

  const toggleMobilePanel = (panel) => {
    setActiveMobilePanel((prev) => (prev === panel ? null : panel));
  };

  // SWAPS ARTWORK DIRECTLY ON THE ACTIVE CANVAS IN STATE
  const handleSwapArtworkFromLibrary = (
    canvasObj,
    artistDesign,
    preferredSide = "front",
  ) => {
    setIsDesignLibraryOpen(false);
    if (!artistDesign) return;

    const imgUrl = `https://api.hanuut.com/image/raw/${artistDesign._id || artistDesign.id}`;
    const meta = artistDesign.podDesignMetadata || {};

    const newDesignState = {
      file: "library_design",
      previewUrl: imgUrl,
      scale: meta.defaultPlacement?.scale || 55,
      x: meta.defaultPlacement?.x || 50,
      y: meta.defaultPlacement?.y || 35,
      rotation: meta.defaultPlacement?.rotation || 0,
    };

    if (preferredSide === "back") {
      setActiveSide("back");
      setBackDesign(newDesignState);
    } else {
      setActiveSide("front");
      setFrontDesign(newDesignState);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [selectedColor, setSelectedColor] = useState(
    canvas.availableColors[0]?.colorName || "",
  );
  const [selectedSize, setSelectedSize] = useState(
    canvas.sizes[0]?.sizeCode || "",
  );

  const artistDesign = canvas.initialArtistDesign;
  const isArtistLocked = !!artistDesign;
  const preferredSide = artistDesign?.preferredSide || "front";

  const [activeSide, setActiveSide] = useState(preferredSide);
  const [templateUrl, setTemplateUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("transform");
  const [showGrid, setShowGrid] = useState(false);
  const [showSolidBg, setShowSolidBg] = useState(false);
  const [solidBgColor, setSolidBgColor] = useState("#FFFFFF");

  const [
    frontDesign,
    setFrontDesign,
    undoFront,
    redoFront,
    canUndoFront,
    canRedoFront,
    resetFront,
  ] = useDesignHistory({
    file: isArtistLocked && preferredSide === "front" ? "artist_locked" : null,
    previewUrl:
      artistDesign && preferredSide === "front"
        ? artistDesign.front?.imageUrl
        : null,
    x: preferredSide === "front" ? (artistDesign?.front?.x ?? 50) : 50,
    y: preferredSide === "front" ? (artistDesign?.front?.y ?? 35) : 50,
    scale: preferredSide === "front" ? (artistDesign?.front?.width ?? 55) : 50,
    rotation:
      preferredSide === "front" ? (artistDesign?.front?.rotation ?? 0) : 0,
  });

  const [
    backDesign,
    setBackDesign,
    undoBack,
    redoBack,
    canUndoBack,
    canRedoBack,
    resetBack,
  ] = useDesignHistory({
    file: isArtistLocked && preferredSide === "back" ? "artist_locked" : null,
    previewUrl:
      artistDesign && preferredSide === "back"
        ? artistDesign.back?.imageUrl
        : null,
    x: preferredSide === "back" ? (artistDesign?.back?.x ?? 50) : 50,
    y: preferredSide === "back" ? (artistDesign?.back?.y ?? 35) : 50,
    scale: preferredSide === "back" ? (artistDesign?.back?.width ?? 55) : 50,
    rotation:
      preferredSide === "back" ? (artistDesign?.back?.rotation ?? 0) : 0,
  });

  // Hydrates the entire studio state perfectly from the editing payload
  useEffect(() => {
    let isMounted = true;
    if (editingCartItem) {
      const custom =
        editingCartItem.podCustomization || editingCartItem.customization;
      if (!custom) return;

      const loadSavedDesign = async () => {
        const stableId =
          editingCartItem.variantId || editingCartItem.lineItemId;

        let frontUrl =
          custom.front?.imageUrl ||
          custom.front?.artworkUrl ||
          custom.front?.originalImageUrl;
        let backUrl =
          custom.back?.imageUrl ||
          custom.back?.artworkUrl ||
          custom.back?.originalImageUrl;

        if (frontUrl?.startsWith("blob:") && stableId) {
          const blob = await retrieveFile(`${stableId}_front`);
          if (blob && isMounted) frontUrl = URL.createObjectURL(blob);
        }
        if (backUrl?.startsWith("blob:") && stableId) {
          const blob = await retrieveFile(`${stableId}_back`);
          if (blob && isMounted) backUrl = URL.createObjectURL(blob);
        }

        if (isMounted) {
          if (custom.front) {
            resetFront({
              file: "existing",
              previewUrl: frontUrl,
              x: custom.front.x ?? custom.front.xOffsetPercent ?? 50,
              y: custom.front.y ?? custom.front.yOffsetPercent ?? 35,
              scale: custom.front.width ?? custom.front.widthPercent ?? 55,
              rotation: custom.front.rotation ?? 0,
            });
          }
          if (custom.back) {
            resetBack({
              file: "existing",
              previewUrl: backUrl,
              x: custom.back.x ?? custom.back.xOffsetPercent ?? 50,
              y: custom.back.y ?? custom.back.yOffsetPercent ?? 35,
              scale: custom.back.width ?? custom.back.widthPercent ?? 55,
              rotation: custom.back.rotation ?? 0,
            });
          }

          if (editingCartItem.color || editingCartItem.colorSelected) {
            setSelectedColor(
              editingCartItem.color || editingCartItem.colorSelected,
            );
          }
          if (editingCartItem.size || editingCartItem.sizeSelected) {
            setSelectedSize(
              editingCartItem.size || editingCartItem.sizeSelected,
            );
          }

          if (custom.printSide === "back" || (!custom.front && custom.back)) {
            setActiveSide("back");
          } else {
            setActiveSide("front");
          }
        }
      };
      loadSavedDesign();
    }
  }, [editingCartItem, resetFront, resetBack]);

  const activeDesignState = activeSide === "back" ? backDesign : frontDesign;
  const setActiveDesignState =
    activeSide === "back" ? setBackDesign : setFrontDesign;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      )
        return;
      const step = e.shiftKey ? 5 : 1;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveDesignState((prev) => ({
          ...prev,
          x: Math.max(0, prev.x - step),
        }));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveDesignState((prev) => ({
          ...prev,
          x: Math.min(100, prev.x + step),
        }));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveDesignState((prev) => ({
          ...prev,
          y: Math.max(0, prev.y - step),
        }));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveDesignState((prev) => ({
          ...prev,
          y: Math.min(100, prev.y + step),
        }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveDesignState]);

  const activeColorObj = useMemo(() => {
    if (!canvas?.availableColors || !selectedColor) return null;
    const target = String(selectedColor).trim().toLowerCase();
    return canvas.availableColors.find(
      (c) => String(c.colorName).trim().toLowerCase() === target,
    );
  }, [canvas, selectedColor]);

  const activeTemplateId = useMemo(() => {
    if (!activeColorObj) return null;
    return activeSide === "back"
      ? activeColorObj.podBackTemplateId
      : activeColorObj.podFrontTemplateId || activeColorObj.imageId;
  }, [activeColorObj, activeSide]);

  useEffect(() => {
    let isMounted = true;
    if (activeTemplateId) {
      getImage(activeTemplateId).then((res) => {
        if (isMounted && res.data) setTemplateUrl(getImageUrl(res.data));
      });
    } else {
      setTemplateUrl(null);
    }
    return () => {
      isMounted = false;
    };
  }, [activeTemplateId]);

  const DOCK_ITEMS = [
    { id: "variants", label: isArabic ? "الألوان والمقاسات" : "Colors & Sizes", icon: <FaTshirt />, tooltip: isArabic ? "تغيير اللون والمقاس" : "Change Color & Size" },
    { id: "layer", label: isArabic ? "التصميم والطبقات" : "Artwork & Layers", icon: <FaPalette />, tooltip: isArabic ? "إدارة تصميمك والطبقات" : "Manage Artwork Layers" },
    { id: "transform", label: isArabic ? "التعديل والموقع" : "Transform & Align", icon: <FaSlidersH />, tooltip: isArabic ? "ضبط الحجم والدوران" : "Scale, Rotate & Align" },
    { id: "collections", label: isArabic ? "مكتبة التصاميم" : "Art Library", icon: <FaBookOpen />, tooltip: isArabic ? "تصفح تصاميم الفنانين" : "Browse Creator Designs" },
  ];

  const MOBILE_DOCK_ITEMS = [
    { id: "variants", label: isArabic ? "الألوان" : "Colors", icon: <FaTshirt /> },
    { id: "layer", label: isArabic ? "التصميم" : "Design", icon: <FaPalette /> },
    { id: "scale", label: isArabic ? "الحجم" : "Scale", icon: <FaExpandAlt /> },
    { id: "position", label: isArabic ? "الموقع" : "Position", icon: <FaArrowsAlt /> },
    { id: "rotation", label: isArabic ? "الدوران" : "Rotate", icon: <FaSyncAlt /> },
  ];

  const handleDockClick = (id) => {
    if (id === "collections") {
      setIsDesignLibraryOpen(true);
    } else {
      setActivePanel(id);
    }
  };
  
  const handleMobileDockClick = (id) => {
    setActiveMobilePanel((prev) => (prev === id ? null : id));
  };

  const frontDesignThumbnail = useMemo(() => frontDesign?.previewUrl || null, [frontDesign]);
  const backDesignThumbnail = useMemo(() => backDesign?.previewUrl || null, [backDesign]);

  // LIVE PRICING CALCULATION FOR MOBILE OVERLAY
  const baseApparelCost = useMemo(() => {
    const matchedSize = canvas.sizes?.find((s) => s.sizeCode === selectedSize);
    return matchedSize ? matchedSize.baseCost : 0;
  }, [canvas, selectedSize]);

  const garmentDims = useMemo(
    () => getGarmentDimensions(canvas.title, selectedSize, canvas.sizeChart),
    [canvas.title, selectedSize, canvas.sizeChart]
  );
  
  const cfg = useMemo(() => getTemplateConfig(canvas.title), [canvas.title]);
  const printWidthRatio = cfg.printW_ref / cfg.B_ref;

  const frontPrintCost = useMemo(() => {
    if (!frontDesign.previewUrl) return 0;
    const maxPrintWidthCm = garmentDims.B * printWidthRatio;
    const wCm = (frontDesign.scale / 100) * maxPrintWidthCm;
    const hCm = wCm / (frontDesign.aspectRatio || 1);
    return getRawPrintCost(wCm, hCm) + 50;
  }, [frontDesign, garmentDims, printWidthRatio]);

  const backPrintCost = useMemo(() => {
    if (!backDesign.previewUrl) return 0;
    const maxPrintWidthCm = garmentDims.B * printWidthRatio;
    const wCm = (backDesign.scale / 100) * maxPrintWidthCm;
    const hCm = wCm / (backDesign.aspectRatio || 1);
    return getRawPrintCost(wCm, hCm);
  }, [backDesign, garmentDims, printWidthRatio]);

  const finalCost = baseApparelCost + frontPrintCost + backPrintCost;

  // DIRECT CART COMMIT FUNCTION FOR MOBILE
  const commitToCartAndCheckout = async () => {
    const hasFront = !!frontDesign.previewUrl;
    const hasBack = !!backDesign.previewUrl;

    if (!hasFront && !hasBack) {
      const confirmBlank = window.confirm(
        isArabic
          ? "لم تقوم بإضافة أي تصميم. هل ترغب في شراء القطعة بدون طباعة؟"
          : "You haven't added a design. Would you like to buy this item blank?"
      );
      if (!confirmBlank) return;
    }

    const targetVariantId = `pod_${canvas.canvasId}_${selectedColor}_${selectedSize}_${Date.now()}`;

    if (hasFront && frontDesign.file && typeof frontDesign.file !== "string") {
      await persistFile(`${targetVariantId}_front`, frontDesign.file);
    }
    if (hasBack && backDesign.file && typeof backDesign.file !== "string") {
      await persistFile(`${targetVariantId}_back`, backDesign.file);
    }

    const printSideKeyword = hasFront && hasBack ? "double" : hasBack ? "back" : hasFront ? "front" : "blank";
    const apiProdUrl = process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";
    
    const activeColorObj = canvas.availableColors.find((c) => c.colorName === selectedColor);
    const frontTemplateUrl = activeColorObj?.podFrontTemplateId ? `${apiProdUrl}/image/raw/${activeColorObj.podFrontTemplateId}` : null;
    const backTemplateUrl = activeColorObj?.podBackTemplateId ? `${apiProdUrl}/image/raw/${activeColorObj.podBackTemplateId}` : null;

    const cartPayload = {
      productId: canvas.canvasId,
      variantId: targetVariantId,
      title: canvas.title,
      color: selectedColor,
      size: selectedSize,
      sellingPrice: finalCost,
      imageId: canvas.previewImageId,
      quantity: 1,
      shopId: shopId,
      podCustomization: {
        printSide: printSideKeyword,
        baseGarmentCost: baseApparelCost,
        printCost: frontPrintCost + backPrintCost,
        front: hasFront ? {
          imageId: `${targetVariantId}_front`,
          imageUrl: frontDesign.previewUrl,
          originalImageId: `${targetVariantId}_front`,
          originalImageUrl: frontDesign.previewUrl,
          width: frontDesign.scale, height: frontDesign.scale,
          x: frontDesign.x, y: frontDesign.y, rotation: frontDesign.rotation,
          templateUrl: frontTemplateUrl,
        } : null,
        back: hasBack ? {
          imageId: `${targetVariantId}_back`,
          imageUrl: backDesign.previewUrl,
          originalImageId: `${targetVariantId}_back`,
          originalImageUrl: backDesign.previewUrl,
          width: backDesign.scale, height: backDesign.scale,
          x: backDesign.x, y: backDesign.y, rotation: backDesign.rotation,
          templateUrl: backTemplateUrl,
        } : null,
      },
    };

    dispatch(addToCart(cartPayload));
    if (onCommitSuccess) onCommitSuccess();
    dispatch(openCart()); // Trigger cart open
  };

  return (
    <WorkspaceWrapper>
      <MobilePageLock />
      <WorkspaceGrid>
        <StageArea>
          <MobileHeaderOverlay>
            <MobileHeaderContent>
              <h2>{canvas.title}</h2>
              <span>{canvas.sku || canvas.serialNumber}</span>
            </MobileHeaderContent>
            <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
              {canvas.specifications?.printableSurfaces?.includes("back") && (
                <SideViewToggleGroup>
                  <CompactViewBtn
                    type="button"
                    $active={activeSide === "front"}
                    onClick={() => setActiveSide("front")}
                    title={isArabic ? "الواجهة الأمامية" : "Front Side"}
                  >
                    <ShirtIcon side="front" />
                    {frontDesignThumbnail && (
                      <MiniOverlayThumbnail src={frontDesignThumbnail} alt="Front Print" />
                    )}
                  </CompactViewBtn>
                  <CompactViewBtn
                    type="button"
                    $active={activeSide === "back"}
                    onClick={() => setActiveSide("back")}
                    title={isArabic ? "الظهر" : "Back Side"}
                  >
                    <ShirtIcon side="back" />
                    {backDesignThumbnail && (
                      <MiniOverlayThumbnail src={backDesignThumbnail} alt="Back Print" />
                    )}
                  </CompactViewBtn>
                </SideViewToggleGroup>
              )}
              
              <HeaderCircleBtn onClick={() => dispatch(openCart())} title={t("pod_studio_tray_title", "Bag")} style={{ position: 'relative' }}>
                <FaShoppingCart size={16} />
                {shopCartItems.length > 0 && <CartBadge>{shopCartItems.reduce((acc, item) => acc + item.quantity, 0)}</CartBadge>}
              </HeaderCircleBtn>
            </div>
          </MobileHeaderOverlay>

          <PreviewStage
            canvas={canvas}
            activeTemplateUrl={templateUrl}
            activeSide={activeSide}
            designState={activeDesignState}
            setDesignState={setActiveDesignState}
            selectedSize={selectedSize}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showSolidBg={showSolidBg}
            setShowSolidBg={setShowSolidBg}
            solidBgColor={solidBgColor}
            setSolidBgColor={setSolidBgColor}
          />

          {/* 🔴 NEW MOBILE PRICING & SIZING OVERLAY (VISIBLE ONLY WHEN NO TOOL PANEL IS OPEN) */}
          <AnimatePresence>
            {!activeMobilePanel && (
              <MobileSummaryBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                    {isArabic ? `المقاس الحالي: ${selectedSize}` : `Active Size: ${selectedSize}`}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600 }}>
                    A: {garmentDims.A}cm B: {garmentDims.B}cm
                  </span>
                </div>
                
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                  <PriceRow>
                    <span>{isArabic ? "قيمة القطعة الأساسية:" : "Base Apparel:"}</span>
                    <span>{baseApparelCost} DA</span>
                  </PriceRow>
                  {(frontPrintCost > 0 || backPrintCost > 0) && (
                    <PriceRow>
                      <span>{isArabic ? "قيمة الطباعة:" : "Custom Print:"}</span>
                      <span>+{frontPrintCost + backPrintCost} DA</span>
                    </PriceRow>
                  )}
                  <PriceRow className="total">
                    <span>{isArabic ? "الإجمالي المستحق للمشروع:" : "Total Cost:"}</span>
                    <span>{finalCost} DA</span>
                  </PriceRow>
                </div>
                
                <MobileFloatingPurchaseCTA
                  type="button"
                  onClick={() => commitToCartAndCheckout()}
                >
                  <FaShoppingCart />
                  <span>{isArabic ? "إكمال وتأكيد الطلبية ➔" : "Proceed with Order ➔"}</span>
                </MobileFloatingPurchaseCTA>
              </MobileSummaryBox>
            )}
          </AnimatePresence>
        </StageArea>

        {/* Dynamic Two-Tier Pro Design Inspector (Desktop) */}
        <InspectorContainer>
          <ControlDrawer>
            <InlineHeaderRow>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <HeaderLeftGroup>
                  <h2>{canvas.title}</h2>
                  <span className="sku">{canvas.sku || canvas.serialNumber}</span>
                </HeaderLeftGroup>

                {canvas.specifications?.printableSurfaces?.includes("back") && (
                  <SideViewToggleGroup>
                    <CompactViewBtn
                      type="button"
                      $active={activeSide === "front"}
                      onClick={() => setActiveSide("front")}
                      title={isArabic ? "الواجهة الأمامية" : "Front Side"}
                    >
                      <ShirtIcon side="front" />
                      {frontDesignThumbnail && (
                        <MiniOverlayThumbnail src={frontDesignThumbnail} alt="Front Print" />
                      )}
                    </CompactViewBtn>
                    <CompactViewBtn
                      type="button"
                      $active={activeSide === "back"}
                      onClick={() => setActiveSide("back")}
                      title={isArabic ? "الظهر" : "Back Side"}
                    >
                      <ShirtIcon side="back" />
                      {backDesignThumbnail && (
                        <MiniOverlayThumbnail src={backDesignThumbnail} alt="Back Print" />
                      )}
                    </CompactViewBtn>
                  </SideViewToggleGroup>
                )}
              </div>

              <HeaderRightGroup>
                <TopCartButton onClick={() => dispatch(openCart())}>
                  <FaShoppingCart size={16} />
                  {shopCartItems.length > 0 && (
                    <span className="badge">
                      {shopCartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </TopCartButton>
              </HeaderRightGroup>
            </InlineHeaderRow>

            <ScrollableInspector>
              {/* Panel A: Colors & Sizes */}
              {activePanel === "variants" && (
                <OptionRow style={{ marginTop: "1rem" }}>
                  <OptionSection>
                    <SectionLabel>
                      {t("pod_studio_colors_title", "Colors")}
                    </SectionLabel>
                    <CollapsiblePills>
                      {canvas.availableColors.map((col) => (
                        <ColorSwatch
                          key={col.colorName}
                          $active={selectedColor === col.colorName}
                          $hex={getDisplayColorHex(col.colorName)}
                          onClick={() => setSelectedColor(col.colorName)}
                        />
                      ))}
                    </CollapsiblePills>
                  </OptionSection>

                  <OptionSection>
                    <SectionLabel>
                      {t("pod_studio_sizes_title", "Sizes")}
                    </SectionLabel>
                    <CollapsiblePills>
                      {canvas.sizes.map((s) => (
                        <SizePill
                          key={s.sizeCode}
                          $active={selectedSize === s.sizeCode}
                          onClick={() => setSelectedSize(s.sizeCode)}
                        >
                          {s.sizeCode}
                        </SizePill>
                      ))}
                    </CollapsiblePills>
                  </OptionSection>
                </OptionRow>
              )}

              {/* Panel B & C: Unified Design Controls */}
              {(activePanel === "layer" || activePanel === "transform") && (
                <div style={{ marginTop: "1rem" }}>
                  <DesignControls
                    designState={activeDesignState}
                    setDesignState={setActiveDesignState}
                    canvasName={canvas.title}
                    selectedSize={selectedSize}
                    sizeChart={canvas.sizeChart}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onOpenDesignLibrary={() => setIsDesignLibraryOpen(true)}
                    activePanel={activePanel}
                  />
                </div>
              )}
            </ScrollableInspector>

            {/* Pinned Pricing & Checkout summary */}
            <ProductionSummary
              canvas={canvas}
              frontDesign={frontDesign}
              backDesign={backDesign}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              shopId={shopId}
              onCommitSuccess={onCommitSuccess}
              editingCartItem={editingCartItem}
            />
          </ControlDrawer>

          <CanvaDock>
            {DOCK_ITEMS.map((item) => (
              <DockItem
                key={item.id}
                $active={activePanel === item.id}
                onClick={() => handleDockClick(item.id)}
                title={item.tooltip}
              >
                {item.icon}
                <span>{item.label}</span>
              </DockItem>
            ))}
          </CanvaDock>
        </InspectorContainer>
      </WorkspaceGrid>

      {/* MOBILE ACTIVE TOOL PANEL */}
      <AnimatePresence mode="wait">
        {activeMobilePanel && (
          <MobileToolPanel
            key={activeMobilePanel}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
          >
            {/* Minimal Header with Undo/Redo */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 700, color: "white", fontSize: "0.95rem" }}>
                {MOBILE_DOCK_ITEMS.find(i => i.id === activeMobilePanel)?.label}
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  style={{ background: "transparent", border: "none", color: canUndoFront ? "#FFF" : "#555", cursor: "pointer" }}
                  disabled={!canUndoFront}
                  onClick={undoFront}
                >
                  <FaUndo size={14} />
                </button>
                <button
                  style={{ background: "transparent", border: "none", color: canRedoFront ? "#FFF" : "#555", cursor: "pointer" }}
                  disabled={!canRedoFront}
                  onClick={redoFront}
                >
                  <FaRedo size={14} />
                </button>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {activeMobilePanel === "variants" && (
                <OptionRow style={{ marginTop: "4px" }}>
                  <OptionSection>
                    <SectionLabel style={{ fontSize: "0.7rem" }}>
                      {t("pod_studio_colors_title", "Colors")}
                    </SectionLabel>
                    <CollapsiblePills>
                      {canvas.availableColors.map((col) => (
                        <ColorSwatch
                          key={col.colorName}
                          $active={selectedColor === col.colorName}
                          $hex={getDisplayColorHex(col.colorName)}
                          onClick={() => setSelectedColor(col.colorName)}
                          style={{ width: "24px", height: "24px" }}
                        />
                      ))}
                    </CollapsiblePills>
                  </OptionSection>

                  <OptionSection>
                    <SectionLabel style={{ fontSize: "0.7rem" }}>
                      {t("pod_studio_sizes_title", "Sizes")}
                    </SectionLabel>
                    <CollapsiblePills>
                      {canvas.sizes.map((s) => (
                        <SizePill
                          key={s.sizeCode}
                          $active={selectedSize === s.sizeCode}
                          onClick={() => setSelectedSize(s.sizeCode)}
                          style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem" }}
                        >
                          {s.sizeCode}
                        </SizePill>
                      ))}
                    </CollapsiblePills>
                  </OptionSection>
                </OptionRow>
              )}

              {activeMobilePanel === "layer" && (
                <DesignControls
                  designState={activeDesignState}
                  setDesignState={setActiveDesignState}
                  canvasName={canvas.title}
                  selectedSize={selectedSize}
                  sizeChart={canvas.sizeChart}
                  activeTab="layer"
                  setActiveTab={setActiveTab}
                  onOpenDesignLibrary={() => setIsDesignLibraryOpen(true)}
                  activePanel="layer"
                />
              )}

              {activeMobilePanel === "scale" && (
                <DesignControls
                  designState={activeDesignState}
                  setDesignState={setActiveDesignState}
                  canvasName={canvas.title}
                  selectedSize={selectedSize}
                  sizeChart={canvas.sizeChart}
                  activeTab="transform"
                  setActiveTab={setActiveTab}
                  activePanel="transform"
                  hideTabs={true}
                />
              )}

              {activeMobilePanel === "position" && (
                <DesignControls
                  designState={activeDesignState}
                  setDesignState={setActiveDesignState}
                  canvasName={canvas.title}
                  selectedSize={selectedSize}
                  sizeChart={canvas.sizeChart}
                  activeTab="position"
                  setActiveTab={setActiveTab}
                  activePanel="transform"
                  hideTabs={true}
                />
              )}

              {activeMobilePanel === "rotation" && (
                <DesignControls
                  designState={activeDesignState}
                  setDesignState={setActiveDesignState}
                  canvasName={canvas.title}
                  selectedSize={selectedSize}
                  sizeChart={canvas.sizeChart}
                  activeTab="rotation"
                  setActiveTab={setActiveTab}
                  activePanel="transform"
                  hideTabs={true}
                />
              )}
            </div>
          </MobileToolPanel>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM TOOLBAR (4 Clean Icons) */}
      <FloatingToolbar>
        {MOBILE_DOCK_ITEMS.map((item) => (
          <ToolIconButton
            key={item.id}
            $active={activeMobilePanel === item.id}
            onClick={() => handleMobileDockClick(item.id)}
          >
            {item.icon}
            {item.id === "cart" && shopCartItems.length > 0 && (
              <div style={{
                position: 'absolute', top: -2, right: -2, background: '#F07A48', color: 'black',
                fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {shopCartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0)}
              </div>
            )}
          </ToolIconButton>
        ))}
      </FloatingToolbar>

      <AnimatePresence>
        {isDesignLibraryOpen && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDesignLibraryOpen(false)}
            style={{ zIndex: 3000 }}
          >
            <LibraryModalCard
              $isArabic={isArabic}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
            >
              <LibraryModalHeader>
                <h3>{isArabic ? "مكتبة التصاميم" : "Artwork Library"}</h3>
                <CloseBtn onClick={() => setIsDesignLibraryOpen(false)}>
                  <FaTimes />
                </CloseBtn>
              </LibraryModalHeader>
              <LibraryModalBody>
                <PrePreparedDesignsTab 
                  onSelectArtwork={(url, placement, art) => handleSwapArtworkFromLibrary(canvas, art, activeSide)}
                />
              </LibraryModalBody>
            </LibraryModalCard>
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </WorkspaceWrapper>
  );
};

DesignWorkspace.propTypes = {
  canvas: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  shopId: PropTypes.string.isRequired,
  editingCartItem: PropTypes.object,
  onCommitSuccess: PropTypes.func,
};

export default DesignWorkspace;