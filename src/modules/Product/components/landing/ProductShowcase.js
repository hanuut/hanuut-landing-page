import React from 'react';
import styled from 'styled-components';
import PremiumProductCard from './PremiumProductCard';
import Loader from '../../../../components/Loader';

const ShowcaseSection = styled.section`
    width: 100%;
    /* Removed padding to let cards sit tighter */
    padding-bottom: 2rem; 
`;

const SectionTitle = styled.h2`
    font-size: 1.2rem; 
    font-weight: 700;
    color: ${props => props.theme.text};
    margin: 0 0 1rem 0.5rem;
    font-family: 'Tajawal', sans-serif;
`;

const ProductsGrid = styled.div`
    display: grid;
    /* Desktop: Auto-fill */
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
    
    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
        /* Force 2 columns on mobile */
        grid-template-columns: repeat(2, 1fr);
        /* Tight gap to fit content */
        gap: 10px; 
    }
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #8E8E93;
  padding: 4rem 0;
`;

const ProductShowcase = ({ 
    title, 
    products, 
    loading, 
    error, 
    onCardClick, 
    isOrderingEnabled 
}) => {
    if (loading) return <Loader fullscreen={false} />;
    if (error) return <StatusMessage>Error loading products</StatusMessage>;
    if (!products || products.length === 0) return null;

    return (
        <ShowcaseSection>
            {title && <SectionTitle>{title}</SectionTitle>}
            
            <ProductsGrid>
                {products.map(product => (
                    <PremiumProductCard
                        key={product._id}
                        product={product}
                        onCardClick={onCardClick}
                        isOrderingEnabled={isOrderingEnabled}
                    />
                ))}
            </ProductsGrid>
        </ShowcaseSection>
    );
};

export default ProductShowcase;