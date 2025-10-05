// src/modules/Product/components/landing/ProductDetailsModal.js

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getImage } from '../../../Images/services/imageServices';

// Reusable bufferToUrl function
const bufferToUrl = (imageObject) => {
    if (!imageObject || !imageObject.buffer?.data) return null;
    const imageData = imageObject.buffer.data;
    const base64String = btoa(new Uint8Array(imageData).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const format = imageObject.originalname.split('.').pop().toLowerCase();
    const mimeType = format === 'jpg' ? 'jpeg' : format;
    return `data:image/${mimeType};base64,${base64String}`;
};

// --- Styled Components ---

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  width: 90%;
  max-width: 600px;
  background-color: #FFFFFF;
  border-radius: ${props => props.theme.defaultRadius};
  padding: 2.5rem;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
  &:hover {
    color: #000;
  }
`;

const ProductName = styled.h2`
  font-size: ${props => props.theme.fontxxl};
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MainImage = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: ${props => props.theme.smallRadius};
    background-color: #f5f5f7;
    margin-bottom: 1.5rem;
`;

const OptionsGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const OptionLabel = styled.p`
    font-size: ${props => props.theme.fontmd};
    font-weight: 500;
    margin-bottom: 0.75rem;
`;

const OptionButtons = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
`;

const OptionButton = styled.button`
    padding: 0.5rem 1rem;
    font-size: ${props => props.theme.fontsm};
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: ${props => props.$isSelected ? props.theme.primaryColor : '#f5f5f7'};
    color: ${props => props.$isSelected ? '#FFFFFF' : props.theme.text};
    border: 1px solid ${props => props.$isSelected ? props.theme.primaryColor : '#f5f5f7'};
`;

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    border-top: 1px solid #EAEAEA;
    padding-top: 1.5rem;
`;

const Price = styled.p`
    font-size: ${props => props.theme.fontxl};
    font-weight: 600;
`;

const AddToCartButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: ${props => props.theme.fontlg};
  font-weight: 600;
  color: #FFFFFF;
  background-color: ${props => props.theme.darkGreen};
  border: none;
  border-radius: ${props => props.theme.smallRadius};
  cursor: pointer;
  transition: opacity 0.3s ease;
  &:hover { opacity: 0.9; }
`;


const ProductDetailsModal = ({ product, onClose, onAddToCart,shopIsOpen }) => {
    const { t } = useTranslation();

    

    const [selectedColor, setSelectedColor] = useState(product?.availabilities[0]?.color || '');
    const [selectedSize, setSelectedSize] = useState(product?.availabilities[0]?.sizes[0]?.size || '');
    const [imageUrl, setImageUrl] = useState(null);
    // Find the current availability based on selected color
    const currentAvailability = useMemo(() => 
        product.availabilities.find(av => av.color === selectedColor),
        [product, selectedColor]
    );

    // Find the current size details (including price)
    const currentSizeDetails = useMemo(() =>
        currentAvailability?.sizes.find(s => s.size === selectedSize),
        [currentAvailability, selectedSize]
    );

    // Update image and reset size when color changes
    useEffect(() => {
        if (currentAvailability) {
            const fetchImageData = async () => {
                try {
                    const response = await getImage(currentAvailability.imageId);
                    setImageUrl(bufferToUrl(response.data));
                } catch (error) {
                    console.error("Failed to fetch product image:", error);
                }
            };
            fetchImageData();
            // Reset to the first available size for the new color
            setSelectedSize(currentAvailability.sizes[0]?.size || '');
        }
    }, [currentAvailability]);
    
    if (!product) return null;
    

    const handleAddToCart = () => {
        if (!currentSizeDetails) return; 

        // Create a specific variant object to add to the cart
        const cartVariant = {
            product: product,
            variantId: `${product._id}_${selectedColor}_${selectedSize}`,
            color: selectedColor,
            size: selectedSize,
            sellingPrice: currentSizeDetails.sellingPrice,
            imageId: currentAvailability.imageId,
        };
        onAddToCart(cartVariant);
        onClose();
    };
    
    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <AnimatePresence>
            <ModalBackdrop variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
                <ModalContent variants={modalVariants} onClick={(e) => e.stopPropagation()}>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                    <ProductName>{product.name}</ProductName>

                    {imageUrl && <MainImage src={imageUrl} alt={product.name} />}
                    
                    <OptionsGroup>
                        <OptionLabel>{t('color', 'Color')}</OptionLabel>
                        <OptionButtons>
                            {product.availabilities.map(av => (
                                <OptionButton key={av.color} $isSelected={selectedColor === av.color} onClick={() => setSelectedColor(av.color)}>
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
                                    <OptionButton key={s.size} $isSelected={selectedSize === s.size} onClick={() => setSelectedSize(s.size)}>
                                        {s.size}
                                    </OptionButton>
                                ))}
                            </OptionButtons>
                        </OptionsGroup>
                    )}

                    <Footer>
                        <Price>{currentSizeDetails?.sellingPrice || '...'} {t('dzd')}</Price>
                        {shopIsOpen &&  <AddToCartButton onClick={handleAddToCart}>{t('add_to_cart')}</AddToCartButton>}    
                    </Footer>
                </ModalContent>
            </ModalBackdrop>
        </AnimatePresence>
    );
};

export default ProductDetailsModal;