import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getImage } from '../../../Images/services/imageServices';
import { getImageUrl } from '../../../../utils/imageUtils';
import { FaTimes, FaMinus, FaPlus } from 'react-icons/fa';

// --- 1. LAYOUT & ANIMATION COMPONENTS ---

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.75); /* Darker backdrop for focus */
  backdrop-filter: blur(15px); /* Strong blur */
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 950px; /* Spacious width for split view */
  height: auto;
  max-height: 85vh; /* Keep it off the edges */
  
  /* Premium Dark Theme */
  background-color: #18181B; /* Zinc 900 */
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px; /* Smooth corners */
  box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7);
  
  position: relative;
  overflow: hidden; /* Contains the spotlight */
  display: flex;
  flex-direction: column;

  /* Spotlight Effect Overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(
      800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
      rgba(255, 255, 255, 0.04), 
      transparent 40%
    );
    z-index: 0;
    pointer-events: none;
    transition: opacity 0.3s;
  }
`;

const ContentLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  z-index: 1; /* Above spotlight */
  overflow: hidden;

  /* Mobile Stack */
  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

// --- 2. LEFT SECTION: IMAGE ---

const ImageSection = styled.div`
  flex: 1.2;
  background-color: #09090b; /* Darker than content */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  /* On Mobile, it becomes a header image */
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    aspect-ratio: 1/1; 
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 2.5rem;
    box-sizing: border-box;
    transition: transform 0.5s ease;
  }
`;

// --- 3. RIGHT SECTION: DETAILS ---

const InfoSection = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto; /* Only scroll text on desktop */
  
  /* Scrollbar hiding */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
    overflow-y: visible; /* Let container scroll on mobile */
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  /* Flip position based on language */
  ${props => props.isArabic ? 'left: 1.5rem;' : 'right: 1.5rem;'}
  z-index: 10;
  
  width: 42px; height: 42px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;

  &:hover {
    background: rgba(255,255,255,0.15);
    transform: scale(1.05);
  }
`;

// --- 4. TYPOGRAPHY ---

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const BrandLabel = styled.span`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 700;
  color: #71717a; /* Zinc 500 */
  display: block;
`;

const ProductTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0.5rem 0 0 0;
  line-height: 1.1;
  font-family: 'Tajawal', sans-serif;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const PriceTag = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${(props) => props.theme.primaryColor || '#F07A48'};
  margin-top: 0.5rem;
`;

// --- 5. OPTIONS (Colors & Sizes) ---

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OptionLabel = styled.span`
  font-size: 0.9rem;
  color: #a1a1aa;
  font-weight: 500;
`;

const PillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const OptionPill = styled.button`
  padding: 0.7rem 1.4rem;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Tajawal', sans-serif;
  
  /* Unselected */
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d4d4d8;

  /* Selected */
  ${props => props.$active && css`
    background: #FFFFFF;
    color: #000000;
    border-color: #FFFFFF;
    box-shadow: 0 0 20px rgba(255,255,255,0.15);
  `}

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ColorCircle = styled.button`
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  background-color: ${props => props.$color};
  transition: transform 0.2s, box-shadow 0.2s;
  
  ${props => props.$active && css`
    transform: scale(1.15);
    box-shadow: 0 0 0 2px #18181B, 0 0 0 4px white;
  `}
  &:hover { transform: scale(1.1); }
`;

// --- 6. ACTIONS FOOTER ---

const Footer = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// "Add to Cart" Button
const MainButton = styled.button`
  width: 100%;
  padding: 1.1rem;
  border-radius: 18px;
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
  font-family: 'Tajawal', sans-serif;

  background: ${(props) => props.$disabled ? '#27272a' : props.theme.primaryColor};
  color: ${(props) => props.$disabled ? '#52525b' : '#111'}; // Black text on bright button
  
  ${props => !props.$disabled && css`
    box-shadow: 0 4px 20px ${(props) => `${props.theme.primaryColor}40`};
    &:hover { transform: translateY(-2px); filter: brightness(1.1); }
    &:active { transform: scale(0.98); }
  `}
`;

// Quantity Control Bar
const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
`;

const QtyBtn = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.theme.primaryColor};
  border: none;
  color: #111;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const QtyDisplay = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  font-family: 'Tajawal', sans-serif;
  min-width: 40px;
  text-align: center;
