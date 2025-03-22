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

// Optional imports - uncomment if needed
// const ContactPage = lazy(() => import("../modules/ContactPage"));
// const SolutionsPage = lazy(() => import("../modules/SolutionsPage"));
// const ShopPage = lazy(() => import("../modules/Partners/components/ShopPage"));
// const PaymentPage = lazy(() => import("../modules/payment/PaymentPage"));
// const SatimTestPage = lazy(() => import("../modules/payment/SatimTestPage"));

/**
 * CustomRouter component
 *
 * Provides centralized routing configuration for the Hanuut application
 * with optimized performance through code splitting, route grouping,
 * and animated transitions between routes.
 *
 * @param {Object} props - Component props
 * @param {Object} props.appConfig - Application configuration containing deep link settings
 * @param {Object} props.location - Current location object (from useLocation())
 */
const CustomRouter = ({ appConfig, location }) => {
  // Configure deep link routes based on app configuration
  const deepLinkRoutes = useMemo(() => {
    const deepLinkConfig = {
      appScheme: appConfig?.appScheme || "hanuut://",
      appName: appConfig?.appName || "Hanuut",
      storeUrl:
        appConfig?.storeUrl ||
        "https://play.google.com/store/apps/details?id=com.hanuut.shop",
      logoSrc: appConfig?.logoSrc,
    };

    // Create a map of path patterns to their transform functions
    const deepLinkPatterns = {
      "/deeplink": { path: () => "" },
      "/deeplink/product/:id": {
        path: (params) => `product/${params.id}`,
      },
      "/deeplink/shop/:username": {
        path: (params) => `shop/${params.username}`,
      },
      "/deeplink/category/:id": {
        path: (params) => `category/${params.id}`,
      },
      "/deeplink/search": {
        path: () => "search",
      },
      "/deeplink/cart": {
        path: () => "cart",
      },
      "/deeplink/profile": {
        path: () => "profile",
      },
    };

    // Generate deep link routes from the patterns
    return Object.entries(deepLinkPatterns).map(([path, config]) => (
      <Route
        key={`deeplink-${path}`}
        path={path}
        element={
          <DeepLinkRedirect
            {...deepLinkConfig}
            transformPath={(normalizedPath) => {
              // Extract route params if present
              const pathParts = normalizedPath.split("/");
              const params = {};

              // Create params object by matching route pattern segments
              path.split("/").forEach((segment, index) => {
                if (segment.startsWith(":")) {
                  const paramName = segment.substring(1);
                  params[paramName] = pathParts[index];
                }
              });

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
          {/* Main routes */}
          <Route path="/" element={<HomePage />} />

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
          <Route path="/:username" element={<ShopPageWithUsername />} />
          <Route path="/shop/:username" element={<ShopPageWithUsername />} />

          {/* Tawsila related routes */}
          <Route path="/tawsila" element={<Tawsila />} />
          <Route path="/get-started-with-Tawsila" element={<GetStarted />} />

          {/* Deep link routes - generated dynamically */}
          {deepLinkRoutes}

          {/* Legacy redirects */}
          <Route
            path="/app/*"
            element={<Navigate to="/deeplink/*" replace />}
          />

          {/* Disabled/commented routes - uncomment if needed */}
          {/* <Route path="/solutions" element={<SolutionsPage />} /> */}
          {/* <Route path="/contact" element={<ContactPage />} /> */}
          {/* <Route path="/shop/:shopName" element={<ShopPage/>} /> */}
          {/* <Route path="/confirmPayment" element={<PaymentPage />} /> */}
          {/* <Route path="/testPayment" element={<SatimTestPage />} /> */}

          {/* Catch all route - must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

CustomRouter.propTypes = {
  /** Application configuration containing deep link settings */
  appConfig: PropTypes.shape({
    appScheme: PropTypes.string,
    appName: PropTypes.string,
    storeUrl: PropTypes.string,
    logoSrc: PropTypes.string,
  }),

  /** Current location object (from useLocation()) */
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
