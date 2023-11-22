import React, { useEffect } from "react";
import styled from "styled-components";
import ShopCart from "./ShopCart";
import { useParams } from "react-router-dom";
import BackgroundImage from "../../../assets/background.png";
import CategoriesContainer from "../../Categories/components/CategoriesContainer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Playstore from "../../../assets/playstore.png";
import {
  fetchShopWithUsername,
  selectShop,
  selectShops,
} from "../state/reducers";
import {
  fetchShopImage,
  selectSelectedShopImage,
} from "../../Images/state/reducers";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import NotFoundPage from "../../NotFoundPage";
import ButtonWithIcon from "../../../components/ButtonWithIcon";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;
const ShopPageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  @media (max-width: 768px) {
  }
`;
const UpperBoxCover = styled.div`
  width: 100%;
  padding: 2rem 0rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(${BackgroundImage}) center/cover no-repeat;
  @media (max-width: 768px) {
    padding: 1rem 0rem;
  }
`;
const UpperBox = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 90%;
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
const Title = styled.p`
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const MenuTitle = styled.h1`
  margin-top: 1rem;
  font-size: 3rem;
  color: ${(props) => props.theme.orangeColor};
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontLargest};
  }
`;

const LowerBox = styled.div`
  width: 80%;
  display: flex;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const ShopPageWithUsername = () => {
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.shop";
  const { t, i18n } = useTranslation();
  const { username } = useParams();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(selectShops);
  const selectedShop = useSelector(selectShop);
  const selectedShopImage = useSelector(selectSelectedShopImage);

  useEffect(() => {
    dispatch(fetchShopWithUsername(username));
  }, [dispatch, username]);

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
      <ShopPageContainer isArabic={i18n.language === "ar"}>
        <UpperBoxCover>
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
              <Title>{t("toOrder")}</Title>
              <Link to={link}>
                <ButtonWithIcon
                  image={Playstore}
                  backgroundColor="#000000"
                  text1={t("getItOn")}
                  text2={t("googlePlay")}
                ></ButtonWithIcon>
              </Link>
            </OrderAndDownload>
          </UpperBox>
        </UpperBoxCover>
        <MenuTitle>{t("menuTitle")}</MenuTitle>
        <LowerBox>
          {selectedShop ? (
            <CategoriesContainer shopData={selectedShop} />
          ) : (
            <Loader />
          )}
        </LowerBox>
      </ShopPageContainer>
    </Section>
  );
};

export default ShopPageWithUsername;
