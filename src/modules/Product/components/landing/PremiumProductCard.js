import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../../../utils/imageUtils";
import { getImage } from "../../../Images/services/imageServices";
import { FaArrowRight, FaMinus, FaPlus } from "react-icons/fa";
import { getPreferredProductImageId } from "../../../PodStudio/hooks/usePrintableArea";

// ===========================================================================
// UTILITIES
// ===========================================================================

const APPAREL_EMOJIS = ["👕", "👔", "🧥", "🥼", "👖", "🩳", "🎒", "👜", "🧢"];

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
  vert: "#10B981",
  yellow: "#F59E0B",
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
// STYLED COMPONENTS (BLUEPRINT AESTHETIC)
// ===========================================================================

const CardWrapper = styled(motion.div)`
  background-color: #0c0c0e;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  height: 100%;

  &:hover {
    transform: translateY(-6px);
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.6),
      0 0 20px rgba(240, 122, 72, 0.1);
  }

  &:hover .footer-action {
    color: ${(props) => props.theme.primaryColor || "#F07A48"};
    transform: translateX(${(props) => (props.$isArabic ? "-4px" : "4px")});
  }
`;

const BlueprintStage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1.05;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111214;

  /* Technical Grid Background */
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center;

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;

  /* Ambient Lamp Glows */
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
    filter: blur(30px);
    pointer-events: none;
    z-index: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1.5rem;
    box-sizing: border-box;
    position: absolute;
    inset: 0;
    z-index: 2;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.5));
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  }

  ${CardWrapper}:hover & img {
    transform: scale(1.08) translateY(-4px);
  }
`;

const SkuBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  color: #71717a;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  z-index: 10;
`;

const ContentBlock = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
`;

const ProductTitle = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  font-family: "Tajawal", sans-serif;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TechSpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

const SpecBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: start;

  .label {
    font-size: 0.65rem;
    color: #52525b;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: "Tajawal", sans-serif;
  }

  .value {
    font-size: 0.8rem;
    color: #d4d4d8;
    font-weight: 700;
    font-family: monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ColorSwatchesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  .swatch {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
  }

  .extra {
    font-size: 0.7rem;
    color: #a1a1aa;
    font-weight: 700;
    font-family: monospace;
    margin-left: 2px;
  }
`;

const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BasePrice = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;

  span:first-child {
    font-size: 0.65rem;
    color: #71717a;
    text-transform: uppercase;
    font-weight: 800;
  }

  span:last-child {
    font-size: 1.1rem;
    font-weight: 900;
    color: white;
    font-family: "Tajawal", sans-serif;
  }
`;

const ActionArrow = styled.div`
  font-size: 0.85rem;
  font-weight: 800;
  color: #71717a;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  font-family: "Tajawal", sans-serif;
`;

const QuantityController = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2px;
`;

const QtyBtn = styled.button`
  background: transparent;
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    color: ${(props) => props.theme.primaryColor};
  }
`;

// 🔴 THE MISSING STYLED COMPONENT:
const QtyValue = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  min-width: 24px;
  text-align: center;
