import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import OnboardingWizard from "../modules/Partners/components/Onboarding/OnboardingWizard";
// Import Loader component for Suspense fallback
import Loader from "./Loader";

// Direct imports for frequently accessed pages
import HomePage from "../modules/HomePage";
import NotFoundPage from "../modules/NotFoundPage";

const PaymentReturnPage = lazy(() => import("../modules/payment/PaymentReturnPage"));
// Lazy-loaded page components for better performance
const PrivacyPolicy = lazy(() => import("../modules/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("../modules/TermsAndConditions"));
const PartnersPage = lazy(() => import("../modules/Partners/PartnersPage"));
const DeleteAccountPage = lazy(() => import("../modules/DeleteAccountPage"));
const ShopPageWithUsername = lazy(() =>
  import("../modules/Partners/components/ShopPageWithUsername")
);
const ShopCategoryPage = lazy(() =>
  import("../modules/Product/components/landing/ShopCategoryPage")
);

const Tawsila = lazy(() => import("../modules/Tawsila/Tawsila"));
const GetStarted = lazy(() => import("../modules/Tawsila/GetStarted"));
const LinksPage = lazy(() => import("../modules/LinksPage"));
const MyHanuutGuide = lazy(() => import("../modules/MyHanuutGuide"));
const ProductPage = lazy(() => import("../modules/Product/ProductPage"));
const DeepLinkRedirect = lazy(() => import("./DeepLinkRedirect"));

const PaymentResultPage = lazy(() =>
  import("../modules/payment/PaymentResultPage")
);
const PaymentProcessingPage = lazy(() =>
  import("../modules/payment/PaymentProcessingPage")
);

const BlogListPage = lazy(() =>
  import("../modules/Blog/component/BlogListPage")
);
const BlogPostPage = lazy(() => import("../modules/Blog/BlogPostPage"));
const MarketplaceAdRedirectPage = lazy(() =>
  import("../modules/Marketplace/MarketplaceAdRedirectPage")
);

const ShopRedirector = () => {
  const { username } = useParams();
  // Permanently redirect to the clean URL
  return <Navigate to={`/${username}`} replace />;
};

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
      "/deeplink/shop/:username": {
        path: (params) => `shop/${params.username}`,
      },
      "/deeplink/category/:id": { path: (params) => `category/${params.id}` },
      "/deeplink/search": { path: () => "search" },
      "/deeplink/cart": { path: () => "cart" },
    };

    const RouteWithParams = ({ path, config }) => {
      const params = useParams();
      return (
        <DeepLinkRedirect {...deepLinkConfig} finalPath={config.path(params)} />
      );
    };

    // Map standard routes
    const routes = Object.entries(deepLinkPatterns).map(([path, config]) => (
      <Route
        key={`deeplink-${path}`}
        path={path}
        element={<RouteWithParams path={path} config={config} />}
      />
    ));

    // 3. Push the SPECIAL route for Marketplace Ads
    // This route uses the dedicated component we created to fetch data before redirecting
    routes.push(
      <Route
        key="deeplink-ad-special"
        path="/deeplink/ad/:adId"
        element={<MarketplaceAdRedirectPage appConfig={appConfig} />}
      />
    );

    return routes;
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
          
          {/* 2. Add the Return Route here */}
          <Route path="/payment/return" element={<PaymentReturnPage />} />

          {/* Content pages */}
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/my-hanuut-guide" element={<MyHanuutGuide />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/partners/onboarding" element={<OnboardingWizard />} />
         
          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route
            path="/terms_and_conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/delete_account" element={<DeleteAccountPage />} />

          <Route path="/blog" element={<BlogListPage />} />

          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />

          {/* Product and shop routes */}
          <Route path="/product/:productId" element={<ProductPage />} />

          {/* 3. The redirect route. This will catch /shop/some-name... */}
          <Route path="/shop/:username" element={<ShopRedirector />} />

          {/* Tawsila related routes
          <Route path="/tawsila" element={<Tawsila />} />
          <Route path="/get-started-with-Tawsila" element={<GetStarted />} /> */}

          {/* Legacy redirects */}
          <Route
            path="/app/*"
            element={<Navigate to="/deeplink/*" replace />}
          />
          <Route
            path="/:username/category/:categoryId"
            element={<ShopCategoryPage />}
          />
          {/* 4. The CANONICAL shop route. THIS MUST BE NEAR THE END. */}
          {/* This path is now more specific, starting with /@ */}
          <Route path="/:username" element={<ShopPageWithUsername />} />
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
