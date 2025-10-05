// src/modules/Product/components/landing/ProductCard.js

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getImage } from '../../../Images/services/imageServices';

// Utility to convert image buffer to a displayable URL
const bufferToUrl = (imageObject) => {
    if (!imageObject || !imageObject.buffer?.data) return null;
    const imageData = imageObject.buffer.data;
    const base64String = btoa(new Uint8Array(imageData).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const format = imageObject.originalname.split('.').pop().toLowerCase();
    const mimeType = format === 'jpg' ? 'jpeg' : format;
    return `data:image/${mimeType};base64,${base64String}`;
};

const CardWrapper = styled.div`
    background-color: ${props => props.theme.surface};
    border-radius: ${props => props.theme.defaultRadius};
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    cursor: pointer;
    break-inside: avoid;
    margin-bottom: 2rem;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
    }
`;

const ImageContainer = styled.div`
    width: 100%;
    padding-top: 100%; /* Creates a square aspect ratio */
    position: relative;
    background-color: #f5f5f7;
`;

const CardImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const ContentContainer = styled.div`
    padding: 1.25rem;
`;

const ProductName = styled.h3`
    font-weight: 600;
    font-size: ${props => props.theme.fontlg};
    color: ${props => props.theme.text};
    margin: 0 0 0.25rem 0;
    line-height: 1.4;
`;

const ProductPrice = styled.p`
    font-size: ${props => props.theme.fontmd};
    color: rgba(${props => props.theme.textRgba}, 0.7);
    margin: 0;
`;

const ProductCard = ({ product, onCardClick,shopIsOpen }) => {
    const { t } = useTranslation();
    const [imageUrl, setImageUrl] = useState(null);

    const imageId = useMemo(() => {
        if (product && product.availabilities && product.availabilities.length > 0) {
            return product.availabilities[0].imageId;
        }
        return null;
    }, [product]);

    useEffect(() => {
        if (imageId) {
            const fetchImageData = async () => {
                try {
                    const response = await getImage(imageId);
                    const url = bufferToUrl(response.data);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Failed to fetch product image:", error);
                }
            };
            fetchImageData();
        }
    }, [imageId]);

    const displayPrice = useMemo(() => {
        if (!product?.availabilities?.length) return 0;
        let minPrice = Infinity;
        product.availabilities.forEach(av => {
            av.sizes.forEach(size => {
                if (size.sellingPrice < minPrice) {
                    minPrice = size.sellingPrice;
                }
            });
        });
        return minPrice === Infinity ? 0 : minPrice;
    }, [product]);

    return (
        <CardWrapper onClick={() => {
            if(shopIsOpen) {
                onCardClick(product);
            }
        }}>
            <ImageContainer>
                {imageUrl && <CardImage src={imageUrl} alt={product.name} loading="lazy" />}
            </ImageContainer>
            <ContentContainer>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{t('from', "≥")} {displayPrice} {t('dzd')}</ProductPrice>
            </ContentContainer>
        </CardWrapper>
    );
};

export default ProductCard;