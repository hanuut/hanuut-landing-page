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

// --- DYNAMIC ADAPTIVE GRID ---
const ProductsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  /* Standard Grid: No selected item */
  ${props => !props.$hasActive ? css`
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  ` : css`
    /* Adaptive Grid: Split screen active (Strictly 2 columns) */
    grid-template-columns: repeat(2, 1fr);
  `}

  @media (max-width: 768px) {
    /* Mobile/Tablet: 1 Column if selected, 2 Columns if standard */
    grid-template-columns: ${props => props.$hasActive ? "1fr" : "repeat(2, 1fr)"};
    gap: 10px;
  }
`;

const ProductShowcase = ({
  title,
  products,
  loading,
  error,
  onCardClick,
  onUpdateQuantity, // --- ADDED ---
  isOrderingEnabled,
  cartItems = [],
  activeProductId = null,
  hasActive = false,
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
            <div id={`product-card-${currentProdId}`} key={currentProdId}>
              <PremiumProductCard
                product={product}
                onCardClick={onCardClick}
                onUpdateQuantity={onUpdateQuantity} // --- PASSED DOWN ---
                isOrderingEnabled={isOrderingEnabled}
                quantityInCart={totalQuantityInCart}
                $isActive={currentProdId === activeProductId}
              />
            </div>
          );
        })}
      </ProductsGrid>
    </ShowcaseSection>
  );
};

export default ProductShowcase;