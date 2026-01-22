import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { usePalette } from 'color-thief-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Imports ---
import ShopHeader from './ShopHeader';
import ProductShowcase from '../../Product/components/landing/ProductShowcase';
import ProductFilterBar from '../../Product/components/landing/ProductFilterBar';
import PoweredByHanuut from '../../../components/PoweredByHanuut';
import { getImageUrl } from '../../../utils/imageUtils';
import Loader from '../../../components/Loader';
import Cart from './Cart'; // Ensure Cart is imported
import ProductDetailsModal from '../../Product/components/landing/ProductDetailsModal'; // Ensure Modal is imported

// --- Redux ---
import {
    fetchPaginatedProducts,
    selectPaginatedState,
    fetchFeaturedProductsByShop, 
    selectProducts,
    resetPagination
} from '../../Product/state/reducers';
import { fetchCategories, selectCategories } from '../../Categories/state/reducers';
import { 
    selectCart, 
    addToCart, 
    updateCartQuantity, 
    closeCart 
} from '../../Cart/state/reducers'; // Import Cart Actions & Selector

// --- Services ---
import { createGlobalOrder } from '../services/orderServices'; // Import Order Service

// --- Theme ---
import { partnerTheme } from '../../../config/Themes';

const PageWrapper = styled.main`
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.body}; 
    color: ${(props) => props.theme.text};
    padding-bottom: 6rem;
    padding-top: 0;
    position: relative;
    z-index: 1;
`;

const Container = styled(motion.div)`
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    padding: calc(${(props) => props.theme.navHeight} + 1rem) 1rem 1rem 1rem;
    direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding-top: calc(${(props) => props.theme.navHeightMobile} + 1.5rem);
        padding-left: 1rem;
        padding-right: 1rem;
    }
`;

const LoadMoreTrigger = styled.div`
    height: 20px;
    width: 100%;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
`;

