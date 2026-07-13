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
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0.5rem;
  font-family: "Tajawal", sans-serif;
`;

// --- GRID SHIFTS LAYOUT SYSTEM IN-FLIGHT ---
const ProductsGrid = styled.div`
  width: 100%;
  
  ${props => props.$layoutType === 'list' ? `
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  ` : `
    column-count: ${props.$hasActive ? 2 : 4};
    column-gap: 1.5rem;

    @media (max-width: 1200px) {
      column-count: ${props.$hasActive ? 2 : 3};
    }

    @media (max-width: 768px) {
      column-count: ${props.$hasActive ? 1 : 2};
      column-gap: 10px;
    }
  `}
`;

const CardContainer = styled.div`
  ${props => props.$layoutType === 'list' ? `
    width: 100%;
  ` : `
    break-inside: avoid; 
    margin-bottom: 1.5rem; 
    
    @media (max-width: 768px) {
      margin-bottom: 10px;
    }
  `}
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
  isPodShop = false,
  layoutType = 'grid' // --- VALUE: 'grid' or 'list'
}) => {
  if (loading) return <Loader fullscreen={false} />;
  if (error) return <p>Error loading products</p>;
  if (!products || products.length === 0) return null;

  return (
    <ShowcaseSection>
      {title && <SectionTitle>{title}</SectionTitle>}
      <ProductsGrid $hasActive={hasActive} $layoutType={layoutType}>
        {products.map((product, index) => {
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
            <CardContainer id={`product-card-${currentProdId}`} key={currentProdId} $layoutType={layoutType}>
              <PremiumProductCard
                product={product}
                index={index} 
                onCardClick={onCardClick}
                onUpdateQuantity={onUpdateQuantity}
                isOrderingEnabled={isOrderingEnabled}
                quantityInCart={totalQuantityInCart}
                cartItems={cartItems}
                $isActive={currentProdId === activeProductId}
                isPodShop={isPodShop} 
                layoutType={layoutType} // <--- PASS DOWN FOR DUAL LAYOUT
              />
            </CardContainer>
          );
        })}
      </ProductsGrid>
    </ShowcaseSection>
  );
};

export default ProductShowcase;