import React, { useEffect, useState, useMemo } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useParams, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import BackgroundImage from "../../../assets/background.webp";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopWithUsername, selectShop, selectShops } from "../state/reducers";
import { fetchImage, selectSelectedShopImage } from "../../Images/state/reducers";
import { addToCart, updateCartQuantity, selectCart } from "../../Cart/state/reducers";
import { fetchProductById, selectSelectedProduct } from "../../Product/state/reducers";
import { useTranslation } from "react-i18next";

import Loader from "../../../components/Loader";
import NotFoundPage from "../../NotFoundPage";
import MenuPage from "./MenuPage";
import GroceryShopPage from "./GroceryShopPage";
import ProductDetailsModal from "../../Product/components/landing/ProductDetailsModal";
import GlobalShopLandingPage from "./GlobalShopLandingPage";
import Seo from "../../../components/Seo";

// --- NEW IMPORTS ---
import BioLinksPage from "./BioLinksPage";
import { getImageUrl } from "../../../utils/imageUtils";
import { light, partnerTheme } from "../../../config/Themes";

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

// --- HEX TO RGB CONVERTER (For Custom Theme Shadows) ---
const hexToRgbString = (hex) => {
  if (!hex) return null;
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) { return r + r + g + g + b + b; });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
};

const MAX_RETRIES = 2;

const ShopPageWithUsername = () => {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { loading, error } = useSelector(selectShops);
  const selectedShop = useSelector(selectShop);
  const selectedShopImage = useSelector(selectSelectedShopImage);
  const { cart: cartItems } = useSelector(selectCart);

  const [domainKeyWord, setDomainKeyWord] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // --- 1. DETECT /links ROUTE ---
  const isLinksRoute = location.pathname.endsWith("/links");

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

  // --- 2. ROUTE PROTECTION: Fallback if /links is disabled ---
  useEffect(() => {
    if (selectedShop && isLinksRoute) {
      const bioLinksActive = selectedShop.shopSettings?.bioLinks?.isActive;
      // If the feature is turned off by the merchant, kick them back to the main shop
      if (!bioLinksActive && selectedShop.username) {
        // Safe redirect: Ensure we extract the pure username without '@' just in case
        const safeUsername = selectedShop.username.startsWith('@') ? selectedShop.username : `@${selectedShop.username}`;
        navigate(`/${safeUsername}`, { replace: true });
      }
    }
  }, [selectedShop, isLinksRoute, navigate]);

  // Deep Link Logic
  const productIdFromUrl = searchParams.get("product");
  useEffect(() => {
    if (productIdFromUrl) {
      if (selectedProductForModal?._id === productIdFromUrl) return;
      dispatch(fetchProductById(productIdFromUrl))
        .unwrap()
        .then((product) => { setSelectedProductForModal(product); })
        .catch((err) => { setSearchParams({}); });
    } else {
      if (selectedProductForModal) setSelectedProductForModal(null);
    }
  }, [productIdFromUrl, dispatch, setSearchParams, selectedProductForModal]);

  const handleCardClick = (product) => { setSearchParams({ product: product._id }); };
  const handleCloseModal = () => { setSearchParams({}); };
  const handleAddToCart = (variant) => dispatch(addToCart(variant));
  const handleUpdateQuantity = (variantId, newQuantity) => dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));

  // --- 3. DYNAMIC THEMER ---
  const customTheme = useMemo(() => {
    const baseTheme = domainKeyWord === 'global' ? partnerTheme : light;
    if (!selectedShop?.styles) return baseTheme;

    const { mainColor, secondaryColor, surfaceColor, onSurfaceColor } = selectedShop.styles;
    const mainRgb = hexToRgbString(mainColor);
    const secondaryRgb = hexToRgbString(secondaryColor);

    return {
      ...baseTheme,
      primaryColor: mainColor || baseTheme.primaryColor,
      primaryRgba: mainRgb || baseTheme.primaryRgba, 
      secondaryColor: secondaryColor || baseTheme.secondaryColor,
      accentRgba: secondaryRgb || baseTheme.accentRgba, 
      body: surfaceColor || baseTheme.body,
      text: onSurfaceColor || baseTheme.text,
      surface: surfaceColor || baseTheme.surface, 
    };
  }, [selectedShop, domainKeyWord]);

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
    const shopTitle = selectedShop.name || "Hanuut Shop";
    const shopImage = getImageUrl(selectedShop.imageId); 
    const cleanUsername = selectedShop.username?.startsWith("@") ? selectedShop.username : `@${selectedShop.username}`;

    const currentUrl = `https://hanuut.com/${cleanUsername}${isLinksRoute ? '/links' : ''}`;
    const commune = selectedShop.addressId?.commune || "Algeria";
    const wilaya = selectedShop.addressId?.wilaya || "Algeria";

    const metaTitle = isLinksRoute 
      ? `${shopTitle} | Links & Socials` 
      : t(`seo.shop_title_${domainKeyWord}`, { shopName: shopTitle, commune: commune, wilaya: wilaya, defaultValue: `${shopTitle} | Hanuut` });

    const metaDesc = isLinksRoute
      ? selectedShop.description || `Connect with ${shopTitle} across all platforms.`
      : t(`seo.shop_desc_${domainKeyWord}`, { shopName: shopTitle, commune: commune, wilaya: wilaya, defaultValue: selectedShop.description || t("partnersPage_seo_description") });

    const pageProps = { onCardClick: handleCardClick };

    return (
      // --- 4. APPLY THE THEME TO EVERYTHING INSIDE ---
      <ThemeProvider theme={customTheme}>
        <Section style={{ backgroundColor: customTheme.body }}>
          
          <Seo title={metaTitle} description={metaDesc} url={currentUrl} image={shopImage} shop={!isLinksRoute ? selectedShop : null} />

          {/* --- 5. RENDER BIO LINKS OR STANDARD SHOP --- */}
          {isLinksRoute && selectedShop.shopSettings?.bioLinks?.isActive ? (
            <BioLinksPage shop={selectedShop} />
          ) : (
            (() => {
              switch (domainKeyWord) {
                case "food":
                  return <MenuPage selectedShop={selectedShop} selectedShopImage={selectedShopImage} shopDomain={domainKeyWord} />;
                case "global":
                  return (
                    <>
                      <GlobalShopLandingPage
                        shop={selectedShop}
                        image={selectedShopImage}
                        isOrderingEnabled={isOrderingEnabled}
                        orderingStatusKey={orderingStatusKey}
                        {...pageProps}
                      />
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
                    </>
                  );
                case "grocery":
                  return <GroceryShopPage shop={selectedShop} image={selectedShopImage} />;
                default:
                  return <NotFoundPage />;
              }
            })()
          )}
        </Section>
      </ThemeProvider>
    );
  }
  return <Section><Loader fullscreen={false} /></Section>;
};

export default ShopPageWithUsername;