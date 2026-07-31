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
  FaSearch,
  FaPalette,
  FaTshirt,
} from "react-icons/fa";
import {
  fetchPaginatedProducts,
  selectProducts,
} from "../../../Product/state/reducers";
import { selectCategories } from "../../../Categories/state/reducers";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import Loader from "../../../../components/Loader";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";

// --- TEXT PARSER ---
const parseBilingualText = (text, targetLang) => {
  if (!text) return "";
  return text;
};

// Global in-memory image cache dictionary (Zero-fetch lag)
const imageCache = {};

// ==========================================================
// STYLED COMPONENTS - GLASS STITCH INTERACTIVE WORKSPACE
// ==========================================================

const LibraryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
  z-index: 2;
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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 2;

  h3 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
    font-family: "Tajawal", sans-serif;
    text-transform: uppercase;
  }
  .line {
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.12),
      transparent
    );
  }
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;
  position: relative;
  z-index: 2;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    background: #111214;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    color: white;
    font-size: 0.85rem;
    outline: none;
    font-family: "Tajawal", sans-serif;
    transition: border-color 0.2s;
    &:focus {
      border-color: #f07a48;
    }
  }
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #52525b;
  }
`;

// --- MULTI-RAIL CAROUSEL WRAPPERS ---
const MarqueeWrapper = styled.div`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow: hidden;
  padding: 3rem 0; /* Extra clearance room */
  mask-image: linear-gradient(
    to right,
    transparent,
    black 15%,
    black 85%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 15%,
    black 85%,
    transparent
  );
  direction: ltr;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const scrollLeft = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
`;

const scrollRight = keyframes`
  0% { transform: translate3d(-50%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
`;

const MarqueeTrack = styled.div`
  display: flex;
  gap: 3rem;
  width: max-content;
  align-items: center;
  animation: ${(props) => (props.$reverse ? scrollRight : scrollLeft)} 
             ${(props) => props.$speed}s linear infinite;
  animation-play-state: ${(props) => (props.$isPaused ? "paused" : "running")};
  will-change: transform;
`;

const MarqueeItem = styled.div`
  width: ${(props) => (props.$isLineActive ? "130px" : "85px")};
  height: ${(props) => (props.$isLineActive ? "130px" : "85px")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-8px);
    z-index: 10;
  }
`;

const expandPulse = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.35);
    opacity: 0;
  }
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
        border: 1.5px solid ${props.$active ? props.$color || "#f07a48" : "rgba(255, 255, 255, 0.05)"};
      `;
    }
    if (props.$shape === "squircle") {
      return css`
        transform: translate(-50%, -50%);
        border-radius: 18px;
        border: 1.5px solid ${props.$active ? props.$color || "#f07a48" : "rgba(255, 255, 255, 0.05)"};
      `;
    }
    return css`
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 1.5px solid ${props.$active ? props.$color || "#f07a48" : "rgba(255, 255, 255, 0.05)"};
    `;
  }}

  box-shadow: ${(props) =>
    props.$active
      ? `0 0 25px ${props.$color || "rgba(240, 122, 72, 0.35)"}, inset 0 0 10px rgba(255, 255, 255, 0.02)`
      : "0 10px 25px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.02)"};

  ${MarqueeItem}:hover & {
    border-color: ${(props) => props.$color || "#f07a48"};
    box-shadow:
      0 15px 35px ${(props) => props.$color || "rgba(240, 122, 72, 0.25)"},
      inset 0 0 15px rgba(240, 122, 72, 0.05);
  }
`;

// --- GRID CARD COMPONENTS ---
const GridCard = styled.div`
  background: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  z-index: 2;

  &:hover {
    border-color: #f07a48;
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }
`;

const GridImageStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 70%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;

  img {
    max-width: 85%;
    max-height: 85%;
    object-fit: contain;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.5));
    transition: transform 0.4s ease;
  }

  ${GridCard}:hover & img {
    transform: scale(1.08);
  }
`;

const GridInfo = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  flex-grow: 1;
  justify-content: space-between;
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

const ActionBtn = styled.button`
  background: #f07a48;
  color: #000;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    transform: scale(1.02);
    filter: brightness(1.15);
  }
`;

// --- FLOATING POPOVER (MATERIAL BLUEPRINT) ---
const FloatingPopover = styled(motion.div)`
  position: fixed;
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
  width: 380px;
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
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
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
  gap: 0.3;
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

const TechRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.4rem;
  .label {
    font-size: 0.75rem;
    color: #71717a;
    font-weight: 800;
    text-transform: uppercase;
    font-family: "Tajawal", sans-serif;
  }
  .value {
    font-size: 0.8rem;
    color: #e4e4e7;
    font-weight: 700;
    font-family: monospace;
  }
`;

