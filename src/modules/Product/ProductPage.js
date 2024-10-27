import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectSelectedProduct } from "./state/reducers";
import { fetchProductById } from "./state/reducers";
import styled from "styled-components";
import {
  fetchShop,
  fetchShopWithUsername,
  selectShop,
  selectShops,
} from "../Partners/state/reducers";
import {
  fetchShopImage,
  selectSelectedShopImage,
} from "../Images/state/reducers";
import NotFoundPage from "../NotFoundPage";
import Loader from "../../components/Loader";
import { ShopCart } from "../Partners/components/ShopCart";
import { useTranslation } from "react-i18next";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import Playstore from "../../assets/playstore.webp";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-size: 100%;
  gap: 2rem;
  background-position: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;
const Container = styled.div`
  width: 80%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
    padding: ${(props) => props.theme.smallPadding};
    width: 85%;
  }
`;
const UpperBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
`;
const OrderAndDownload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-top: 1rem;
    align-items: flex-start;
  }
`;

const Card = styled.div`
  width: 30%;
  border: 1px solid rgba(${(props) => props.theme.textRgba}, 0.1);
  border-radius: ${(props) => props.theme.smallRadius};
  padding: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Name = styled.h4`
  font-family: "Tajawal", sans-serif;
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
`;

const Brand = styled.span`
  font-family: "Tajawal", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.secondaryText};
`;

const Desc = styled.p`
  max-width: 75%;
  font-family: "Tajawal", sans-serif;
  font-size: 0.9rem;
  font-weight: 300;
  color: ${(props) => props.theme.text};
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  font-weight: bold;
  color: ${(props) => props.theme.primary};
`;

const Price = styled.h4`
  font-size: 1.4rem;
`;

const ProductDetailsContainer = styled.div`
  position: absolute;
  left: 0;
  top: 6rem;
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};

  @media (max-width: 768px) {
    padding: ${(props) => props.theme.smallPadding};
    width: 95%;
    height: auto;
  }
`;

const ProductPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const selectedProduct = useSelector(selectSelectedProduct);
  const selectedShop = useSelector(selectShop);
  const { loading, error } = useSelector(selectShops);
  const selectedShopImage = useSelector(selectSelectedShopImage);
  const { t, i18n } = useTranslation();
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.shop";

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [productId]);

  useEffect(() => {
    if (selectedProduct) dispatch(fetchShop(selectedProduct.shopId));
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedShop && selectedShop.imageId) {
      dispatch(fetchShopImage(selectedShop.imageId));
    }
  }, [dispatch, selectedShop]);

  if (error) {
    return <NotFoundPage />;
  }
  if (!selectedShop || !selectedShopImage || loading) {
    return (
      <Section>
        <Loader />
      </Section>
    );
  }
  return (
    <Section>
      <Container>
        {" "}
        <UpperBox>
          {selectedShop && selectedShopImage ? (
            <ShopCart
              className="headingShopCart"
              key={selectedShop.id}
              shop={selectedShop}
              imageData={selectedShopImage}
            />
          ) : (
            <Loader />
          )}
          <OrderAndDownload>
            <p>{t("toOrder")}</p>
            <Link href={link}>
              <ButtonWithIcon
                image={Playstore}
                backgroundColor="#000000"
                text1={t("getItOn")}
                text2={t("googlePlay")}
              />
            </Link>
          </OrderAndDownload>
        </UpperBox>
      </Container>
    </Section>
  );
};

export default ProductPage;
