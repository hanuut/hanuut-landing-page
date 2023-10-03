import React, { useEffect} from "react";
import styled from "styled-components";
import ShopCart from "./ShopCart";
import { useParams} from "react-router-dom";
import BackgroundImage from "../../../assets/background.png";
import CategoriesContainer from "../../Categories/components/CategoriesContainer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Playstore from "../../../assets/playstore.png";
import { fetchShopWithUsername, selectShop, selectShops } from "../state/reducers";
import {
  fetchShopImage,
  selectSelectedShopImage,
} from "../../Images/state/reducers";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import NotFoundPage from "../../NotFoundPage";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: 768px) {
    justify-content: flex-start;
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
  padding: 1.5rem 0rem;
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
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 96%;
    flex-direction: column;
  }
`;

const OrderAndDownload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0rem 0.5rem;
    margin-top: 0.7rem;
  }
`;
const Title = styled.h3`
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;
const Button = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: ${(props) => props.theme.downloadButtonColor};
  color: #fff;
  border: none;
  border-radius: ${(props) => props.theme.defaultRadius};
  padding: ${(props) => props.theme.actionButtonPadding};
  font-size: ${(props) => props.theme.fontxl};
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover {
    transform: scale(1.03);
  }
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
    padding: ${(props) => props.theme.actionButtonPaddingMobile};
  }
`;
const PlayIcon = styled.img`
  height: 1.5rem;
  object-fit: cover;
  -webkit-transform: ${(props) => (props.isArabic ? "scaleX(-1)" : "")};
  transform: ${(props) => (props.isArabic ? "scaleX(-1)" : "")};
  @media (max-width: 768px) {
    height: 0.8rem;
  }
`;
const LowerBox = styled.div`
  width: 80%;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
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

 
if(error){
    return <NotFoundPage />
}
  if (!selectedShop || !selectedShopImage || loading) {
    return <Loader />;
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
                <Button>
                  {t("homeInputButton")}{" "}
                  <PlayIcon src={Playstore} isArabic={i18n.language === "ar"} />
                </Button>
              </Link>
            </OrderAndDownload>
          </UpperBox>
        </UpperBoxCover>
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
