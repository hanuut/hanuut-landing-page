import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getImage } from "../../../Images/services/imageServices";
import { getImageUrl } from "../../../../utils/imageUtils";
import { FaMinus, FaPlus, FaTimes, FaExpand, FaEye, FaBookmark, FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";

// =========================================================
// 🛡️ STYLED COMPONENTS MOVED TO TOP (RESOLVES LINTER ERRORS)
// =========================================================

const DetailContainer = styled(motion.div)`
  width: 100%;
  background: #111214;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const BlurredBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(props) => props.$imgUrl});
  background-size: cover;
  background-position: center;
  filter: blur(50px) brightness(0.7);
  transform: scale(1.15);
  z-index: 0;
  pointer-events: none;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(17, 18, 20, 0.15) 0%,
    rgba(17, 18, 20, 0.55) 65%,
    #111214 100%
  );
  z-index: 1;
  pointer-events: none;
`;

const RelativeContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const GallerySection = styled.div`
  width: 100%;
  height: 240px;
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BlurredGalleryBg = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.$imgUrl});
  background-size: cover;
  background-position: center;
  filter: blur(25px) brightness(0.4);
  z-index: 1;
  pointer-events: none;
`;

const SharpForegroundImage = styled.img`
  position: relative;
  z-index: 2;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
`;

const MainImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: zoom-in;
  z-index: 2;
`;

const AltImagesRow = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 6px;
  border-radius: 12px;
  z-index: 10;
  max-width: 80%;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const AltThumbnail = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
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

const FloatingSocialProof = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  gap: 8px;
`;

const ProofBadge = styled.span`
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  svg {
    color: ${(props) => props.theme.primaryColor};
  }
`;

const ImageOverlayScrim = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.3) 70%,
    transparent 100%
  );
  padding: 2.5rem 1.25rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: ${(props) => (props.$isArabic ? "right" : "left")};
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};
  z-index: 5;
`;

const Brand = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.primaryColor};
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1.5px;
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
  font-weight: 900;
  color: ${(props) => props.theme.primaryColor};
  margin-top: 0.2rem;
`;

const ZoomHint = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px;
  border-radius: 50%;
  color: white;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const InfoSection = styled.div`
  padding: 0 1.25rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionLabel = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionPanelRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const PanelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: ${(props) => (props.$isButton ? "1 1 180px" : "0 1 auto")};
  min-width: fit-content;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const PillsContainer = styled.div`
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 2px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ColorSwatch = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${(props) => props.$colorCode || "#27272a"};
  border: 2px solid
    ${(props) => (props.$active ? "white" : "rgba(255,255,255,0.1)")};
  box-shadow: ${(props) =>
    props.$active ? `0 0 8px ${props.theme.primaryColor}` : "none"};

  &:hover {
    transform: scale(1.15);
  }
`;

const SizePill = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  background: ${(props) =>
    props.$active ? "white" : "rgba(255,255,255,0.03)"};
  border: 1px solid
    ${(props) =>
      props.$active ? props.theme.primaryColor : "rgba(255,255,255,0.1)"};
  color: ${(props) => (props.$active ? "#000" : "#D4D4D8")};
  box-shadow: ${(props) =>
    props.$active ? `0 0 8px ${props.theme.primaryColor}50` : "none"};

  &:hover {
    background: ${(props) =>
      props.$active ? "white" : "rgba(255,255,255,0.08)"};
  }
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 16px;
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-family: "Cairo", sans-serif;
  .name {
    font-size: 0.7rem;
    color: #71717a;
    font-weight: 700;
    text-transform: uppercase;
  }
  .val {
    font-size: 0.85rem;
    color: #e4e4e7;
    font-weight: 600;
  }
`;

const AccordionContainer = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.01);
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Tajawal", sans-serif;
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const AccordionBody = styled(motion.div)`
  overflow: hidden;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #a1a1aa;
  font-family: "Cairo", sans-serif;
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

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
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
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.85);
  }
`;

const COLOR_MAP = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  grey: "#6B7280",
  beige: "#F5F5DC",
};

