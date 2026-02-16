import React from "react";
import styled from "styled-components";
import PremiumProductCard from "./PremiumProductCard";
import Loader from "../../../../components/Loader";

const ShowcaseSection = styled.section`
  width: 100%;
  padding-bottom: 2rem;
`;
const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(props) => props.theme.text};
  margin: 0 0 1rem 0.5rem;
  font-family: "Tajawal", sans-serif;
`;
const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const ProductShowcase = ({
  title,
  products,
  loading,
  error,
  onCardClick,
  isOrderingEnabled,
  cartItems = [],
}) => {
  if (loading) return <Loader fullscreen={false} />;
  if (error) return <p>Error loading products</p>;
  if (!products || products.length === 0) return null;
    console.log(cartItems, "Cart items in Showcase"); // Debugging log
  return (
    <ShowcaseSection>
      {title && <SectionTitle>{title}</SectionTitle>}
      <ProductsGrid>
        {products.map((product) => {
           const currentProdId = (product._id || product.id)?.toString();

          const totalQuantityInCart = cartItems
            .filter((item) => {
              const cartProdId = (
                item.productId ||
                item.product?._id ||
                item.product?.id
              )?.toString();
              return cartProdId === currentProdId;
            })
            .reduce((acc, item) => acc + item.quantity, 0);

          return (
            <PremiumProductCard
              key={currentProdId}
              product={product}
              onCardClick={onCardClick}
              isOrderingEnabled={isOrderingEnabled}
              quantityInCart={totalQuantityInCart}
            />
          );
        })}
      </ProductsGrid>
    </ShowcaseSection>
  );
};

export default ProductShowcase;
