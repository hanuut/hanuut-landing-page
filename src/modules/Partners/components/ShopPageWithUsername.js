// src/modules/Partners/components/ShopPageWithUsername.js

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import BackgroundImage from "../../../assets/background.webp";
import {
  fetchShopWithUsername,
  selectShop,
  selectShops,
} from "../state/reducers";
import {
  fetchImage,
  selectSelectedShopImage,
} from "../../Images/state/reducers";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import NotFoundPage from "../../NotFoundPage";
import MenuPage from "./MenuPage";
import GroceryShopPage from "./GroceryShopPage"; 
import { useTranslation } from "react-i18next";
import Cart from "./Cart";
import ProductDetailsModal from '../../Product/components/landing/ProductDetailsModal';
import { createPosOrder ,createGlobalOrder } from "../services/orderServices";
import GlobalShopLandingPage from "./GlobalShopLandingPage";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  background-image: url(${BackgroundImage});
  background-size: 100%;
  background-position: center;
  padding: 0rem 0;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
    padding: 2rem 0;
  }
`;

const MAX_RETRIES = 2;

const ShopPageWithUsername = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { loading, error } = useSelector(selectShops);
  const selectedShop = useSelector(selectShop);
  const selectedShopImage = useSelector(selectSelectedShopImage);
  
  const [domainKeyWord, setDomainKeyWord] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(null);

  useEffect(() => {
    dispatch(fetchShopWithUsername(username));
  }, [dispatch, username]);

  useEffect(() => {
    if (error && !loading && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        console.log(`Failed to fetch shop. Retrying attempt ${retryCount + 1}...`);
        setRetryCount(prev => prev + 1);
        if (username && username.startsWith('@')) {
          dispatch(fetchShopWithUsername(username));
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, loading, retryCount, dispatch, username]);


  useEffect(() => {
    if (selectedShop?.domainId) {
      setDomainKeyWord(selectedShop.domainId.keyword);
    }
  }, [selectedShop]);

  useEffect(() => {
    if (selectedShop?.imageId) {
      dispatch(fetchImage(selectedShop.imageId));
    }
  }, [dispatch, selectedShop]);

  const handleCardClick = (product) => {
        setSelectedProductForModal(product);
    };

    const handleCloseModal = () => {
        setSelectedProductForModal(null);
    };

    const handleAddToCart = (variant) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.variantId === variant.variantId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.variantId === variant.variantId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...variant, quantity: 1 }];
            }
        });
    };

    const handleUpdateQuantity = (variantId, newQuantity) => {
        if (newQuantity <= 0) {
            setCartItems(prev => prev.filter(item => item.variantId !== variantId));
        } else {
            setCartItems(prev => prev.map(item =>
                item.variantId === variantId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const handlePlaceOrder = async (customerDetails) => {
    if (isSubmitting === "submitting") return;

    // --- FORM VALIDATION ---
    if (!customerDetails.customerName || !customerDetails.customerPhone) {
        alert(t('form_validation_alert')); // Basic validation
        return;
    }
    if (domainKeyWord === 'global' && (!customerDetails.address?.wilaya || !customerDetails.address?.commune)) {
        alert(t('errorFillAllFields')); // E-commerce requires an address
        return;
    }
    
    setIsSubmitting("submitting");

    const { address } = customerDetails;

    const deliveryInfoString = `${address.addressLine}, ${address.commune}, ${address.wilaya}`;

    let orderPayload;
    let submissionService;

    if (domainKeyWord === 'global') {
        // --- BUILD PAYLOAD FOR GLOBAL E-COMMERCE ORDER ---
        submissionService = createGlobalOrder;
        orderPayload = {
            shopId: selectedShop._id,
            customerName: customerDetails.customerName,
            customerPhone: customerDetails.customerPhone,
            deliveryInfo: deliveryInfoString, 
            note: customerDetails.note,
            products: cartItems.map((item) => ({
                productId: item.product._id,
                title: item.product.name,
                quantity: item.quantity,
                sellingPrice: item.sellingPrice,
                categoryId: item.product.categoryId,
                supplementary: `${item.size},${item.color}`, // As per your Flutter model
            })),
        };

    } else {
        submissionService = createPosOrder;
        orderPayload = {
            shopId: selectedShop._id,
            customerName: customerDetails.customerName,
            tableNumber: customerDetails.tableNumber,
            note: customerDetails.note,
            products: cartItems.map((item) => ({
                productId: item.dish._id,
                title: item.dish.name,
                quantity: item.quantity,
                sellingPrice: item.dish.sellingPrice,
                categoryId: item.dish.categoryId,
            })),
        };
    }

    try {
        await submissionService(orderPayload);
        setIsSubmitting("success");
        setTimeout(() => {
            setIsCartOpen(false);
            setCartItems([]);
            setIsSubmitting(null);
        }, 2000);
    } catch (error) {
        console.error("Failed to submit order:", error);
        setIsSubmitting("error");
        setTimeout(() => setIsSubmitting(null), 3000);
    }
};

    const handleCloseCart = () => {
        setIsCartOpen(false);
        if (isSubmitting === "success" || isSubmitting === "error") {
            setIsSubmitting(null);
        }
    };


  if (loading || (error && retryCount < MAX_RETRIES)) {
    const loaderMessage = retryCount > 0 
      ? `` 
      : null;  

    return (
      <Section>
        <Loader message={loaderMessage} fullscreen={false} />
      </Section>
    );
  }

  if (error && retryCount >= MAX_RETRIES) {
    return <NotFoundPage />;
  }

  // --- UPDATED RENDER LOGIC ---
  if (selectedShop && Object.keys(selectedShop).length > 0 && selectedShopImage && domainKeyWord) {
    const pageProps = {
        onCardClick: handleCardClick,
    };
    
    // We will need to adapt the props for the Cart component in a later phase
    const cartProps = {
        items: cartItems,
        isOpen: isCartOpen,
        onOpen: () => setIsCartOpen(true),
        onClose: handleCloseCart,
        onUpdateQuantity: handleUpdateQuantity,
        onSubmitOrder: handlePlaceOrder,
        isPremium: selectedShop.subscriptionPlanId !== null,
        isSubmitting: isSubmitting,
        shopDomain: domainKeyWord, // Pass domain to the cart
    };

    const shopIsOpen = selectedShop.isOpen;

    switch (domainKeyWord) {
        case "food":
            return (
                <Section>
                    <MenuPage
                        selectedShop={selectedShop}
                        selectedShopImage={selectedShopImage}
                        shopDomain={domainKeyWord}
                    />
                </Section>
            );
        case "global":
            return (
                <Section>
                    <GlobalShopLandingPage
                        shop={selectedShop}
                        image={selectedShopImage}
                        {...pageProps} 
                    />
                    <Cart {...cartProps} />
                    {selectedProductForModal && (
                        <ProductDetailsModal
                            product={selectedProductForModal}
                            onClose={handleCloseModal}
                            onAddToCart={handleAddToCart}
                            shopIsOpen={shopIsOpen}
                        />
                    )}
                </Section>
            );
        case "grocery":
            // The new grocery page has its own full-page styling
            return (
                <GroceryShopPage 
                    shop={selectedShop}
                    image={selectedShopImage}
                />
            );
        default:
            // For any other domain, show the 404 page
            return <NotFoundPage />;
    }
  }

  // Fallback loader for the initial render cycle.
  return (
      <Section>
        <Loader fullscreen={false} />
      </Section>
    );
};

export default ShopPageWithUsername;