import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import OnboardingWizard from "../modules/Partners/components/Onboarding/OnboardingWizard";
import Loader from "./Loader";

// Direct imports for frequently accessed pages
import HomePage from "../modules/HomePage";
import NotFoundPage from "../modules/NotFoundPage";

const SupportPage = lazy(() => import("../modules/SupportPage"));
const PaymentReturnPage = lazy(() => import("../modules/payment/PaymentReturnPage"));
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
const EsuuqPage = lazy(() => import("../modules/Esuuq/EsuuqPage"));
const LinksPage = lazy(() => import("../modules/LinksPage"));
const MyHanuutGuide = lazy(() => import("../modules/MyHanuutGuide"));
const ProductPage = lazy(() => import("../modules/Product/ProductPage"));
const DeepLinkRedirect = lazy(() => import("./DeepLinkRedirect"));
const LocationDirectory = lazy(() => import("../modules/Marketplace/LocationDirectory"));
const PaymentResultPage = lazy(() =>
  import("../modules/payment/PaymentResultPage")
);
const PaymentProcessingPage = lazy(() =>
  import("../modules/payment/PaymentProcessingPage")
);

const RestaurantPage = lazy(() => import("../modules/Partners/RestaurantPage"));
const EpiceriePage = lazy(() => import("../modules/Partners/EpiceriePage"));
const BoutiquePage = lazy(() => import("../modules/Partners/BoutiquePage"));

const BlogListPage = lazy(() =>
  import("../modules/Blog/component/BlogListPage")
);
const BlogPostPage = lazy(() => import("../modules/Blog/BlogPostPage"));
const MarketplaceAdRedirectPage = lazy(() =>
  import("../modules/Marketplace/MarketplaceAdRedirectPage")
);

const TrackingPage = lazy(() => import("../modules/Partners/components/TrackingPage"));

const TawsilaLanding = lazy(() => import("../modules/Tawsila/TawsilaLanding"));
const DriverOnboarding = lazy(() => import("../modules/Tawsila/DriverOnboarding"));

const ShopRedirector = () => {
  const { username } = useParams();
  return <Navigate to={`/${username}`} replace />;
};

const CustomRouter = ({ appConfig, location }) => {
  const deepLinkRoutes = useMemo(() => {
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

    const routes = Object.entries(deepLinkPatterns).map(([path, config]) => (
      <Route
        key={`deeplink-${path}`}
        path={path}
        element={<RouteWithParams path={path} config={config} />}
      />
    ));

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
          <Route path="/esuuq" element={<EsuuqPage />} />
          <Route path="/explore/:domain/:wilaya" element={<LocationDirectory />} />
          <Route path="/payment/process" element={<PaymentProcessingPage />} />
          <Route path="/payment/result" element={<PaymentResultPage />} />
          <Route path="/payment/return" element={<PaymentReturnPage />} />

          {/* Content pages */}
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/myHanuut" element={<PartnersPage />} />
          <Route path="/my-hanuut-guide" element={<MyHanuutGuide />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/partners/onboarding" element={<OnboardingWizard />} />
          <Route path="/restaurant" element={<RestaurantPage />} />
          <Route path="/epicerie" element={<EpiceriePage />} />
          <Route path="/boutique" element={<BoutiquePage />} />
          <Route path="/abridh" element={<TawsilaLanding />} />
          <Route path="/abrid" element={<TawsilaLanding />} />
          <Route path="/abridh/drive" element={<DriverOnboarding />} />
          <Route path="/@abridh/drive" element={<DriverOnboarding />} />

          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/support" element={<SupportPage />} />
          <Route
            path="/terms_and_conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/delete_account" element={<DeleteAccountPage />} />

          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />

          <Route path="/shop/:username" element={<ShopRedirector />} />

          <Route path="/track" element={<TrackingPage />} />
          <Route path="/track/:phone/:orderId" element={<TrackingPage />} />

          {/* Legacy redirects */}
          <Route
            path="/app/*"
            element={<Navigate to="/deeplink/*" replace />}
          />
          <Route
            path="/:username/category/:categoryId"
            element={<ShopCategoryPage />}
          />
          
          {/* CANONICAL routes */}
          <Route path="/:username" element={<ShopPageWithUsername />} />
          <Route path="/:username/links" element={<ShopPageWithUsername />} />
          
          {/* 🔴 EXPLICIT Isolated SKU & Collection Landing Routes: Only trigger for aurasLab / @aurasLab */}
          <Route path="/aurasLab/collection/:DiscoveryGroup" element={<ShopPageWithUsername />} />
          <Route path="/@aurasLab/collection/:DiscoveryGroup" element={<ShopPageWithUsername />} />
          <Route path="/aurasLab/:ProductSku" element={<ShopPageWithUsername />} />
          <Route path="/@aurasLab/:ProductSku" element={<ShopPageWithUsername />} />

          {/* Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

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