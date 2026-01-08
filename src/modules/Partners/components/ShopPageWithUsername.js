// ... (imports remain the same)
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import BackgroundImage from "../../../assets/background.webp";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopWithUsername, selectShop, selectShops } from "../state/reducers";
import { fetchImage, selectSelectedShopImage } from "../../Images/state/reducers";
import { addToCart, updateCartQuantity, clearCart, selectCart } from "../../Cart/state/reducers"; 
import Loader from "../../../components/Loader";
import NotFoundPage from "../../NotFoundPage";
import MenuPage from "./MenuPage";
import GroceryShopPage from "./GroceryShopPage";
import { useTranslation } from "react-i18next";
import Cart from "./Cart";
import ProductDetailsModal from "../../Product/components/landing/ProductDetailsModal";
import { createPosOrder, createGlobalOrder } from "../services/orderServices";
import GlobalShopLandingPage from "./GlobalShopLandingPage";
import { Helmet } from "react-helmet";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-image: url(${BackgroundImage});
  background-size: 100%;
  background-position: center;
  padding: 0;
  width: 100%;
  position: relative;
  @media (max-width: 768px) { justify-content: flex-start; width: 100%; }
`;

const MAX_RETRIES = 2;

const ShopPageWithUsername = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { loading, error } = useSelector(selectShops);
  const selectedShop = useSelector(selectShop);
  const selectedShopImage = useSelector(selectSelectedShopImage);
  const { cart: cartItems } = useSelector(selectCart); 

  const [domainKeyWord, setDomainKeyWord] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(null);

  const getPublicImageUrl = (imageId) => {
    if (!imageId) return "";
    return `${process.env.REACT_APP_API_PROD_URL}/image/${imageId}`;
  };

  useEffect(() => { if (username) dispatch(fetchShopWithUsername(username)); }, [dispatch, username]);

  useEffect(() => {
    if (error && !loading && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        if (username?.startsWith("@")) dispatch(fetchShopWithUsername(username));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, loading, retryCount, dispatch, username]);

  useEffect(() => {
    if (selectedShop) {
      if (selectedShop.domainId?.keyword) setDomainKeyWord(selectedShop.domainId.keyword);
      else if (selectedShop.isHyperLocal === false) setDomainKeyWord("global");
      else setDomainKeyWord("food"); 
    }
  }, [selectedShop]);

  useEffect(() => {
    if (selectedShop?.imageId) dispatch(fetchImage(selectedShop.imageId));
  }, [dispatch, selectedShop]);

  const handleCardClick = (product) => setSelectedProductForModal(product);
  const handleCloseModal = () => setSelectedProductForModal(null);
  const handleAddToCart = (variant) => dispatch(addToCart(variant));
  const handleUpdateQuantity = (variantId, newQuantity) => dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));

  const handlePlaceOrder = async (customerDetails) => {
    if (isSubmitting === "submitting") return;

    if (!customerDetails.customerName || !customerDetails.customerPhone) {
      alert(t("form_validation_alert")); 
      return;
    }
    if (domainKeyWord === "global" && (!customerDetails.address?.wilaya || !customerDetails.address?.commune)) {
      alert(t("errorFillAllFields")); 
      return;
    }

    setIsSubmitting("submitting");

    const { address, gpsLocation } = customerDetails;
    const deliveryInfoString = address ? `${address.addressLine || ''}, ${address.commune}, ${address.wilaya}` : "";

    let orderPayload;
    let submissionService;

    // --- ROBUST PAYLOAD CONSTRUCTION (FIX FOR 400 ERROR) ---
    // 1. Filter out items that are missing critical IDs
    const validItems = cartItems.filter(item => (item.productId || item.product?._id) && (item.title || item.product?.name));
    
    // 2. Map safely
    const productsPayload = validItems.map((item) => ({
        productId: item.productId || item.product._id, // Fallback if top-level productId missing
        title: item.title || item.product.name,        // Fallback if top-level title missing
        quantity: Number(item.quantity),
        sellingPrice: Number(item.sellingPrice),
        categoryId: item.product?.categoryId, 
        supplementary: `${item.size || 'Default'},${item.color || 'Default'}`, 
    }));

    if(productsPayload.length === 0) {
        alert("Cart is invalid or empty. Please clear cart and try again.");
        setIsSubmitting(null);
        return;
    }

    if (domainKeyWord === "global") {
      submissionService = createGlobalOrder;
      orderPayload = {
        shopId: selectedShop._id,
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
    } else {
      submissionService = createPosOrder;
      orderPayload = {
        shopId: selectedShop._id,
        customerName: customerDetails.customerName,
        tableNumber: customerDetails.tableNumber,
        note: customerDetails.note,
        products: productsPayload,
      };
    }

    try {
      await submissionService(orderPayload);
      setIsSubmitting("success");
      setTimeout(() => {
        setIsCartOpen(false);
        dispatch(clearCart()); 
        setIsSubmitting(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to submit order:", error);
      if (error.response && error.response.data) console.error("Server Error Details:", error.response.data);
      setIsSubmitting("error");
      setTimeout(() => setIsSubmitting(null), 3000);
    }
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    if (isSubmitting === "success" || isSubmitting === "error") setIsSubmitting(null);
  };

  let isOrderingEnabled = false;
  let orderingStatusKey = "";

  if (selectedShop && domainKeyWord) {
    if (domainKeyWord === "global") {
      if (!selectedShop.isValidated) {
        isOrderingEnabled = false;
        orderingStatusKey = "shop_not_validated";
      } else if (selectedShop.canSellOnline === false) {
        isOrderingEnabled = false;
        orderingStatusKey = "sales_disabled";
      } else {
        isOrderingEnabled = true;
      }
    } else {
      isOrderingEnabled = selectedShop.isOpen;
      orderingStatusKey = selectedShop.isOpen ? "" : "shop_status_closed";
    }
  }

  if (loading || (error && retryCount < MAX_RETRIES)) return <Section><Loader fullscreen={false} /></Section>;
  if (error && retryCount >= MAX_RETRIES) return <NotFoundPage />;

  if (selectedShop && Object.keys(selectedShop).length > 0 && selectedShopImage && domainKeyWord) {
    const pageProps = { onCardClick: handleCardClick };
    const cartProps = {
      items: cartItems, 
      isOpen: isCartOpen,
      onOpen: () => setIsCartOpen(true),
      onClose: handleCloseCart,
      onUpdateQuantity: handleUpdateQuantity,
      onSubmitOrder: handlePlaceOrder,
      isPremium: selectedShop.subscriptionPlanId !== null,
      isSubmitting: isSubmitting,
      shopDomain: domainKeyWord, 
    };

    const shopTitle = selectedShop.name || "Hanuut Shop";
    const shopDesc = selectedShop.description || t("partnersPage_seo_description");
    const shopImage = getPublicImageUrl(selectedShop.imageId);

    return (
      <Section>
        <Helmet>
          <title>{shopTitle} | Hanuut</title>
          <meta name="description" content={shopDesc} />
          <meta property="og:title" content={shopTitle} />
          <meta property="og:image" content={shopImage} />
        </Helmet>
        
        {(() => {
          switch (domainKeyWord) {
            case "food": return <MenuPage selectedShop={selectedShop} selectedShopImage={selectedShopImage} shopDomain={domainKeyWord} />;
            case "global": return (
                <Section>
                  <GlobalShopLandingPage
                    shop={selectedShop}
                    image={selectedShopImage}
                    isOrderingEnabled={isOrderingEnabled}
                    orderingStatusKey={orderingStatusKey}
                    {...pageProps}
                  />
                  <Cart {...cartProps} />
                  {selectedProductForModal && (
                    <ProductDetailsModal
                      product={selectedProductForModal}
                      onClose={handleCloseModal}
                      cartItems={cartItems} 
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      isOrderingEnabled={isOrderingEnabled}
                      orderingStatusKey={orderingStatusKey}
                    />
                  )}
                </Section>
              );
            case "grocery": return <GroceryShopPage shop={selectedShop} image={selectedShopImage} />;
            default: return <NotFoundPage />;
          }
        })()}
      </Section>
    );
  }
  return <Section><Loader fullscreen={false} /></Section>;
};

export default ShopPageWithUsername;