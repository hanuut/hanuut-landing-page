// src/modules/PodStudio/components/storefront/sections/CanvasLibrary.jsx

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import PropTypes from "prop-types";
import styled, { keyframes, css } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

import { fetchPaginatedProducts } from "../../../Product/state/reducers";
import {
  fetchCategories,
  selectCategories,
} from "../../../Categories/state/reducers";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import Loader from "../../../../components/Loader";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import PremiumProductCard from "../../../Product/components/landing/PremiumProductCard";
import ProductFilterBar from "../../../Product/components/landing/ProductFilterBar";

const imageCache = {};

// ===========================================================================
// STYLED COMPONENTS (LAYOUTS & MARQUEE)
// ===========================================================================

const LibraryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
  box-sizing: border-box;
`;

const FluidGasBackdrop = styled(motion.div)`
  position: absolute;
  width: ${(props) => props.$size || "220px"};
  height: ${(props) => props.$size || "220px"};
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${(props) => props.$color || "rgba(240, 122, 72, 0.18)"} 0%,
    transparent 70%
  );
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: screen;
  transition:
    background 0.8s ease-in-out,
    width 0.8s ease,
    height 0.8s ease;
`;

const VerticalMarqueeWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1.25rem 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: center;
  position: relative;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to bottom, #050507 0%, rgba(5, 5, 7, 0) 100%);
    z-index: 10;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, #050507 0%, rgba(5, 5, 7, 0) 100%);
    z-index: 10;
    pointer-events: none;
  }
`;

const scrollUp = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(0, -50%, 0); }
`;

const scrollDown = keyframes`
  0% { transform: translate3d(0, -50%, 0); }
  100% { transform: translate3d(0, 0, 0); }
`;

const VerticalMarqueeTrack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: max-content;
  align-items: center;
  animation: ${(props) => (props.$reverse ? scrollDown : scrollUp)} ${(props) => props.$speed}s linear infinite;
  animation-play-state: ${(props) => (props.$isPaused ? "paused" : "running")};
  will-change: transform;
`;

const MarqueeItem = styled.div`
  width: ${(props) => (props.$compact ? "68px" : props.$isLineActive ? "110px" : "80px")};
  height: ${(props) => (props.$compact ? "68px" : props.$isLineActive ? "110px" : "80px")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: scale(1.15);
    z-index: 12;
  }
`;

const expandPulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }
`;

const CirclePulseRing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 105%;
  height: 105%;
  pointer-events: none;
  z-index: 0;
  animation: ${expandPulse} 2s infinite cubic-bezier(0.25, 0.8, 0.25, 1);
  display: ${(props) => (props.$active ? "block" : "none")};

  ${(props) => {
    if (props.$shape === "diamond") {
      return css`
        border: 1.5px solid ${props.$color || "#f07a48"};
        transform: translate(-50%, -50%) rotate(45deg);
        border-radius: 14px;
      `;
    }
    if (props.$shape === "squircle") {
      return css`
        border: 1.5px solid ${props.$color || "#f07a48"};
        border-radius: 18px;
      `;
    }
    return css`
      border: 1.5px solid ${props.$color || "#f07a48"};
      border-radius: 50%;
    `;
  }}
`;

const CircleBg = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 92%;
  height: 95%;
  background: #111214;
  z-index: 0;
  transition: all 0.3s ease;

  ${(props) => {
    if (props.$shape === "diamond") {
      return css`
        transform: translate(-50%, -50%) rotate(45deg);
        border-radius: 14px;
        border: 1.5px solid
          ${props.$active ? props.$color || "#f07a48" : "rgba(255, 255, 255, 0.05)"};
      `;
    }
    if (props.$shape === "squircle") {
      return css`
        transform: translate(-50%, -50%);
        border-radius: 18px;
        border: 1.5px solid
          ${props.$active ? props.$color || "#f07a48" : "rgba(255, 255, 255, 0.05)"};
      `;
    }
    return css`
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 1.5px solid
        ${props.$active ? props.$color || "#f07a48" : "rgba(255, 255, 255, 0.05)"};
    `;
  }}

  box-shadow: ${(props) =>
    props.$active
      ? `0 0 25px ${props.$color || "rgba(240, 122, 72, 0.35)"}, inset 0 0 10px rgba(255, 255, 255, 0.02)`
      : "0 10px 25px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.02)"};

  ${MarqueeItem}:hover & {
    border-color: ${(props) => props.$color || "#f07a48"};
    box-shadow: 0 15px 35px
      ${(props) => props.$color || "rgba(240, 122, 72, 0.25)"},
      inset 0 0 15px rgba(240, 122, 72, 0.05);
  }
