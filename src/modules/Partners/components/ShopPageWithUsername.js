import React, { useEffect, useState, useMemo } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import {
  useParams,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  selectCart,
  openCart,
} from "../../Cart/state/reducers";
import { fetchProductById } from "../../Product/state/reducers";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { usePalette } from "color-thief-react";

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
import { parseBioLinks } from "../../../utils/bioLinkParser";

import { FaShoppingCart, FaChevronDown, FaChevronUp } from "react-icons/fa";

const DynamicThemeStyles = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.body} !important;
    color: ${(props) => props.theme.text} !important;
  }
`;

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

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  padding-bottom: 6rem;
  position: relative;
  z-index: 1;
`;

const PremiumHeader = styled.div`
  width: 100%;
  position: relative;
  background: ${(props) => props.theme.body};
  border-bottom: 1px solid ${(props) => props.theme.glassBorder};
`;

const CoverPhoto = styled.div`
  width: 100%;
  height: 100px; /* --- REDUCED TO EXACT HALF SIZE --- */
  position: relative;
  background: ${props => props.$bgUrl ? `url(${props.$bgUrl}) center/cover no-repeat` : 'none'};
  overflow: hidden;

  /* Strict Blur Logic: Only blur if we are generating a fallback from the shop logo */
  ${props => !props.$bgUrl && `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url(${props.$logoUrl}) center/cover no-repeat;
      filter: blur(60px) scale(2); /* Blurred abstract look */
      opacity: 0.35;
    }
  `}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    /* Maintained the gradient to transition smoothly into the dark storefront */
    background: linear-gradient(to bottom, rgba(17, 18, 20, 0.1) 0%, ${props => props.theme.body} 100%);
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: -75px auto 0 auto; /* --- SYMMETRICAL LOGO OVERLAP (Splits 150px logo perfectly in half) --- */
  padding: 0 2rem 2rem 2rem;
  position: relative;
  z-index: 10;
  display: flex;
  gap: 2.5rem;
  align-items: flex-end;

  @media(max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: -75px;
    gap: 1.5rem;
  }
`;

const ShopLogo = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 32px;
  object-fit: cover;
  border: 4px solid ${props => props.theme.body};
  box-shadow: 0 15px 30px rgba(0,0,0,0.35);
  background: ${props => props.theme.surface};
  flex-shrink: 0;
`;

const IdentityBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ShopName = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${(props) => props.theme.text};
  font-family: "Tajawal", sans-serif;
`;

const ShopDesc = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.text}99;
  max-width: 600px;
  line-height: 1.5;
`;

const BioLinksWrapper = styled.div`
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const LinkPill = styled.a`
  background: ${(props) =>
    props.$isPrimary ? props.theme.primaryColor : "rgba(255,255,255,0.05)"};
  border: 1px solid
    ${(props) =>
      props.$isPrimary ? props.theme.primaryColor : "rgba(255,255,255,0.1)"};
  color: ${(props) => (props.$isPrimary ? "#000" : "white")} !important;
  padding: 0.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  height: 48px;

  &:hover {
    transform: translateY(-2px);
    background: ${(props) =>
      props.$isPrimary ? props.theme.primaryColor : "rgba(255,255,255,0.1)"};
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const MoreLinksButton = styled.button`
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const FloatingCartPill = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  background: ${(props) => props.theme.primaryColor};
  color: #000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

