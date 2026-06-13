import React from "react";
import styled, { css } from "styled-components";
import PremiumProductCard from "./PremiumProductCard";
import Loader from "../../../../components/Loader";

const ShowcaseSection = styled.section`
  width: 100%;
  padding-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0.5rem;
  font-family: "Tajawal", sans-serif;
`;

// --- NEW HIGH-FIDELITY CSS COLUMNS MASONRY GRID ---
const ProductsGrid = styled.div`
  width: 100%;
  
  /* Dynamic Columns based on active details split panel */
  column-count: ${props => props.$hasActive ? 2 : 4};
  column-gap: 1.5rem;

  @media (max-width: 1200px) {
    column-count: ${props => props.$hasActive ? 2 : 3};
  }

  @media (max-width: 768px) {
    column-count: ${props => props.$hasActive ? 1 : 2};
    column-gap: 10px;
  }
`;

const CardContainer = styled.div`
  break-inside: avoid; /* Prevents cards from breaking across columns */
  margin-bottom: 1.5rem; /* Generous vertical spacing */
  
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const ProductShowcase = ({
  title,
  products,
  loading,
  error,
  onCardClick,
  onUpdateQuantity,
  isOrderingEnabled,
  cartItems = [],
  activeProductId = null,
  hasActive = false,
  imageOverrides = {}, // --- ADDED ---
}) => {
  if (loading) return <Loader fullscreen={false} />;
  if (error) return <p>Error loading products</p>;
  if (!products || products.length === 0) return null;

  return (
    <ShowcaseSection>
      {title && <SectionTitle>{title}</SectionTitle>}
      <ProductsGrid $hasActive={hasActive}>
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
            <CardContainer id={`product-card-${currentProdId}`} key={currentProdId}>
              <PremiumProductCard
                product={product}
                onCardClick={onCardClick}
                onUpdateQuantity={onUpdateQuantity}
                isOrderingEnabled={isOrderingEnabled}
                quantityInCart={totalQuantityInCart}
                cartItems={cartItems}
                $isActive={currentProdId === activeProductId}
                imageOverrideId={imageOverrides[currentProdId]} // --- PASSED DOWN ---
              />
            </CardContainer>
          );
        })}
      </ProductsGrid>
    </ShowcaseSection>
  );
};

export default ProductShowcase;