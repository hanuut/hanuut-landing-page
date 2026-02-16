import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { usePalette } from "color-thief-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

// --- Imports ---
import ShopHeader from "./ShopHeader";
import ProductShowcase from "../../Product/components/landing/ProductShowcase";
import ProductFilterBar from "../../Product/components/landing/ProductFilterBar";
import PoweredByHanuut from "../../../components/PoweredByHanuut";
import { getImageUrl } from "../../../utils/imageUtils";
import Loader from "../../../components/Loader";
import Cart from "./Cart";
import ProductDetailsModal from "../../Product/components/landing/ProductDetailsModal";
import OrderSuccessModal from "./OrderSuccessModal";

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
  closeCart,
} from "../../Cart/state/reducers";
import { createGlobalOrder } from "../services/orderServices";
import { partnerTheme } from "../../../config/Themes";

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
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #f07a48;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const GlobalShopLandingPage = ({
  shop,
  image,
  isOrderingEnabled,
  orderingStatusKey,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isArabic = i18n.language === "ar";

  const normalizedShopId = useMemo(() => shop?._id || shop?.id, [shop]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  const {
    products: paginatedList,
    loading: paginatedLoading,
    meta: paginationMeta,
  } = useSelector(selectPaginatedState);
  const { featuredProducts } = useSelector(selectProducts);
  const { categories } = useSelector(selectCategories);
  const { cart } = useSelector(selectCart);

  // --- FIX 1: Filter cart items using the correct root-level shopId ---
  const shopCartItems = useMemo(() => {
    console.log(cart, "Filtering cart items for shop"); // Debugging log
    if (!normalizedShopId) return [];
    return cart.filter((item) => item.product?.shopId === normalizedShopId);
  }, [cart, normalizedShopId]);

  const imageUrl = useMemo(() => getImageUrl(image), [image]);
  const { data: logoPalette } = usePalette(imageUrl, 2, "hex", {
    crossOrigin: "Anonymous",
  });
  const isSubscribed = shop.subscriptionPlanId !== null;
  const brandColors = {
    main: shop.styles?.mainColor || logoPalette?.[0] || "#F07A48",
    accent: shop.styles?.secondaryColor || logoPalette?.[1] || "#39A170",
  };

  useEffect(() => {
    if (normalizedShopId) {
      dispatch(fetchFeaturedProductsByShop(normalizedShopId));
      if (shop.categories?.length > 0)
        dispatch(fetchCategories(shop.categories));
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
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, normalizedShopId, searchQuery, selectedCategory]);

  // --- RESTORED: Deep Linking Logic, managed locally ---
  const productIdFromUrl = searchParams.get("product");
  useEffect(() => {
    if (productIdFromUrl) {
      if (selectedProductForModal?._id === productIdFromUrl) return;
      dispatch(fetchProductById(productIdFromUrl))
        .unwrap()
        .then(setSelectedProductForModal)
        .catch(() => setSearchParams({}));
    } else {
      if (selectedProductForModal) setSelectedProductForModal(null);
    }
  }, [productIdFromUrl, dispatch, setSearchParams, selectedProductForModal]);

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
    [
      paginatedLoading,
      paginationMeta.hasMore,
      normalizedShopId,
      selectedCategory,
      searchQuery,
      dispatch,
    ],
  );

  // --- RESTORED: Local Modal Handlers ---
  const handleModalOpen = (product) =>
    setSearchParams({ product: product._id });
  const handleModalClose = () => setSearchParams({});

  // --- FIX 2: Ensure correct shopId is dispatched ---
  const handleAddToCart = (variant) =>
    dispatch(addToCart({ ...variant, shopId: normalizedShopId }));
  const handleUpdateQuantity = (variantId, newQuantity) =>
    dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));

  const handlePlaceOrder = async (customerDetails) => {
    if (isSubmitting === "submitting") return;
    if (
      !customerDetails.customerName ||
      !customerDetails.customerPhone ||
      !customerDetails.address?.wilaya
    ) {
      alert(t("errorFillAllFields"));
      return;
    }
    setIsSubmitting("submitting");

    const { address, gpsLocation, deliveryOption } = customerDetails;
    const deliveryInfoString = `${address.addressLine || ""}, ${address.commune}, ${address.wilaya}`;
    const productsPayload = shopCartItems.map((item) => ({
      productId: item.productId || item.product._id || item.product.id,
      title: item.title || item.product.name,
      quantity: Number(item.quantity),
      sellingPrice: Number(item.sellingPrice),
      categoryId: item.product?.categoryId,
      supplementary: `${item.size || "Default"},${item.color || "Default"}`,
    }));

    const orderPayload = {
      shopId: normalizedShopId,
      customerName: customerDetails.customerName,
      customerPhone: customerDetails.customerPhone,
      deliveryInfo: deliveryInfoString,
      note: customerDetails.note || "",
      deliveryPricing: deliveryOption?.price || 0,
      deliveryOptionKeyword: deliveryOption?.type || "national",
      city: address?.commune,
      state: address?.wilaya,
      addressLine: address?.addressLine || "",
      ...(gpsLocation && {
        gpsLocation: {
          lat: Number(gpsLocation.lat),
          lng: Number(gpsLocation.lng),
        },
      }),
      products: productsPayload,
    };

    try {
      const response = await createGlobalOrder(orderPayload);
      const result = response.data || response;
      setOrderSuccessData({
        orderId: result.orderId,
        customerPhone: result.customerPhone,
        shopName: shop.name,
      });
      setIsSubmitting("success");
      dispatch(closeCart()); // Close the cart to reveal the success modal
    } catch (error) {
      console.error("Order Failed:", error);
      setIsSubmitting("error");
      setTimeout(() => setIsSubmitting(null), 3000);
    }
  };

  // --- FIX 3: Clear cart logic moved here to run AFTER modal is closed ---
  const handleClearSuccess = () => {
    setIsSubmitting(null);
    setOrderSuccessData(null);
    shopCartItems.forEach((item) =>
      dispatch(updateCartQuantity({ variantId: item.variantId, quantity: 0 })),
    );
  };

  const isHomeView =
    !searchQuery && !selectedCategory && paginationMeta.page === 1;

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
          <motion.div variants={fadeInUp} style={{ marginBottom: "1rem" }}>
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
                <div style={{ marginBottom: "2rem" }}>
                  <ProductShowcase
                    title={t("featured_products_title")}
                    products={featuredProducts}
                    onCardClick={handleModalOpen}
                    isOrderingEnabled={isOrderingEnabled}
                    cartItems={shopCartItems}
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
                onCardClick={handleModalOpen}
                isOrderingEnabled={isOrderingEnabled}
                cartItems={shopCartItems}
              />
              <LoadMoreTrigger ref={lastElementRef}>
                {paginatedLoading && paginatedList.length > 0 && (
                  <SpinnerSmall />
                )}
              </LoadMoreTrigger>
              {!paginatedLoading &&
                paginatedList.length === 0 &&
                !isHomeView && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#666",
                      marginTop: "2rem",
                    }}
                  >
                    {t("noProductsAvailable")}
                  </p>
                )}
            </motion.div>
          </AnimatePresence>
        </Container>

        {/* RESTORED: Product Modal logic */}
        {selectedProductForModal && (
          <ProductDetailsModal
            product={selectedProductForModal}
            onClose={handleModalClose}
            cartItems={shopCartItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            isOrderingEnabled={isOrderingEnabled}
            orderingStatusKey={orderingStatusKey}
          />
        )}

        {/* SUCCESS MODAL RENDERED HERE, INDEPENDENT OF CART */}
        {orderSuccessData && (
          <OrderSuccessModal
            orderData={orderSuccessData}
            onClose={handleClearSuccess}
          />
        )}

        <Cart
          items={shopCartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onSubmitOrder={handlePlaceOrder}
          isSubmitting={isSubmitting}
          shopDomain="global"
          shopId={normalizedShopId}
        />

        <PoweredByHanuut />
      </PageWrapper>
    </ThemeProvider>
  );
};

export default GlobalShopLandingPage;
