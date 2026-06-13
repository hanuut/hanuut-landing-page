import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// --- Redux ---
import {
  fetchPaginatedProducts,
  fetchFeaturedProductsByShop,
  selectProducts,
  resetPagination,
  fetchProductById,
} from "../../Product/state/reducers";
import {
  fetchCategories,
  selectCategories,
} from "../../Categories/state/reducers";
import {
  selectCart,
  addToCart,
  updateCartQuantity,
} from "../../Cart/state/reducers";

import ProductShowcase from "../../Product/components/landing/ProductShowcase";
import ProductFilterBar from "../../Product/components/landing/ProductFilterBar";
import InlineProductDetails from "../../Product/components/landing/InlineProductDetails";

const ContentWrapper = styled.div`
  width: 100%;
  background: ${props => props.theme.body};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 90%;
  padding: 2rem 0;
`;

// --- MULTI-SCREEN DYNAMIC GRID ---
const SplitGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media(min-width: 1024px) {
    display: grid;
    /* 1.1fr for Products Grid (Right/Left depending on RTL), 1.9fr for Premium Details Pane */
    grid-template-columns: ${props => props.$isArabic ? "1fr 1.5fr" : "1.5fr 1fr"}; 
    align-items: start;
  }
`;

const DesktopPane = styled.div`
  display: none;
  
  @media(min-width: 1024px) {
    display: block;
    position: sticky;
    top: 100px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    &::-webkit-scrollbar { display: none; }
  }
`;

const MobilePane = styled.div`
  display: block;
  
  @media(min-width: 1024px) {
    display: none;
  }
`;

const ProductsListPane = styled.div`
  width: 100%;