`;

const WarningBadge = styled.div`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 0.95rem;
`;

// --- COMPONENT LOGIC ---

const ProductDetailsModal = ({ 
  product, 
  onClose, 
  onAddToCart, 
  onUpdateQuantity, 
  cartItems, 
  isOrderingEnabled, 
  orderingStatusKey 
}) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const modalRef = useRef(null);
    
    // -- State --
    const [selectedColor, setSelectedColor] = useState(product?.availabilities[0]?.color || '');
    const [selectedSize, setSelectedSize] = useState('');
    const [imageBuffer, setImageBuffer] = useState(null);
    
    // -- Spotlight Effect --
    const handleMouseMove = (e) => {
        if (!modalRef.current) return;
        const rect = modalRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        modalRef.current.style.setProperty("--mouse-x", `${x}px`);
        modalRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    // -- Derived Data --
    const currentAvailability = useMemo(() => 
        product.availabilities.find(av => av.color === selectedColor),
        [product, selectedColor]
    );

    const currentSizeDetails = useMemo(() =>
        currentAvailability?.sizes.find(s => s.size === selectedSize),
        [currentAvailability, selectedSize]
    );

    // -- Check Cart --
    // Create unique ID for this specific combination
    const currentVariantId = `${product._id}_${selectedColor}_${selectedSize}`;
    
    // Check if this item is in the Redux cart
    const existingCartItem = useMemo(() => {
       if(!cartItems || !currentSizeDetails) return null;
       return cartItems.find(item => item.variantId === currentVariantId);
    }, [cartItems, currentVariantId, currentSizeDetails]);

    // -- Effects --

    // Auto-select size if current selection is invalid for new color
    useEffect(() => {
        if (currentAvailability && currentAvailability.sizes.length > 0) {
             const sizeExists = currentAvailability.sizes.some(s => s.size === selectedSize);
             if (!sizeExists) {
                 setSelectedSize(currentAvailability.sizes[0].size);
             }
        }
    }, [currentAvailability]);

    // Fetch Image for the selected color
    useEffect(() => {
        let isMounted = true;
        if (currentAvailability?.imageId) {
            getImage(currentAvailability.imageId)
                .then(res => { if(isMounted && res.data) setImageBuffer(res.data); })
                .catch(err => console.error("Img error", err));
        }
        return () => { isMounted = false; };
    }, [currentAvailability]);
    
    const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);
    const productName = !isArabic && product.nameFr ? product.nameFr : product.name;
    
    // -- Handlers --
    const handleAddToCartClick = () => {
        if (!currentSizeDetails) return;
        const cartVariant = {
            product: product,
            variantId: currentVariantId,
            color: selectedColor,
            size: selectedSize,
            sellingPrice: currentSizeDetails.sellingPrice,
            imageId: currentAvailability.imageId,
            quantity: 1
        };
        onAddToCart(cartVariant);
        // We do NOT close the modal, allowing user to see the change to quantity controls
    };

    return (
        <AnimatePresence>
            <ModalBackdrop 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={onClose}
            >
                <ModalContent 
                    ref={modalRef}
                    onMouseMove={handleMouseMove}
                    initial={{ y: 50, opacity: 0, scale: 0.96 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.96 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <CloseButton onClick={onClose} isArabic={isArabic}><FaTimes /></CloseButton>

                    <ContentLayout>
                        {/* LEFT: Product Image */}
                        <ImageSection>
                           {imageUrl ? (
                               <motion.img 
                                   key={imageUrl} // Animate when image changes
                                   initial={{ opacity: 0, scale: 1.1 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   transition={{ duration: 0.5 }}
                                   src={imageUrl} 
                                   alt={productName} 
                                />
                           ) : (
                               <div style={{color: '#555'}}>Loading...</div>
                           )}
                        </ImageSection>

                        {/* RIGHT: Product Information */}
                        <InfoSection isArabic={isArabic}>
                            
                            <HeaderGroup>
                                {product.brand && <BrandLabel>{product.brand}</BrandLabel>}
                                <ProductTitle>{productName}</ProductTitle>
                                <PriceTag>
                                    {currentSizeDetails ? parseInt(currentSizeDetails.sellingPrice) : '-'} {t("dzd")}
                                </PriceTag>
                            </HeaderGroup>

                            {/* Color Selection */}
                            <OptionGroup>
                                <OptionLabel>{t('color', 'Color')}</OptionLabel>
                                <PillsContainer>
                                    {product.availabilities.map(av => (
                                        CSS.supports('color', av.color) ? (
                                            <ColorCircle 
                                                key={av.color} 
                                                $color={av.color} 
                                                $active={selectedColor === av.color} 
                                                onClick={() => setSelectedColor(av.color)} 
                                                title={av.color}
                                            />
                                        ) : (
                                            <OptionPill 
                                                key={av.color} 
                                                $active={selectedColor === av.color} 
                                                onClick={() => setSelectedColor(av.color)}
                                            >
                                                {av.color}
                                            </OptionPill>
                                        )
                                    ))}
                                </PillsContainer>
                            </OptionGroup>

                            {/* Size Selection */}
                            {currentAvailability && (
                                <OptionGroup>
                                    <OptionLabel>{t('size', 'Size')}</OptionLabel>
                                    <PillsContainer>
                                        {currentAvailability.sizes.map(s => (
                                            <OptionPill 
                                                key={s.size} 
                                                $active={selectedSize === s.size} 
                                                onClick={() => setSelectedSize(s.size)}
                                            >
                                                {s.size}
                                            </OptionPill>
                                        ))}
                                    </PillsContainer>
                                </OptionGroup>
                            )}

                            {/* Sticky Footer for Actions */}
                            <Footer>
                                {isOrderingEnabled ? (
                                    existingCartItem ? (
                                        // ITEM EXISTS: Show Quantity Controls
                                        <QuantityWrapper>
                                            <QtyBtn onClick={() => onUpdateQuantity(currentVariantId, existingCartItem.quantity - 1)}>
                                                <FaMinus size={14} />
                                            </QtyBtn>
                                            <QtyDisplay>{existingCartItem.quantity}</QtyDisplay>
                                            <QtyBtn onClick={() => onUpdateQuantity(currentVariantId, existingCartItem.quantity + 1)}>
                                                <FaPlus size={14} />
                                            </QtyBtn>
                                        </QuantityWrapper>
                                    ) : (
                                        // NEW ITEM: Show Add Button
                                        <MainButton 
                                            onClick={handleAddToCartClick}
                                            disabled={!currentSizeDetails}
                                            $disabled={!currentSizeDetails}
                                        >
                                            {t('add_to_cart')}
                                        </MainButton>
                                    )
                                ) : (
                                    // ORDERING DISABLED: Show Warning
                                    <WarningBadge>
                                        {t(orderingStatusKey)}
                                    </WarningBadge>
                                )}
                            </Footer>
                        </InfoSection>
                    </ContentLayout>
                </ModalContent>
            </ModalBackdrop>
        </AnimatePresence>
    );
};

export default ProductDetailsModal;