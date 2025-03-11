import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { selectShop } from "../../Partners/state/reducers";
import ProductDetails from "./ProductDetails";
import { useNavigate } from "react-router-dom";
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

const Product = ({
  product,
  selectedProduct,
  setSelectedProduct,
  selectedCategory,
}) => {
  const selectedShop = useSelector(selectShop);
  const { i18n } = useTranslation();
  const { name, sellingPrice, brand, shortDescription, description } = product;

  const navigate = useNavigate();
  const onProductClick = () => {
    if (selectedShop.domainId.keyword === "global") {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Card
      isArabic={i18n.language === "ar"}
      key={product.id}
      onClick={onProductClick}
      aria-label={`View details for ${name}`}
    >
      <Body>
        <ContentRow>
          <Name>
            {name} - <Brand>{brand}</Brand>
          </Name>
        </ContentRow>
        <ContentRow>
          <Desc>
            {selectedShop.domainId.keyword === "global"
              ? shortDescription
              : description}
          </Desc>
          <PriceContainer>
            <Price>
              {sellingPrice} {t("dzd")}
            </Price>
          </PriceContainer>
        </ContentRow>
      </Body>
    </Card>
  );
};

export default Product;