`;

const LoadMoreTrigger = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${props => props.theme.primaryColor};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const GlobalShopLandingPage = ({ shop, isOrderingEnabled }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";

  const normalizedShopId = useMemo(() => shop?._id || shop?.id, [shop]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);

  // --- DYNAMIC PRODUCT IMAGE OVERRIDES MAP (Carousel-to-Grid Sync) ---
  const [imageOverrides, setImageOverrides] = useState({});

  // --- SELECT INDIVIDUAL PRIMITIVES TO ELIMINATE REDUX WARNING & RE-RENDERS ---
  const paginatedList = useSelector((state) => state.products.paginatedProducts);
  const paginatedLoading = useSelector((state) => state.products.paginationLoading);
  const paginationMeta = useSelector((state) => state.products.paginationMeta);
  
  const { featuredProducts } = useSelector(selectProducts);
  const { categories } = useSelector(selectCategories);
  const { cart } = useSelector(selectCart);

  const shopCartItems = useMemo(() => {
    if (!normalizedShopId) return [];
    return cart.filter((item) => item.shopId === normalizedShopId);
  }, [cart, normalizedShopId]);

  // Initialize Categories & Featured Products
  useEffect(() => {
    if (normalizedShopId) {
      dispatch(fetchFeaturedProductsByShop(normalizedShopId));
      if (shop.categories?.length > 0) {
        dispatch(fetchCategories(shop.categories));
      }
      dispatch(
        fetchPaginatedProducts({
          shopId: normalizedShopId,
          page: 1,
          limit: 12,
          categoryId: "",
          search: "",
          isNewFilter: true,
        }),
      );
    }
    return () => dispatch(resetPagination());
  }, [dispatch, normalizedShopId, shop.categories]);

  // --- DE-DUPLICATED SELF-HEALING CATEGORIES LOADER ---
  useEffect(() => {
    if (paginatedList.length > 0) {
      const extractedCategoryIds = paginatedList
        .map(p => {
          if (!p.categoryId) return null;
          if (typeof p.categoryId === 'object') {
            return p.categoryId._id || p.categoryId.id;
          }
          return p.categoryId;
        })
        .filter(id => id && typeof id === 'string');
      
      const uniqueIds = Array.from(new Set(extractedCategoryIds));
      
      const missingIds = uniqueIds.filter(id => 
        !categories.some(cat => cat.id === id)
      );

      if (missingIds.length > 0) {
         dispatch(fetchCategories(missingIds));
      }
    }
  }, [paginatedList, categories, dispatch]);

  // Watch Filters
  useEffect(() => {
    if (!normalizedShopId) return;
    const timer = setTimeout(() => {
      dispatch(
        fetchPaginatedProducts({
          shopId: normalizedShopId,
          page: 1,
          limit: 12,
          categoryId: selectedCategory || "",
          search: searchQuery,
          isNewFilter: true,
        }),
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, normalizedShopId, searchQuery, selectedCategory]);

  // Direct URL Deep Link handler
  const productIdFromUrl = searchParams.get("product");
  useEffect(() => {
    if (productIdFromUrl) {
      if (activeProduct?._id === productIdFromUrl) return;
      dispatch(fetchProductById(productIdFromUrl))
        .unwrap()
        .then((product) => {
          setActiveProduct(product);
        })
        .catch(() => setSearchParams({}));
    }
  }, [productIdFromUrl, dispatch, setSearchParams, activeProduct]);

  // Auto-scroll alignment logic
  useEffect(() => {
    if (activeProduct) {
      if (window.innerWidth < 1024) {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      } else {
        const element = document.getElementById(`product-card-${activeProduct._id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [activeProduct]);

  // Infinite Scroll Observer
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (paginatedLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && paginationMeta.hasMore) {
          dispatch(
            fetchPaginatedProducts({
              shopId: normalizedShopId,
              page: paginationMeta.page + 1,
              limit: 12,
              categoryId: selectedCategory || "",
              search: searchQuery,
              isNewFilter: false,
            }),
          );
        }
      });
      if (node) observer.current.observe(node);
    },
    [paginatedLoading, paginationMeta.hasMore, normalizedShopId, selectedCategory, searchQuery, dispatch],
  );

  const handleCardClick = (product, quickAdd = false) => {
    if (activeProduct?._id === product._id && !quickAdd) {
      setActiveProduct(null);
      setSearchParams({});
      return;
    }

    setActiveProduct(product);
    setSearchParams({ product: product._id });

    if (quickAdd && isOrderingEnabled) {
      const defaultAvail = product.availabilities?.[0];
      const defaultSize = defaultAvail?.sizes?.[0];
      if (defaultSize) {
        dispatch(addToCart({
          product,
          productId: product._id, 
          title: product.name, 
          variantId: `${product._id}_${defaultAvail.color}_${defaultSize.size}`,
          color: defaultAvail.color,
          size: defaultSize.size,
          sellingPrice: defaultSize.sellingPrice,
          imageId: defaultAvail.imageId,
          quantity: 1,
          shopId: normalizedShopId,
        }));
      }
    }
  };

  const handleClose = () => {
    setActiveProduct(null);
    setSearchParams({});
  };

  const handleAddToCart = (variant) => {
    dispatch(addToCart({ ...variant, shopId: normalizedShopId }));
  };

  const handleUpdateQuantity = (variantId, newQuantity) => {
    dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));
  };

  // --- THE CRITICAL FIX: MEMOIZE ACTION CALLBACK TO STOP INFINITE LOOP ---
  const handleImageChange = useCallback((productId, imageId) => {
    setImageOverrides(prev => {
      if (prev[productId] === imageId) return prev; // Stop redundant rendering
      return { ...prev, [productId]: imageId };
    });
  }, []);

  const isHomeView = !searchQuery && !selectedCategory && paginationMeta.page === 1;

  const renderCatalogContent = () => (
    <>
      {isHomeView && featuredProducts.length > 0 && (
        <div style={{ marginBottom: "3rem" }}>
          <ProductShowcase
            title={t("featured_products_title")}
            products={featuredProducts}
            onCardClick={handleCardClick}
            onUpdateQuantity={handleUpdateQuantity}
            isOrderingEnabled={isOrderingEnabled}
            cartItems={shopCartItems}
            activeProductId={activeProduct?._id}
            hasActive={!!activeProduct}
            imageOverrides={imageOverrides}
          />
        </div>
      )}

      <ProductShowcase
        title={
          searchQuery
            ? `${t("search_results_for")} "${searchQuery}"`
            : selectedCategory
              ? t("productsListTitle")
              : t("all_products")
        }
        products={paginatedList}
        loading={paginatedLoading && paginatedList.length === 0}
        onCardClick={handleCardClick}
        onUpdateQuantity={handleUpdateQuantity}
        isOrderingEnabled={isOrderingEnabled}
        cartItems={shopCartItems}
        activeProductId={activeProduct?._id}
        hasActive={!!activeProduct}
        imageOverrides={imageOverrides}
      />
    </>
  );

  return (
    <ContentWrapper>
      <Container>
        {/* --- Category Filter & Search Bar --- */}
        <ProductFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {activeProduct ? (
          <SplitGrid $isArabic={isArabic}>
            <AnimatePresence>
              <MobilePane>
                <InlineProductDetails
                  product={activeProduct}
                  cartItems={shopCartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isOrderingEnabled={isOrderingEnabled}
                  onClose={handleClose}
                  onImageChange={handleImageChange}
                />
              </MobilePane>
            </AnimatePresence>

            <ProductsListPane>
              {renderCatalogContent()}
              <LoadMoreTrigger ref={lastElementRef}>
                {paginatedLoading && paginatedList.length > 0 && <Spinner />}
              </LoadMoreTrigger>
            </ProductsListPane>

            <AnimatePresence>
              <DesktopPane>
                <InlineProductDetails
                  product={activeProduct}
                  cartItems={shopCartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isOrderingEnabled={isOrderingEnabled}
                  onClose={handleClose}
                  onImageChange={handleImageChange}
                />
              </DesktopPane>
            </AnimatePresence>
          </SplitGrid>
        ) : (
          <ProductsListPane>
            {renderCatalogContent()}
            <LoadMoreTrigger ref={lastElementRef}>
              {paginatedLoading && paginatedList.length > 0 && <Spinner />}
            </LoadMoreTrigger>
          </ProductsListPane>
        )}
      </Container>
    </ContentWrapper>
  );
};

export default GlobalShopLandingPage;