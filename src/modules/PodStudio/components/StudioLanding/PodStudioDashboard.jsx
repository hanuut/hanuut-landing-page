import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  selectCart,
  updateCartQuantity,
  openCart,
  closeCart,
} from "../../../Cart/state/reducers";
import { partnerTheme } from "../../../../config/Themes";
import { getImageUrl } from "../../../../utils/imageUtils";
import { retrieveFile, garbageCollectKeys } from "../../utils/indexedDbHelper";
import DesignWorkspace from "../Workspace/DesignWorkspace";
import CreationTray from "../CreationTray/CreationTray";
import Cart from "../../../Partners/components/Cart";
import OrderSuccessModal from "../../../Partners/components/OrderSuccessModal";
import { AnimatePresence, motion } from "framer-motion";

import CanvasLibrary from "./CanvasLibrary";
import LanguagesDropDown from "../../../../components/LanguagesDropDown";

// --- PHASE 2 INTEGRATED STOREFRONT IMPORTS ---
import "../storefront/styles/storefront.css";
import HeroSection from "../storefront/sections/HeroSection";
import CreativePossibilities from "../storefront/sections/CreativePossibilities";
import CTASection from "../storefront/sections/CTASection";

import {
  fetchPaginatedProducts,
  selectProducts,
} from "../../../Product/state/reducers";
import { selectCategories } from "../../../Categories/state/reducers";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import { fetchProductById } from "../../../Product/state/reducers";
import Seo from "../../../../components/Seo";
import { createGlobalOrder } from "../../../Partners/services/orderServices";

const LayoutShell = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #0c0c0e;
  color: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2.5rem;
`;

const UnifiedHeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
  box-sizing: border-box;
  z-index: 10;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-align: start;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const HeaderCircleBtn = styled(Link)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 44px;
  width: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }
`;

const LangWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 0 4px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #ffffff;
  }
`;

const StudioLogo = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

const StudioText = styled.div`
  display: flex;
  flex-direction: column;
`;

const StudioName = styled.h2`
  font-size: 1.15rem;
  font-weight: 800;
  color: white;
  margin: 0;
  font-family: "Tajawal", sans-serif;
`;

const StudioDesc = styled.p`
  font-size: 0.8rem;
  color: #a1a1aa;
  margin: 2px 0 0 0;
  font-family: "Cairo", sans-serif;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 400px;
`;

const FloatingCartPill = styled.button`
  background: ${(props) => props.theme.primaryColor || "#F07A48"};
  color: #050505;
  border: none;
  height: 44px;
  padding: 0 1.5rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 25px rgba(240, 122, 72, 0.35);
  cursor: pointer;
  transition: transform 0.2s;
  font-family: "Tajawal", sans-serif;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
  }
`;

const HiddenCartTriggerWrapper = styled.div`
  .homeDownloadButton {
    display: none !important;
  }
`;

const uploadAssetWithFallback = async (fileBlob) => {
  const API_URL =
    process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com";

  try {
    const formData = new FormData();
    formData.append("file", fileBlob);
    const res = await axios.post(`${API_URL}/image/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data && res.data.url) return res.data.url;
  } catch (err) {
    console.warn(
      "Cloudinary upload failed, using NestJS database fallback...",
      err,
    );
  }

  const fallbackData = new FormData();
  fallbackData.append("image", fileBlob);
  const fallbackRes = await axios.post(`${API_URL}/image`, fallbackData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (fallbackRes.data && fallbackRes.data.id) {
    return `${API_URL}/image/raw/${fallbackRes.data.id}`;
  }
  throw new Error(
    "Failed to save custom asset across both primary and fallback backends.",
  );
};

