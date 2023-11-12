import React from "react";
import styled from "styled-components";
import ShopCart from "./ShopCart";
import { useLocation } from "react-router-dom";
import BackgroundImage from "../../../assets/background.png";
import CategoriesContainer from "../../Categories/components/CategoriesContainer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Playstore from "../../../assets/playstore.png";
import ButtonWithIcon from "../../../components/ButtonWithIcon";

const Section = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight})`};
  background-color: ${(props) => props.theme.body};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

const ShopPage = () => {
  const link = "https://play.google.com/store/apps/details?id=com.hanuut.shop";
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { shopData, shopImage } = location.state;

  return (
    <Section>
      <ShopPageContainer isArabic={i18n.language === "ar"}>
        <UpperBoxCover>
          <UpperBox>
            <ShopCart
              className="headingShopCart"
              key={shopData.id}
              shop={shopData}
              imageData={shopImage}
            />
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
        <LowerBox>
          <CategoriesContainer shopData={shopData} />
        </LowerBox>
      </ShopPageContainer>
    </Section>
  );
};

export default ShopPage;
