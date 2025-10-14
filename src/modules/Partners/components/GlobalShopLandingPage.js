// src/modules/Partners/components/GlobalShopLandingPage.js

import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { usePalette } from 'color-thief-react';

// Import child components
import ShopHeader from './ShopHeader';
import ProductShowcase from '../../Product/components/landing/ProductShowcase';
import CategoryShowcase from '../../Product/components/landing/CategoryShowcase';

// Import Redux actions and selectors
import {
    fetchFeaturedProductsByShop,
    fetchNewArrivalsByShop,
    selectProducts,
} from '../../Product/state/reducers';

// Utility to convert image buffer to a displayable URL
const bufferToUrl = (imageObject) => {
    if (!imageObject || !imageObject.buffer?.data) return null;
    const imageData = imageObject.buffer.data;
    const base64String = btoa(new Uint8Array(imageData).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const format = imageObject.originalname.split('.').pop().toLowerCase();
    const mimeType = format === 'jpg' ? 'jpeg' : format;
    return `data:image/${mimeType};base64,${base64String}`;
};

const PageWrapper = styled.main`
    width: 90%;
    max-width: 1280px;
    padding: 1rem;
    direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

    @media (max-width: 768px) {
        padding: 0;
    }
`;

const GlobalShopLandingPage = ({ shop, image, onCardClick }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // Select product data from the Redux store
    const {
        featuredProducts,
        featuredLoading,
        featuredError,
        newArrivals,
        newArrivalsLoading,
        newArrivalsError,
    } = useSelector(selectProducts);

    // Fetch data when the component mounts
    useEffect(() => {
        if (shop?._id) {
            dispatch(fetchFeaturedProductsByShop(shop._id));
            dispatch(fetchNewArrivalsByShop(shop._id));
        }
    }, [dispatch, shop]);
    
    // Memoize image URL conversion and color palette extraction
    const imageUrl = useMemo(() => bufferToUrl(image), [image]);
    const { data: logoPalette } = usePalette(imageUrl, 2, 'hex', {
        crossOrigin: 'Anonymous',
        quality: 10,
    });
    
    const isSubscribed = shop.subscriptionPlanId !== null;
    const brandColors = {
        main: shop.styles?.mainColor || (logoPalette && logoPalette[0]),
        accent: shop.styles?.secondaryColor || (logoPalette && logoPalette[1]),
    };

    const shopIsOpen = shop.isOpen;

    return (
        <PageWrapper isArabic={i18n.language === 'ar'}>
            <ShopHeader
                shop={shop}
                imageData={imageUrl}
                isSubscribed={isSubscribed}
                brandColors={brandColors}
            />

            {/* Featured Products Section */}
            <ProductShowcase
                title={t('featured_products_title', 'Featured Products')}
                products={featuredProducts}
                loading={featuredLoading}
                error={featuredError}
                onCardClick={onCardClick}
                shopIsOpen={shopIsOpen}
            />

            {/* New Arrivals Section */}
            <ProductShowcase
                title={t('new_arrivals_title', 'New Arrivals')}
                products={newArrivals}
                loading={newArrivalsLoading}
                error={newArrivalsError}
                onCardClick={onCardClick}
                shopIsOpen={shopIsOpen}
            />

            {/* Categories Section */}
            {/* <CategoryShowcase shop={shop} /> */}
        </PageWrapper>
    );
};

export default GlobalShopLandingPage;