`;

const FloatingPopover = styled(motion.div)`
  position: fixed;
  background: rgba(24, 24, 27, 0.88);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
  width: 360px;
  z-index: 9999;
  pointer-events: none;
`;

const BlueprintStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #050505;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 0;
  }
`;

const CoordinateOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
  z-index: 5;
`;

const CoordText = styled.span`
  color: #f07a48;
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
`;

const TagInfo = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  text-align: right;
  z-index: 5;
`;

const CoreTag = styled.div`
  background: #f07a48;
  color: #050505;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 800;
`;

const SpecBadge = styled.span`
  background: rgba(255, 255, 255, 0.03);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
  color: #71717a;
  font-family: monospace;
  text-transform: uppercase;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SplitLayout = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  align-items: flex-start;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Sidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  background: #08080a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 1.25rem;
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-sizing: border-box;

  @media (max-width: 900px) {
    display: ${(props) => (props.$isOpenMobile ? "flex" : "none")};
    width: 100%;
    position: relative;
    top: 0;
  }
`;

const AccordionSection = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.75rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const AccordionHeader = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  color: #a1a1aa;
  font-family: "Tajawal", sans-serif;
  font-weight: 800;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }

  .header-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const RedActiveBadge = styled.span`
  background-color: #ef4444;
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 800;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
`;

const AccordionContent = styled(motion.div)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
`;

const FilterChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const FilterChip = styled.button`
  background: ${(props) =>
    props.$active ? "rgba(240, 122, 72, 0.18)" : "rgba(255, 255, 255, 0.03)"};
  color: ${(props) => (props.$active ? "#f07a48" : "#d4d4d8")};
  border: 1px solid
    ${(props) => (props.$active ? "#f07a48" : "rgba(255, 255, 255, 0.08)")};
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  text-align: start;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(240, 122, 72, 0.5);
    background: rgba(240, 122, 72, 0.08);
  }
`;

const ColorFilterSwatch = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid
    ${(props) => (props.$active ? "#f07a48" : "rgba(255, 255, 255, 0.2)")};
  background-color: ${(props) => props.$colorCode || "#27272a"};
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const MainContentArea = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const CategorySectionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

const CategoryRowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 0.5rem;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  h4 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 800;
    color: #ffffff;
    font-family: "Tajawal", sans-serif;
  }

  button {
    background: transparent;
    border: none;
    color: #f07a48;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    font-family: "Tajawal", sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.2s;

    &:hover {
      text-decoration: underline;
      transform: ${(props) => (props.$isArabic ? "translateX(-3px)" : "translateX(3px)")};
    }
  }
`;

const DynamicViewContainer = styled.div`
  width: 100%;

  ${(props) =>
    props.$mode === "list" &&
    css`
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `}

  ${(props) =>
    props.$mode === "grid-compact" &&
    css`
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
      @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }
    `}

  ${(props) =>
    props.$mode === "grid-featured" &&
    css`
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    `}
`;

const LoadMoreTrigger = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  position: relative;
  z-index: 5;
