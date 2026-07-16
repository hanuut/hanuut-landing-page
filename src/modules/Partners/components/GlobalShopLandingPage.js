import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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
  closeCart, 
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

const StudioHero = styled(motion.header)`
  text-align: center;
  margin-bottom: 3.5rem;
  padding: 3rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  direction: ${props => props.$isArabic ? 'rtl' : 'ltr'};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%; left: 50%;
    transform: translateX(-50%);
    width: 60%; height: 100%;
    background: radial-gradient(circle, rgba(57, 161, 112, 0.08) 0%, transparent 70%);
    filter: blur(50px);
    pointer-events: none;
  }
`;

const HeroTag = styled.span`
  font-family: monospace;
  font-size: 0.8rem;
  color: ${props => props.theme.primaryColor};
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 900;
  color: white;
  margin: 1rem 0;
  font-family: 'Tajawal', sans-serif;
  letter-spacing: -1px;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #a1a1aa;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-family: 'Cairo', sans-serif;
  white-space: pre-line;
`;

const SplitGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media(min-width: 1024px) {
    display: grid;
    grid-template-columns: ${props => props.$isFocused 
      ? "1fr" 
      : (props.$isArabic ? "1fr 1.5fr" : "1.5fr 1fr")}; 
    align-items: start;
    transition: grid-template-columns 0.4s ease-in-out;
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
    width: 100%;
    &::-webkit-scrollbar { display: none; }
  }
`;

const MobilePane = styled.div`
  display: none;
  
  @media(max-width: 1024px) {
    display: block;
  }
`;

const ProductsListPane = styled.div`
  width: 100%;
  display: ${props => props.$hidden ? 'none' : 'block'}; 
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