// --- HEX TO RGB CONVERTER ---
const hexToRgbString = (hex) => {
  if (!hex) return null;
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : null;
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
  const [showAllLinks, setShowAllLinks] = useState(false);

  const isLinksRoute = location.pathname.endsWith("/links");

  // --- Handlers defined cleanly inside functional scope ---
  const handleCardClick = (product) => {
    setSearchParams({ product: product._id });
  };
  const handleCloseModal = () => {
    setSearchParams({});
  };
  const handleAddToCart = (variant) =>
    dispatch(
      addToCart({ ...variant, shopId: selectedShop?._id || selectedShop?.id }),
    );
  const handleUpdateQuantity = (variantId, newQuantity) =>
    dispatch(updateCartQuantity({ variantId, quantity: newQuantity }));

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

  // Route protection
  useEffect(() => {
    if (selectedShop && isLinksRoute) {
      const bioLinksActive = selectedShop.shopSettings?.bioLinks?.isActive;
      if (!bioLinksActive && selectedShop.username) {
        const safeUsername = selectedShop.username.startsWith("@")
          ? selectedShop.username
          : `@${selectedShop.username}`;
        navigate(`/${safeUsername}`, { replace: true });
      }
    }
  }, [selectedShop, isLinksRoute, navigate]);

  const shopImageUrl = useMemo(
    () => getImageUrl(selectedShopImage),
    [selectedShopImage],
  );
  const { data: logoPalette } = usePalette(shopImageUrl, 2, "hex", {
    crossOrigin: "Anonymous",
  });

  const hasCustomization = useMemo(() => {
    const plan = selectedShop?.subscriptionPlanId;
    return plan && plan.price > 0;
  }, [selectedShop]);

  const customTheme = useMemo(() => {
    const baseTheme = domainKeyWord === "global" ? partnerTheme : light;
    if (!selectedShop?.styles) return baseTheme;

    const { mainColor, secondaryColor, surfaceColor, onSurfaceColor } =
      selectedShop.styles;
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
  }, [selectedShop, domainKeyWord, hasCustomization]);

  const parsedBioLinks = useMemo(() => {
    if (!selectedShop?.shopSettings?.bioLinks?.isActive) return [];
    return parseBioLinks(
      selectedShop.shopSettings.bioLinks.links,
      selectedShop.shopSettings.bioLinks.social,
    );
  }, [selectedShop]);

  const visibleLinks = useMemo(() => {
    if (showAllLinks) return parsedBioLinks;
    return parsedBioLinks.slice(0, 4);
  }, [parsedBioLinks, showAllLinks]);

  const shopCartItems = useMemo(() => {
    const shopIdValue = selectedShop?._id || selectedShop?.id;
    if (!shopIdValue) return [];
    return cartItems.filter((item) => item.shopId === shopIdValue);
  }, [cartItems, selectedShop]);

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
    const shopTitle = selectedShop.name || "Hanuut Shop";
    const shopImage = getImageUrl(selectedShop.imageId);
    const cleanUsername = selectedShop.username?.startsWith("@")
      ? selectedShop.username
      : `@${selectedShop.username}`;

    const currentUrl = `https://hanuut.com/${cleanUsername}${isLinksRoute ? "/links" : ""}`;
    const commune = selectedShop.addressId?.commune || "Algeria";
    const wilaya = selectedShop.addressId?.wilaya || "Algeria";

    const metaTitle = isLinksRoute
      ? `${shopTitle} | Links & Socials`
      : t(`seo.shop_title_${domainKeyWord}`, {
          shopName: shopTitle,
          commune: commune,
          wilaya: wilaya,
          defaultValue: `${shopTitle} | Hanuut`,
        });

    const metaDesc = isLinksRoute
      ? selectedShop.description ||
        `Connect with ${shopTitle} across all platforms.`
      : t(`seo.shop_desc_${domainKeyWord}`, {
          shopName: shopTitle,
          commune: commune,
          wilaya: wilaya,
          defaultValue:
            selectedShop.description || t("partnersPage_seo_description"),
        });

    const pageProps = { onCardClick: handleCardClick };
    const coverUrl = selectedShop.styles?.coverImageId
      ? `https://api.hanuut.com/image/raw/${selectedShop.styles.coverImageId}`
      : null;

    return (
      <ThemeProvider theme={customTheme}>
        <DynamicThemeStyles />
        <Section style={{ backgroundColor: customTheme.body }}>
          <Seo
            title={metaTitle}
            description={metaDesc}
            url={currentUrl}
            image={shopImage}
            shop={!isLinksRoute ? selectedShop : null}
          />

          {/* --- RENDER BIO LINKS OR STANDARD SHOP (ROUTER PRESERVED) --- */}
          {isLinksRoute && selectedShop.shopSettings?.bioLinks?.isActive ? (
            <BioLinksPage shop={selectedShop} />
          ) : (
            (() => {
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
                    <PageWrapper>
                      {/* Only render Premium Header on Global/E-commerce shop type */}
                      <PremiumHeader>
                        <CoverPhoto $bgUrl={coverUrl} $logoUrl={shopImageUrl} />
                        <HeaderContent>
                          <ShopLogo
                            src={shopImageUrl}
                            alt={selectedShop.name}
                          />
                          <IdentityBlock>
                            <ShopName>{selectedShop.name}</ShopName>
                            <ShopDesc>{selectedShop.description}</ShopDesc>
                          </IdentityBlock>

                          {parsedBioLinks.length > 0 && (
                            <BioLinksWrapper>
                              <LinkGrid>
                                {visibleLinks.map((link, idx) => (
                                  <LinkPill
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    $isPrimary={link.isPrimary}
                                    title={link.label}
                                  >
                                    {link.icon}
                                  </LinkPill>
                                ))}
                              </LinkGrid>
                              {parsedBioLinks.length > 4 && (
                                <MoreLinksButton
                                  onClick={() => setShowAllLinks(!showAllLinks)}
                                >
                                  {showAllLinks ? (
                                    <>
                                      <FaChevronUp /> Hide Links
                                    </>
                                  ) : (
                                    <>
                                      <FaChevronDown /> View All (
                                      {parsedBioLinks.length})
                                    </>
                                  )}
                                </MoreLinksButton>
                              )}
                            </BioLinksWrapper>
                          )}
                        </HeaderContent>
                      </PremiumHeader>

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
                          cartItems={shopCartItems}
                          onAddToCart={handleAddToCart}
                          onUpdateQuantity={handleUpdateQuantity}
                          isOrderingEnabled={isOrderingEnabled}
                          orderingStatusKey={orderingStatusKey}
                        />
                      )}

                      {/* Only render Floating Cart Pill on Global shop type */}
                      {shopCartItems.length > 0 && (
                        <FloatingCartPill
                          onClick={() => dispatch(openCart())}
                          initial={{ y: 100, x: 100, scale: 0.8 }}
                          animate={{ y: 0, x: 0, scale: 1 }}
                          exit={{ y: 100, x: 100 }}
                        >
                          <FaShoppingCart />
                          <span>
                            {shopCartItems.reduce(
                              (acc, item) => acc + item.quantity,
                              0,
                            )}{" "}
                            Items
                          </span>
                        </FloatingCartPill>
                      )}
                    </PageWrapper>
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
            })()
          )}
        </Section>
      </ThemeProvider>
    );
  }
  return (
    <Section>
      <Loader fullscreen={false} />
    </Section>
  );
};

export default ShopPageWithUsername;
