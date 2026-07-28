import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { getImage } from "../../../../Images/services/imageServices";
import { getImageUrl } from "../../../../../utils/imageUtils";
import { getPreferredProductImageId } from "../../../hooks/usePrintableArea";
import { analyzeProductImageLuminance } from "../../../utils/colorLuminanceAnalyzer";

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

const CardWrapper = styled.div`
  background-color: #111214;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 280px;
  width: 280px;
  scroll-snap-align: start;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(240, 122, 72, 0.4);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  }
`;

// 🔴 LIQUID GLASS STAGE CONTAINER
const LiquidGlassStage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(25px) saturate(160%);
  -webkit-backdrop-filter: blur(25px) saturate(160%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.03);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.65));
    transition: transform 0.4s ease;
    position: absolute;
    inset: 0;
    padding: 1rem;
    box-sizing: border-box;
    z-index: 5;
  }

  ${CardWrapper}:hover & img {
    transform: scale(1.05);
  }
`;

// 🔴 MULTIPLE ADAPTIVE LIGHT SOURCES
const LightOrb1 = styled.div`
  position: absolute;
  top: -25%;
  left: -20%;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${(props) => props.$color || "rgba(255, 255, 255, 0.15)"} 0%,
    transparent 70%
  );
  filter: blur(30px);
  pointer-events: none;
  z-index: 1;
`;

const LightOrb2 = styled.div`
  position: absolute;
  bottom: -25%;
  right: -20%;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${(props) => props.$color || "rgba(240, 122, 72, 0.15)"} 0%,
    transparent 70%
  );
  filter: blur(35px);
  pointer-events: none;
  z-index: 1;
`;

const LightOrb3 = styled.div`
  position: absolute;
  top: 35%;
  right: 10%;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${(props) => props.$color || "rgba(57, 161, 112, 0.12)"} 0%,
    transparent 70%
  );
  filter: blur(25px);
  pointer-events: none;
  z-index: 1;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: start;
`;

const CategoryBadge = styled.span`
  font-family: monospace;
  font-size: 0.7rem;
  color: #71717a;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProductName = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
  font-family: "Tajawal", sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpecRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

const SpecBadge = styled.span`
  font-size: 0.72rem;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #a1a1aa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Cairo", sans-serif;
`;

const PricingActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const PriceValue = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
`;

const CustomizeBtn = styled.button`
  background-color: #f07a48;
  color: #050505;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 800;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.15);
    transform: scale(1.02);
  }
`;

const ProductCard = ({ product, index, onSelect }) => {
  const { t } = useTranslation();
  const [imageBuffer, setImageBuffer] = useState(null);
  const [hoverImageBuffer, setHoverImageBuffer] = useState(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Dynamic Light Colors State
  const [lightScheme, setLightScheme] = useState({
    color1: "rgba(240, 122, 72, 0.15)",
    color2: "rgba(57, 127, 249, 0.15)",
    color3: "rgba(255, 255, 255, 0.1)",
  });

  const defaultAvailability = product?.availabilities?.[0];
  const defaultSize = defaultAvailability?.sizes?.[0];

  const previews = product?.previewImages ?? [];
  const activeImageId =
    getPreferredProductImageId(product, 0, defaultAvailability?.color);
  const hoverImageId =
    previews.length > 1 ? getPreferredProductImageId(product, 1, defaultAvailability?.color) : null;

  useEffect(() => {
    let isMounted = true;
    if (!activeImageId) return;

    if (activeImageId) {
      getImage(activeImageId)
        .then((res) => {
          if (isMounted && res?.data) {
            setImageBuffer(res.data);
            const url = getImageUrl(res.data);
            analyzeProductImageLuminance(url).then((scheme) => {
              if (isMounted) setLightScheme(scheme);
            });
          }
        })
        .catch((err) => console.error("Error loading substrate image:", err));
    }

    if (hoverImageId) {
      getImage(hoverImageId)
        .then((res) => {
          if (isMounted && res?.data) {
            setHoverImageBuffer(res.data);
          }
        })
        .catch((err) => console.error("Error loading hover substrate image:", err));
    } else {
      if (isMounted) setHoverImageBuffer(null);
    }

    return () => {
      isMounted = false;
    };
  }, [activeImageId, hoverImageId]);

  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);
  const hoverImageUrl = useMemo(() => getImageUrl(hoverImageBuffer), [hoverImageBuffer]);

  const gsmValue = useMemo(() => {
    if (!product.specifications || !Array.isArray(product.specifications))
      return null;
    return (
      product.specifications.find((spec) => spec.name?.toLowerCase() === "gsm")
        ?.value || null
    ); 
  }, [product.specifications]);

  const materialValue = useMemo(() => {
    if (!product.specifications || !Array.isArray(product.specifications))
      return null;
    return (
      product.specifications.find(
        (spec) => spec.name?.toLowerCase() === "material",
      )?.value || null
    );
  }, [product.specifications]);

  const targetId = useMemo(() => {
    return product?._id || product?.id || product?.productId || product?.name || "";
  }, [product]);

  return (
    <CardWrapper
      className="pod-card-wrapper"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <LiquidGlassStage onClick={onSelect}>
        {/* Dynamic Multi-Source Light Orbs */}
        <LightOrb1 $color={lightScheme.color1} />
        <LightOrb2 $color={lightScheme.color2} />
        <LightOrb3 $color={lightScheme.color3} />

        <AnimatePresence mode="wait">
          {isCardHovered && hoverImageUrl ? (
            <motion.img
              key="hover-image"
              src={hoverImageUrl}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          ) : imageUrl ? (
            <motion.img
              key="main-image"
              src={imageUrl}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          ) : (
            <motion.div
              key="emoji-placeholder"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: "3.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                inset: 0,
                zIndex: 5,
              }}
            >
              {getStableEmoji(targetId, index)}
            </motion.div>
          )}
        </AnimatePresence>
      </LiquidGlassStage>

      <InfoBlock>
        <CategoryBadge>
          {t("pod_store.base_label", "CANVAS")} /{" "}
          {String(index + 1).padStart(3, "0")}
        </CategoryBadge>
        <ProductName onClick={onSelect}>{product.name}</ProductName>
        <SpecRow>
          {gsmValue && <SpecBadge>{gsmValue} GSM</SpecBadge>}
          {materialValue && <SpecBadge>{materialValue}</SpecBadge>}
          {product.hasBackPrintSurface && (
            <SpecBadge>{t("pod_store.double_sided", "Double-Sided")}</SpecBadge>
          )}
        </SpecRow>
      </InfoBlock>
      <PricingActionRow>
        <PriceValue>
          {parseInt(defaultSize?.sellingPrice || 0)} {t("dzd", "DA")}
        </PriceValue>
        <CustomizeBtn onClick={onSelect}>
          {t("pod_store.start_designing_btn", "Design")}
        </CustomizeBtn>
      </PricingActionRow>
    </CardWrapper>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProductCard;