// src/modules/Categories/components/landing/CategoryShowcase.js

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories } from '../../../Categories/state/reducers';
import CategoryCard from './CategoryCard';
import Loader from '../../../../components/Loader';
import { useTranslation } from 'react-i18next';

const ShowcaseSection = styled.section`
    width: 100%;
    padding: 3rem 0;
    background-color: ${props => props.theme.surface};
    border-radius: ${props => props.theme.defaultRadius};
    margin-top: 2rem;

    @media (max-width: 768px) {
        padding: 2rem 1.5rem;
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

const CategoriesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: ${(props) => props.theme.fontlg};
  color: rgba(${(props) => props.theme.textRgba}, 0.7);
  padding: 2rem 0;
`;

const CategoryShowcase = ({ shop , onCardClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(selectCategories);

    useEffect(() => {
        // Fetch categories only if the shop object and its categories array exist
        if (shop && shop.categories && shop.categories.length > 0) {
            dispatch(fetchCategories(shop.categories));
        }
    }, [dispatch, shop]);

    if (!shop || !shop.categories || shop.categories.length === 0) {
        // Don't render if the shop has no categories assigned
        return null;
    }

    if (loading) {
        return <Loader fullscreen={false} />;
    }

    if (error) {
        return <StatusMessage>Error: {error}</StatusMessage>;
    }

    return (
        <ShowcaseSection>
            <SectionTitle>{t('shop_by_category_title', 'Shop by Category')}</SectionTitle>
            <CategoriesGrid>
                {categories.map(category => (
                    <CategoryCard 
                        key={category.id} 
                        category={category} 
                        shopUsername={shop.username} 
                    />
                ))}
            </CategoriesGrid>
        </ShowcaseSection>
    );
};

export default CategoryShowcase;