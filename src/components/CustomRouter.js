import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// Import Loader component for Suspense fallback
import Loader from "./Loader";

// Direct imports for frequently accessed pages
import HomePage from "../modules/HomePage";
import NotFoundPage from "../modules/NotFoundPage";

// Lazy-loaded page components for better performance
const PrivacyPolicy = lazy(() => import("../modules/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../modules/TermsAndConditions"));
const PartnersPage = lazy(() => import("../modules/Partners/PartnersPage"));
const DeleteAccountPage = lazy(() => import("../modules/DeleteAccountPage"));
const ShopPageWithUsername = lazy(() =>
  import("../modules/Partners/components/ShopPageWithUsername")
);
const Tawsila = lazy(() => import("../modules/Tawsila/Tawsila"));
const GetStarted = lazy(() => import("../modules/Tawsila/GetStarted"));
const LinksPage = lazy(() => import("../modules/LinksPage"));
const MyHanuutGuide = lazy(() => import("../modules/MyHanuutGuide"));
const ProductPage = lazy(() => import("../modules/Product/ProductPage"));
const DeepLinkRedirect = lazy(() => import("./DeepLinkRedirect"));


const PaymentResultPage = lazy(() => import("../modules/payment/PaymentResultPage"));
const PaymentProcessingPage = lazy(() => import("../modules/payment/PaymentProcessingPage"));

const CustomRouter = ({ appConfig, location }) => {
  const deepLinkRoutes = useMemo(() => {
    // ... (no changes inside this useMemo hook) ...
    const deepLinkConfig = {
      appScheme: appConfig?.appScheme || "hanuut://",
      appName: appConfig?.appName || "Hanuut",
      storeUrl:
        appConfig?.storeUrl ||
        "https://play.google.com/store/apps/details?id=com.hanuut.shop",
      logoSrc: appConfig?.logoSrc,
    };
    const deepLinkPatterns = {
      "/deeplink": { path: () => "" },
      "/deeplink/product/:id": { path: (params) => `product/${params.id}` },
      "/deeplink/shop/:username": { path: (params) => `shop/${params.username}` },
      "/deeplink/category/:id": { path: (params) => `category/${params.id}` },
      "/deeplink/search": { path: () => "search" },
      "/deeplink/cart": { path: () => "cart" },
      "/deeplink/marketplace/:marketplaceRef/:adRef": {
        path: (params) => `marketplace/${params.marketplaceRef}/${params.adRef}`,
      },
    };
    return Object.entries(deepLinkPatterns).map(([path, config]) => (
      <Route
        key={`deeplink-${path}`}
        path={path}
        element={
          <DeepLinkRedirect
            {...deepLinkConfig}
            transformPath={(normalizedPath) => {
              console.log("Normalized Path:", normalizedPath);
              const pathParts = normalizedPath.split("/");
              console.log("Path Parts:", pathParts);
              const params = {};
              path.split("/").forEach((segment, index) => {
                if (segment.startsWith(":")) {
                  const paramName = segment.substring(1);
                  params[paramName] = pathParts[index];
                }else if (segment !== pathParts[index]) {
                  const paramName = segment;
                  params[paramName] = pathParts[index];
                }
              });
              console.log("Params in transformPath:", params);
              return config.path(params);
            }}
          />
        }
      />
    ));
  }, [appConfig]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense
        fallback={
          <Loader appName={appConfig?.appName} logoSrc={appConfig?.logoSrc} />
        }
      >
        <Routes location={location}>
          {/* Deep link routes */}
          {deepLinkRoutes}

          {/* Main routes */}
          <Route path="/" element={<HomePage />} />

          {/* --- Payment Routes --- */}
          <Route path="/payment/process" element={<PaymentProcessingPage />} />
          <Route path="/payment/result" element={<PaymentResultPage />} />

          {/* Content pages */}
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/my-hanuut-guide" element={<MyHanuutGuide />} />
          <Route path="/links" element={<LinksPage />} />

          {/* Legal pages */}
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms_and_conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/delete_account" element={<DeleteAccountPage />} />

          {/* Product and shop routes */}
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/shop/:username" element={<ShopPageWithUsername />} />
          <Route path="/:username" element={<ShopPageWithUsername />} />

          {/* Tawsila related routes */}
          <Route path="/tawsila" element={<Tawsila />} />
          <Route path="/get-started-with-Tawsila" element={<GetStarted />} />

          {/* Legacy redirects */}
          <Route
            path="/app/*"
            element={<Navigate to="/deeplink/*" replace />}
          />

          {/* Catch all route - must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

// ... (PropTypes and defaultProps remain unchanged) ...
CustomRouter.propTypes = {
  appConfig: PropTypes.shape({
    appScheme: PropTypes.string,
    appName: PropTypes.string,
    storeUrl: PropTypes.string,
    logoSrc: PropTypes.string,
  }),
  location: PropTypes.object,
};
CustomRouter.defaultProps = {
  appConfig: {
    appScheme: "hanuut://",
    appName: "Hanuut",
    storeUrl: "https://play.google.com/store/apps/details?id=com.hanuut.shop",
  },
};

export default CustomRouter;