// --- NEW COMPONENT SPECIFICS GROUP ---
const SelectorGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// --- MAIN INLINE COMPONENT ---
const InlineProductDetails = ({
  product,
  onAddToCart,
  onUpdateQuantity,
  cartItems,
  isOrderingEnabled,
  onClose,
  onImageChange,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImageId, setActiveImageId] = useState(null);
  const [imagesMap, setImagesMap] = useState({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(false);

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
    return product.availabilities.find((a) => a.color === selectedColor);
  }, [product, selectedColor]);

  const currentSizeDetails = useMemo(() => {
    return currentAvailability?.sizes.find((s) => s.size === selectedSize);
  }, [currentAvailability, selectedSize]);

  useEffect(() => {
    if (currentAvailability) {
      const sizeExists = currentAvailability.sizes.some(
        (s) => s.size === selectedSize,
      );
      if (!sizeExists && currentAvailability.sizes?.length > 0) {
        setSelectedSize(currentAvailability.sizes[0].size);
      }
      setActiveImageId(currentAvailability.imageId);
    }
  }, [selectedColor]);

  useEffect(() => {
    if (activeImageId && onImageChange) {
      onImageChange(product._id, activeImageId);
    }
  }, [activeImageId, onImageChange, product._id]);

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
      productId: product._id,
      title: product.name,
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

  // --- STRICT STIPULATION: BOOLEAN CAST CONVERTER ---
  const showViews = !!(product.viewsCount && product.viewsCount > 0);
  const showSaves = !!(product.savesCount && product.savesCount > 0);

  return (
    <>
      <DetailContainer
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BlurredBackdrop $imgUrl={imagesMap[activeImageId]} />
        <GradientOverlay />

        <RelativeContent>
          <GallerySection>
            {/* --- STRICTLY BOOLEAN CHECK PREVENTS ROGUE "0" TEXT BUG --- */}
            {(showViews || showSaves) && (
              <FloatingSocialProof>
                {showViews ? (
                  <ProofBadge>
                    <FaEye /> {product.viewsCount}
                  </ProofBadge>
                ) : null}
                {showSaves ? (
                  <ProofBadge>
                    <FaBookmark /> {product.savesCount}
                  </ProofBadge>
                ) : null}
              </FloatingSocialProof>
            )}

            <MainImageWrapper onClick={() => setIsLightboxOpen(true)}>
              {/* Blurred background fills full width */}
              <BlurredGalleryBg $imgUrl={imagesMap[activeImageId]} />

              {/* Foreground sharp image fits neatly inside viewport constraints */}
              <AnimatePresence mode="wait">
                {imagesMap[activeImageId] && (
                  <SharpForegroundImage
                    key={activeImageId}
                    src={imagesMap[activeImageId]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>

              <ImageOverlayScrim $isArabic={isArabic}>
                {product.brand && <Brand>{product.brand}</Brand>}
                <ProductName>{product.name}</ProductName>
                <Price>
                  {parseInt(currentSizeDetails?.sellingPrice || 0)} {t("dzd")}
                </Price>
              </ImageOverlayScrim>

              <ZoomHint>
                <FaExpand />
              </ZoomHint>
            </MainImageWrapper>

            {/* Carousel thumbnails absolutely positioned on top at bottom */}
            {galleryImages.length > 1 && (
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
            )}
          </GallerySection>

          <InfoSection>
            {product.shortDescription && (
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#a1a1aa",
                  margin: 0,
                  fontFamily: "Cairo, sans-serif",
                  lineHeight: 1.5,
                }}
              >
                {product.shortDescription}
              </p>
            )}

            {/* --- MULTI-VARIANT COMPACT HORIZONTAL PANEL --- */}
            <ActionPanelRow>
              {/* Colors */}
              <PanelSection>
                <SectionLabel>{t("color_prefix")}</SectionLabel>
                <PillsContainer>
                  {product.availabilities.map((av) => {
                    const hex = COLOR_MAP[av.color.toLowerCase()] || av.color;
                    return (
                      <ColorSwatch
                        key={av.color}
                        $active={selectedColor === av.color}
                        $colorCode={hex}
                        onClick={() => setSelectedColor(av.color)}
                        title={av.colorLabel || av.color}
                      >
                        {selectedColor === av.color && (
                          <FaCheck
                            size={10}
                            color={
                              av.color.toLowerCase() === "white"
                                ? "#000"
                                : "#fff"
                            }
                          />
                        )}
                      </ColorSwatch>
                    );
                  })}
                </PillsContainer>
              </PanelSection>

              {/* Sizes */}
              {currentAvailability && (
                <PanelSection>
                  <SectionLabel>{t("size_prefix")}</SectionLabel>
                  <PillsContainer>
                    {currentAvailability.sizes.map((s) => (
                      <SizePill
                        key={s.size}
                        $active={selectedSize === s.size}
                        onClick={() => setSelectedSize(s.size)}
                      >
                        {s.size}
                      </SizePill>
                    ))}
                  </PillsContainer>
                </PanelSection>
              )}

              {/* Add to Cart / Qty */}
              {isOrderingEnabled && (
                <PanelSection $isButton>
                  <SectionLabel style={{ visibility: "hidden" }}>
                    Action
                  </SectionLabel>
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
                    <AddToCartBtn onClick={handleAdd}>
                      {t("add_to_cart")}
                    </AddToCartBtn>
                  )}
                </PanelSection>
              )}
            </ActionPanelRow>

            {/* Two-Column Specifications Grid */}
            {product.specifications?.length > 0 && (
              <SelectorGrid>
                <SectionLabel>{t("specifications_header")}</SectionLabel>
                <SpecsGrid>
                  {product.specifications.slice(0, 4).map((spec, idx) => (
                    <SpecItem key={idx}>
                      <span className="name">{spec.name}</span>
                      <span className="val">{spec.value}</span>
                    </SpecItem>
                  ))}
                </SpecsGrid>
              </SelectorGrid>
            )}

            {/* Collapsible Accordion description */}
            {product.longDescription && (
              <AccordionContainer>
                <AccordionHeader onClick={() => setIsDescOpen(!isDescOpen)}>
                  <span>Details & Care</span>
                  {isDescOpen ? <FaChevronUp /> : <FaChevronDown />}
                </AccordionHeader>
                <AnimatePresence>
                  {isDescOpen && (
                    <AccordionBody
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div style={{ padding: "0 1.25rem 1.25rem 1.25rem" }}>
                        {product.longDescription}
                      </div>
                    </AccordionBody>
                  )}
                </AnimatePresence>
              </AccordionContainer>
            )}
          </InfoSection>
        </RelativeContent>

        {onClose && (
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        )}
      </DetailContainer>

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