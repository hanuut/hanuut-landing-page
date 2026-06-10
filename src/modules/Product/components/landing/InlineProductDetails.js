import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import { FaMinus, FaPlus, FaTimes, FaExpand } from "react-icons/fa";

const DetailContainer = styled(motion.div)`
  width: 100%;
  background: #111214;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
`;

// --- NEW SOFT GLASSY BACKDROP ---
const BlurredBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.$imgUrl});
  background-size: cover;
  background-position: center;
  filter: blur(40px) brightness(0.6); /* Softened from 0.35 to let colors pop */
  transform: scale(1.15);
  z-index: 0;
  pointer-events: none;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  /* Soft overlay transition to solid black at the bottom */
  background: linear-gradient(
    to bottom, 
    rgba(17, 18, 20, 0.25) 0%, 
    rgba(17, 18, 20, 0.8) 75%, 
    #111214 100__%
  );
  z-index: 1;
  pointer-events: none;
`;

const RelativeContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GallerySection = styled.div`
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.05);
`;

const MainImageWrapper = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: zoom-in;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }
`;

const ZoomHint = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  padding: 4px;
  border-radius: 6px;
  color: white;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AltImagesRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  width: 100%;
  justify-content: center;
  &::-webkit-scrollbar { display: none; }
`;

const AltThumbnail = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid ${props => props.$active ? props.theme.primaryColor : 'transparent'};
  cursor: pointer;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.4);
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
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Brand = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.primaryColor};
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1px;
`;

const ProductName = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  font-family: 'Tajawal', sans-serif;
  line-height: 1.3;
`;

const Price = styled.div`
  font-size: 1.35rem;
  font-weight: 800;
  color: white;
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
  gap: 0.5rem;
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
  background: ${props => props.$active ? 'white' : 'rgba(255,255,255,0.03)'};
  border: 1px solid ${props => props.$active ? 'white' : 'rgba(255,255,255,0.1)'};
  color: ${props => props.$active ? '#000' : '#d4d4d8'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255,255,255,0.08)'};
  }
`;

const SpecsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 0.85rem;
  border-radius: 10px;
`;

const SpecRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  .name { color: #71717a; font-weight: 600; }
  .val { color: white; }
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
  background: ${props => props.theme.primaryColor};
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
  background: ${props => props.theme.primaryColor};
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

// --- LIGHTBOX PORTAL OVERLAY ---
const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: zoom-out;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
  }
