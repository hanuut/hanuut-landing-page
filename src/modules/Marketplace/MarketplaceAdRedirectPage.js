import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { fetchAdById, selectMarketplace } from "./state/reducers";
import DeepLinkRedirect from "../../components/DeepLinkRedirect";
import Loader from "../../components/Loader";

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
`;

const MarketplaceAdRedirectPage = ({ appConfig }) => {
  const { adId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Select state from the new marketplace slice
  const { selectedAd, loading, error } = useSelector(selectMarketplace);

  // 1. Fetch Ad Data on mount
  useEffect(() => {
    if (adId) {
      dispatch(fetchAdById(adId));
    }
  }, [dispatch, adId]);

  // 2. Extract price helper (Based on your GlobalProduct Schema structure for C2C)
  const getPrice = (ad) => {
    if (ad?.availabilities?.[0]?.sizes?.[0]?.sellingPrice) {
      return ad.availabilities[0].sizes[0].sellingPrice;
    }
    return null;
  };

  // 3. Image URL Helper
  // Note: Your API serves images at /image/:id. 
  // Social bots need a clean URL, not a base64 string.
  const getImageUrl = (ad) => {
    if (ad?.images && ad.images.length > 0) {
      return `${process.env.REACT_APP_API_PROD_URL}/image/${ad.images[0]}`;
    }
    return appConfig?.logoSrc || ""; // Fallback to app logo
  };

  const metaData = useMemo(() => {
    if (!selectedAd) return null;

    return {
      title: selectedAd.name || "Hanuut Marketplace",
      description: selectedAd.shortDescription || "Check out this ad on Hanuut.",
      image: getImageUrl(selectedAd),
      price: getPrice(selectedAd),
      url: window.location.href,
    };
  }, [selectedAd, appConfig]);

  // 4. Define Deep Link Configuration
  const deepLinkProps = {
    appScheme: appConfig?.appScheme || "hanuut://",
    appName: appConfig?.appName || "Hanuut",
    storeUrl: appConfig?.storeUrl || "https://play.google.com/store/apps/details?id=com.hanuut.shop",
    logoSrc: appConfig?.logoSrc,
    // This creates the path: hanuut://ad/{adId}
    finalPath: `ad/${adId}`, 
  };

  if (loading) {
    return (
      <PageContainer>
        <Loader message={t("loading.message", "Loading...")} />
      </PageContainer>
    );
  }

  return (
    <>
      {/* Inject Metadata for Social Media Crawlers */}
      <Helmet>
        {metaData ? (
          <>
            <title>{metaData.title}</title>
            <meta name="description" content={metaData.description} />

            {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
            <meta property="og:type" content="product" />
            <meta property="og:url" content={metaData.url} />
            <meta property="og:title" content={metaData.title} />
            <meta property="og:description" content={metaData.description} />
            <meta property="og:image" content={metaData.image} />
            <meta property="og:site_name" content="Hanuut Marketplace" />

            {/* Pricing (Optional but good for products) */}
            {metaData.price && (
              <meta property="product:price:amount" content={metaData.price} />
            )}
            {metaData.price && (
              <meta property="product:price:currency" content="DZD" />
            )}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaData.title} />
            <meta name="twitter:description" content={metaData.description} />
            <meta name="twitter:image" content={metaData.image} />
          </>
        ) : (
          <title>Hanuut Marketplace</title>
        )}
      </Helmet>

      {/* Trigger the redirect logic */}
      <DeepLinkRedirect {...deepLinkProps} />
    </>
  );
};

export default MarketplaceAdRedirectPage;