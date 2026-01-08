import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getImageUrl } from "../../../../utils/imageUtils";
import { getImage } from "../../../Images/services/imageServices";

const CardWrapper = styled(motion.div)`
  background-color: #18181B; 
  border: 1px solid #27272A;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${(props) => props.theme.primaryColor || "#F07A48"};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  background-color: #09090b;

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
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
`;

const Brand = styled.p`
  font-size: 0.7rem;
  color: #71717a; 
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
`;

const ProductName = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.3;
  font-family: 'Tajawal', sans-serif;
  
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
  font-size: 1rem;
  font-weight: 700;
  color: white;
`;

const LoadingSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background: #27272a;
  opacity: 0.5;
`;

const PremiumProductCard = ({ 
  product, 
  onCardClick, 
  isOrderingEnabled // <--- New Prop
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

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
    return () => { isMounted = false; };
  }, [imageId]);

  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);

  // Price Logic
  const displayPrice = useMemo(() => {
    if (!product?.availabilities?.length) return 0;
    let min = Infinity;
    product.availabilities.forEach(av => {
        av.sizes.forEach(size => {
            if (size.sellingPrice < min) min = size.sellingPrice;
        });
    });
    return min === Infinity ? 0 : min;
  }, [product]);

  const productName = !isArabic && product.nameFr ? product.nameFr : product.name;

  return (
    <CardWrapper
      onClick={() => onCardClick(product)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      // --- VISUAL CUE ---
      // Dim the card if ordering is disabled, but keep it clickable
      style={{ opacity: isOrderingEnabled ? 1 : 0.75, filter: isOrderingEnabled ? 'none' : 'grayscale(30%)' }}
    >
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
          <Price>{parseInt(displayPrice)} {t("dzd")}</Price>
        </PriceRow>
      </Content>
    </CardWrapper>
  );
};

export default PremiumProductCard;