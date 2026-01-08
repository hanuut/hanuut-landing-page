import React, { useEffect, useMemo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { usePalette } from 'color-thief-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Imports ---
import ShopHeader from './ShopHeader';
import ProductShowcase from '../../Product/components/landing/ProductShowcase';
import ProductFilterBar from '../../Product/components/landing/ProductFilterBar';
import { getImageUrl } from '../../../utils/imageUtils';

// --- Redux ---
import {
    fetchFeaturedProductsByShop,
    fetchNewArrivalsByShop,
    selectProducts,
} from '../../Product/state/reducers';
import { fetchCategories, selectCategories } from '../../Categories/state/reducers';

// --- Theme ---
import { partnerTheme } from '../../../config/Themes';

const PageWrapper = styled.main`
    width: 100%;
    min-height: 100vh;
    background-color: #050505;
    color: white;
    padding-bottom: 6rem;
    padding-top: calc(${(props) => props.theme.navHeight} + 3rem); 
    
    position: absolute; 
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;

    @media (max-width: 768px) {
        padding-top: calc(${(props) => props.theme.navHeightMobile} + 2rem); 
    }
`;

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: 1rem;
    direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
    box-sizing: border-box;
`;

const GlobalShopLandingPage = ({ 
    shop, 
    image, 
    onCardClick, // <--- Only uses this to notify parent
    isOrderingEnabled 
}) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const isArabic = i18n.language === 'ar';

    // --- Filter State ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    // --- Redux Selectors ---
    const {
        featuredProducts,
        featuredLoading,
        featuredError,
        newArrivals,
        newArrivalsLoading,
        newArrivalsError,
    } = useSelector(selectProducts);

    const { categories } = useSelector(selectCategories);

    // --- Fetching ---
    useEffect(() => {
        if (shop?._id) {
            dispatch(fetchFeaturedProductsByShop(shop._id));
            dispatch(fetchNewArrivalsByShop(shop._id));
            
            if (shop.categories && shop.categories.length > 0) {
                dispatch(fetchCategories(shop.categories));
            }
        }
    }, [dispatch, shop]);

    // --- Branding ---
    const imageUrl = useMemo(() => getImageUrl(image), [image]);
    const { data: logoPalette } = usePalette(imageUrl, 2, 'hex', { crossOrigin: 'Anonymous' });
    const isSubscribed = shop.subscriptionPlanId !== null;
    const brandColors = {
        main: shop.styles?.mainColor || logoPalette?.[0] || "#F07A48",
        accent: shop.styles?.secondaryColor || logoPalette?.[1] || "#39A170",
    };

    // --- Filter Logic ---
    const allProducts = useMemo(() => {
        const productMap = new Map();
        featuredProducts.forEach(p => productMap.set(p._id, p));
        newArrivals.forEach(p => productMap.set(p._id, p));
        return Array.from(productMap.values());
    }, [featuredProducts, newArrivals]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [allProducts, searchQuery, selectedCategory]);

    const isFiltering = searchQuery.length > 0 || selectedCategory !== null;

    return (
        <ThemeProvider theme={partnerTheme}>
            <PageWrapper>
                <Container isArabic={isArabic}>
                    
                    <ShopHeader
                        shop={shop}
                        imageData={imageUrl}
                        isSubscribed={isSubscribed}
                        brandColors={brandColors}
                    />
                    
                    <div style={{ marginTop: '2rem' }}>
                        <ProductFilterBar 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {isFiltering ? (
                            <motion.div
                                key="filtered"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                style={{ marginTop: '-1.5rem' }}
                            >
                                <ProductShowcase
                                    title={searchQuery ? `${t('search_results_for', 'Results for')} "${searchQuery}"` : t('productsListTitle', 'Products')}
                                    products={filteredProducts}
                                    loading={newArrivalsLoading} 
                                    error={newArrivalsError}
                                    onCardClick={onCardClick} // Calls Parent
                                    isOrderingEnabled={isOrderingEnabled} 
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="default"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ marginTop: '-1.5rem' }}
                            >
                                {featuredProducts.length > 0 && (
                                    <ProductShowcase
                                        title={t('featured_products_title', 'Featured Collection')}
                                        products={featuredProducts}
                                        loading={featuredLoading}
                                        error={featuredError}
                                        onCardClick={onCardClick} // Calls Parent
                                        isOrderingEnabled={isOrderingEnabled} 
                                    />
                                )}

                                <ProductShowcase
                                    title={t('new_arrivals_title', 'New Arrivals')}
                                    products={newArrivals}
                                    loading={newArrivalsLoading}
                                    error={newArrivalsError}
                                    onCardClick={onCardClick} // Calls Parent
                                    isOrderingEnabled={isOrderingEnabled}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Container>
            </PageWrapper>
        </ThemeProvider>
    );
};

export default GlobalShopLandingPage;