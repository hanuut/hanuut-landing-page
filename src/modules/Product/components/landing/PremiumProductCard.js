// src/modules/Product/components/landing/PremiumProductCard.js

import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../../../utils/imageUtils";
import { getImage } from "../../../Images/services/imageServices";
import { getPreferredProductImageId } from "../../../PodStudio/hooks/usePrintableArea";
import { analyzeProductImageLuminance } from "../../../PodStudio/utils/colorLuminanceAnalyzer";
import { addToCart, openCart } from "../../../Cart/state/reducers";
import { FaPaintBrush, FaShoppingCart } from "react-icons/fa";

// ===========================================================================
// UTILITIES & COLOR MAP
// ===========================================================================

const APPAREL_EMOJIS = [
  "👕", "👔", "🧥", "🥼", "👖", "🩳", "🎒", "👜", "🧢"
];

const getStableEmoji = (id, index) => {
  const str = String(id || index || "");
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return APPAREL_EMOJIS[sum % APPAREL_EMOJIS.length];
};

const COLOR_MAP = {
  black: "#000000",
  noir: "#000000",
  white: "#FFFFFF",
  blanc: "#FFFFFF",
  red: "#EF4444",
  rouge: "#EF4444",
  blue: "#3B82F6",
  bleu: "#3B82F6",
  navy: "#1E3A8A",
  green: "#10B981",
  vert: "#10B981",  yellow: "#F59E0B",
  jaune: "#F59E0B",
  grey: "#9CA3AF",
  gris: "#9CA3AF",
  pink: "#EC4899",
  rose: "#EC4899",
  beige: "#F5F5DC",
  cream: "#FEF3C7",
  brown: "#78350F",
  marron: "#78350F",
  purple: "#8B5CF6",
  mauve: "#8B5CF6",
  burgundy: "#7F1D1D",
  bordeaux: "#7F1D1D",
};

const getHex = (c) => COLOR_MAP[String(c).toLowerCase().trim()] || c;

// ===========================================================================
// STYLED COMPONENTS (LIST VIEW SIDE SLIDE-IN RECONFIGURATION)
// ===========================================================================

const CardWrapper = styled(motion.div)`
  background-color: #0c0c0e;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: 100%;

  ${(props) =>
    props.$layoutType === "list"
      ? css`
          flex-direction: row;
          height: 110px;
          align-items: center;
        `
      : css`
          flex-direction: column;
          height: 100%;
        `}

  &:hover {
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    box-shadow:
      0 15px 35px rgba(0, 0, 0, 0.6),
      0 0 15px rgba(240, 122, 72, 0.15);
  }
`;

const BlueprintStage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111214;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 12px 12px;
  background-position: center;
  overflow: hidden;
  flex-shrink: 0;

  ${(props) =>
    props.$layoutType === "list"
      ? css`
          width: 105px;
          height: 100%;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        `
      : css`
          width: 100%;
          aspect-ratio: 1 / 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        `}

  &::before {
    content: "";
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    background: radial-gradient(
      circle,
      ${(props) => props.$glow || "rgba(255,255,255,0.05)"} 0%,
      transparent 70%
    );
    filter: blur(20px);
    pointer-events: none;
    z-index: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: ${(props) => (props.$layoutType === "list" ? "0.4rem" : "1.25rem")};
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    z-index: 2;
    filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.65));
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }

  ${CardWrapper}:hover & img {
    transform: scale(1.08);
  }
`;

const SkuBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2px 5px;
  border-radius: 4px;
  color: #71717a;
  font-family: monospace;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  z-index: 10;
`;

const ContentBlock = styled.div`
  padding: 0.75rem 1rem;
  display: flex;
  flex: 1;
  gap: 1rem;
  position: relative;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  ${(props) =>
    props.$layoutType !== "list" &&
    css`
      flex-direction: column;
      align-items: stretch;
    `}
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: start;
  min-width: 160px;
  max-width: 220px;
`;

const ProductTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
  font-family: "Tajawal", sans-serif;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechSpecsGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  justify-content: flex-start;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SpecBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: start;

  .label {
    font-size: 0.55rem;
    color: #71717a;
    font-weight: 800;
    text-transform: uppercase;
    font-family: "Tajawal", sans-serif;
  }

  .value {
    font-size: 0.72rem;
    color: #e4e4e7;
    font-weight: 700;
    font-family: monospace;
    white-space: nowrap;
  }
`;

const ColorSwatchesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .extra {
    font-size: 0.58rem;
    color: #a1a1aa;
    font-weight: 700;
    font-family: monospace;
  }
`;

const EndPriceBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: ${(props) => (props.$isArabic ? "left" : "right")};
  flex-shrink: 0;
  z-index: 2;

  span.label {
    font-size: 0.55rem;
    color: #71717a;
    text-transform: uppercase;
    font-weight: 800;
  }

  span.amount {
    font-size: 1.15rem;
    font-weight: 900;
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
    font-family: "Tajawal", sans-serif;
  }
