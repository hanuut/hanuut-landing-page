// src/modules/Product/components/landing/ProductShowcase.js

import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import Loader from '../../../../components/Loader';

const ShowcaseSection = styled.section`
    width: 100%;
    padding: 3rem 0;
    
    @media (max-width: 768px) {
        padding: 0;
    }
`;

const SectionTitle = styled.h2`
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => props.theme.text};
    margin-bottom: 2.5rem;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 2rem;
    }
`;

const ProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;

    /* This media query ensures a two-column layout on mobile */
    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
  padding: 2rem 0;
`;

const ProductShowcase = ({ title, products, loading, error, onCardClick ,shopIsOpen }) => {
    if (loading) {
        return <Loader fullscreen={false} />;
    }

    if (error) {
        return <StatusMessage>Error: {error}</StatusMessage>;
    }

    if (!products || products.length === 0) {
        // Don't render the section at all if there's nothing to show
        return null;
    }

    return (
        <ShowcaseSection>
            {/* <SectionTitle>{title}</SectionTitle> */}\
            <ProductsGrid>
                {products.map(product => {
                    return (
                        <ProductCard
                            key={product._id} // Added key for best practice
                            product={product}
                            onCardClick={onCardClick}
                            shopIsOpen={shopIsOpen}
                        />
                    );
                })}
            </ProductsGrid>
        </ShowcaseSection>
    );
};

export default ProductShowcase;