// src/modules/PodStudio/components/StudioLanding/PodStudioDashboard.jsx

import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  selectCart,
  updateCartQuantity,
  openCart,
  closeCart,
} from "../../../Cart/state/reducers";
import { partnerTheme } from "../../../../config/Themes";
import { getImageUrl } from "../../../../utils/imageUtils";

import StudioHero from "./StudioHero";
import CanvasLibrary from "./CanvasLibrary";
import DesignWorkspace from "../Workspace/DesignWorkspace";
import CreationTray from "../CreationTray/CreationTray";

import Cart from "../../../Partners/components/Cart";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import { fetchProductById } from "../../../Product/state/reducers";

import Seo from "../../../../components/Seo";
import { createGlobalOrder } from "../../../Partners/services/orderServices";
import OrderSuccessModal from "../../../Partners/components/OrderSuccessModal";
import { AnimatePresence, motion } from "framer-motion";

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
  padding-bottom: 1.5rem;
  box-sizing: border-box;
  direction: ${(props) => (props.$isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  text-align: start;
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
  padding: 0.8rem 1.5rem;
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

const PodStudioDashboard = ({ shop, selectedShopImage }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const isArabic = i18n.language === "ar";

  const { cart } = useSelector(selectCart);

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

  const seoMetadata = useMemo(() => {
    const shopTitle = shop.name || "AF Print Studio";

    const translations = {
      en: {
        title: `${shopTitle} | Create Custom Premium Apparel & Streetwear`,
        description: `Design and manufacture custom premium apparel at ${shopTitle}. Upload your designs and build your customized streetwear collection on organic open-end cotton blanks.`,
      },
      fr: {
        title: `${shopTitle} | Créez vos Vêtements Personnalisés Haut de Gamme`,
        description: `Concevez et fabriquez vos vêtements personnalisés haut de gamme avec ${shopTitle}. Importez vos visuels et créez votre collection sur des supports en coton de qualité supérieure.`,
      },
      ar: {
        title: `أوراس فورج بود لابد | صمم ملابسك المخصصة بجودة فاخرة | ${shopTitle}`,
        description: `صمم وأنتج ملابسك الفاخرة والمخصصة مع معمل ${shopTitle}. ارفع تصاميمك الخاصة وابدأ إنتاج تشكيلتك الفريدة على خامات من القطن الطبيعي مع شحن لكافة الولايات بالجزائر.`,
      },
    };

    const currentLang = i18n.language || "en";
    return translations[currentLang] || translations.en;
  }, [shop, i18n.language]);

  const handleSelectCanvas = (canvas) => {
    setSelectedCanvas(canvas);
  };

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

  // --- RESTORED HELPER: Scrolls down to library segment on CTA click ---
  const handleEnterWorkspace = () => {
    const el = document.getElementById("canvas-library-anchor");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePlaceOrder = async (customerDetails) => {
    if (isSubmitting === "submitting") return;
    setIsSubmitting("submitting");

    const activeProducts = customerDetails.healedProducts || shopCartItems;

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

      products: activeProducts.map((item) => ({
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

    try {
      const response = await createGlobalOrder(orderPayload);
      const orderResult = response.data;

      setOrderSuccessData({
        orderId: orderResult.orderId,
        customerPhone: customerDetails.customerPhone,
        shopName: shop.name,
      });

      setIsSubmitting("success");

      // Clear the cart for this shop after success
      shopCartItems.forEach((item) =>
        dispatch(
          updateCartQuantity({ variantId: item.variantId, quantity: 0 }),
        ),
      );
    } catch (error) {
      console.error("Global Order Placement Failed:", error);
      const backendMessage = error.response?.data?.message;
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

  // SECURE EDIT TRIGGER: Closes the active Cart overlay modal before initiating editor state load
  const handleEditCustomItem = (cartItem) => {
    dispatch(closeCart()); // <-- FIXED: MODAL CLOSES NATIVELY
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
        title={seoMetadata.title}
        description={seoMetadata.description}
        url={`https://hanuut.com/@${shop.username}`}
        image={shopLogoUrl}
        shop={shop}
      />

      <LayoutShell dir={isArabic ? "rtl" : "ltr"}>
        <MainContent>
          <UnifiedHeaderRow $isArabic={isArabic}>
            <HeaderLeft>
              {selectedCanvas && (
                <BackButton onClick={handleBackToCatalog}>
                  {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
                  <span>{t("pod_studio.btn_back")}</span>
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
                  <StudioName>{shop.name}</StudioName>
                  <StudioDesc>
                    {shop.description || "Print-On-Demand Studio"}
                  </StudioDesc>
                </StudioText>
              </div>
            </HeaderLeft>

            {(shopCartItems.length > 0 || !selectedCanvas) && (
              <FloatingCartPill onClick={() => setIsTrayOpen(true)}>
                <FaShoppingCart />
                {shopCartItems.length > 0 && (
                  <span>
                    {shopCartItems.reduce(
                      (acc, item) => acc + item.quantity,
                      0,
                    )}{" "}
                    {t("pod_studio.tray_title")}
                  </span>
                )}
              </FloatingCartPill>
            )}
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
            <>
              <StudioHero onEnterWorkspace={handleEnterWorkspace} />
              <div
                id="canvas-library-anchor"
                style={{ width: "100%", paddingTop: "1rem" }}
              >
                <CanvasLibrary
                  shopId={shop._id || shop.id}
                  onSelectCanvas={handleSelectCanvas}
                  shop={shop}
                />
              </div>
            </>
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
  shop: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  selectedShopImage: PropTypes.object,
};

export default PodStudioDashboard;