`;

const InlineProductDetails = ({
  product,
  onAddToCart,
  onUpdateQuantity,
  cartItems,
  isOrderingEnabled,
  onClose,
}) => {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageId, setActiveImageId] = useState(null);
  const [imagesMap, setImagesMap] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset local state if active product changes
  useEffect(() => {
    if (product?.availabilities?.length > 0) {
      const firstAvail = product.availabilities[0];
      setSelectedColor(firstAvail.color);
      if (firstAvail.sizes?.length > 0) {
        setSelectedSize(firstAvail.sizes[0].size);
      }
      setActiveImageId(firstAvail.imageId);
    }
  }, [product]);

  const currentAvailability = useMemo(() => {
    return product.availabilities.find(a => a.color === selectedColor);
  }, [product, selectedColor]);

  const currentSizeDetails = useMemo(() => {
    return currentAvailability?.sizes.find(s => s.size === selectedSize);
  }, [currentAvailability, selectedSize]);

  useEffect(() => {
    if (currentAvailability) {
      const sizeExists = currentAvailability.sizes.some(s => s.size === selectedSize);
      if (!sizeExists && currentAvailability.sizes?.length > 0) {
        setSelectedSize(currentAvailability.sizes[0].size);
      }
      setActiveImageId(currentAvailability.imageId);
    }
  }, [currentAvailability, selectedSize]);

  // Load image assets
  const allImageIds = useMemo(() => {
    const ids = [];
    product.availabilities.forEach(av => {
      if (av.imageId) ids.push(av.imageId);
      if (av.altImageIds) ids.push(...av.altImageIds);
    });
    return Array.from(new Set(ids));
  }, [product]);

  useEffect(() => {
    allImageIds.forEach(id => {
      if (imagesMap[id]) return;
      getImage(id).then(res => {
        if (res.data) {
          setImagesMap(prev => ({ ...prev, [id]: getImageUrl(res.data) }));
        }
      });
    });
  }, [allImageIds, imagesMap]);

  const currentVariantId = `${product._id}_${selectedColor}_${selectedSize}`;
  const existingCartItem = cartItems.find(item => item.variantId === currentVariantId);

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
    return [currentAvailability.imageId, ...(currentAvailability.altImageIds || [])];
  }, [currentAvailability]);

  return (
    <>
      <DetailContainer initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <BlurredBackdrop $imgUrl={imagesMap[activeImageId]} />
        <GradientOverlay />
        
        <RelativeContent>
          <GallerySection>
            <MainImageWrapper onClick={() => setIsLightboxOpen(true)}>
              <AnimatePresence mode="wait">
                {imagesMap[activeImageId] && (
                  <motion.img 
                    key={activeImageId}
                    src={imagesMap[activeImageId]} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>
              <ZoomHint><FaExpand /></ZoomHint>
            </MainImageWrapper>
            <AltImagesRow>
              {galleryImages.map((id, index) => (
                <AltThumbnail key={index} $active={activeImageId === id} onClick={() => setActiveImageId(id)}>
                  <img src={imagesMap[id]} alt="Alt view" />
                </AltThumbnail>
              ))}
            </AltImagesRow>
          </GallerySection>

          <TitleBlock>
            {product.brand && <Brand>{product.brand}</Brand>}
            <ProductName>{product.name}</ProductName>
            <Price>{parseInt(currentSizeDetails?.sellingPrice || 0)} {t("dzd")}</Price>
          </TitleBlock>

          {/* Color Select */}
          <SelectorGrid>
            <SectionLabel>Color</SectionLabel>
            <PillsContainer>
              {product.availabilities.map(av => (
                <Pill key={av.color} $active={selectedColor === av.color} onClick={() => setSelectedColor(av.color)}>
                  {av.colorLabel || av.color}
                </Pill>
              ))}
            </PillsContainer>
          </SelectorGrid>

          {/* Size Select */}
          {currentAvailability && (
            <SelectorGrid>
              <SectionLabel>Size</SectionLabel>
              <PillsContainer>
                {currentAvailability.sizes.map(s => (
                  <Pill key={s.size} $active={selectedSize === s.size} onClick={() => setSelectedSize(s.size)}>
                    {s.size}
                  </Pill>
                ))}
              </PillsContainer>
            </SelectorGrid>
          )}

          {/* Specs */}
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

          {isOrderingEnabled && (
            <div style={{ marginTop: 'auto' }}>
              {existingCartItem ? (
                <QtyBox>
                  <QtyBtn onClick={() => onUpdateQuantity(currentVariantId, existingCartItem.quantity - 1)}><FaMinus /></QtyBtn>
                  <span className="font-bold text-lg">{existingCartItem.quantity}</span>
                  <QtyBtn onClick={() => onUpdateQuantity(currentVariantId, existingCartItem.quantity + 1)}><FaPlus /></QtyBtn>
                </QtyBox>
              ) : (
                <AddToCartBtn onClick={handleAdd}>Add to Cart</AddToCartBtn>
              )}
            </div>
          )}
        </RelativeContent>

        {onClose && (
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
        )}
      </DetailContainer>

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {isLightboxOpen && imagesMap[activeImageId] && (
          <LightboxOverlay 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.img 
              src={imagesMap[activeImageId]} 
              alt={product.name} 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }} 
            />
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default InlineProductDetails;