const SpinnerSmall = styled.div`
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255,255,255,0.1);
    border-top-color: #F07A48;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    @keyframes spin { to { transform: rotate(360deg); } }
`;

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const GlobalShopLandingPage = ({ 
    shop, 
    image, 
    onCardClick, 
    isOrderingEnabled,
    orderingStatusKey
}) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const isArabic = i18n.language === 'ar';

    // --- Filter State ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProductForModal, setSelectedProductForModal] = useState(null); // Local Modal State
    const [isSubmitting, setIsSubmitting] = useState(null); // Order Status

    // --- Selectors ---
    const { 
        products: paginatedList, 
        loading: paginatedLoading, 
        meta: paginationMeta 
    } = useSelector(selectPaginatedState);
    
    const { featuredProducts } = useSelector(selectProducts); 
    const { categories } = useSelector(selectCategories);
    const { cart } = useSelector(selectCart); // Global Cart

    // --- FILTER CART FOR CURRENT SHOP ---
    const shopCartItems = useMemo(() => {
        if (!shop?._id) return [];
        return cart.filter(item => item.shopId === shop._id);
    }, [cart, shop]);

    // --- Branding ---
    const imageUrl = useMemo(() => getImageUrl(image), [image]);
    const { data: logoPalette } = usePalette(imageUrl, 2, 'hex', { crossOrigin: 'Anonymous' });
    const isSubscribed = shop.subscriptionPlanId !== null;
    const brandColors = {
        main: shop.styles?.mainColor || logoPalette?.[0] || "#F07A48",
        accent: shop.styles?.secondaryColor || logoPalette?.[1] || "#39A170",
    };

    // --- 1. Initial Setup ---
    useEffect(() => {
        if (shop?._id) {
            dispatch(fetchFeaturedProductsByShop(shop._id));
            if (shop.categories?.length > 0) {
                dispatch(fetchCategories(shop.categories));
            }
            dispatch(fetchPaginatedProducts({
                shopId: shop._id,
                page: 1,
                limit: 12,
                categoryId: '',
                search: '',
                isNewFilter: true
            }));
        }
        return () => {
            dispatch(resetPagination());
        };
    }, [dispatch, shop]);

    // --- 2. Handle Filters ---
    useEffect(() => {
        if (!shop?._id) return;
        const timer = setTimeout(() => {
            dispatch(fetchPaginatedProducts({
                shopId: shop._id,
                page: 1,
                limit: 12,
                categoryId: selectedCategory || '',
                search: searchQuery,
                isNewFilter: true
            }));
        }, 500); 
        return () => clearTimeout(timer);
    }, [dispatch, shop, searchQuery, selectedCategory]);

    // --- 3. Infinite Scroll ---
    const observer = useRef();
    const lastElementRef = useCallback(node => {
        if (paginatedLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && paginationMeta.hasMore) {
                dispatch(fetchPaginatedProducts({
                    shopId: shop._id,
                    page: paginationMeta.page + 1,
                    limit: 12,
                    categoryId: selectedCategory || '',
                    search: searchQuery,
                    isNewFilter: false
                }));
            }
        });
        if (node) observer.current.observe(node);
    }, [paginatedLoading, paginationMeta.hasMore, shop, selectedCategory, searchQuery, dispatch]);

    // --- 4. Cart Handlers ---
    const handleModalOpen = (product) => setSelectedProductForModal(product);
    const handleModalClose = () => setSelectedProductForModal(null);

    const handleAddToCart = (variant) => {
        // Ensure shopId is attached
        const payload = { ...variant, shopId: shop._id };
        dispatch(addToCart(payload));
    };

    const handleUpdateQuantity = (variantId, newQuantity) => {
        dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));
    };

    const handlePlaceOrder = async (customerDetails) => {
        if (isSubmitting === "submitting") return;
        if (!customerDetails.customerName || !customerDetails.customerPhone || !customerDetails.address?.wilaya) {
            alert(t("errorFillAllFields")); 
            return;
        }

        setIsSubmitting("submitting");
        const { address, gpsLocation } = customerDetails;
        const deliveryInfoString = address ? `${address.addressLine || ''}, ${address.commune}, ${address.wilaya}` : "";

        // Use filtered shopItems
        const productsPayload = shopCartItems.map((item) => ({
            productId: item.productId || item.product._id,
            title: item.title || item.product.name,
            quantity: Number(item.quantity),
            sellingPrice: Number(item.sellingPrice),
            categoryId: item.product?.categoryId, 
            supplementary: `${item.size || 'Default'},${item.color || 'Default'}`, 
        }));

        const orderPayload = {
            shopId: shop._id,
            customerName: customerDetails.customerName,
            customerPhone: customerDetails.customerPhone,
            deliveryInfo: deliveryInfoString,
            note: customerDetails.note || "",
            deliveryPricing: 0, 
            city: address?.commune,
            state: address?.wilaya,
            addressLine: address?.addressLine || "",
            ...(gpsLocation && { gpsLocation: { lat: Number(gpsLocation.lat), lng: Number(gpsLocation.lng) } }),
            products: productsPayload,
        };

        try {
            await createGlobalOrder(orderPayload);
            setIsSubmitting("success");
            setTimeout(() => {
                dispatch(closeCart());
                // Clear filtered items from global cart
                shopCartItems.forEach(item => dispatch(updateCartQuantity({ variantId: item.variantId, quantity: 0 })));
                setIsSubmitting(null);
            }, 2000);
        } catch (error) {
            console.error("Order Failed:", error);
            setIsSubmitting("error");
            setTimeout(() => setIsSubmitting(null), 3000);
        }
    };

    const isHomeView = !searchQuery && !selectedCategory && paginationMeta.page === 1;

    return (
        <ThemeProvider theme={partnerTheme}>
            <PageWrapper>
                <Container isArabic={isArabic} initial="hidden" animate="visible">
                    
                    <motion.div variants={fadeInUp}>
                        <ShopHeader
                            shop={shop}
                            imageData={imageUrl}
                            isSubscribed={isSubscribed}
                            brandColors={brandColors}
                        />
                    </motion.div>
                    
                    <motion.div variants={fadeInUp} style={{ marginBottom: '1rem' }}>
                        <ProductFilterBar 
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key="content"
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                        >
                            {isHomeView && featuredProducts.length > 0 && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <ProductShowcase
                                        title={t('featured_products_title', 'Featured')}
                                        products={featuredProducts}
                                        onCardClick={handleModalOpen} // Open Modal
                                        isOrderingEnabled={isOrderingEnabled} 
                                    />
                                </div>
                            )}

                            <ProductShowcase
                                title={
                                    searchQuery 
                                    ? `${t('search_results_for', 'Results for')} "${searchQuery}"` 
                                    : selectedCategory 
                                        ? t('productsListTitle', 'Products') 
                                        : t('all_products', 'All Products')
                                }
                                products={paginatedList}
                                loading={paginatedLoading && paginatedList.length === 0} 
                                onCardClick={handleModalOpen} // Open Modal
                                isOrderingEnabled={isOrderingEnabled}
                            />
                            
                            <LoadMoreTrigger ref={lastElementRef}>
                                {paginatedLoading && paginatedList.length > 0 && <SpinnerSmall />}
                            </LoadMoreTrigger>
                            
                            {!paginatedLoading && paginatedList.length === 0 && (
                                <p style={{textAlign: 'center', color: '#666', marginTop: '2rem'}}>
                                    {t("noProductsAvailable")}
                                </p>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </Container>

                {/* MODAL for Product Details */}
                {selectedProductForModal && (
                    <ProductDetailsModal
                        product={selectedProductForModal}
                        onClose={handleModalClose}
                        cartItems={shopCartItems} // Pass filtered cart
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={handleUpdateQuantity}
                        isOrderingEnabled={isOrderingEnabled}
                        orderingStatusKey={orderingStatusKey}
                    />
                )}

                {/* Cart Modal (Hidden until toggled by Redux) */}
                <Cart 
                    items={shopCartItems} 
                    onUpdateQuantity={handleUpdateQuantity}
                    onSubmitOrder={handlePlaceOrder}
                    isSubmitting={isSubmitting}
                    shopDomain="global"
                />

                <PoweredByHanuut />
                
            </PageWrapper>
        </ThemeProvider>
    );
};

export default GlobalShopLandingPage;