import React, { useState } from "react";
import Product from "./Product";
import Loader from "../../../components/Loader";
import styled from "styled-components";
import { selectProducts } from "../state/reducers";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const Section = styled.div`
  margin-top: 1rem;
  width: 100%;
  overflow-y: scroll;
  max-height: ${(props) => (props.expanded ? "100%" : "0")};
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
const NoAvailableProducts = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight} - 11rem)`};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.p`
  font-size: 2.5rem;
  @media (max-width: 768px) {
    margin-top: 1rem;
    font-size: ${(props) => props.theme.fontxxl};
  }
`;
const ProductsContainer = ({ products, expanded, selectedCategory }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { t } = useTranslation();
  const { loading: productsLoading, error: productError } =
    useSelector(selectProducts);
  if (productsLoading) return <Loader />;
  if (productError) return <div>Error: {productError}</div>;
  return (
    <Section expanded={expanded}>
      {products.length > 0 ? (
        products.map((product) => {
          return product.isHidden !== true ? (
            <Product
              key={product.product._id}
              product={product.product}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              selectedCategory={selectedCategory}
            />
          ) : null;
        })
      ) : (
        <NoAvailableProducts>
          <Content>{t("noProductsAvailable")}</Content>
        </NoAvailableProducts>
      )}
    </Section>
  );
};

export default ProductsContainer;
