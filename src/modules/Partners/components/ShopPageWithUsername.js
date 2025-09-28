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
import Shop from "./Shop";
import { useTranslation } from "react-i18next"; // 1. Import useTranslation

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  /* --- FIX: Justify center to correctly position the loader --- */
  justify-content: center; 
  background-image: url(${BackgroundImage});
  background-size: 100%;
  background-position: center;
  padding: 0rem 0;
  @media (max-width: 768px) {
    /* Allow flex-start on mobile if needed, but center is better for the loader */
    justify-content: flex-start;
    width: 100%;
    padding: 2rem 0; /* Add padding back for mobile content */
  }
`;

const MAX_RETRIES = 2; // Total number of automatic retries

const ShopPageWithUsername = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { loading, error } = useSelector(selectShops);
  const selectedShop = useSelector(selectShop);
  const selectedShopImage = useSelector(selectSelectedShopImage);
  
  const [domainKeyWord, setDomainKeyWord] = useState(null);
  // 3. Add state to track our retry attempts
  const [retryCount, setRetryCount] = useState(0);

  // Initial fetch effect
  useEffect(() => {
    dispatch(fetchShopWithUsername(username));
  }, [dispatch, username]);

  // --- 4. THE RETRY LOGIC ---
  useEffect(() => {
    // Condition: If there is an error, we are NOT currently loading, and we haven't exceeded our retries...
    if (error && !loading && retryCount < MAX_RETRIES) {
      // ...then wait 2 seconds and try again.
      const timer = setTimeout(() => {
        console.log(`Failed to fetch shop. Retrying attempt ${retryCount + 1}...`);
        setRetryCount(prev => prev + 1);
        if (username && username.startsWith('@')) {
      // 3. Extract the actual username by removing the '@'
      // 4. Dispatch the fetch action with the clean username
      dispatch(fetchShopWithUsername(username));
    }
      }, 2000); // 2-second delay

      // Cleanup function to clear the timer if the component unmounts
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

  // --- 5. ROBUST RENDERING LOGIC ---

  // Show loader if we are loading OR if we are in a retry cycle
  if (loading || (error && retryCount < MAX_RETRIES)) {
    const loaderMessage = retryCount > 0 
      ? `${t("shop_load_error_retrying")} (${retryCount}/${MAX_RETRIES})` 
      : null; // Use null for the default "Loading..." message

    return (
      <Section>
        <Loader message={loaderMessage} fullscreen={false} />
      </Section>
    );
  }

  // Show 404 page ONLY if there is an error AND we have exhausted all retries
  if (error && retryCount >= MAX_RETRIES) {
    return <NotFoundPage />;
  }

  // If data is ready and there's no error, show the page
  if (selectedShop && selectedShopImage && domainKeyWord) {
    return (
      <Section>
        {domainKeyWord === "food" ? (
          <MenuPage
            selectedShop={selectedShop}
            selectedShopImage={selectedShopImage}
          />
        ) : (
          <Shop
            selectedShop={selectedShop}
            selectedShopImage={selectedShopImage}
          />
        )}
      </Section>
    );
  }

  // This is a fallback loader for the very initial render before any other condition is met.
  return (
      <Section>
        <Loader fullscreen={false} />
      </Section>
    );
};

export default ShopPageWithUsername;