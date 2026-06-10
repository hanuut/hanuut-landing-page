import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// --- Redux ---
import {
  fetchPaginatedProducts,
  selectPaginatedState,
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

// --- NEW PERFECTED WIDE-DETAILS COLUMN RATIO ---
const SplitGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media(min-width: 1024px) {
    display: grid;
    /* 1.1fr for Products Grid (Right/Left depending on RTL), 1.9fr for Premium Details Pane */
    grid-template-columns: 1.1fr 1.9fr; 
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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const normalizedShopId = useMemo(() => shop?._id || shop?.id, [shop]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);

  const {
    products: paginatedList,
    loading: paginatedLoading,
    meta: paginationMeta,
  } = useSelector(selectPaginatedState);
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

  // Self-healing categories loader
  useEffect(() => {
    if (paginatedList.length > 0) {
      const extractedCategoryIds = paginatedList
        .map(p => p.categoryId)
        .filter(id => id && typeof id === 'string');
      
      const uniqueIds = Array.from(new Set(extractedCategoryIds));
      if (uniqueIds.length > 0) {
         dispatch(fetchCategories(uniqueIds));
      }
    }
  }, [paginatedList, dispatch]);

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

  // --- RESPONSIVE AUTO-SCROLL ALIGNMENT LOGIC ---
  useEffect(() => {
    if (activeProduct) {
      if (window.innerWidth < 1024) {
        // Mobile/Tablet: Scroll window to the top so details pane is instantly visible
        window.scrollTo({ top: 300, behavior: 'smooth' });
      } else {
        // Desktop: Keep card aligned and centered in the grid
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
          <SplitGrid>
            <AnimatePresence>
              <MobilePane>
                <InlineProductDetails
                  product={activeProduct}
                  cartItems={shopCartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isOrderingEnabled={isOrderingEnabled}
                  onClose={handleClose}
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