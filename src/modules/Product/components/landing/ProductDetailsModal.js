import React, { useState, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getImage } from '../../../Images/services/imageServices';
import { getImageUrl } from '../../../../utils/imageUtils'; // Ensure you use the utility

// --- Styled Components ---

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 1rem;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75); /* Darker backdrop */
  backdrop-filter: blur(8px); /* Stronger blur for focus */
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  direction: ltr; 
  padding: 1rem;
  box-sizing: border-box;
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 550px;
  /* Use Theme Surface (Zinc 900 for Partners, White for Grocery) */
  background-color: ${props => props.theme.surface || '#18181B'}; 
  border: 1px solid ${props => props.theme.border || 'rgba(255,255,255,0.1)'};
  border-radius: 24px;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  direction: ${props => (props.isArabic ? 'rtl' : 'ltr')};
  color: ${props => props.theme.text}; /* Adapt text color */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  /* Hide Scrollbar */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const CloseButton = styled.button`
  position: relative;
  top: 4.5rem;
  right: ${props => (!props.isArabic ? 'auto' : '1.5rem')};
  left: ${props => (!props.isArabic ? '1.5rem' : 'auto')};
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const ProductName = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Tajawal', sans-serif;
  line-height: 1.3;
`;

const ProductBrand = styled.p`
    font-size: 0.9rem;
    color: ${props => props.theme.zinc500 || '#71717a'};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-bottom: 1.5rem;
`;

const MainImage = styled.img`
    width: 100%;
    aspect-ratio: 1/1; /* Square is better for details */
    object-fit: cover;
    border-radius: 16px;
    background-color: ${props => props.theme.zinc950 || '#09090b'};
    margin-bottom: 2rem;
    border: 1px solid rgba(255,255,255,0.05);
`;

const OptionsGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const OptionLabel = styled.p`
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: ${props => props.theme.zinc500 || '#a1a1aa'};
`;

const OptionButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
`;

const OptionButton = styled.button`
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    
    /* Default State (Dark Mode compatible) */
    background-color: transparent;
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.zinc800 || '#27272a'};

    &:hover {
        border-color: ${props => props.theme.zinc500 || '#71717a'};
    }

    /* Selected State */
    ${props => props.$isSelected && css`
        background-color: ${props.theme.primaryColor}; /* Orange/Green */
        border-color: ${props.theme.primaryColor};
        color: white;
        font-weight: 700;
        box-shadow: 0 0 15px ${props.theme.primaryColor}40; /* Subtle Glow */
    `}
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2.5rem;
    border-top: 1px solid ${props => props.theme.border || 'rgba(255,255,255,0.1)'};
    padding-top: 1.5rem;
`;

const Price = styled.p`
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
`;

const AddToCartButton = styled.button`
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  background-color: ${props => props.theme.primaryColor};
  border: none;
  border-radius: 99px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { 
      transform: scale(1.05);
      box-shadow: 0 0 20px ${props => props.theme.primaryColor}40;
  }
  
  &:active { transform: scale(0.95); }
