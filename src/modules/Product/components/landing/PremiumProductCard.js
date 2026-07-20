import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../../../utils/imageUtils";
import { getImage } from "../../../Images/services/imageServices";
import { FaMinus, FaPlus, FaTshirt } from "react-icons/fa";
import { getPreferredProductImageId } from "../../../PodStudio/hooks/usePrintableArea";

// Stable apparel emoji hashing map
const APPAREL_EMOJIS = ["👕", "👔", "🧥", "🥼", "👖", "🩳", "🧦", "👟", "🎒", "👜", "🧢", "🎽"];

const getStableEmoji = (id) => {
  if (!id) return "👕";
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % APPAREL_EMOJIS.length;
  return APPAREL_EMOJIS[index];
};

const formatSpecification = (spec) => {
  if (!spec || !spec.value) return "";
  const value = spec.value.toString().trim();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const CardWrapper = styled(motion.div)`
  background-color: ${(props) => props.theme.surface};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;

  ${(props) =>
    props.$layoutType === "grid"
      ? `
    flex-direction: column;
    height: 100%;
  `
      : `
    flex-direction: row;
    align-items: center;
    padding: 1.25rem;
    gap: 2rem;
    width: 100%;

    @media(max-width: 600px) {
      flex-direction: column;
      align-items: stretch;
      gap: 1.25rem;
    }
  `}

  border: 2px solid ${(props) =>
    props.$isActive ? props.theme.primaryColor : "rgba(255,255,255,0.05)"};

  box-shadow: ${(props) =>
    props.$isActive
      ? `0 0 25px ${props.theme.primaryColor}50`
      : "0 4px 20px rgba(0,0,0,0.1)"};

  &:hover {
    transform: translateY(-5px);
    border-color: ${(props) =>
      props.$isActive ? props.theme.primaryColor : "rgba(255,255,255,0.2)"};
    box-shadow: ${(props) =>
      props.$isActive
        ? `0 0 25px ${props.theme.primaryColor}50`
        : "0 10px 25px rgba(0,0,0,0.2)"};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.03) 70%
    ),
    rgba(15, 15, 15, 0.45);

  backdrop-filter: blur(25px) saturate(140%);
  -webkit-backdrop-filter: blur(25px) saturate(140%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.03);

  ${(props) =>
    props.$layoutType === "grid"
      ? `
    width: 100%;
    padding-top: 100%; /* Restored aspect ratio mapping */
  `
      : `
    width: 110px;
    height: 110px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
    padding: 0.5rem;

    @media(max-width: 600px) {
      width: 100%;
      height: 200px;
    }
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.45));
    position: absolute;
    inset: 0;
    padding: 1rem;
    box-sizing: border-box;
  }

  ${CardWrapper}:hover & img {
    transform: scale(1.04) translateY(-4px);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  ${(props) =>
    props.$layoutType === "grid"
      ? `
    padding: 1.25rem;
    gap: 0.5rem;
  `
      : `
    gap: 0.35rem;
    text-align: left;
  `}
`;

const SerialTag = styled.span`
  font-family: monospace;
  font-size: 0.7rem;
  color: #71717a;
  font-weight: 700;
  letter-spacing: 1px;
`;

const Brand = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.primaryColor};
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1px;
`;

const ProductName = styled.h3`
  font-weight: 700;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${(props) =>
    props.$layoutType === "grid"
      ? `
    font-size: 1rem;
    line-height: 1.4;
  `
      : `
    font-size: 1.25rem;
    line-height: 1.2;
  `}
`;

const SpecSheet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 0.25rem;
  font-family: "Cairo", sans-serif;
`;

const SpecLine = styled.span`
  font-size: 0.8rem;
  color: #a1a1aa;
  font-weight: 500;
`;

const RightActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  flex-shrink: 0;
  min-width: 180px;

  @media (max-width: 600px) {
    align-items: stretch;
    width: 100%;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${(props) =>
    props.$layoutType === "grid"
      ? `
    margin-top: auto;
    padding-top: 1rem;
  `
      : `
    margin: 0;
  `}
`;

const Price = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  color: white;
`;

const StudioActionBtn = styled.button`
  background: ${(props) => props.theme.primaryColor};
  color: #000;
  border: none;
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;

  ${(props) =>
    props.$layoutType === "grid"
      ? `
    margin-top: 1rem;
  `
      : `
    margin: 0;
  `}

  &:hover {
    filter: brightness(1.15);
    transform: translateY(-2px);
  }
`;

const QuantityController = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
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
  font-size: 0.85rem;

  &:hover {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const QtyValue = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
  min-width: 24px;
  text-align: center;
`;

const PremiumProductCard = ({
  product,
  index,
  onCardClick,
  onUpdateQuantity,
  isOrderingEnabled,
  quantityInCart = 0,
  cartItems = [],
  $isActive = false,
  isPodShop = false,
  layoutType = "grid",
  imageOverrideId = null,
}) => {
  const { t } = useTranslation();
  const [imageBuffer, setImageBuffer] = useState(null);
  const [hoverImageBuffer, setHoverImageBuffer] = useState(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const defaultAvailability = product?.availabilities?.[0];
  const defaultSize = defaultAvailability?.sizes?.[0];

  const previews = product?.previewImages ?? [];
  const activeImageId =
    imageOverrideId ||
    getPreferredProductImageId(product, 0, defaultAvailability?.color);
  const hoverImageId =
    previews.length > 1
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
    } else {
      setHoverImageBuffer(null);
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
  const productName = product.name;

  const activeCartItemForThisProduct = useMemo(() => {
    return cartItems.find((item) => {
      const cartProdId = (
        item.productId ||
        item.product?._id ||
        item.product?.id
      )?.toString();
      return cartProdId === product._id?.toString();
    });
  }, [cartItems, product]);

  const handleCardSelect = () => {
    onCardClick(product, false);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (!defaultSize || !onUpdateQuantity) return;
    const targetVariantId =
      activeCartItemForThisProduct?.variantId ||
      `${product._id}_${defaultAvailability.color}_${defaultSize.size}`;
    const currentQty = activeCartItemForThisProduct?.quantity || quantityInCart;
    onUpdateQuantity(targetVariantId, currentQty - 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (!defaultSize || !onUpdateQuantity) return;
    const targetVariantId =
      activeCartItemForThisProduct?.variantId ||
      `${product._id}_${defaultAvailability.color}_${defaultSize.size}`;
    const currentQty = activeCartItemForThisProduct?.quantity || quantityInCart;
    onUpdateQuantity(targetVariantId, currentQty + 1);
  };

  const mappedSpecs = useMemo(() => {
    if (!product.specifications || product.specifications.length === 0)
      return [];
    return product.specifications
      .slice(0, 2)
      .map(formatSpecification)
      .filter(Boolean);
  }, [product]);

  const renderSpecs = () => {
    if (isPodShop && mappedSpecs.length > 0) {
      return (
        <SpecSheet>
          {mappedSpecs.map((specText, i) => (
            <SpecLine key={i}>• {specText}</SpecLine>
          ))}
          <SpecLine
            style={{
              color: "#39A170",
              fontSize: "0.75rem",
              marginTop: "4px",
              fontWeight: "bold",
            }}
          >
            Ready for your design
          </SpecLine>
        </SpecSheet>
      );
    }
    if (isPodShop && product.shortDescription) {
      return (
        <SpecSheet>
          <SpecLine
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.shortDescription}
          </SpecLine>
        </SpecSheet>
      );
    }
    return null;
  };

  if (isPodShop && layoutType === "list") {
    return (
      <CardWrapper
        onClick={handleCardSelect}
        $isActive={$isActive}
        $layoutType="list"
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        <ImageContainer $layoutType="list">
          <AnimatePresence mode="wait">
            {isCardHovered && hoverImageUrl ? (
              <motion.img
                key="hover"
                src={hoverImageUrl}
                alt={productName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            ) : (
              imageUrl && (
                <motion.img
                  key="main"
                  src={imageUrl}
                  alt={productName}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )
            )}
          </AnimatePresence>
        </ImageContainer>

        <Content $layoutType="list">
          <SerialTag>
            {t("pod_studio_base_label")} / {String(index + 1).padStart(3, "0")}
          </SerialTag>
          <ProductName $layoutType="list">{productName}</ProductName>
          {renderSpecs()}
        </Content>

        <RightActionColumn>
          <Price>
            {parseInt(defaultSize?.sellingPrice || 0)} {t("dzd")}
          </Price>
          <StudioActionBtn
            type="button"
            onClick={handleCardSelect}
            $layoutType="list"
          >
            <FaTshirt /> {t("pod_studio_design_button")}
          </StudioActionBtn>
        </RightActionColumn>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      onClick={handleCardSelect}
      $isActive={$isActive}
      $layoutType="grid"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <ImageContainer $layoutType="grid">
        <AnimatePresence mode="wait">
          {isCardHovered && hoverImageUrl ? (
            <motion.img
              key="hover"
              src={hoverImageUrl}
              alt={productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          ) : imageUrl ? (
            <motion.img
              key="main"
              src={imageUrl}
              alt={productName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <motion.div
              key="emoji"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: "4rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                inset: 0,
              }}
            >
              {getStableEmoji(product._id)}
            </motion.div>
          )}
        </AnimatePresence>
      </ImageContainer>

      <Content $layoutType="grid">
        {isPodShop ? (
          <SerialTag>
            {t("pod_studio_base_label")} / {String(index + 1).padStart(3, "0")}
          </SerialTag>
        ) : (
          product.brand && <Brand>{product.brand}</Brand>
        )}
        <ProductName $layoutType="grid">{productName}</ProductName>
        {renderSpecs()}

        <PriceRow $layoutType="grid">
          <Price>
            {parseInt(defaultSize?.sellingPrice || 0)} {t("dzd")}
          </Price>
          {isOrderingEnabled &&
            defaultSize &&
            !isPodShop &&
            (quantityInCart > 0 ? (
              <QuantityController>
                <QtyBtn onClick={handleDecrement}>
                  <FaMinus />
                </QtyBtn>
                <QtyValue>{quantityInCart}</QtyValue>
                <QtyBtn onClick={handleIncrement}>
                  <FaPlus />
                </QtyBtn>
              </QuantityController>
            ) : (
              <QtyBtn
                onClick={(e) => {
                  e.stopPropagation();
                  onCardClick(product, true);
                }}
              >
                <FaPlus />
              </QtyBtn>
            ))}
        </PriceRow>

        {isPodShop && (
          <StudioActionBtn
            type="button"
            onClick={handleCardSelect}
            $layoutType="grid"
          >
            <FaTshirt /> {t("pod_studio_design_button")}
          </StudioActionBtn>
        )}
      </Content>
    </CardWrapper>
  );
};

export default PremiumProductCard;