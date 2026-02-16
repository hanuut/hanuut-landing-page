// src/modules/Product/components/landing/PremiumProductCard.js

import React, { useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getImageUrl } from "../../../../utils/imageUtils";
import { getImage } from "../../../Images/services/imageServices";

const CardWrapper = styled(motion.div)`
  background-color: ${(props) => props.theme.surface};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  /* --- STEP 2.3: Active State Border --- */
  border: 1px solid
    ${(props) => (props.$hasItems ? props.theme.primaryColor : "transparent")};

  box-shadow: ${(props) =>
    props.$hasItems
      ? `0 4px 15px ${props.theme.primaryColor}30`
      : "0 4px 6px rgba(0,0,0,0.1)"};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

// --- STEP 2.3: Quantity Badge ---
const QuantityBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${(props) => props.theme.primaryColor || "#39A170"};
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-family: "Tajawal", sans-serif;
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  background-color: #1c1c1e;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${CardWrapper}:hover img {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
`;

const Brand = styled.p`
  font-size: 0.65rem;
  color: ${(props) => props.theme.secondaryText || "#8E8E93"};
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
`;

const ProductName = styled.h3`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin: 0;
  line-height: 1.3;
  font-family: "Tajawal", sans-serif;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
`;

const Price = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
`;

const LoadingSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: #3a3a3c;
  opacity: 0.5;
`;

const PremiumProductCard = ({
  product,
  onCardClick,
  isOrderingEnabled,
  quantityInCart = 0, // Received from Showcase
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Image Logic
  const [imageBuffer, setImageBuffer] = useState(null);
  const imageId = product?.availabilities?.[0]?.imageId;

  useEffect(() => {
    let isMounted = true;
    if (imageId) {
      getImage(imageId)
        .then((res) => {
          if (isMounted && res.data) setImageBuffer(res.data);
        })
        .catch((err) => console.error(err));
    }
    return () => {
      isMounted = false;
    };
  }, [imageId]);

  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);

  // Price Logic (Get min price)
  const displayPrice = useMemo(() => {
    if (!product?.availabilities?.length) return 0;
    let min = Infinity;
    product.availabilities.forEach((av) => {
      av.sizes.forEach((size) => {
        if (size.sellingPrice < min) min = size.sellingPrice;
      });
    });
    return min === Infinity ? 0 : min;
  }, [product]);

  const productName =
    !isArabic && product.nameFr ? product.nameFr : product.name;

  return (
    <CardWrapper
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onCardClick(product);
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{ opacity: isOrderingEnabled ? 1 : 0.6 }}
      $hasItems={quantityInCart > 0}
    >
      {/* Badge Logic */}
      {quantityInCart > 0 && <QuantityBadge>{quantityInCart}</QuantityBadge>}

      <ImageContainer>
        {imageUrl ? (
          <img src={imageUrl} alt={productName} loading="lazy" />
        ) : (
          <LoadingSkeleton />
        )}
      </ImageContainer>

      <Content>
        {product.brand && <Brand>{product.brand}</Brand>}
        <ProductName>{productName}</ProductName>
        <PriceRow>
          <Price>
            {parseInt(displayPrice)} {t("dzd")}
          </Price>
        </PriceRow>
      </Content>
    </CardWrapper>
  );
};

export default PremiumProductCard;
