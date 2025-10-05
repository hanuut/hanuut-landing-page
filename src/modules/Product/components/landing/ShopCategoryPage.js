// src/modules/Product/components/landing/ShopCategoryPage.js

import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePalette } from 'color-thief-react';

// Import Reusable Components
import ShopHeader from '../../../Partners/components/ShopHeader';
import ProductShowcase from './ProductShowcase';
import Loader from '../../../../components/Loader';
import NotFoundPage from '../../../NotFoundPage';

// Import Redux Actions & Selectors
import { fetchShopWithUsername, selectShop, selectShops } from '../../../Partners/state/reducers';
import { fetchImage, selectSelectedShopImage } from '../../../Images/state/reducers';
import { fetchCategories, selectCategories } from '../../../Categories/state/reducers';
import { fetchProductByShopAndCategory, selectProducts } from '../../state/reducers';

// Utility to convert image buffer to a displayable URL
const bufferToUrl = (imageObject) => {
    if (!imageObject || !imageObject.buffer?.data) return null;
    const imageData = imageObject.buffer.data;
    const base64String = btoa(new Uint8Array(imageData).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    const format = imageObject.originalname.split('.').pop().toLowerCase();
    const mimeType = format === 'jpg' ? 'jpeg' : format;
    return `data:image/${mimeType};base64,${base64String}`;
};

// Styled Components
const PageWrapper = styled.main`
    width: 100%;
    max-width: 1280px;
    padding: 2rem;
    margin: 0 auto; // Center the page content
    direction: ${(props) => (props.isArabic ? 'rtl' : 'ltr')};

    @media (max-width: 768px) {
        padding: 1.5rem 1rem;
    }
`;

const BackLink = styled(Link)`
    display: inline-block;
    font-size: ${props => props.theme.fontlg};
    color: ${props => props.theme.primaryColor};
    text-decoration: none;
    font-weight: 500;
    margin-bottom: 2rem;

    &:hover {
        text-decoration: underline;
    }
`;

const ShopCategoryPage = () => {
    const { username, categoryId } = useParams();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();

    // Selectors for various parts of the state
    const { loading: shopLoading, error: shopError } = useSelector(selectShops);
    const selectedShop = useSelector(selectShop);
    const selectedShopImage = useSelector(selectSelectedShopImage);
    const { categories, loading: categoriesLoading } = useSelector(selectCategories);
    const { products, loading: productsLoading, error: productsError } = useSelector(selectProducts);

    // Fetch shop details when the component mounts or username changes
    useEffect(() => {
        if (username) {
            dispatch(fetchShopWithUsername(username));
        }
    }, [dispatch, username]);

    // Fetch shop image once shop data is available
    useEffect(() => {
        if (selectedShop?.imageId) {
            dispatch(fetchImage(selectedShop.imageId));
        }
    }, [dispatch, selectedShop]);

    // Fetch category and product data once the shop ID is available
    useEffect(() => {
        if (selectedShop?._id && categoryId) {
            dispatch(fetchCategories([categoryId])); // Fetch details for this specific category
            dispatch(fetchProductByShopAndCategory({ shopId: selectedShop._id, categoryId }));
        }
    }, [dispatch, selectedShop, categoryId]);

    // Memoized values for performance
    const imageUrl = useMemo(() => bufferToUrl(selectedShopImage), [selectedShopImage]);
    const { data: logoPalette } = usePalette(imageUrl, 2, 'hex', { crossOrigin: 'Anonymous', quality: 10 });

    const brandColors = {
        main: selectedShop?.styles?.mainColor || (logoPalette && logoPalette[0]),
        accent: selectedShop?.styles?.secondaryColor || (logoPalette && logoPalette[1]),
    };

    // Find the current category from the loaded categories
    const currentCategory = useMemo(() => {
        return categories.find(cat => cat.id === categoryId);
    }, [categories, categoryId]);
    
    // Determine the category name based on the current language
    const categoryName = useMemo(() => {
        if (!currentCategory) return '...';
        return i18n.language === 'fr' && currentCategory.nameFr 
            ? currentCategory.nameFr 
            : i18n.language === 'en' && currentCategory.nameEn 
                ? currentCategory.nameEn 
                : currentCategory.name;
    }, [currentCategory, i18n.language]);

    // Filter products from the global state to match only the current category and shop
    const categoryProducts = useMemo(() => {
        return products.filter(p => p.categoryId === categoryId && p.shopId === selectedShop?._id).map(p => p.product);
    }, [products, categoryId, selectedShop]);


    // --- Render Logic ---

    if (shopLoading || (selectedShop && !imageUrl) || categoriesLoading) {
        return <Loader />;
    }

    if (shopError || !selectedShop) {
        return <NotFoundPage />;
    }

    return (
        <PageWrapper isArabic={i18n.language === 'ar'}>
            {/* Back link to navigate to the main shop page */}
            <BackLink to={`/${username}`}>← {t('backToShop', `Back to ${selectedShop.name}`)}</BackLink>
            
            <ShopHeader
                shop={selectedShop}
                imageData={imageUrl}
                isSubscribed={selectedShop.subscriptionPlanId !== null}
                brandColors={brandColors}
            />

            <ProductShowcase
                title={categoryName}
                products={categoryProducts}
                loading={productsLoading}
                error={productsError}
                emptyMessage={t('noProductsAvailable', 'No products are available in this category')}
            />
        </PageWrapper>
    );
};

export default ShopCategoryPage;