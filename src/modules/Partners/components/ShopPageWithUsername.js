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
import FoodShop from "./FoodShop";
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
  padding: 2rem 0;
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
    if (selectedShop.domainId) {
      setDomainKeyWord(selectedShop.domainId.keyword);
    }
  }, [dispatch, selectedShop]);

  useEffect(() => {
    if (selectedShop && selectedShop.imageId) {
      dispatch(fetchImage(selectedShop.imageId));
    }
  }, [dispatch, selectedShop]);

  if (error) {
    return <NotFoundPage />;
  }
  if (!selectedShop || !selectedShopImage || loading || !domainKeyWord) {
    return (
      <Section>
        <Loader />
      </Section>
    );
  }

  return (
    <>
      {" "}
      <Section>
        {domainKeyWord === "food" ? (
          <FoodShop
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
