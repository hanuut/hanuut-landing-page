// src/modules/PodStudio/components/StudioLanding/PodStudioDashboard.jsx

import React, { useState, useMemo, useEffect, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaShoppingCart,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import {
  selectCart,
  updateCartQuantity,
  openCart,
  closeCart,
} from "../../../Cart/state/reducers";
import { partnerTheme } from "../../../../config/Themes";
import { getImageUrl } from "../../../../utils/imageUtils";
import { retrieveFile } from "../../utils/indexedDbHelper";
import CreationTray from "../CreationTray/CreationTray";
import Cart from "../../../Partners/components/Cart";
import OrderSuccessModal from "../../../Partners/components/OrderSuccessModal";
import { AnimatePresence } from "framer-motion";

import CanvasLibrary from "./CanvasLibrary";
import LanguagesDropDown from "../../../../components/LanguagesDropDown";

import "../storefront/styles/storefront.css";
import HeroSection from "../storefront/sections/HeroSection";
import CreativePossibilities from "../storefront/sections/CreativePossibilities";
import CTASection from "../storefront/sections/CTASection";

import {
  fetchPaginatedProducts,
  selectProducts,
} from "../../../Product/state/reducers";
import { productToCanvasAdapter } from "../../adapters/productToCanvasAdapter";
import { fetchProductById } from "../../../Product/state/reducers";
import Seo from "../../../../components/Seo";
import { createGlobalOrder } from "../../../Partners/services/orderServices";
import DiscoveryCarousel from "../storefront/sections/DiscoveryCarousel";
import EditorialShowcase from "../storefront/sections/EditorialShowcase";
import Loader from "../../../../components/Loader";
import ArtistDesignProductModal from "../Workspace/ArtistDesignProductModal";

const DesignWorkspace = lazy(() => import("../Workspace/DesignWorkspace"));

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

  @media (max-width: 768px) {
    padding: 1rem 1rem 3rem 1rem;
    gap: 1.5rem;
  }
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
  direction: ltr;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: auto auto auto;
    gap: 8px;
    height: auto;
    padding-bottom: 0.5rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
`;

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

const BackToStudioBtn = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.9rem;
  font-family: "Tajawal", sans-serif;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  &:hover {
    background: #f07a48;
    color: #050505;
    border-color: #f07a48;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.85rem;
    font-size: 0.8rem;
    border-radius: 10px;
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

  img {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    height: 36px;
    width: 36px;
    img {
      width: 18px;
      height: 18px;
    }
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
  }

  @media (max-width: 768px) {
    height: 36px;
    padding: 0 2px;
  }
`;

const StudioLogo = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const StudioText = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    display: none;
  }
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

  @media (max-width: 768px) {
    height: 36px;
    padding: 0 1rem;
    font-size: 0.8rem;
    gap: 6px;
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

const PodStudioDashboard = ({
  shop,
  selectedShopImage,
  initialSku,
  initialGroup,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const { cart } = useSelector(selectCart);
  const { paginatedProducts, paginationLoading } = useSelector(selectProducts);

  const [selectedCanvas, setSelectedCanvas] = useState(null);
  const [selectedArtistDesignForModal, setSelectedArtistDesignForModal] = useState(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [editingCartItem, setEditingCartItem] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(null);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [orderErrorMsg, setOrderErrorMsg] = useState("");

  const shopId = shop?._id || shop?.id;

  const shopCartItems = useMemo(() => {
    if (!shopId) return [];
    return cart.filter((item) => item.shopId === shopId);
  }, [cart, shopId]);

  const shopLogoUrl = useMemo(
    () => getImageUrl(selectedShopImage),
    [selectedShopImage]
  );

  useEffect(() => {
    if (shopId && !selectedCanvas) {
      dispatch(
        fetchPaginatedProducts({
          shopId: shopId,
          page: 1,
          limit: 25,
          categoryId: "",
          search: "",
          isNewFilter: true,
          printOnDemand: true,
        })
      );
    }
  }, [dispatch, shopId, selectedCanvas]);

  const rawProducts = useMemo(
    () => paginatedProducts || [],
    [paginatedProducts]
  );

  useEffect(() => {
    if (initialSku && !selectedCanvas) {
      const matched = rawProducts.find(
        (p) => String(p.sku).toLowerCase() === String(initialSku).toLowerCase()
      );
      if (matched) {
        const canvasObj = productToCanvasAdapter(matched);
        if (canvasObj) setSelectedCanvas(canvasObj);
      } else if (!paginationLoading && rawProducts.length > 0) {
        axios
          .get(
            `${process.env.REACT_APP_API_PROD_URL || "https://api.hanuut.com"}/global-product/sku/${encodeURIComponent(initialSku)}`
          )
          .then((res) => {
            if (res.data) {
              const canvasObj = productToCanvasAdapter(res.data);
              if (canvasObj) setSelectedCanvas(canvasObj);
            }
          })
          .catch((err) =>
            console.warn("Could not find product matching Sku:", err)
          );
      }
    }
  }, [initialSku, rawProducts, selectedCanvas, paginationLoading]);

  const handleBackToCatalog = () => {
    setSelectedCanvas(null);
    setEditingCartItem(null);
    navigate("/aurasLab/studio", { replace: false });
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

  const handleSelectCanvas = (product) => {
    if (!product) return;
    if (product.sku) {
      navigate(`/aurasLab/studio/${product.sku}`, { state: { fromApp: true } });
    } else if (product.canvasId) {
      setSelectedCanvas(product);
    } else {
      const canvas = productToCanvasAdapter(product);
      if (canvas) setSelectedCanvas(canvas);
    }
  };

  // 🔴 THE MISSING FUNCTION THAT CONNECTS THE MODAL TO THE STUDIO
  const handleSelectDesign = (canvasOrProduct, artistDesign = null, preferredSide = "front") => {
    if (!canvasOrProduct) return;

    let canvasObj = canvasOrProduct;
    if (!canvasObj.canvasId) {
      canvasObj = productToCanvasAdapter(canvasOrProduct);
    }

    if (artistDesign) {
      const meta = artistDesign.podDesignMetadata || {};
      const imgUrl = `https://api.hanuut.com/image/raw/${artistDesign._id || artistDesign.id}`;
      
      canvasObj = {
        ...canvasObj,
        initialArtistDesign: {
          designId: artistDesign._id || artistDesign.id,
          artistName: meta.artistName,
          collectionName: meta.collectionName,
          preferredSide: preferredSide,
          front: preferredSide === "front" ? {
            imageUrl: imgUrl,
            width: meta.defaultPlacement?.scale || 55,
            x: meta.defaultPlacement?.x || 50,
            y: meta.defaultPlacement?.y || 35,
            rotation: meta.defaultPlacement?.rotation || 0,
          } : null,
          back: preferredSide === "back" ? {
            imageUrl: imgUrl,
            width: meta.defaultPlacement?.scale || 55,
            x: meta.defaultPlacement?.x || 50,
            y: meta.defaultPlacement?.y || 35,
            rotation: meta.defaultPlacement?.rotation || 0,
          } : null,
        },
      };
    }
    setSelectedCanvas(canvasObj);
    
    // Smoothly scroll to top so the user sees the workspace
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        })
      );

      const orderPayload = {
        shopId: shopId,
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
        discount: customerDetails.discount || 0,
        discountCode: customerDetails.discountCode || "",
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
          updateCartQuantity({ variantId: item.variantId, quantity: 0 })
        )
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
        description={shop.description || "Print-On-Demand Custom Streetwear Laboratory"}
        url={`https://hanuut.com/aurasLab`}
      />

      <LayoutShell dir="ltr" className="pod-storefront">
        <div className="pod-storefront-bg-glow" />
        <MainContent>
          <UnifiedHeaderRow>
            {/* LEFT: BACK TO STUDIO BUTTON / HOME CIRCLE */}
            <HeaderLeft>
              {selectedCanvas ? (
                <BackToStudioBtn onClick={handleBackToCatalog}>
                  {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
                  <span>{isArabic ? "العودة للاستوديو" : "Back to Studio"}</span>
                </BackToStudioBtn>
              ) : (
                <HeaderCircleBtn to="/aurasLab" title={t("back_home", "AURAS LAB Home")}>
                  <img src="/logoPic.png" alt="Hanuut Home" />
                </HeaderCircleBtn>
              )}
            </HeaderLeft>

            {/* CENTER: LANGUAGE DROPDOWN */}
            <HeaderCenter>
              <LangWrapper>
                <LanguagesDropDown textColor="#ffffff" />
              </LangWrapper>
            </HeaderCenter>

            {/* RIGHT: LOGO & BRAND LINK (Redirection to /aurasLab) */}
            <HeaderRight>
              {!selectedCanvas && shopCartItems.length > 0 && (
                <FloatingCartPill onClick={() => setIsTrayOpen(true)}>
                  <FaShoppingCart />
                  <span>
                    {shopCartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </FloatingCartPill>
              )}

              <HeaderCircleBtn
                to="collab"
                title={t("pod_studio_join_creators_btn", "Join as Creator")}
              >
                <span style={{ fontSize: "1.1rem" }}>🎨</span>
              </HeaderCircleBtn>

              {/* 🔴 BRAND IDENTITY LINK: Redirects to /aurasLab */}
              <Link
                to="/aurasLab"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                title={isArabic ? "الذهاب إلى الواجهة الرئيسية" : "Go to AURAS LAB Home"}
              >
                <StudioText>
                  <StudioName>
                    {shop.name === "AURAS FORGE" ? "AURAS LAB" : shop.name || "AURAS LAB"}
                  </StudioName>
                  <StudioDesc>
                    {shop.description || "Print-On-Demand Studio"}
                  </StudioDesc>
                </StudioText>
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
              </Link>
            </HeaderRight>
          </UnifiedHeaderRow>

          {selectedCanvas ? (
            <Suspense fallback={<Loader fullscreen={false} />}>
              <DesignWorkspace
                key={`${selectedCanvas.canvasId}-${selectedCanvas.initialArtistDesign?.designId || 'blank'}`}
                canvas={selectedCanvas}
                onClose={handleBackToCatalog}
                shopId={shopId}
                editingCartItem={editingCartItem}
                onCommitSuccess={handleCommitSuccess}
              />
            </Suspense>
          ) : (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "5rem" }}>
              <HeroSection
                onScrollToCatalog={handleScrollToCatalog}
                sampleProducts={rawProducts}
                onSelectCanvas={handleSelectCanvas}
              />

              <DiscoveryCarousel
                products={rawProducts}
                onSelectCanvas={handleSelectCanvas}
              />

              <EditorialShowcase
                shopId={shopId}
                onSelectDesign={(canvas, artistDesign, preferredSide) => {
                  if (artistDesign) {
                    setSelectedArtistDesignForModal(artistDesign);
                  } else {
                    handleSelectDesign(canvas, artistDesign, preferredSide);
                  }
                }}
              />

              <div id="canvas-library-anchor" style={{ scrollMarginTop: "100px" }}>
                <CanvasLibrary
                  shopId={shopId}
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
          shopId={shopId}
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
            shopId={shopId}
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

        {/* Modal handles selection inside it */}
        <ArtistDesignProductModal
          isOpen={!!selectedArtistDesignForModal}
          onClose={() => setSelectedArtistDesignForModal(null)}
          design={selectedArtistDesignForModal}
          shopId={shopId}
          onSelectProductWithDesign={(canvas, design, preferredSide) => {
            setSelectedArtistDesignForModal(null);
            handleSelectDesign(canvas, design, preferredSide);
          }}
        />
      </LayoutShell>
    </ThemeProvider>
  );
};

PodStudioDashboard.propTypes = {
  shop: PropTypes.object.isRequired,
  selectedShopImage: PropTypes.object,
  initialSku: PropTypes.string,
  initialGroup: PropTypes.string,
};

export default PodStudioDashboard;