import React, { useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import { FaTimes, FaMinus, FaPlus } from "react-icons/fa";

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const BentoContainer = styled(motion.div)`
  width: 100%;
  max-width: 850px;
  height: 500px; /* FIXED HEIGHT FOR PERFECT DESKTOP VIEW */
  background: #111214;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr; /* PERFECT 50/50 SPLIT */
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    max-height: 90vh;
    height: auto;
    overflow-y: auto;
  }
`;

const GallerySection = styled.div`
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 300px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const MainImageWrapper = styled.div`
  width: 100%;
  height: 280px; /* COMPACT FOR FIXED VIEWPORT */
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const AltImagesRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  width: 100%;
  justify-content: center;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const AltThumbnail = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid
    ${(props) => (props.$active ? props.theme.primaryColor : "transparent")};
  cursor: pointer;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoSection = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto; /* Scrollable only internally if content overflows */

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Brand = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.primaryColor};
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.5px;
`;

const ProductName = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  margin-top: 0.25rem;
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 700;
  text-transform: uppercase;
`;

const SelectorGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const PillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Pill = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${(props) =>
    props.$active ? "white" : "rgba(255,255,255,0.03)"};
  border: 1px solid
    ${(props) => (props.$active ? "white" : "rgba(255,255,255,0.1)")};
  color: ${(props) => (props.$active ? "#000" : "#d4d4d8")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.$active ? "white" : "rgba(255,255,255,0.08)"};
  }
`;

const SpecsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  border-radius: 10px;
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  .name {
    color: #71717a;
    font-weight: 600;
  }
  .val {
    color: white;
  }
`;

const QtyBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.4rem;
  border-radius: 12px;
`;

const QtyBtn = styled.button`
  background: ${(props) => props.theme.primaryColor};
  color: #000;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const AddToCartBtn = styled.button`
  background: ${(props) => props.theme.primaryColor};
  color: #000;
  border: none;
  width: 100%;
  padding: 0.85rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ProductDetailsModal = ({
  product,
  onClose,
  onAddToCart,
  onUpdateQuantity,
  cartItems,
  isOrderingEnabled,
}) => {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(
    product?.availabilities?.[0]?.color || "",
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageId, setActiveImageId] = useState(null);
  const [imagesMap, setImagesMap] = useState({});

  const currentAvailability = useMemo(() => {
    return product.availabilities.find((a) => a.color === selectedColor);
  }, [product, selectedColor]);

  const currentSizeDetails = useMemo(() => {
    return currentAvailability?.sizes.find((s) => s.size === selectedSize);
  }, [currentAvailability, selectedSize]);

  useEffect(() => {
    if (currentAvailability) {
      if (currentAvailability.sizes?.length > 0) {
        setSelectedSize(currentAvailability.sizes[0].size);
      }
      setActiveImageId(currentAvailability.imageId);
    }
  }, [currentAvailability]);

  // Lazy load image buffers
  const allImageIds = useMemo(() => {
    const ids = [];
    product.availabilities.forEach((av) => {
      if (av.imageId) ids.push(av.imageId);
      if (av.altImageIds) ids.push(...av.altImageIds);
    });
    return Array.from(new Set(ids));
  }, [product]);

  useEffect(() => {
    allImageIds.forEach((id) => {
      if (imagesMap[id]) return;
      getImage(id).then((res) => {
        if (res.data) {
          setImagesMap((prev) => ({ ...prev, [id]: getImageUrl(res.data) }));
        }
      });
    });
  }, [allImageIds, imagesMap]);

  const currentVariantId = `${product._id}_${selectedColor}_${selectedSize}`;
  const existingCartItem = cartItems.find(
    (item) => item.variantId === currentVariantId,
  );

  const handleAdd = () => {
    if (!currentSizeDetails) return;
    onAddToCart({
      product,
      variantId: currentVariantId,
      color: selectedColor,
      size: selectedSize,
      sellingPrice: currentSizeDetails.sellingPrice,
      imageId: currentAvailability.imageId,
      quantity: 1,
    });
  };

  const galleryImages = useMemo(() => {
    if (!currentAvailability) return [];
    return [
      currentAvailability.imageId,
      ...(currentAvailability.altImageIds || []),
    ];
  }, [currentAvailability]);

  return (
    <ModalBackdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <BentoContainer
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Photo Bento Block */}
        <GallerySection>
          <MainImageWrapper>
            <AnimatePresence mode="wait">
              {imagesMap[activeImageId] && (
                <motion.img
                  key={activeImageId}
                  src={imagesMap[activeImageId]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </MainImageWrapper>
          <AltImagesRow>
            {galleryImages.map((id, index) => (
              <AltThumbnail
                key={index}
                $active={activeImageId === id}
                onClick={() => setActiveImageId(id)}
              >
                <img src={imagesMap[id]} alt="Alt view" />
              </AltThumbnail>
            ))}
          </AltImagesRow>
        </GallerySection>

        {/* Right Side: Configuration Bento Block */}
        <InfoSection>
          <TitleBlock>
            {product.brand && <Brand>{product.brand}</Brand>}
            <ProductName>{product.name}</ProductName>
            <Price>
              {parseInt(currentSizeDetails?.sellingPrice || 0)} {t("dzd")}
            </Price>
          </TitleBlock>

          {/* Color Matrix Selector */}
          <SelectorGrid>
            <SectionLabel>Color</SectionLabel>
            <PillsContainer>
              {product.availabilities.map((av) => (
                <Pill
                  key={av.color}
                  $active={selectedColor === av.color}
                  onClick={() => setSelectedColor(av.color)}
                >
                  {av.colorLabel || av.color}
                </Pill>
              ))}
            </PillsContainer>
          </SelectorGrid>

          {/* Size Matrix Selector */}
          {currentAvailability && (
            <SelectorGrid>
              <SectionLabel>Size</SectionLabel>
              <PillsContainer>
                {currentAvailability.sizes.map((s) => (
                  <Pill
                    key={s.size}
                    $active={selectedSize === s.size}
                    onClick={() => setSelectedSize(s.size)}
                  >
                    {s.size}
                  </Pill>
                ))}
              </PillsContainer>
            </SelectorGrid>
          )}

          {/* Product Specs */}
          {product.specifications?.length > 0 && (
            <SelectorGrid>
              <SectionLabel>Specifications</SectionLabel>
              <SpecsTable>
                {product.specifications.slice(0, 3).map((spec, idx) => (
                  <SpecRow key={idx}>
                    <span className="name">{spec.name}</span>
                    <span className="val">{spec.value}</span>
                  </SpecRow>
                ))}
              </SpecsTable>
            </SelectorGrid>
          )}

          {/* Action Footer */}
          {isOrderingEnabled && (
            <div style={{ marginTop: "auto" }}>
              {existingCartItem ? (
                <QtyBox>
                  <QtyBtn
                    onClick={() =>
                      onUpdateQuantity(
                        currentVariantId,
                        existingCartItem.quantity - 1,
                      )
                    }
                  >
                    <FaMinus />
                  </QtyBtn>
                  <span className="font-bold text-lg">
                    {existingCartItem.quantity}
                  </span>
                  <QtyBtn
                    onClick={() =>
                      onUpdateQuantity(
                        currentVariantId,
                        existingCartItem.quantity + 1,
                      )
                    }
                  >
                    <FaPlus />
                  </QtyBtn>
                </QtyBox>
              ) : (
                <AddToCartBtn onClick={handleAdd}>Add to Cart</AddToCartBtn>
              )}
            </div>
          )}
        </InfoSection>

        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </BentoContainer>
    </ModalBackdrop>
  );
};

export default ProductDetailsModal;