const GlobalShopLandingPage = ({ shop, isOrderingEnabled, editingCartItem, setEditingCartItem }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";

  const normalizedShopId = useMemo(() => shop?._id || shop?.id, [shop]);

  // Detect POD mode from shop configurations
  const isPodShop = shop?.shopSettings?.printOnDemand === true || shop?.printOnDemand === true;

  const [activeWizardStep, setActiveWizardStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [imageOverrides, setImageOverrides] = useState({});

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
          printOnDemand: isPodShop 
        }),
      );
    }
    return () => dispatch(resetPagination());
  }, [dispatch, normalizedShopId, shop.categories, isPodShop]);

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
      const missingIds = uniqueIds.filter(id => !categories.some(cat => cat.id === id));

      if (missingIds.length > 0) {
         dispatch(fetchCategories(missingIds));
      }
    }
  }, [paginatedList, categories, dispatch]);

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
          printOnDemand: isPodShop 
        }),
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, normalizedShopId, searchQuery, selectedCategory, isPodShop]);

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
              printOnDemand: isPodShop 
            }),
          );
        }
      });
      if (node) observer.current.observe(node);
    },
    [paginatedLoading, paginationMeta.hasMore, normalizedShopId, selectedCategory, searchQuery, dispatch, isPodShop],
  );

  const observer = useRef();

  const handleCardClick = (product, quickAdd = false) => {
    if (activeProduct?._id === product._id && !quickAdd) {
      setActiveProduct(null);
      setSearchParams({});
      return;
    }

    setActiveProduct(product);
    setSearchParams({ product: product._id });
    setActiveWizardStep(1); 

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
    setActiveWizardStep(1);
    setEditingCartItem(null); 
  };

  const handleAddToCart = (variant) => {
    dispatch(addToCart({ ...variant, shopId: normalizedShopId }));
  };

  const handleUpdateQuantity = (variantId, newQuantity) => {
    dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));
  };

  const handleImageChange = useCallback((productId, imageId) => {
    setImageOverrides(prev => {
      if (prev[productId] === imageId) return prev; 
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
            layoutType={isPodShop ? 'list' : 'grid'} // --- RESTORED COEXISTING LAYOUT RULES ---
            isPodShop={isPodShop} 
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
        layoutType={isPodShop ? 'list' : 'grid'} // --- RESTORED COEXISTING LAYOUT RULES ---
        isPodShop={isPodShop} 
      />
    </>
  );

  const isDesignerFocused = isPodShop && activeProduct && activeWizardStep >= 2;

  return (
    <ContentWrapper>
      <Container>
        {!isDesignerFocused && (
          <ProductFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isPodShop={isPodShop} 
          />
        )}

        {isPodShop && !isDesignerFocused && (
          <StudioHero
            $isArabic={isArabic}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroTag>{t("pod_studio.hero_tag")}</HeroTag>
            <HeroTitle>{t("pod_studio.hero_title")}</HeroTitle>
            <HeroSubtitle>{t("pod_studio.hero_subtitle")}</HeroSubtitle>
          </StudioHero>
        )}

        {activeProduct ? (
          <SplitGrid $isArabic={isArabic} $isFocused={isDesignerFocused}>
            <AnimatePresence>
              <MobilePane>
                <InlineProductDetails
                  product={activeProduct}
                  isPodShop={isPodShop} 
                  cartItems={shopCartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isOrderingEnabled={isOrderingEnabled}
                  onClose={handleClose}
                  onImageChange={handleImageChange}
                  onWizardStepChange={setActiveWizardStep} 
                  editingCartItem={editingCartItem} 
                  setEditingCartItem={setEditingCartItem} 
                />
              </MobilePane>
            </AnimatePresence>

            <ProductsListPane $hidden={isDesignerFocused}>
              {renderCatalogContent()}
              <LoadMoreTrigger ref={lastElementRef}>
                {paginatedLoading && paginatedList.length > 0 && <Spinner />}
              </LoadMoreTrigger>
            </ProductsListPane>

            <AnimatePresence>
              <DesktopPane>
                <InlineProductDetails
                  product={activeProduct}
                  isPodShop={isPodShop} 
                  cartItems={shopCartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isOrderingEnabled={isOrderingEnabled}
                  onClose={handleClose}
                  onImageChange={handleImageChange}
                  onWizardStepChange={setActiveWizardStep} 
                  editingCartItem={editingCartItem} 
                  setEditingCartItem={setEditingCartItem} 
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

export default GlobalShopLandingPage;import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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
  closeCart, 
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

const StudioHero = styled(motion.header)`
  text-align: center;
  margin-bottom: 3.5rem;
  padding: 3rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  direction: ${props => props.$isArabic ? 'rtl' : 'ltr'};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%; left: 50%;
    transform: translateX(-50%);
    width: 60%; height: 100%;
    background: radial-gradient(circle, rgba(57, 161, 112, 0.08) 0%, transparent 70%);
    filter: blur(50px);
    pointer-events: none;
  }
`;

const HeroTag = styled.span`
  font-family: monospace;
  font-size: 0.8rem;
  color: ${props => props.theme.primaryColor};
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 900;
  color: white;
  margin: 1rem 0;
  font-family: 'Tajawal', sans-serif;
  letter-spacing: -1px;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #a1a1aa;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-family: 'Cairo', sans-serif;
  white-space: pre-line;
`;

const SplitGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media(min-width: 1024px) {
    display: grid;
    grid-template-columns: ${props => props.$isFocused 
      ? "1fr" 
      : (props.$isArabic ? "1fr 1.5fr" : "1.5fr 1fr")}; 
    align-items: start;
    transition: grid-template-columns 0.4s ease-in-out;
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
    width: 100%;
    &::-webkit-scrollbar { display: none; }
  }
`;

const MobilePane = styled.div`
  display: none;
  
  @media(max-width: 1024px) {
    display: block;
  }
`;

const ProductsListPane = styled.div`
  width: 100%;
  display: ${props => props.$hidden ? 'none' : 'block'}; 
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

const GlobalShopLandingPage = ({ shop, isOrderingEnabled, editingCartItem, setEditingCartItem }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";

  const normalizedShopId = useMemo(() => shop?._id || shop?.id, [shop]);

  // Detect POD mode from shop configurations
  const isPodShop = shop?.shopSettings?.printOnDemand === true || shop?.printOnDemand === true;

  const [activeWizardStep, setActiveWizardStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [imageOverrides, setImageOverrides] = useState({});

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
          printOnDemand: isPodShop 
        }),
      );
    }
    return () => dispatch(resetPagination());
  }, [dispatch, normalizedShopId, shop.categories, isPodShop]);

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
      const missingIds = uniqueIds.filter(id => !categories.some(cat => cat.id === id));

      if (missingIds.length > 0) {
         dispatch(fetchCategories(missingIds));
      }
    }
  }, [paginatedList, categories, dispatch]);

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
          printOnDemand: isPodShop 
        }),
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, normalizedShopId, searchQuery, selectedCategory, isPodShop]);

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
              printOnDemand: isPodShop 
            }),
          );
        }
      });
      if (node) observer.current.observe(node);
    },
    [paginatedLoading, paginationMeta.hasMore, normalizedShopId, selectedCategory, searchQuery, dispatch, isPodShop],
  );

  const observer = useRef();

  const handleCardClick = (product, quickAdd = false) => {
    if (activeProduct?._id === product._id && !quickAdd) {
      setActiveProduct(null);
      setSearchParams({});
      return;
    }

    setActiveProduct(product);
    setSearchParams({ product: product._id });
    setActiveWizardStep(1); 

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
    setActiveWizardStep(1);
    setEditingCartItem(null); 
  };

  const handleAddToCart = (variant) => {
    dispatch(addToCart({ ...variant, shopId: normalizedShopId }));
  };

  const handleUpdateQuantity = (variantId, newQuantity) => {
    dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));
  };

  const handleImageChange = useCallback((productId, imageId) => {
    setImageOverrides(prev => {
      if (prev[productId] === imageId) return prev; 
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
            layoutType={isPodShop ? 'list' : 'grid'} // --- RESTORED COEXISTING LAYOUT RULES ---
            isPodShop={isPodShop} 
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
        layoutType={isPodShop ? 'list' : 'grid'} // --- RESTORED COEXISTING LAYOUT RULES ---
        isPodShop={isPodShop} 
      />
    </>
  );

  const isDesignerFocused = isPodShop && activeProduct && activeWizardStep >= 2;

  return (
    <ContentWrapper>
      <Container>
        {!isDesignerFocused && (
          <ProductFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isPodShop={isPodShop} 
          />
        )}

        {isPodShop && !isDesignerFocused && (
          <StudioHero
            $isArabic={isArabic}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroTag>{t("pod_studio.hero_tag")}</HeroTag>
            <HeroTitle>{t("pod_studio.hero_title")}</HeroTitle>
            <HeroSubtitle>{t("pod_studio.hero_subtitle")}</HeroSubtitle>
          </StudioHero>
        )}

        {activeProduct ? (
          <SplitGrid $isArabic={isArabic} $isFocused={isDesignerFocused}>
            <AnimatePresence>
              <MobilePane>
                <InlineProductDetails
                  product={activeProduct}
                  isPodShop={isPodShop} 
                  cartItems={shopCartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isOrderingEnabled={isOrderingEnabled}
                  onClose={handleClose}
                  onImageChange={handleImageChange}
                  onWizardStepChange={setActiveWizardStep} 
                  editingCartItem={editingCartItem} 
                  setEditingCartItem={setEditingCartItem} 
                />
              </MobilePane>
            </AnimatePresence>

            <ProductsListPane $hidden={isDesignerFocused}>
              {renderCatalogContent()}
              <LoadMoreTrigger ref={lastElementRef}>
                {paginatedLoading && paginatedList.length > 0 && <Spinner />}
              </LoadMoreTrigger>
            </ProductsListPane>

            <AnimatePresence>
              <DesktopPane>
                <InlineProductDetails
                  product={activeProduct}
                  isPodShop={isPodShop} 
                  cartItems={shopCartItems}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  isOrderingEnabled={isOrderingEnabled}
                  onClose={handleClose}
                  onImageChange={handleImageChange}
                  onWizardStepChange={setActiveWizardStep} 
                  editingCartItem={editingCartItem} 
                  setEditingCartItem={setEditingCartItem} 
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