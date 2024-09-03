import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { light } from "../../../config/Themes";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Cart/state/reducers";
import { selectShop } from "../../Partners/state/reducers";
import ProductDetails from "./ProductDetails";

const Card = styled.div`
  width: 30%;
  border: 1px solid rgba(${(props) => props.theme.textRgba}, 0.1);
  border-radius: ${(props) => props.theme.smallRadius};
  padding: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 97%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  top: 3rem;
  border-radius: ${(props) => props.theme.defaultRadius};
  box-shadow: 0 5px 5px rgba(${(props) => props.theme.primaryColorRgba}, 0.2);
  direction: ${(props) => (props.isArabic ? "rtl" : "ltr")};
  background-color: ${(props) => props.theme.body};
  @media (max-width: 768px) {
    padding: ${(props) => props.theme.smallPadding};
    width: 95%;
    height: 90%;
  }
`;
const Product = ({
  product,
  selectedProduct,
  setSelectedProduct,
  selectedCategory,
}) => {
  console.log("product is ", product.id);
  const selectedShop = useSelector(selectShop);
  const { i18n } = useTranslation();
  const { name, sellingPrice } = product;

  const onProductClick = () => {
    console.log(selectedProduct);
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };

  return (
    <>
      <Card
        isArabic={i18n.language === "ar"}
        key={product.id}
        onClick={onProductClick}
      >
        <Body>
          <ContentRow>
            <Name>
              {name} - <Brand>{product.brand}</Brand>
            </Name>
          </ContentRow>
          <ContentRow>
            {selectedShop.domainId.keyword === "global" ? (
              <Desc>{product.shortDescription}</Desc>
            ) : (
              <Desc>{product.description}</Desc>
            )}
            <PriceContainer>
              <Price>
                {sellingPrice} {t("dzd")}
              </Price>
            </PriceContainer>
          </ContentRow>
        </Body>
      </Card>
      {selectedProduct?.id === product.id && (
        <ProductDetailsContainer>
          <ProductDetails
            selectedCategory={selectedCategory}
            selectedProduct={product}
            setSelectedProduct={setSelectedProduct}
          />
        </ProductDetailsContainer>
      )}
    </>
  );
};

export default Product;