`;

// ===========================================================================
// COMPONENT LOGIC
// ===========================================================================

const PremiumProductCard = ({
  product,
  index,
  onCardClick,
  onUpdateQuantity,
  isOrderingEnabled,
  quantityInCart = 0,
  isPodShop = false,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [imageBuffer, setImageBuffer] = useState(null);
  const [hoverImageBuffer, setHoverImageBuffer] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState("rgba(255,255,255,0.03)");

  const defaultAvailability = product?.availabilities?.[0];
  const defaultSize = defaultAvailability?.sizes?.[0];
  const price = parseInt(
    defaultSize?.sellingPrice || product?.sellingPrice || 0,
  );

  const uniqueColors = useMemo(() => {
    if (!product.availabilities) return [];
    return [...new Set(product.availabilities.map((a) => a.color))].filter(
      Boolean,
    );
  }, [product]);

  const uniqueSizes = useMemo(() => {
    if (!product.availabilities) return [];
    const sizes = product.availabilities.flatMap(
      (a) => a.sizes?.map((s) => s.size) || [],
    );
    const unique = [...new Set(sizes)].filter(Boolean);
    if (unique.length <= 4) return unique.join(" • ");
    if (unique.length > 4) return `${unique[0]} ➔ ${unique[unique.length - 1]}`;
    return "N/A";
  }, [product]);

const gsmValue = useMemo(() => {
    const rawVal = product.specifications?.find((s) => s.name?.toLowerCase() === "gsm")?.value;
    if (!rawVal) return null;
    return String(rawVal).replace(/gsm/i, '').trim();
  }, [product.specifications]);

  const hasBackPrint = product.hasBackPrintSurface;

  const activeImageId = getPreferredProductImageId(
    product,
    0,
    defaultAvailability?.color,
  );
  const hoverImageId =
    product?.previewImages?.length > 1
      ? getPreferredProductImageId(product, 1, defaultAvailability?.color)
      : null;

  useEffect(() => {
    let isMounted = true;
    if (activeImageId) {
      getImage(activeImageId).then((res) => {
        if (isMounted && res.data) setImageBuffer(res.data);
      });
    }
    if (hoverImageId) {
      getImage(hoverImageId).then((res) => {
        if (isMounted && res.data) setHoverImageBuffer(res.data);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [activeImageId, hoverImageId]);

  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);
  const hoverImageUrl = useMemo(
    () => getImageUrl(hoverImageBuffer),
    [hoverImageBuffer],
  );

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvas.width = 10;
        canvas.height = 10;
        ctx.drawImage(img, 0, 0, 10, 10);
        const imgData = ctx.getImageData(0, 0, 10, 10).data;
        let rSum = 0,
          gSum = 0,
          bSum = 0,
          count = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          if (imgData[i + 3] > 50) {
            rSum += imgData[i];
            gSum += imgData[i + 1];
            bSum += imgData[i + 2];
            count++;
          }
        }
        if (count > 0) {
          const brightness =
            0.299 * (rSum / count) +
            0.587 * (gSum / count) +
            0.114 * (bSum / count);
          setAmbientGlow(
            brightness < 100
              ? "rgba(240, 122, 72, 0.12)"
              : "rgba(255, 255, 255, 0.06)",
          );
        }
      } catch (err) {}
    };
  }, [imageUrl]);

  const sku =
    product.sku ||
    `CANVAS-${String(product._id || product.id)
      .substring(0, 4)
      .toUpperCase()}`;

  return (
    <CardWrapper
      $isArabic={isArabic}
      onClick={() => onCardClick(product, false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BlueprintStage $glow={ambientGlow}>
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
              transition={{ duration: 0.3 }}
            />
          ) : imageUrl ? (
            <motion.img
              key="main"
              src={imageUrl}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div
              style={{
                fontSize: "4rem",
                zIndex: 5,
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
              }}
            >
              {getStableEmoji(product._id || product.id, index)}
            </div>
          )}
        </AnimatePresence>
      </BlueprintStage>

      <ContentBlock>
        <ProductTitle>{product.name}</ProductTitle>

        {isPodShop && (
          <TechSpecsGrid>
            <SpecBox>
              <span className="label">Colors</span>
              {uniqueColors.length > 0 ? (
                <ColorSwatchesRow>
                  {uniqueColors.slice(0, 4).map((c, i) => (
                    <div
                      key={i}
                      className="swatch"
                      style={{ backgroundColor: getHex(c) }}
                      title={c}
                    />
                  ))}
                  {uniqueColors.length > 4 && (
                    <span className="extra">+{uniqueColors.length - 4}</span>
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
                {hasBackPrint ? "FRONT & BACK" : "FRONT ONLY"}
              </span>
            </SpecBox>

            <SpecBox>
              <span className="label">Fabric Weight</span>
              <span className="value">
                {gsmValue ? `${gsmValue} GSM` : "Standard"}
              </span>
            </SpecBox>
          </TechSpecsGrid>
        )}

        <CardFooter>
          <BasePrice>
            <span>{isPodShop ? "Base Cost" : "Price"}</span>
            <span>
              {price} {t("dzd", "DA")}
            </span>
          </BasePrice>

          {isPodShop ? (
            <ActionArrow className="footer-action">
              {isArabic ? "اختر الخامة" : "Select Canvas"}{" "}
              {isArabic ? "←" : "➔"}
            </ActionArrow>
          ) : (
            isOrderingEnabled &&
            (quantityInCart > 0 ? (
              <QuantityController onClick={(e) => e.stopPropagation()}>
                <QtyBtn
                  onClick={() =>
                    onUpdateQuantity(product._id, quantityInCart - 1)
                  }
                >
                  <FaMinus size={10} />
                </QtyBtn>
                <QtyValue>{quantityInCart}</QtyValue>
                <QtyBtn
                  onClick={() =>
                    onUpdateQuantity(product._id, quantityInCart + 1)
                  }
                >
                  <FaPlus size={10} />
                </QtyBtn>
              </QuantityController>
            ) : (
              <ActionArrow
                className="footer-action"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(product, true);
                }}
              >
                <FaPlus /> Add to Cart
              </ActionArrow>
            ))
          )}
        </CardFooter>
      </ContentBlock>
    </CardWrapper>
  );
};

export default PremiumProductCard;
