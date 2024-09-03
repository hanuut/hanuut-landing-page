import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShops, selectShops } from "../state/reducers";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ShopCart from "./ShopCart";
import {
  fetchShopsImages,
  selectShopsImages,
} from "../../Images/state/reducers";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader";

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    width: 90%;
  }
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
  .shopLinkWrapper {
    width: 30%;
  }
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;
const Title = styled.h2`
  align-self: start;
  font-size: ${(props) => props.theme.fontLargest};
  font-weight: bold;
  color: ${(props) => props.theme.primaryColor};
  @media (max-width: 768px) {
    margin-top: 2rem;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;
const ShopsContainer = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { shops, loading, error } = useSelector(selectShops);
  const { images, imagesLoading } = useSelector(selectShopsImages);
  const [shopsWithImages, setShopsWithImages] = useState([]);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchShopsImages(shops));
  }, [dispatch, shops]);

  useEffect(() => {
    const shopsWithImagesInstance = [];
    shops.forEach((shop) => {
      const image = images.find((img) => img.shopId === shop.id);
      if (image) {
        const shopWithImageInstance = {
          shopData: shop,
          shopImage: image,
        };
        shopsWithImagesInstance.push(shopWithImageInstance);
      }
    });
    setShopsWithImages(shopsWithImagesInstance);
  }, [images, shops]);
  if (error) {
    return <h5>{error}</h5>;
  }

  return (
    <Section isArabic={i18n.language === "ar"}>
      {loading || imagesLoading ? (
        <Loader />
      ) : shops.length <= 0 ? (
        <></> // Render the component to inform that there are no valid shops yet
      ) : (
        <>
          <Title>{t("ourPartners")}</Title>
          <Container>
            {shopsWithImages.map((shop) =>
              shop.shopData.domainId === "6357da1c6c62b4f58636879a" ? (
                <Link
                  to={`/shop/${shop.shopData.username}`}
                  state={{
                    shopData: shop.shopData,
                    shopImage: shop.shopImage.image,
                  }}
                  key={shop.shopData.id}
                  className="shopLinkWrapper"
                >
                  <ShopCart
                    key={shop.shopData.id}
                    shop={shop.shopData}
                    imageData={shop.shopImage.image}
                  />
                </Link>
              ) : (
                <></>
              )
            )}
          </Container>
        </>
      )}
    </Section>
  );
};
export default ShopsContainer;