const PodStudioDashboard = ({ shop, selectedShopImage }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";

  const { cart } = useSelector(selectCart);
  const { paginatedProducts, paginationLoading } = useSelector(selectProducts);
  const { categories } = useSelector(selectCategories);

  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(null);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [orderErrorMsg, setOrderErrorMsg] = useState("");

  const shopCartItems = useMemo(() => {
    const shopIdValue = shop?._id || shop?.id;
    if (!shopIdValue) return [];
    return cart.filter((item) => item.shopId === shopIdValue);
  }, [cart, shop]);

  const shopLogoUrl = useMemo(
    () => getImageUrl(selectedShopImage),
    [selectedShopImage],
  );

  // Fetch product blanks inside the dashboard to display them on the Catalog
  useEffect(() => {
    const shopIdValue = shop?._id || shop?.id;
    if (shopIdValue && !selectedCanvas) {
      dispatch(
        fetchPaginatedProducts({
          shopId: shopIdValue,
          page: 1,
          limit: 12,
          categoryId: "",
          search: "",
          isNewFilter: true,
          printOnDemand: true,
        }),
      );
    }
  }, [dispatch, shop, selectedCanvas]);

  const handleBackToCatalog = () => {
    setSelectedCanvas(null);
    setEditingCartItem(null);
  };

  const handleDeleteItem = (variantId) => {
    dispatch(updateCartQuantity({ variantId, quantity: 0 }));
  };

  const handleEditItem = (item) => {
    setIsTrayOpen(false);
    setEditingCartItem(item);

    dispatch(fetchProductById(item.canvasId))
      .unwrap()
      .then((product) => {
        const canvas = productToCanvasAdapter(product);
        setSelectedCanvas(canvas);
      });
  };

  const handleCommitSuccess = () => {
    setSelectedCanvas(null);
    setEditingCartItem(null);
    setIsTrayOpen(true);
  };

  const handleInitiateProduction = () => {
    setIsTrayOpen(false);
    dispatch(openCart());
  };

  const handleUpdateQuantity = (variantId, newQuantity) => {
    dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById("canvas-library-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // We map raw products to the catalog. We pass RAW products, not adapted canvases.
  const rawProducts = paginatedProducts || [];

  const handleSelectCanvas = (product) => {
    if (!product) return;

    // --- COGNITIVE SAFEGUARD: BREAK THE DOUBLE-ADAPTATION LOOP ---
    if (product.canvasId) {
      setSelectedCanvas(product);
      return;
    }

    // When a product card is clicked, we run the adapter to build the workspace schema
    const canvas = productToCanvasAdapter(product);
    if (canvas) setSelectedCanvas(canvas);
  };

  const handlePlaceOrder = async (customerDetails) => {
    if (isSubmitting === "submitting") return;
    setIsSubmitting("submitting");

    const activeProducts = customerDetails.healedProducts || shopCartItems;

    try {
      const resolvedProducts = await Promise.all(
        activeProducts.map(async (item) => {
          if (!item.podCustomization) return item;

          const custom = { ...item.podCustomization };
          const stableId = item.variantId;

          if (custom.front?.imageUrl?.startsWith("blob:") && stableId) {
            const fileBlob = await retrieveFile(`${stableId}_front`);
            if (fileBlob) {
              const permanentUrl = await uploadAssetWithFallback(fileBlob);
              custom.front = {
                ...custom.front,
                imageUrl: permanentUrl,
                imageId: permanentUrl,
                originalImageUrl: permanentUrl,
                originalImageId: permanentUrl,
              };
            }
          }

          if (custom.back?.imageUrl?.startsWith("blob:") && stableId) {
            const fileBlob = await retrieveFile(`${stableId}_back`);
            if (fileBlob) {
              const permanentUrl = await uploadAssetWithFallback(fileBlob);
              custom.back = {
                ...custom.back,
                imageUrl: permanentUrl,
                imageId: permanentUrl,
                originalImageUrl: permanentUrl,
                originalImageId: permanentUrl,
              };
            }
          }

          return {
            ...item,
            podCustomization: custom,
          };
        }),
      );

      const orderPayload = {
        shopId: shop._id || shop.id,
        customerName: customerDetails.customerName,
        customerPhone: customerDetails.customerPhone,
        deliveryInfo: customerDetails.note || "No note",
        note: customerDetails.note,
        deliveryPricing: customerDetails.deliveryOption?.price || 0,
        deliveryOptionKeyword:
          customerDetails.deliveryOption?.type === "STOP_DESK"
            ? "stop_desk"
            : "byShop",
        state: customerDetails.address?.wilaya,
        city: customerDetails.address?.commune,
        addressLine: customerDetails.address?.addressLine || "Home Delivery",
        gpsLocation: customerDetails.gpsLocation,
        shopDomainKeyword: "global",

        products: resolvedProducts.map((item) => ({
          productId: item.productId,
          title: item.title,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          categoryId: item.categoryId || item.product?.categoryId,
          supplementary:
            item.color && item.size ? `${item.color},${item.size}` : undefined,
          podCustomization: item.podCustomization,
        })),
      };

      const response = await createGlobalOrder(orderPayload);
      const orderResult = response.data;

      setOrderSuccessData({
        orderId: orderResult.orderId,
        customerPhone: customerDetails.customerPhone,
        shopName:
          shop.name === "AURAS FORGE" ? "AURAS LAB" : shop.name || "AURAS LAB",
      });

      setIsSubmitting("success");

      shopCartItems.forEach((item) =>
        dispatch(
          updateCartQuantity({ variantId: item.variantId, quantity: 0 }),
        ),
      );
    } catch (error) {
      console.error("Global Order Placement Failed:", error);
      const backendMessage = error.response?.data?.message || error.message;
      setOrderErrorMsg(backendMessage || t("order_error_message"));
      setIsSubmitting("error");
      setTimeout(() => {
        setIsSubmitting(null);
        setOrderErrorMsg("");
      }, 4000);
    }
  };

  const handleClearSuccess = () => {
    setIsSubmitting(null);
    setOrderSuccessData(null);
  };

  const handleEditCustomItem = (cartItem) => {
    dispatch(closeCart());
    setEditingCartItem(cartItem);
    dispatch(fetchProductById(cartItem.productId))
      .unwrap()
      .then((product) => {
        const canvas = productToCanvasAdapter(product);
        setSelectedCanvas(canvas);
      });
  };

  return (
    <ThemeProvider theme={partnerTheme}>
      <Seo
        title={shop.name || "AURAS LAB"}
        description={
          shop.description || "Print-On-Demand Custom Streetwear Laboratory"
        }
        url={`https://hanuut.com/@${shop.username}`}
        image={shopLogoUrl}
        shop={shop}
      />

      <LayoutShell dir={isArabic ? "rtl" : "ltr"} className="pod-storefront">
        <div className="pod-storefront-bg-glow" />
        <MainContent>
          <UnifiedHeaderRow $isArabic={isArabic}>
            <HeaderLeft>
              {selectedCanvas && (
                <BackButton onClick={handleBackToCatalog}>
                  {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
                  <span>{t("pod_studio_btn_back", "Back")}</span>
                </BackButton>
              )}
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                {shopLogoUrl ? (
                  <StudioLogo src={shopLogoUrl} alt={shop.name} />
                ) : (
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "#222",
                    }}
                  />
                )}
                <StudioText>
                  <StudioName>
                    {shop.name === "AURAS FORGE"
                      ? "AURAS LAB"
                      : shop.name || "AURAS LAB"}
                  </StudioName>
                  <StudioDesc>
                    {shop.description || "Print-On-Demand Studio"}
                  </StudioDesc>
                </StudioText>
              </div>
            </HeaderLeft>

            <HeaderRight>
              {/* Home Link */}
              <HeaderCircleBtn to="/" title={t("back_home", "Back to Home")}>
                <img src="/logoPic.png" alt="Hanuut Home" />
              </HeaderCircleBtn>

              {/* Language Switcher Wrapper */}
              <LangWrapper>
                <LanguagesDropDown textColor="#ffffff" />
              </LangWrapper>

              {/* Shopping Cart Pill */}
              {(shopCartItems.length > 0 || !selectedCanvas) && (
                <FloatingCartPill onClick={() => setIsTrayOpen(true)}>
                  <FaShoppingCart />
                  {shopCartItems.length > 0 && (
                    <span>
                      {shopCartItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0,
                      )}{" "}
                      {t("pod_studio_tray_title", "Tray")}
                    </span>
                  )}
                </FloatingCartPill>
              )}
            </HeaderRight>
          </UnifiedHeaderRow>

          {selectedCanvas ? (
            <DesignWorkspace
              canvas={selectedCanvas}
              onClose={handleBackToCatalog}
              shopId={shop._id || shop.id}
              editingCartItem={editingCartItem}
              onCommitSuccess={handleCommitSuccess}
            />
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "5rem",
              }}
            >
              <HeroSection
                onScrollToCatalog={handleScrollToCatalog}
                sampleProducts={rawProducts}
              />

              <div
                id="canvas-library-anchor"
                style={{ scrollMarginTop: "100px" }}
              >
                {/* Notice we pass the exact old props back into the exact old component layout */}
                <CanvasLibrary
                  shopId={shop._id || shop.id}
                  onSelectCanvas={handleSelectCanvas}
                  shop={shop}
                />
              </div>

              <CreativePossibilities
                products={rawProducts}
                onSelectCanvas={handleSelectCanvas}
              />

              <CTASection onStartDesign={handleScrollToCatalog} />
            </div>
          )}
        </MainContent>

        <CreationTray
          cartItems={cart}
          shopId={shop._id || shop.id}
          isOpen={isTrayOpen}
          onClose={() => setIsTrayOpen(false)}
          onDelete={handleDeleteItem}
          onEdit={handleEditItem}
          onSubmit={handleInitiateProduction}
        />

        <HiddenCartTriggerWrapper>
          <Cart
            items={shopCartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onSubmitOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
            shopDomain="global"
            shopId={shop._id || shop.id}
            orderErrorMsg={orderErrorMsg}
            onEditCustomItem={handleEditCustomItem}
            orderSuccessData={orderSuccessData}
            onClearSuccess={handleClearSuccess}
          />
        </HiddenCartTriggerWrapper>

        <AnimatePresence>
          {orderSuccessData && (
            <OrderSuccessModal
              orderData={orderSuccessData}
              onClose={handleClearSuccess}
            />
          )}
        </AnimatePresence>
      </LayoutShell>
    </ThemeProvider>
  );
};

PodStudioDashboard.propTypes = {
  shop: PropTypes.object.isRequired,
  selectedShopImage: PropTypes.object,
};

export default PodStudioDashboard;
