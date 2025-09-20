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

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-image: url(${BackgroundImage});
  background-size: 100%;
  background-position: center;
  padding: 0rem 0;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const ShopPageWithUsername = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(selectShops);
  const selectedShop = useSelector(selectShop);
  const selectedShopImage = useSelector(selectSelectedShopImage);
  const [domainKeyWord, setDomainKeyWord] = useState(null);

  useEffect(() => {
    dispatch(fetchShopWithUsername(username));
  }, [dispatch, username]);

  useEffect(() => {
    if (selectedShop?.domainId) { // Added optional chaining for safety
      setDomainKeyWord(selectedShop.domainId.keyword);
    }
  }, [dispatch, selectedShop]);

  useEffect(() => {
    if (selectedShop?.imageId) { // Added optional chaining for safety
      dispatch(fetchImage(selectedShop.imageId));
    }
  }, [dispatch, selectedShop]);

  // --- THIS IS THE CORRECTED LOGIC ---

  // 1. If we are currently loading, ALWAYS show the loader.
  // This takes priority over any potential initial error state.
  if (loading || !selectedShop || !selectedShopImage || !domainKeyWord) {
    // If there's an error AND we are not loading, then it's a real 404.
    if (error && !loading) {
      return <NotFoundPage />;
    }
    // Otherwise, it's just a normal loading state.
    return (
      <Section>
        <Loader />
      </Section>
    );
  }

  // 2. If we are NOT loading and there is still an error, it's a true 404.
  if (error) {
    return <NotFoundPage />;
  }
  
  // 3. If we have made it this far, the data is loaded and there is no error.
  return (
    <>
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
    </>
  );
};

export default ShopPageWithUsername;