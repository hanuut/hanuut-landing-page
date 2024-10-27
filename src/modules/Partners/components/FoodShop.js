import React from "react";
import { ShopCart } from "./ShopCart";
import Loader from "../../../components/Loader";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ButtonWithIcon from "../../../components/ButtonWithIcon";
import Playstore from "../../../assets/playstore.webp";
import { useTranslation } from "react-i18next";
import CategoriesContainer from "../../Categories/components/CategoriesContainer";

const FoodContainer = styled.div`
  width: 80%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  // background: linear-gradient(
  //   90deg,
  //   hsla(147, 45%, 80%, 1) 0%,
  //   hsla(148, 46%, 92%, 1) 48%,
  //   hsla(0, 0%, 100%, 1) 100%
  // );

  // background: -moz-linear-gradient(
  //   90deg,
  //   hsla(147, 45%, 80%, 1) 0%,
  //   hsla(148, 46%, 92%, 1) 48%,
  //   hsla(0, 0%, 100%, 1) 100%
  // );

  // background: -webkit-linear-gradient(
  //   90deg,
  //   hsla(147, 45%, 80%, 1) 0%,
  //   hsla(148, 46%, 92%, 1) 48%,
  //   hsla(0, 0%, 100%, 1) 100%
  // );
  background-color: ${(props) => props.theme.body};
  border-radius: ${(props) => props.theme.defaultRadius};
  // box-shadow: 0 5px 5px rgba(${(props) =>
    props.theme.primaryColorRgba}, 0.2);
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
const Title = styled.p`
  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};
  }
`;

const MenuTitle = styled.h1`
  font-size: 3rem;
  color: ${(props) => props.theme.orangeColor};
  @media (max-width: 768px) {
    margin-top: 1rem;
    font-size: ${(props) => props.theme.fontxxxl};
  }
`;

const LowerBox = styled.div`
  width: 100%;
  display: flex;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FoodShop = ({ selectedShop, selectedShopImage }) => {
  const { t, i18n } = useTranslation();
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.shop";

  return (
    <FoodContainer isArabic={i18n.language === "ar"}>
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
      <MenuTitle>{t("menuTitle")}</MenuTitle>
      <LowerBox>
        {selectedShop ? (
          <CategoriesContainer shopData={selectedShop} />
        ) : (
          <Loader />
        )}
      </LowerBox>
    </FoodContainer>
  );
};

export default FoodShop;