`;

const InlineSpinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #f07a48;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const APPAREL_EMOJIS = [
  "👕", "👔", "🧥", "🥼", "👖", "🩳", "🧦", "👟",
  "🎒", "👜", "🧢", "🎽", "👗", "👘", "🥻", "👠",
  "👡", "👢", "🎩", "👑", "🎒", "💼"
];

const getStableEmoji = (id, index) => {
  const str = String(id || index || "");
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return APPAREL_EMOJIS[(sum + (index || 0)) % APPAREL_EMOJIS.length];
};

// ===========================================================================
// ROTATING MOCKUP & MARQUEE HELPERS
// ===========================================================================

const CustomRotatingMockup = ({
  colorObj,
  title,
  isLarge = false,
  isHovered = false,
}) => {
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [isFrontActive, setIsFrontActive] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const imgId = colorObj?.podFrontTemplateId || colorObj?.imageId;
    if (!imgId) return;

    const loadImages = async () => {
      if (imageCache[imgId]) {
        if (isMounted) setFrontUrl(imageCache[imgId]);
      } else {
        getImage(imgId)
          .then((res) => {
            if (res.data) {
              const url = getImageUrl(res.data);
              imageCache[imgId] = url;
              if (isMounted) setFrontUrl(url);
            }
          })
          .catch(() => {});
      }

      if (colorObj?.podBackTemplateId) {
        const bImgId = colorObj.podBackTemplateId;
        if (imageCache[bImgId]) {
          if (isMounted) setBackUrl(imageCache[bImgId]);
        } else {
          getImage(bImgId)
            .then((res) => {
              if (res.data) {
                const url = getImageUrl(res.data);
                imageCache[bImgId] = url;
                if (isMounted) setBackUrl(url);
              }
            })
            .catch(() => {});
        }
      }
    };

    loadImages();
    return () => {
      isMounted = false;
    };
  }, [colorObj]);

  useEffect(() => {
    if (!backUrl || (!isHovered && !isLarge)) {
      setIsFrontActive(true);
      return;
    }
    const timer = setInterval(() => setIsFrontActive((prev) => !prev), 2600);
    return () => clearInterval(timer);
  }, [backUrl, isHovered, isLarge]);

  const hasBack = !!backUrl;
  const imgScaleActive = isLarge ? 1.05 : 0.95;
  const imgScaleInactive = isLarge ? 0.88 : 0.8;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      {frontUrl ? (
        <motion.img
          src={frontUrl}
          alt={title}
          animate={{
            zIndex: isFrontActive ? 3 : 1,
            scale: isFrontActive ? imgScaleActive : imgScaleInactive,
            rotate: isFrontActive ? (isLarge ? 5 : 0) : isLarge ? -4 : 0,
            x: isFrontActive ? 0 : isLarge ? -15 : 0,
            opacity: isFrontActive ? 1.0 : 0.6,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: isLarge ? "85%" : "100%",
            height: isLarge ? "85%" : "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))",
          }}
        />
      ) : (
        <div style={{ zIndex: 3, fontSize: isLarge ? "4rem" : "2.5rem" }}>
          {getStableEmoji(title)}
        </div>
      )}
      {hasBack && (
        <motion.img
          src={backUrl}
          alt={title}
          animate={{
            zIndex: isFrontActive ? 1 : 3,
            scale: isFrontActive ? imgScaleInactive : imgScaleActive,
            rotate: isFrontActive ? (isLarge ? -6 : 0) : isLarge ? 5 : 0,
            x: isFrontActive ? (isLarge ? 15 : 0) : 0,
            opacity: isFrontActive ? 0.6 : 1.0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: isLarge ? "85%" : "100%",
            height: isLarge ? "85%" : "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))",
          }}
        />
      )}
    </div>
  );
};

CustomRotatingMockup.propTypes = {
  colorObj: PropTypes.object,
  title: PropTypes.string,
  isLarge: PropTypes.bool,
  isHovered: PropTypes.bool,
};

const MemoizedMarqueeItem = React.memo(
  ({
    canvas,
    popoverState,
    onSelect,
    onMouseEnter,
    activeColor,
    shape,
    isLineActive,
    compact,
  }) => {
    const isFocused = popoverState.canvas?.canvasId === canvas.canvasId;
    return (
      <MarqueeItem
        $compact={compact}
        onClick={() => onSelect(canvas)}
        onMouseEnter={(e) => onMouseEnter(e, canvas)}
        $isLineActive={isLineActive}
      >
        <CirclePulseRing $active={isFocused} $color={activeColor} $shape={shape} />
        <CircleBg $active={isFocused} $color={activeColor} $shape={shape} />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <CustomRotatingMockup
            colorObj={canvas.availableColors?.[0]}
            title={canvas.title}
            isHovered={isFocused}
          />
        </div>
      </MarqueeItem>
    );
  }
);
MemoizedMarqueeItem.displayName = "MemoizedMarqueeItem";

MemoizedMarqueeItem.propTypes = {
  canvas: PropTypes.object.isRequired,
  popoverState: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  activeColor: PropTypes.string,
  shape: PropTypes.string,
  isLineActive: PropTypes.bool,
  compact: PropTypes.bool,
};

// ===========================================================================
// MAIN CANVAS LIBRARY COMPONENT
// ===========================================================================

const CanvasLibrary = ({
  shopId,
  onSelectCanvas,
  onBlankOrderClick,
  shop,
  displayMode = "all",
}) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const observerRef = useRef();

  const { paginatedProducts, paginationLoading, paginationMeta } = useSelector(
    (state) => state.products
  );
  const { categories } = useSelector(selectCategories);

  // States
  const [popoverState, setPopoverState] = useState({ canvas: null, rect: null });
  const [gasState, setGasState] = useState({
    x: 0,
    y: 0,
    size: "200px",
    color: "rgba(240, 122, 72, 0.15)",
  });
  const [hoveredLineIdx, setHoveredLineIdx] = useState(null);
  const [isItemHovered, setIsItemHovered] = useState(false);

  // DEFAULT VIEW MODE IS NOW LIST VIEW
  const [layoutMode, setLayoutMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // ACCORDION MENU STATE (Closed by default for all sections)
  const [openSections, setOpenSections] = useState({
    surface: false,
    group: false,
    gsm: false,
    material: false,
    cut: false,
    colors: false,
  });

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Multi-Facet Filter States
  const [selectedGsm, setSelectedGsm] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedCut, setSelectedCut] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [hasBackPrintFilter, setHasBackPrintFilter] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // 🟢 1. DEFINE hasActiveFilters BEFORE ANY useMemo THAT CONSUMES IT
  const hasActiveFilters = useMemo(() => {
    return !!(
      selectedGsm ||
      selectedMaterial ||
      selectedCut ||
      selectedColor ||
      hasBackPrintFilter ||
      selectedGroup
    );
  }, [
    selectedGsm,
    selectedMaterial,
    selectedCut,
    selectedColor,
    hasBackPrintFilter,
    selectedGroup,
  ]);

  // 🟢 2. DEFINE clearAllFilters
  const clearAllFilters = () => {
    setSelectedGsm(null);
    setSelectedMaterial(null);
    setSelectedCut(null);
    setSelectedColor(null);
    setHasBackPrintFilter(null);
    setSelectedGroup(null);
    setSelectedCategory(null);
    setSearchQuery("");
  };

  // Ref tracker to prevent duplicate category API calls
  const fetchedCatIdsRef = useRef(new Set());

  useEffect(() => {
    if (!paginatedProducts || paginatedProducts.length === 0) return;

    const extractedCategoryIds = paginatedProducts
      .map((p) => {
        if (!p.categoryId) return null;
        if (typeof p.categoryId === "object") {
          return p.categoryId._id || p.categoryId.id;
        }
        return p.categoryId;
      })
      .filter((id) => id && typeof id === "string");

    const uniqueIds = Array.from(new Set(extractedCategoryIds));
    const missingIds = uniqueIds.filter(
      (id) =>
        !fetchedCatIdsRef.current.has(id) &&
        !categories.some((cat) => String(cat.id || cat._id) === String(id))
    );

    if (missingIds.length > 0) {
      missingIds.forEach((id) => fetchedCatIdsRef.current.add(id));
      dispatch(fetchCategories(missingIds));
    }
  }, [paginatedProducts, categories, dispatch]);

  useEffect(() => {
    if (paginationLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && paginationMeta?.hasMore) {
          dispatch(
            fetchPaginatedProducts({
              shopId,
              page: paginationMeta.page + 1,
              limit: 40,
              categoryId: selectedCategory || "",
              search: searchQuery,
              isNewFilter: false,
              printOnDemand: true,
            })
          );
        }
      },
      { threshold: 0.1 }
    );

    const currentTrigger = observerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }
    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [
    dispatch,
    shopId,
    selectedCategory,
    searchQuery,
    paginationLoading,
    paginationMeta,
  ]);

  const canvasList = useMemo(() => {
    if (!Array.isArray(paginatedProducts)) return [];
    return paginatedProducts
      .map((p) => {
        const mapped = productToCanvasAdapter(p);
        if (!mapped) return null;
        return {
          ...mapped,
          rawProduct: p,
          sku: p.sku || String(p._id || p.id).substring(0, 5).toUpperCase(),
          rawCategory: p.categoryId,
          hasBackPrintSurface: p.hasBackPrintSurface,
          shortDescription: p.shortDescription || "",
          discoveryGroup: p.discoveryGroup || "fashion",
          baseCost: p.availabilities?.[0]?.sizes?.[0]?.sellingPrice || 0,
        };
      })
      .filter(Boolean);
  }, [paginatedProducts]);

  const railsData = useMemo(() => {
    const list = [...canvasList];
    const segmentSize = Math.ceil(list.length / 2);
    return [list.slice(0, segmentSize), list.slice(segmentSize)];
  }, [canvasList]);

  const availableFacets = useMemo(() => {
    const gsms = new Set();
    const materials = new Set();
    const cuts = new Set();
    const colors = new Set();
    const groups = new Set();

    canvasList.forEach((c) => {
      if (c.discoveryGroup) groups.add(c.discoveryGroup);
      if (Array.isArray(c.rawProduct?.specifications)) {
        c.rawProduct.specifications.forEach((spec) => {
          const name = spec.name?.toLowerCase();
          if (name === "gsm" && spec.value) gsms.add(spec.value);
          if (name === "material" && spec.value) materials.add(spec.value);
          if ((name === "cut" || name === "fit") && spec.value)
            cuts.add(spec.value);
        });
      }
      if (Array.isArray(c.availableColors)) {
        c.availableColors.forEach((ac) => {
          if (ac.colorName) colors.add(ac.colorName);
        });
      }
    });

    return {
      gsm: Array.from(gsms),
      material: Array.from(materials),
      cut: Array.from(cuts),
      colors: Array.from(colors),
      groups: Array.from(groups),
    };
  }, [canvasList]);

  // 🟢 3. DEFINE filteredList
  const filteredList = useMemo(() => {
    return canvasList.filter((c) => {
      const prod = c.rawProduct;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = c.title.toLowerCase().includes(query);
        const matchesSku = c.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesSku) return false;
      }

      if (selectedCategory) {
        const catId =
          c.rawCategory?.id || c.rawCategory?._id || c.rawCategory;
        if (catId !== selectedCategory) return false;
      }

      if (hasBackPrintFilter && !c.hasBackPrintSurface) return false;
      if (selectedGroup && c.discoveryGroup !== selectedGroup) return false;

      if (selectedGsm) {
        const gsmSpec = prod.specifications?.find(
          (s) => s.name?.toLowerCase() === "gsm"
        )?.value;
        if (gsmSpec !== selectedGsm) return false;
      }

      if (selectedMaterial) {
        const matSpec = prod.specifications?.find(
          (s) => s.name?.toLowerCase() === "material"
        )?.value;
        if (matSpec !== selectedMaterial) return false;
      }

      if (selectedCut) {
        const cutSpec = prod.specifications?.find(
          (s) =>
            s.name?.toLowerCase() === "cut" || s.name?.toLowerCase() === "fit"
        )?.value;
        if (cutSpec !== selectedCut) return false;
      }

      if (selectedColor) {
        const hasColor = c.availableColors?.some(
          (ac) =>
            String(ac.colorName).toLowerCase() ===
            String(selectedColor).toLowerCase()
        );
        if (!hasColor) return false;
      }

      return true;
    });
  }, [
    canvasList,
    searchQuery,
    selectedCategory,
    hasBackPrintFilter,
    selectedGroup,
    selectedGsm,
    selectedMaterial,
    selectedCut,
    selectedColor,
  ]);

  // 🟢 4. DEFINE categoryGroupedList (SAFE DEPENDENCY CONSUMPTION)
  const categoryGroupedList = useMemo(() => {
    if (selectedCategory || searchQuery || hasActiveFilters) {
      return null;
    }

    const groupsMap = {};
    filteredList.forEach((c) => {
      const catId =
        c.rawCategory?.id || c.rawCategory?._id || c.rawCategory || "uncategorized";
      const catObj = categories.find(
        (cat) => String(cat.id || cat._id) === String(catId)
      );
      const catName = catObj
        ? isArabic
          ? catObj.name
          : catObj.nameFr || catObj.name
        : "General Canvases";

      if (!groupsMap[catId]) {
        groupsMap[catId] = { id: catId, name: catName, items: [] };
      }
      groupsMap[catId].items.push(c);
    });

    return Object.values(groupsMap);
  }, [filteredList, selectedCategory, searchQuery, hasActiveFilters, categories, isArabic]);

  const getColorHex = (canvasObj) => {
    if (!canvasObj) return "#F07A48";
    const color = String(
      canvasObj.availableColors?.[0]?.colorName || ""
    ).toLowerCase();
    if (color.includes("green") || color.includes("vert")) return "#1D9E75";
    if (
      color.includes("blue") ||
      color.includes("bleu") ||
      color.includes("navy")
    )
      return "#397FF9";
    if (color.includes("grey") || color.includes("gris")) return "#A1A1AA";
    if (color.includes("rose") || color.includes("pink")) return "#EC4899";
    if (color.includes("yellow") || color.includes("jaune")) return "#F59E0B";
    if (
      color.includes("red") ||
      color.includes("rouge") ||
      color.includes("bordeaux")
    )
      return "#EF4444";
    return "#F07A48";
  };

  const handleMouseEnter = (e, canvas, lineIdx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.offsetParent
      ? e.currentTarget.offsetParent.getBoundingClientRect()
      : { left: 0, top: 0 };
    setPopoverState({ canvas, rect });
    setIsItemHovered(true);
    setHoveredLineIdx(lineIdx);
    const x = rect.left - parentRect.left + rect.width / 2;
    const y = rect.top - parentRect.top + rect.height / 2;
    const themeColor = getColorHex(canvas);
    setGasState({ x, y, size: "260px", color: `${themeColor}25` });
  };

  const handleMouseLeave = () => {
    setPopoverState({ canvas: null, rect: null });
    setIsItemHovered(false);
    setHoveredLineIdx(null);
    setGasState((prev) => ({ ...prev, size: "180px" }));
  };

  const popoverStyle = useMemo(() => {
    if (!popoverState.rect) return {};
    const { top, left, height } = popoverState.rect;
    let popTop = top + height / 2 - 250;
    popTop = Math.max(20, Math.min(popTop, window.innerHeight - 520));

    if (displayMode === "marquee") {
      return { top: popTop, left: left + 90 };
    }

    const isLeftHalf = left < window.innerWidth / 2;
    return isLeftHalf
      ? { top: popTop, left: left + 100 }
      : { top: popTop, right: window.innerWidth - left + 20 };
  }, [popoverState.rect, displayMode]);

  const getShapeType = (index) => {
    const remainder = index % 3;
    if (remainder === 1) return "squircle";
    if (remainder === 2) return "diamond";
    return "circle";
  };

  if (paginationLoading && canvasList.length === 0) {
    return <Loader fullscreen={false} />;
  }

  const speedScaleTopBottom = hoveredLineIdx !== null ? 240 : 45;

  // MARQUEE MODE
  if (displayMode === "marquee") {
    return (
      <LibraryContainer
        onMouseLeave={handleMouseLeave}
        style={{ height: "100%", padding: 0 }}
      >
        <FluidGasBackdrop
          animate={{
            left: gasState.x - 120,
            top: gasState.y - 120,
            scale: [1, 1.15, 0.9, 1],
            opacity: [0.75, 0.9, 0.65, 0.75],
          }}
          transition={{
            left: { type: "spring", stiffness: 90, damping: 20 },
            top: { type: "spring", stiffness: 90, damping: 20 },
            scale: { repeat: Infinity, duration: 8, ease: "easeInOut" },
            opacity: { repeat: Infinity, duration: 8, ease: "easeInOut" },
          }}
          $size={gasState.size}
          $color={gasState.color}
        />
        <VerticalMarqueeWrapper>
          {railsData.map((railItems, lineIdx) => {
            if (railItems.length === 0) return null;
            const isLineActive = hoveredLineIdx === lineIdx;
            const isReverse = lineIdx === 1;
            return (
              <div
                key={lineIdx}
                onMouseEnter={() => setHoveredLineIdx(lineIdx)}
                onMouseLeave={() => setHoveredLineIdx(null)}
                style={{ overflow: "visible", height: "100%" }}
              >
                <VerticalMarqueeTrack
                  $reverse={isReverse}
                  $speed={
                    isReverse
                      ? speedScaleTopBottom + 10
                      : speedScaleTopBottom
                  }
                  $isPaused={isItemHovered && hoveredLineIdx === lineIdx}
                >
                  {[...railItems, ...railItems, ...railItems, ...railItems].map(
                    (canvas, idx) => (
                      <MemoizedMarqueeItem
                        key={`${canvas.canvasId}-${lineIdx}-${idx}`}
                        canvas={canvas}
                        popoverState={popoverState}
                        onSelect={onSelectCanvas}
                        onMouseEnter={(e) =>
                          handleMouseEnter(e, canvas, lineIdx)
                        }
                        activeColor={getColorHex(canvas)}
                        shape={getShapeType(idx)}
                        isLineActive={isLineActive}
                        compact={true}
                      />
                    )
                  )}
                </VerticalMarqueeTrack>
              </div>
            );
          })}
        </VerticalMarqueeWrapper>

        <AnimatePresence>
          {popoverState.canvas && popoverState.rect && (
            <FloatingPopover
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.2 }}
              style={popoverStyle}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    fontFamily: "Tajawal",
                  }}
                >
                  {t("pod_studio_blank_specifications", "MATERIAL BLUEPRINT")}
                </h4>
                <SpecBadge>{popoverState.canvas.sku}</SpecBadge>
              </div>
              <BlueprintStage>
                <TagInfo>
                  <CoreTag>{popoverState.canvas.sku}</CoreTag>
                  <div
                    style={{
                      color: "white",
                      fontWeight: 900,
                      fontFamily: "Tajawal",
                      fontSize: "1rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {popoverState.canvas.title}
                  </div>
                </TagInfo>
                <CustomRotatingMockup
                  colorObj={popoverState.canvas.availableColors?.[0]}
                  title={popoverState.canvas.title}
                  isLarge={true}
                  isHovered={true}
                />
                <CoordinateOverlay>
                  <CoordText>
                    GSM:{" "}
                    {popoverState.canvas.rawProduct?.specifications?.find(
                      (s) => s.name?.toLowerCase() === "gsm"
                    )?.value || "---"}
                  </CoordText>
                </CoordinateOverlay>
              </BlueprintStage>
            </FloatingPopover>
          )}
        </AnimatePresence>
      </LibraryContainer>
    );
  }

  // CATALOG MODE (GRID / LIST + ACCORDION SIDEBAR)
  return (
    <LibraryContainer onMouseLeave={handleMouseLeave}>
      <ProductFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isPodShop={true}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        onToggleFilterDrawer={() => setFilterDrawerOpen(!filterDrawerOpen)}
        hasActiveFilters={hasActiveFilters}
      />

      <SplitLayout $isArabic={isArabic}>
        {/* Dynamic Accordion Filter Sidebar */}
        <Sidebar $isOpenMobile={filterDrawerOpen}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <h4
              style={{
                margin: 0,
                color: "#fff",
                fontFamily: "Tajawal",
                fontWeight: 800,
              }}
            >
              {t("filter_title", "Filters")}
            </h4>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#f07a48",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontFamily: "Tajawal",
                }}
              >
                {t("filter_clear_all", "Clear All")}
              </button>
            )}
          </div>

          {/* Section 1: Print Surface */}
          <AccordionSection>
            <AccordionHeader onClick={() => toggleSection("surface")}>
              <div className="header-title-group">
                <span>{t("filter_print_surface", "Print Surface")}</span>
                {!openSections.surface && hasBackPrintFilter && (
                  <RedActiveBadge>1</RedActiveBadge>
                )}
              </div>
              {openSections.surface ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </AccordionHeader>
            <AnimatePresence>
              {openSections.surface && (
                <AccordionContent
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FilterChip
                    $active={hasBackPrintFilter === true}
                    onClick={() =>
                      setHasBackPrintFilter(hasBackPrintFilter ? null : true)
                    }
                  >
                    {t("filter_front_back_accessible", "Front & Back Accessible")}
                  </FilterChip>
                </AccordionContent>
              )}
            </AnimatePresence>
          </AccordionSection>

          {/* Section 2: Collection Group */}
          {availableFacets.groups.length > 0 && (
            <AccordionSection>
              <AccordionHeader onClick={() => toggleSection("group")}>
                <div className="header-title-group">
                  <span>{t("filter_collection_group", "Collection Group")}</span>
                  {!openSections.group && selectedGroup && (
                    <RedActiveBadge>1</RedActiveBadge>
                  )}
                </div>
                {openSections.group ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </AccordionHeader>
              <AnimatePresence>
                {openSections.group && (
                  <AccordionContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FilterChipGroup>
                      {availableFacets.groups.map((grp) => (
                        <FilterChip
                          key={grp}
                          $active={selectedGroup === grp}
                          onClick={() =>
                            setSelectedGroup(selectedGroup === grp ? null : grp)
                          }
                        >
                          {t(`group_${grp}`, grp.toUpperCase())}
                        </FilterChip>
                      ))}
                    </FilterChipGroup>
                  </AccordionContent>
                )}
              </AnimatePresence>
            </AccordionSection>
          )}

          {/* Section 3: Fabric Weight */}
          {availableFacets.gsm.length > 0 && (
            <AccordionSection>
              <AccordionHeader onClick={() => toggleSection("gsm")}>
                <div className="header-title-group">
                  <span>{t("filter_fabric_weight", "Fabric Weight")}</span>
                  {!openSections.gsm && selectedGsm && (
                    <RedActiveBadge>1</RedActiveBadge>
                  )}
                </div>
                {openSections.gsm ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </AccordionHeader>
              <AnimatePresence>
                {openSections.gsm && (
                  <AccordionContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FilterChipGroup>
                      {availableFacets.gsm.map((gsm) => (
                        <FilterChip
                          key={gsm}
                          $active={selectedGsm === gsm}
                          onClick={() =>
                            setSelectedGsm(selectedGsm === gsm ? null : gsm)
                          }
                        >
                          {gsm}
                        </FilterChip>
                      ))}
                    </FilterChipGroup>
                  </AccordionContent>
                )}
              </AnimatePresence>
            </AccordionSection>
          )}

          {/* Section 4: Material */}
          {availableFacets.material.length > 0 && (
            <AccordionSection>
              <AccordionHeader onClick={() => toggleSection("material")}>
                <div className="header-title-group">
                  <span>{t("filter_material", "Material")}</span>
                  {!openSections.material && selectedMaterial && (
                    <RedActiveBadge>1</RedActiveBadge>
                  )}
                </div>
                {openSections.material ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </AccordionHeader>
              <AnimatePresence>
                {openSections.material && (
                  <AccordionContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FilterChipGroup>
                      {availableFacets.material.map((mat) => (
                        <FilterChip
                          key={mat}
                          $active={selectedMaterial === mat}
                          onClick={() =>
                            setSelectedMaterial(
                              selectedMaterial === mat ? null : mat
                            )
                          }
                        >
                          {mat}
                        </FilterChip>
                      ))}
                    </FilterChipGroup>
                  </AccordionContent>
                )}
              </AnimatePresence>
            </AccordionSection>
          )}

          {/* Section 5: Cut & Fit */}
          {availableFacets.cut.length > 0 && (
            <AccordionSection>
              <AccordionHeader onClick={() => toggleSection("cut")}>
                <div className="header-title-group">
                  <span>{t("filter_cut_fit", "Cut & Fit")}</span>
                  {!openSections.cut && selectedCut && (
                    <RedActiveBadge>1</RedActiveBadge>
                  )}
                </div>
                {openSections.cut ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </AccordionHeader>
              <AnimatePresence>
                {openSections.cut && (
                  <AccordionContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <FilterChipGroup>
                      {availableFacets.cut.map((c) => (
                        <FilterChip
                          key={c}
                          $active={selectedCut === c}
                          onClick={() =>
                            setSelectedCut(selectedCut === c ? null : c)
                          }
                        >
                          {c}
                        </FilterChip>
                      ))}
                    </FilterChipGroup>
                  </AccordionContent>
                )}
              </AnimatePresence>
            </AccordionSection>
          )}

          {/* Section 6: Colors */}
          {availableFacets.colors.length > 0 && (
            <AccordionSection>
              <AccordionHeader onClick={() => toggleSection("colors")}>
                <div className="header-title-group">
                  <span>{t("filter_colors", "Colors")}</span>
                  {!openSections.colors && selectedColor && (
                    <RedActiveBadge>1</RedActiveBadge>
                  )}
                </div>
                {openSections.colors ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </AccordionHeader>
              <AnimatePresence>
                {openSections.colors && (
                  <AccordionContent
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {availableFacets.colors.map((colorName) => (
                        <ColorFilterSwatch
                          key={colorName}
                          $active={selectedColor === colorName}
                          $colorCode={colorName}
                          onClick={() =>
                            setSelectedColor(
                              selectedColor === colorName ? null : colorName
                            )
                          }
                          title={colorName}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                )}
              </AnimatePresence>
            </AccordionSection>
          )}
        </Sidebar>

        {/* Catalog Main Content */}
        <MainContentArea>
          {categoryGroupedList ? (
            /* CATEGORY GROUPED VIEW WITH "SEE ALL" BUTTON */
            categoryGroupedList.map((group) => (
              <CategorySectionRow key={group.id}>
                <CategoryRowHeader $isArabic={isArabic}>
                  <h4>{group.name}</h4>
                  {group.items.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(group.id)}
                    >
                      <span>{t("see_all", "See All")}</span>
                      {isArabic ? <FaArrowLeft size={10} /> : <FaArrowRight size={10} />}
                    </button>
                  )}
                </CategoryRowHeader>

                <DynamicViewContainer $mode={layoutMode}>
                  {group.items.slice(0, 3).map((canvas, index) => (
                    <PremiumProductCard
                      key={canvas.canvasId}
                      product={canvas.rawProduct}
                      index={index}
                      onCardClick={() => onSelectCanvas(canvas.rawProduct)}
                      onBlankOrderClick={onBlankOrderClick}
                      isPodShop={true}
                      layoutType={layoutMode}
                    />
                  ))}
                </DynamicViewContainer>
              </CategorySectionRow>
            ))
          ) : (
            /* FLAT FILTERED VIEW */
            <DynamicViewContainer $mode={layoutMode}>
              {filteredList.length > 0 ? (
                filteredList.map((canvas, index) => (
                  <PremiumProductCard
                    key={canvas.canvasId}
                    product={canvas.rawProduct}
                    index={index}
                    onCardClick={() => onSelectCanvas(canvas.rawProduct)}
                    onBlankOrderClick={onBlankOrderClick}
                    isPodShop={true}
                    layoutType={layoutMode}
                  />
                ))
              ) : (
                <div
                  style={{
                    color: "#a1a1aa",
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "4rem 1rem",
                    background: "#08080a",
                    borderRadius: "20px",
                    border: "1px dashed rgba(255,255,255,0.08)",
                  }}
                >
                  No blank canvases match your filter criteria.
                </div>
              )}
            </DynamicViewContainer>
          )}

          <LoadMoreTrigger ref={observerRef}>
            {paginationLoading && <InlineSpinner />}
          </LoadMoreTrigger>
        </MainContentArea>
      </SplitLayout>
    </LibraryContainer>
  );
};

CanvasLibrary.propTypes = {
  shopId: PropTypes.string.isRequired,
  onSelectCanvas: PropTypes.func.isRequired,
  onBlankOrderClick: PropTypes.func,
  shop: PropTypes.object.isRequired,
  displayMode: PropTypes.string,
};

export default CanvasLibrary;