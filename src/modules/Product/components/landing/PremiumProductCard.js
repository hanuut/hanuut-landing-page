import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getImageUrl } from "../../../../utils/imageUtils";
import { getImage } from "../../../Images/services/imageServices";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

const CardWrapper = styled(motion.div)`
  background-color: ${props => props.theme.surface};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;

  /* --- SPECIFIC SELECTED GLOW VS FLAT IN-CART --- */
  border: 2px solid ${props => 
    props.$isActive 
      ? props.theme.primaryColor // Selected Glow
      : 'rgba(255,255,255,0.05)' // In-cart or Default remains flat
  };

  box-shadow: ${props => 
    props.$isActive 
      ? `0 0 25px ${props.theme.primaryColor}50` // Glowing drop shadow
      : "0 4px 20px rgba(0,0,0,0.1)"
  };

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.$isActive ? props.theme.primaryColor : "rgba(255,255,255,0.2)"};
    box-shadow: ${props => props.$isActive ? `0 0 25px ${props.theme.primaryColor}50` : "0 10px 25px rgba(0,0,0,0.2)"};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  background-color: #121214;
  cursor: pointer;

  img {
    width: 100%;
    height: auto; /* --- NATIVE BENTO HEIGHT ADAPTATION --- */
    max-height: 440px; 
    display: block;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${CardWrapper}:hover img {
    transform: scale(1.03);
  }
`;

const Content = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const Brand = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.primaryColor};
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1px;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.4;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
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
  padding-top: 1rem;
`;

const Price = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  color: white;
`;

const ActionButton = styled.button`
  background: ${props => props.theme.primaryColor};
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
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
    color: ${props => props.theme.primaryColor};
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
  onCardClick,
  onUpdateQuantity,
  isOrderingEnabled,
  quantityInCart = 0,
  $isActive = false,
  cartItems = [],
  imageOverrideId = null, // --- CAROUSEL-SYNCED ID ---
}) => {
  const { t } = useTranslation();
  const [imageBuffer, setImageBuffer] = useState(null);

  const defaultAvailability = product?.availabilities?.[0];
  const defaultSize = defaultAvailability?.sizes?.[0];
  const activeImageId = imageOverrideId || defaultAvailability?.imageId; // --- DYNAMIC BINDING ---

  useEffect(() => {
    let isMounted = true;
    if (activeImageId) {
      getImage(activeImageId).then((res) => {
        if (isMounted && res.data) setImageBuffer(res.data);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [activeImageId]);

  const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);
  const productName = product.name;

  const activeCartItemForThisProduct = useMemo(() => {
    return cartItems.find(item => {
      const cartProdId = (item.productId || item.product?._id || item.product?.id)?.toString();
      return cartProdId === product._id?.toString();
    });
  }, [cartItems, product]);

  const handleCardSelect = () => {
    onCardClick(product, false); 
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation(); 
    if (!isOrderingEnabled || !defaultSize) return;
    onCardClick(product, true); 
  };

  const handleDecrement = (e) => {
    e.stopPropagation(); 
    if (!defaultSize || !onUpdateQuantity) return;
    const targetVariantId = activeCartItemForThisProduct?.variantId || `${product._id}_${defaultAvailability.color}_${defaultSize.size}`;
    const currentQty = activeCartItemForThisProduct?.quantity || quantityInCart;
    onUpdateQuantity(targetVariantId, currentQty - 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation(); 
    if (!defaultSize || !onUpdateQuantity) return;
    const targetVariantId = activeCartItemForThisProduct?.variantId || `${product._id}_${defaultAvailability.color}_${defaultSize.size}`;
    const currentQty = activeCartItemForThisProduct?.quantity || quantityInCart;
    onUpdateQuantity(targetVariantId, currentQty + 1);
  };

  return (
    <CardWrapper onClick={handleCardSelect} $isActive={$isActive}>
      <ImageContainer>
        {imageUrl && <img src={imageUrl} alt={productName} loading="lazy" />}
      </ImageContainer>

      <Content>
        {product.brand && <Brand>{product.brand}</Brand>}
        <ProductName>{productName}</ProductName>

        <PriceRow>
          <Price>
            {parseInt(defaultSize?.sellingPrice || 0)} {t("dzd")}
          </Price>
          {isOrderingEnabled &&
            defaultSize &&
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
              <ActionButton onClick={handleQuickAdd}>
                <FaShoppingCart />
              </ActionButton>
            ))}
        </PriceRow>
      </Content>
    </CardWrapper>
  );
};

export default PremiumProductCard;