// 🔴 AUTOMATED INFINITE SCROLL DUSTING PORTAL
const LoadMoreTrigger = styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
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
    to { transform: rotate(360deg); }
  }
`;

const APPAREL_EMOJIS = ["👕", "👔", "🧥", "🥼", "👖", "🩳", "🧦", "👟", "🎒", "👜", "🧢", "🎽", "👗", "👘", "🥻", "👠", "👡", "👢", "🧣", "🧤", "🎩", "👑", "🎒", "💼"];

const getStableEmoji = (id, index) => {
  const str = String(id || index || "");
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  const emojiIndex = (sum + (index || 0)) % APPAREL_EMOJIS.length;
  return APPAREL_EMOJIS[emojiIndex];
};

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
        getImage(imgId).then((res) => {
          if (res.data) {
            const url = getImageUrl(res.data);
            imageCache[imgId] = url;
            if (isMounted) setFrontUrl(url);
          }
        }).catch(() => {});
      }

      if (colorObj?.podBackTemplateId) {
        const bImgId = colorObj.podBackTemplateId;
        if (imageCache[bImgId]) {
          if (isMounted) setBackUrl(imageCache[bImgId]);
        } else {
          getImage(bImgId).then((res) => {
            if (res.data) {
              const url = getImageUrl(res.data);
              imageCache[bImgId] = url;
              if (isMounted) setBackUrl(url);
            }
          }).catch(() => {});
        }
      }
    };

    loadImages();
    return () => { isMounted = false; };
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
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
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
          style={{ position: "absolute", width: isLarge ? "85%" : "100%", height: isLarge ? "85%" : "100%", objectFit: "contain", filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))" }}
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
          style={{ position: "absolute", width: isLarge ? "85%" : "100%", height: isLarge ? "85%" : "100%", objectFit: "contain", filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.5))" }}
        />
      )}
    </div>
  );
};

const MemoizedMarqueeItem = React.memo(
  ({ canvas, popoverState, onSelect, onMouseEnter, activeColor, shape, isLineActive }) => {
    const isFocused = popoverState.canvas?.canvasId === canvas.canvasId;
    return (
      <MarqueeItem onClick={() => onSelect(canvas)} onMouseEnter={(e) => onMouseEnter(e, canvas)} $isLineActive={isLineActive}>
        <CirclePulseRing $active={isFocused} $color={activeColor} $shape={shape} />
        <CircleBg $active={isFocused} $color={activeColor} $shape={shape} />
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
          <CustomRotatingMockup colorObj={canvas.availableColors?.[0]} title={canvas.title} isHovered={isFocused} />
        </div>
      </MarqueeItem>
    );
  },
);
MemoizedMarqueeItem.displayName = "MemoizedMarqueeItem";

const CanvasLibrary = ({ shopId, onSelectCanvas, shop }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const observerRef = useRef();

  const { paginatedProducts, paginationLoading, paginationMeta } = useSelector(
    (state) => state.products,
  );
  const { categories } = useSelector(selectCategories);

  const [popoverState, setPopoverState] = useState({ canvas: null, rect: null });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [gasState, setGasState] = useState({
    x: 0, y: 0, size: "200px", color: "rgba(240, 122, 72, 0.15)",
  });

  const [hoveredLineIdx, setHoveredLineIdx] = useState(null);
  const [isItemHovered, setIsItemHovered] = useState(false);

// 🔴 LAZY LOADING: Automatically triggers and reads next pages on scroll
  useEffect(() => {
    if (paginationLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && paginationMeta?.hasMore) {
          dispatch(
            fetchPaginatedProducts({ 
              shopId,
              page: paginationMeta.page + 1,
              limit: 25, // <-- Increased from 12
              categoryId: selectedCategory || "",
              search: searchQuery,
              isNewFilter: false, // Appends new products to list
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
  }, [dispatch, shopId, selectedCategory, searchQuery, paginationLoading, paginationMeta]);

  
  const shopCategoryIds = useMemo(() => {
    if (!shop?.categories) return [];
    return shop.categories.map((cat) => typeof cat === "object" ? cat._id || cat.id : cat);
  }, [shop]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => shopCategoryIds.includes(cat.id || cat._id));
  }, [categories, shopCategoryIds]);

  const canvasList = useMemo(() => {
    if (!Array.isArray(paginatedProducts)) return [];
    return paginatedProducts
      .map((p) => {
        const mapped = productToCanvasAdapter(p);
        if (!mapped) return null;
        return {
          ...mapped,
          sku: p.sku || String(p._id || p.id).substring(0, 5).toUpperCase(),
          rawCategory: p.categoryId,
          shortDescription: p.shortDescription || "",
          baseCost: p.availabilities?.[0]?.sizes?.[0]?.sellingPrice || 0,
        };
      })
      .filter(Boolean);
  }, [paginatedProducts]);

  const railsData = useMemo(() => {
    const list = [...canvasList];
    const segmentSize = Math.ceil(list.length / 2);
    return [
      list.slice(0, segmentSize),
      list.slice(segmentSize),
    ];
  }, [canvasList]);

  const filteredList = useMemo(() => {
    return canvasList.filter((canvas) => {
      const canvasCatId = canvas.rawCategory?.id || canvas.rawCategory?._id || canvas.rawCategory;
      const matchesCategory = !selectedCategory || canvasCatId === selectedCategory;
      const matchesSearch = !searchQuery || canvas.title.toLowerCase().includes(searchQuery.toLowerCase()) || canvas.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [canvasList, selectedCategory, searchQuery]);

  const getColorHex = (canvasObj) => {
    if (!canvasObj) return "#F07A48";
    const color = String(canvasObj.availableColors?.[0]?.colorName || "").toLowerCase();
    if (color.includes("green") || color.includes("vert")) return "#1D9E75";
    if (color.includes("blue") || color.includes("bleu") || color.includes("navy")) return "#397FF9";
    if (color.includes("grey") || color.includes("gris")) return "#A1A1AA";
    if (color.includes("rose") || color.includes("pink")) return "#EC4899";
    if (color.includes("yellow") || color.includes("jaune")) return "#F59E0B";
    if (color.includes("red") || color.includes("rouge") || color.includes("bordeaux")) return "#EF4444";
    return "#F07A48";
  }; 

  const handleMouseEnter = (e, canvas, lineIdx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.offsetParent.getBoundingClientRect();
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
    const { top, left, right, height } = popoverState.rect;
    const isLeftHalf = left < window.innerWidth / 2;
    let popTop = top + height / 2 - 500 / 2;
    popTop = Math.max(20, Math.min(popTop, window.innerHeight - 520));
    return isLeftHalf ? { top: popTop, left: right + 20 } : { top: popTop, right: window.innerWidth - left + 20 };
  }, [popoverState.rect]);

  const getShapeType = (index) => {
    const remainder = index % 3;
    if (remainder === 1) return "squircle";
    if (remainder === 2) return "diamond";
    return "circle";
  };

  if (paginationLoading && canvasList.length === 0)
    return <Loader fullscreen={false} />;

  const speedScaleTopBottom = hoveredLineIdx !== null ? 240 : 24;
  const speedScaleMiddle = hoveredLineIdx !== null ? 300 : 30;

  return (
    <LibraryContainer onMouseLeave={handleMouseLeave}>
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

      <MarqueeWrapper>
        {railsData.map((railItems, lineIdx) => {
          if (railItems.length === 0) return null;
          const isLineActive = hoveredLineIdx === lineIdx;
          const isReverse = lineIdx === 1;
          return (
            <div key={lineIdx} onMouseEnter={() => setHoveredLineIdx(lineIdx)} onMouseLeave={() => setHoveredLineIdx(null)} style={{ overflow: "visible", width: "100%" }}>
              <MarqueeTrack $reverse={isReverse} $speed={isReverse ? speedScaleMiddle : speedScaleTopBottom} $isPaused={isItemHovered && hoveredLineIdx === lineIdx}>
                {[...railItems, ...railItems, ...railItems, ...railItems].map((canvas, idx) => (
                  <MemoizedMarqueeItem
                    key={`${canvas.canvasId}-${lineIdx}-${idx}`}
                    canvas={canvas}
                    popoverState={popoverState}
                    onSelect={onSelectCanvas}
                    onMouseEnter={(e) => handleMouseEnter(e, canvas, lineIdx)}
                    activeColor={getColorHex(canvas)}
                    shape={getShapeType(idx)}
                    isLineActive={isLineActive}
                  />
                ))}
              </MarqueeTrack>
            </div>
          );
        })}
      </MarqueeWrapper>

      <SectionHeader style={{ marginTop: "1rem" }}>
        <h3>{t("pod_studio_catalog_heading", "Explore Blank")}</h3>
        <div className="line" />
      </SectionHeader>

      <FilterRow $isArabic={isArabic}>
        <div className="auras-pills-row">
          <button className={`auras-category-pill ${selectedCategory === null ? "active" : ""}`} onClick={() => setSelectedCategory(null)}>
            {t("all_products", "All")}
          </button>
          {filteredCategories.map((cat) => (
            <button key={cat.id || cat._id} className={`auras-category-pill ${selectedCategory === (cat.id || cat._id) ? "active" : ""}`} onClick={() => setSelectedCategory(cat.id || cat._id)}>
              {isArabic ? cat.name : cat.nameFr || cat.name}
            </button>
          ))}
        </div>
        <SearchBox>
          <FaSearch />
          <input type="text" placeholder={t("search_products")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </SearchBox>
      </FilterRow>

      <div className="auras-5-4-grid">
        {filteredList.map((canvas) => (
          <GridCard key={canvas.canvasId} className="auras-5-4-item" onClick={() => onSelectCanvas(canvas)} onMouseEnter={(e) => handleMouseEnter(e, canvas, null)}>
            <GridImageStage>
              <CustomRotatingMockup colorObj={canvas.availableColors?.[0]} title={canvas.title} isLarge={false} />
            </GridImageStage>
            <GridInfo>
              <div>
                <SpecBadge>{canvas.sku}</SpecBadge>
                <h3 style={{ margin: "8px 0", fontSize: "1.05rem", color: "white", fontFamily: "Tajawal", fontWeight: 800 }}>
                  {canvas.title}
                </h3>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}>
                  {parseInt(canvas.baseCost)} {t("dzd", "DA")}
                </span>
                <ActionBtn>
                  <FaTshirt /> Design
                </ActionBtn>
              </div>
            </GridInfo>
          </GridCard>
        ))}
      </div>

      {/* 🔴 Trigger to load next pages on scroll down */}
      <LoadMoreTrigger ref={observerRef}>
        {paginationLoading && <InlineSpinner />}
      </LoadMoreTrigger>

      <AnimatePresence>
        {popoverState.canvas && popoverState.rect && (
          <FloatingPopover initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} transition={{ duration: 0.2 }} style={popoverStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0, color: "#fff", fontSize: "0.95rem", fontWeight: 800, fontFamily: "Tajawal" }}>
                {t("pod_studio_blank_specifications", "MATERIAL BLUEPRINT")}
              </h4>
              <SpecBadge>{popoverState.canvas.sku}</SpecBadge>
            </div>
            <BlueprintStage>
              <TagInfo>
                <CoreTag>{popoverState.canvas.sku}</CoreTag>
                <div style={{ color: "white", fontWeight: 900, fontFamily: "Tajawal", fontSize: "1rem", textTransform: "uppercase" }}>
                  {popoverState.canvas.title}
                </div>
              </TagInfo>
              <CustomRotatingMockup colorObj={popoverState.canvas.availableColors?.[0]} title={popoverState.canvas.title} isLarge={true} isHovered={true} />
              <CoordinateOverlay>
                <CoordText>GSM: {popoverState.canvas.specifications?.gsm || "---"}</CoordText>
                <CoordText>CUT: {popoverState.canvas.specifications?.fit || "---"}</CoordText>
              </CoordinateOverlay>
            </BlueprintStage>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {popoverState.canvas.specifications?.gsm ? (
                <>
                  <TechRow>
                    <span className="label">Fabric Weight</span>
                    <span className="value">{popoverState.canvas.specifications.gsm} GSM</span>
                  </TechRow>
                  <TechRow>
                    <span className="label">Composition</span>
                    <span className="value">{popoverState.canvas.specifications.composition}</span>
                  </TechRow>
                  <TechRow>
                    <span className="label">Print Zones</span>
                    <span className="value">{popoverState.canvas.specifications.printableSurfaces.join(" & ").toUpperCase()}</span>
                  </TechRow>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#e4e4e7", lineHeight: "1.5", fontFamily: "Cairo, sans-serif" }}>
                  {parseBilingualText(popoverState.canvas.shortDescription, i18n.language)}
                </p>
              )}
            </div>
          </FloatingPopover>
        )}
      </AnimatePresence>
    </LibraryContainer>
  );
};

CanvasLibrary.propTypes = {
  shopId: PropTypes.string.isRequired,
  onSelectCanvas: PropTypes.func.isRequired,
  shop: PropTypes.object.isRequired,
};

export default CanvasLibrary;