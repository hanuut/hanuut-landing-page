import React from 'react';
import styled from 'styled-components';
import PremiumProductCard from './PremiumProductCard';
import Loader from '../../../../components/Loader';

const ShowcaseSection = styled.section`
    width: 100%;
    padding: 2rem 0; 
    border-bottom: 1px solid #27272a;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem; 
    font-weight: 700;
    color: white;
    font-family: 'Tajawal', sans-serif;
    margin: 0;

    span {
        color: ${props => props.theme.primaryColor || '#F07A48'};
    }
`;

const ProductsGrid = styled.div`
    display: grid;
    /* Desktop: 4-5 cards per row depending on screen width */
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    padding: 0 0.5rem;

    /* Mobile: Strictly 2 cards per row, smaller gap */
    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem; 
    }
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #71717a;
  padding: 4rem 0;
`;

const ProductShowcase = ({ 
    title, 
    products, 
    loading, 
    error, 
    onCardClick, 
    isOrderingEnabled // <--- Receive Prop
}) => {
    if (loading) return <Loader fullscreen={false} />;
    if (error) return <StatusMessage>Error loading products</StatusMessage>;
    if (!products || products.length === 0) return null;

    return (
        <ShowcaseSection>
            <Header>
                <SectionTitle>{title}</SectionTitle>
            </Header>
            
            <ProductsGrid>
                {products.map(product => (
                    <PremiumProductCard
                        key={product._id}
                        product={product}
                        onCardClick={onCardClick}
                        isOrderingEnabled={isOrderingEnabled} // <--- Pass Down
                    />
                ))}
            </ProductsGrid>
        </ShowcaseSection>
    );
};

export default ProductShowcase;