`;

// 🔴 SIDE SLIDE-IN ACTION BUTTONS PANEL FOR LIST VIEW
const SideHoverActionsPanel = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  ${(props) => (props.$isArabic ? "left: 0;" : "right: 0;")}
  width: 170px;
  background: rgba(12, 12, 14, 0.95);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-${(props) => (props.$isArabic ? "right" : "left")}: 1px solid rgba(240, 122, 72, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
  gap: 6px;
  box-sizing: border-box;
  transform: ${(props) => (props.$isArabic ? "translateX(-100%)" : "translateX(100%)")};
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 10;

  ${CardWrapper}:hover & {
    transform: translateX(0);
    opacity: 1;
  }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  padding: 0.45rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: transform 0.2s, filter 0.2s;

  &:hover {
    filter: brightness(1.15);
    transform: translateY(-1px);
  }
`;

const GhostBtn = styled.button`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  color: #d4d4d8;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.4rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

// FLOATING BLUEPRINT HOVER POPOVER
const FloatingHoverPopover = styled(motion.div)`
  position: fixed;
  background: rgba(20, 20, 24, 0.95);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.85);
  width: 280px;
  z-index: 9999;
  pointer-events: none;
`;

const PopoverMockupStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #050505;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6));
  }
`;

const PremiumProductCard = ({
  product,
  index = 0,
  onCardClick = () => {},
  onBlankOrderClick,
  isPodShop = false,
  layoutType = "list",
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";

  const [imageBuffer, setImageBuffer] = useState(null);
  const [hoverImageBuffer, setHoverImageBuffer] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState("rgba(255,255,255,0.03)");
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const defaultAvailability = product?.availabilities?.[0];
  const defaultSize = defaultAvailability?.sizes?.[0];
  const price = parseInt(
    defaultSize?.sellingPrice || product?.sellingPrice || 0,
    10
  );

  const uniqueColors = useMemo(() => {
    if (!product.availabilities) return [];
    return [...new Set(product.availabilities.map((a) => a.color))].filter(
      Boolean
    );
  }, [product]);

  const uniqueSizes = useMemo(() => {
    if (!product.availabilities) return [];
    const sizes = product.availabilities.flatMap(
      (a) => a.sizes?.map((s) => s.size) || []
    );
    const unique = [...new Set(sizes)].filter(Boolean);
    if (unique.length <= 4) return unique.join(" • ");
    if (unique.length > 4) return `${unique[0]} ➔ ${unique[unique.length - 1]}`;
    return "N/A";
  }, [product]);

  const gsmValue = useMemo(() => {
    const rawVal = product.specifications?.find(
      (s) => s.name?.toLowerCase() === "gsm"
    )?.value;
    if (!rawVal) return null;
    return String(rawVal).replace(/gsm/i, "").trim();
  }, [product.specifications]);

  const materialValue = useMemo(() => {
    const rawVal = product.specifications?.find(
      (s) => s.name?.toLowerCase() === "material"
    )?.value;
    return rawVal || null;
  }, [product.specifications]);

  const hasBackPrint = product.hasBackPrintSurface;

  const resolvedImageId = useMemo(() => {
    return (
      defaultAvailability?.podFrontTemplateId ||
      defaultAvailability?.imageId ||
      product.previewImages?.[0] ||
      product.imageId ||
      null
    );
  }, [defaultAvailability, product]);

  const hoverImageId =
    product?.previewImages?.length > 1
      ? getPreferredProductImageId(product, 1, defaultAvailability?.color)
      : null;

  useEffect(() => {
    let isMounted = true;
    if (resolvedImageId) {
      getImage(resolvedImageId)
        .then((res) => {
          if (isMounted && res?.data) setImageBuffer(res.data);
        })
        .catch(() => {});
    }
    if (hoverImageId) {
      getImage(hoverImageId)
        .then((res) => {
          if (isMounted && res?.data) setHoverImageBuffer(res.data);
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [resolvedImageId, hoverImageId]);

  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);
  const hoverImageUrl = useMemo(
    () => getImageUrl(hoverImageBuffer),
    [hoverImageBuffer]
  );

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    let top = rect.top + rect.height / 2 - 180;
    top = Math.max(10, Math.min(top, window.innerHeight - 360));

    // 🔴 FIX: In RTL (Arabic), product image is on the RIGHT (rect.right - 285).
    // In LTR (English/French), product image is on the LEFT (rect.left - 5).
    // This positions the popover over the image and keeps CTA buttons unobstructed.
    const left = isArabic ? rect.right - 285 : rect.left - 5;
    setPopoverPos({ top, left: Math.max(10, left) });
  };


  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDirectBlankAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (onBlankOrderClick) {
      onBlankOrderClick(product);
      dispatch(openCart());
      return;
    }

    const selectedColorVal = defaultAvailability?.color || "white";
    const selectedSizeVal = defaultSize?.size || "M";
    const targetShopId = product.shopId || product.shopId?._id || "";

    const uniqueVariantId = `blank_${product._id || product.id}_${selectedColorVal}_${selectedSizeVal}`;
    const resolvedCartImageId =
      defaultAvailability?.podFrontTemplateId ||
      defaultAvailability?.imageId ||
      product.previewImages?.[0] ||
      product.imageId ||
      null;

    const blankCartPayload = {
      product,
      productId: product._id || product.id,
      variantId: uniqueVariantId,
      title: product.name,
      color: selectedColorVal,
      size: selectedSizeVal,
      sellingPrice: price,
      imageId: resolvedCartImageId,
      quantity: 1,
      shopId: targetShopId,
      podCustomization: null,
    };

    dispatch(addToCart(blankCartPayload));
    dispatch(openCart());
  };

  const sku =
    product.sku ||
    `CNV-${String(product._id || product.id)
      .substring(0, 4)
      .toUpperCase()}`;

  return (
    <>
      <CardWrapper
        $layoutType={layoutType}
        $isArabic={isArabic}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onCardClick(product)}
      >
        <BlueprintStage $layoutType={layoutType} $glow={ambientGlow}>
          <SkuBadge>{sku}</SkuBadge>
          <AnimatePresence mode="wait">
            {isHovered && hoverImageUrl ? (
              <motion.img
                key="hover"
                src={hoverImageUrl}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            ) : imageUrl ? (
              <motion.img
                key="main"
                src={imageUrl}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            ) : (
              <div style={{ fontSize: "2.5rem", zIndex: 5 }}>
                {getStableEmoji(product._id || product.id, index)}
              </div>
            )}
          </AnimatePresence>
        </BlueprintStage>

        <ContentBlock $layoutType={layoutType} $isArabic={isArabic}>
          <HeaderGroup>
            <ProductTitle>{product.name}</ProductTitle>
          </HeaderGroup>

          {isPodShop && (
            <TechSpecsGrid>
              <SpecBox>
                <span className="label">{t("filter_colors", "Colors")}</span>
                {uniqueColors.length > 0 ? (
                  <ColorSwatchesRow>
                    {uniqueColors.slice(0, 3).map((c, i) => (
                      <div
                        key={i}
                        className="swatch"
                        style={{ backgroundColor: getHex(c) }}
                        title={c}
                      />
                    ))}
                    {uniqueColors.length > 3 && (
                      <span className="extra">+{uniqueColors.length - 3}</span>
                    )}
                  </ColorSwatchesRow>
                ) : (
                  <span className="value">---</span>
                )}
              </SpecBox>

              <SpecBox>
                <span className="label">Sizes</span>
                <span className="value">{uniqueSizes || "---"}</span>
              </SpecBox>

              <SpecBox>
                <span className="label">Surfaces</span>
                <span
                  className="value"
                  style={{ color: hasBackPrint ? "#39A170" : "#d4d4d8" }}
                >
                  {hasBackPrint ? "FRONT/BACK" : "FRONT"}
                </span>
              </SpecBox>

              <SpecBox>
                <span className="label">Weight</span>
                <span className="value">
                  {gsmValue ? `${gsmValue} GSM` : materialValue || "Standard"}
                </span>
              </SpecBox>
            </TechSpecsGrid>
          )}

          <EndPriceBox $isArabic={isArabic}>
            <span className="label">Base Price</span>
            <span className="amount">
              {price} {t("dzd", "DA")}
            </span>
          </EndPriceBox>

          {/* 🔴 SIDE SLIDE-IN ACTION BUTTONS FOR LIST VIEW */}
          {isPodShop && (
            <SideHoverActionsPanel $isArabic={isArabic}>
              <PrimaryBtn
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(product);
                }}
              >
                <FaPaintBrush /> {isArabic ? "ابدأ التصميم" : "Design"}
              </PrimaryBtn>

              <GhostBtn type="button" onClick={handleDirectBlankAddToCart}>
                <FaShoppingCart /> {isArabic ? "طلب بدون طباعة" : "Order Blank"}
              </GhostBtn>
            </SideHoverActionsPanel>
          )}
        </ContentBlock>
      </CardWrapper>

      {/* FLOATING HOVER PREVIEW POPOVER FOR LIST VIEW */}
      <AnimatePresence>
        {isHovered && layoutType === "list" && (
          <FloatingHoverPopover
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ top: popoverPos.top, left: popoverPos.left }}
          >
            <PopoverMockupStage>
              <img src={imageUrl || hoverImageUrl} alt="" />
            </PopoverMockupStage>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: isArabic ? "right" : "left" }}>
              <span style={{ fontSize: "0.7rem", color: "#f07a48", fontFamily: "monospace", fontWeight: 800 }}>
                {sku}
              </span>
              <h4 style={{ margin: 0, fontSize: "1rem", color: "white", fontFamily: "Tajawal", fontWeight: 800 }}>
                {product.name}
              </h4>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#a1a1aa", fontFamily: "Cairo" }}>
                {gsmValue ? `${gsmValue} GSM • ` : ""}{materialValue || "100% Organic Cotton"}
              </p>
            </div>
          </FloatingHoverPopover>
        )}
      </AnimatePresence>
    </>
  );
};

PremiumProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  index: PropTypes.number,
  onCardClick: PropTypes.func,
  onBlankOrderClick: PropTypes.func,
  isPodShop: PropTypes.bool,
  layoutType: PropTypes.string,
};

export default PremiumProductCard;