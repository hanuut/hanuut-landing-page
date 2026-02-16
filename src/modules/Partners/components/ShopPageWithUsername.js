import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useParams, useSearchParams } from "react-router-dom";
import BackgroundImage from "../../../assets/background.webp";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShopWithUsername,
  selectShop,
  selectShops,
} from "../state/reducers";
import {
  fetchImage,
  selectSelectedShopImage,
} from "../../Images/state/reducers";
import {
  addToCart,
  updateCartQuantity,
  clearCart,
  selectCart,
} from "../../Cart/state/reducers";
import {
  fetchProductById,
  selectSelectedProduct,
} from "../../Product/state/reducers";

import Loader from "../../../components/Loader";
import NotFoundPage from "../../NotFoundPage";
import MenuPage from "./MenuPage";
import GroceryShopPage from "./GroceryShopPage";
import { useTranslation } from "react-i18next";
import ProductDetailsModal from "../../Product/components/landing/ProductDetailsModal";
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
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const MAX_RETRIES = 2;

const ShopPageWithUsername = () => {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { loading, error } = useSelector(selectShops);
  const selectedShop = useSelector(selectShop);
  const selectedShopImage = useSelector(selectSelectedShopImage);
  const { cart: cartItems } = useSelector(selectCart);

  const [domainKeyWord, setDomainKeyWord] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  const getPublicImageUrl = (imageId) => {
    if (!imageId) return "";
    return `${process.env.REACT_APP_API_PROD_URL}/image/${imageId}`;
  };

  useEffect(() => {
    if (username) dispatch(fetchShopWithUsername(username));
  }, [dispatch, username]);

  useEffect(() => {
    if (error && !loading && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        if (username?.startsWith("@"))
          dispatch(fetchShopWithUsername(username));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, loading, retryCount, dispatch, username]);

  useEffect(() => {
    if (selectedShop) {
      if (selectedShop.domainId?.keyword)
        setDomainKeyWord(selectedShop.domainId.keyword);
      else if (selectedShop.isHyperLocal === false) setDomainKeyWord("global");
      else setDomainKeyWord("food");
    }
  }, [selectedShop]);

  useEffect(() => {
    if (selectedShop?.imageId) dispatch(fetchImage(selectedShop.imageId));
  }, [dispatch, selectedShop]);

  // Deep Link Logic
  const productIdFromUrl = searchParams.get("product");
  useEffect(() => {
    if (productIdFromUrl) {
      if (selectedProductForModal?._id === productIdFromUrl) return;
      dispatch(fetchProductById(productIdFromUrl))
        .unwrap()
        .then((product) => {
          setSelectedProductForModal(product);
        })
        .catch((err) => {
          setSearchParams({});
        });
    } else {
      if (selectedProductForModal) {
        setSelectedProductForModal(null);
      }
    }
  }, [productIdFromUrl, dispatch, setSearchParams]);

  const handleCardClick = (product) => {
    setSearchParams({ product: product._id });
  };

  const handleCloseModal = () => {
    setSearchParams({});
  };

  const handleAddToCart = (variant) => dispatch(addToCart(variant));
  const handleUpdateQuantity = (variantId, newQuantity) =>
    dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));

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

  if (loading || (error && retryCount < MAX_RETRIES))
    return (
      <Section>
        <Loader fullscreen={false} />
      </Section>
    );
  if (error && retryCount >= MAX_RETRIES) return <NotFoundPage />;

  if (
    selectedShop &&
    Object.keys(selectedShop).length > 0 &&
    selectedShopImage &&
    domainKeyWord
  ) {
    const pageProps = { onCardClick: handleCardClick };

    const shopTitle = selectedShop.name || "Hanuut Shop";
    const shopDesc =
      selectedShop.description || t("partnersPage_seo_description");
    const shopImage = getPublicImageUrl(selectedShop.imageId);

    const metaTitle = selectedProductForModal
      ? `${selectedProductForModal.name} | ${shopTitle}`
      : `${shopTitle} | Hanuut`;

    const metaDesc = selectedProductForModal
      ? selectedProductForModal.shortDescription || shopDesc
      : shopDesc;

    return (
      <Section>
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDesc} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDesc} />
          <meta property="og:image" content={shopImage} />
        </Helmet>

        {(() => {
          switch (domainKeyWord) {
            case "food":
              return (
                <MenuPage
                  selectedShop={selectedShop}
                  selectedShopImage={selectedShopImage}
                  shopDomain={domainKeyWord}
                />
              );
            case "global":
              return (
                <Section>
                  <GlobalShopLandingPage
                    shop={selectedShop}
                    image={selectedShopImage}
                    isOrderingEnabled={isOrderingEnabled}
                    orderingStatusKey={orderingStatusKey}
                    {...pageProps}
                  />
                  {/* FIX: REMOVED <Cart /> FROM HERE. The GlobalShopLandingPage handles it. */}

                  {/* MODAL IS RENDERED HERE, CONTROLLED BY STATE SYNCED WITH URL */}
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
            case "grocery":
              return (
                <GroceryShopPage
                  shop={selectedShop}
                  image={selectedShopImage}
                />
              );
            default:
              return <NotFoundPage />;
          }
        })()}
      </Section>
    );
  }
  return (
    <Section>
      <Loader fullscreen={false} />
    </Section>
  );
};

export default ShopPageWithUsername;