`;


const ProductDetailsModal = ({ product, onClose, onAddToCart, shopIsOpen }) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    
    // State
    const [selectedColor, setSelectedColor] = useState(product?.availabilities[0]?.color || '');
    const [selectedSize, setSelectedSize] = useState('');
    const [imageBuffer, setImageBuffer] = useState(null);
    
    // Logic to find current variant
    const currentAvailability = useMemo(() => 
        product.availabilities.find(av => av.color === selectedColor),
        [product, selectedColor]
    );

    const currentSizeDetails = useMemo(() =>
        currentAvailability?.sizes.find(s => s.size === selectedSize),
        [currentAvailability, selectedSize]
    );

    // Auto-select first size when color changes
    useEffect(() => {
        if (currentAvailability && currentAvailability.sizes.length > 0) {
             // Only reset size if the current size doesn't exist in the new color
             const sizeExists = currentAvailability.sizes.some(s => s.size === selectedSize);
             if (!sizeExists) {
                 setSelectedSize(currentAvailability.sizes[0].size);
             }
        }
    }, [currentAvailability]);

    // Fetch Image
    useEffect(() => {
        let isMounted = true;
        if (currentAvailability?.imageId) {
            getImage(currentAvailability.imageId)
                .then(res => {
                    if(isMounted && res.data) setImageBuffer(res.data);
                })
                .catch(err => console.error("Img error", err));
        }
        return () => { isMounted = false; };
    }, [currentAvailability]);
    
    const imageUrl = useMemo(() => getImageUrl(imageBuffer), [imageBuffer]);
    
    if (!product) return null;

    const productName = !isArabic && product.nameFr ? product.nameFr : product.name;
    const brandName = product.brand || "";
    
    const handleAddToCart = () => {
        if (!currentSizeDetails) return; 

        const cartVariant = {
            product: product,
            variantId: `${product._id}_${selectedColor}_${selectedSize}`,
            color: selectedColor,
            size: selectedSize,
            sellingPrice: currentSizeDetails.sellingPrice,
            imageId: currentAvailability.imageId,
            quantity: 1 // Default to 1
        };
        onAddToCart(cartVariant);
        onClose();
    };
    
    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants = { hidden: { y: 40, opacity: 0, scale: 0.95 }, visible: { y: 0, opacity: 1, scale: 1 } };

    return (
        <AnimatePresence>
            <ModalBackdrop 
                variants={backdropVariants} 
                initial="hidden" 
                animate="visible" 
                exit="hidden" 
                onClick={onClose}
            >
                <ModalContent 
                    variants={modalVariants} 
                    onClick={(e) => e.stopPropagation()} 
                    isArabic={isArabic}
                >
                    <CloseButton onClick={onClose} isArabic={isArabic}>&times;</CloseButton>
                    
                    {imageUrl ? (
                        <MainImage src={imageUrl} alt={productName} />
                    ) : (
                        <div style={{ width: '100%', aspectRatio: '1/1', background: '#27272a', borderRadius: '16px', marginBottom: '2rem' }} />
                    )}
                    
                    <ProductName>{productName}</ProductName>
                    {brandName && <ProductBrand>{brandName}</ProductBrand>}

                    <OptionsGroup>
                        <OptionLabel>{t('color', 'Color')}</OptionLabel>
                        <OptionButtons>
                            {product.availabilities.map(av => (
                                <OptionButton 
                                    key={av.color} 
                                    $isSelected={selectedColor === av.color} 
                                    onClick={() => setSelectedColor(av.color)}
                                >
                                    {av.color}
                                </OptionButton>
                            ))}
                        </OptionButtons>
                    </OptionsGroup>

                    {currentAvailability && (
                        <OptionsGroup>
                            <OptionLabel>{t('size', 'Size')}</OptionLabel>
                            <OptionButtons>
                                {currentAvailability.sizes.map(s => (
                                    <OptionButton 
                                        key={s.size} 
                                        $isSelected={selectedSize === s.size} 
                                        onClick={() => setSelectedSize(s.size)}
                                    >
                                        {s.size}
                                    </OptionButton>
                                ))}
                            </OptionButtons>
                        </OptionsGroup>
                    )}

                    <Footer>
                        <Price>
                            {currentSizeDetails ? parseInt(currentSizeDetails.sellingPrice) : '-'} {t("dzd")}
                        </Price>
                        {shopIsOpen ? (
                            <AddToCartButton onClick={handleAddToCart}>
                                {t('add_to_cart')}
                            </AddToCartButton>
                        ) : (
                            <span style={{ color: '#ef4444', fontWeight: 600 }}>{t('shop_status_closed')}</span>
                        )}
                    </Footer>
                </ModalContent>
            </ModalBackdrop>
        </AnimatePresence>
    );
};

export default ProductDetailsModal;