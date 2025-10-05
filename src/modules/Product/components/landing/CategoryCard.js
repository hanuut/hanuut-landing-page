// src/modules/Categories/components/landing/CategoryCard.js

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CardLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
    height: 100%;
`;

const CardWrapper = styled.div`
    background-color: #f5f5f7; /* Apple's light grey */
    border-radius: ${props => props.theme.defaultRadius};
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    transition: all 0.3s ease;

    &:hover {
        background-color: #e8e8ed;
        transform: translateY(-5px);
    }
`;

const CategoryName = styled.h3`
    font-weight: 600;
    font-size: ${props => props.theme.fontxl};
    color: ${props => props.theme.text};
    margin: 0;
`;

const ExploreText = styled.span`
    font-size: ${props => props.theme.fontmd};
    color: rgba(${props => props.theme.textRgba}, 0.6);
    font-weight: 500;
    margin-top: 1rem;
`;


const CategoryCard = ({ category, shopUsername }) => {
    const { i18n } = useTranslation();
    
    // Determine the category name based on the current language
    const categoryName = i18n.language === 'fr' && category.nameFr 
        ? category.nameFr 
        : i18n.language === 'en' && category.nameEn 
            ? category.nameEn 
            : category.name;

    return (
        // Note: The link destination will be implemented in a later step.
        // For now, we are setting up the structure.
        <CardLink to={`/${shopUsername}/category/${category.id}`}>
            <CardWrapper>
                <CategoryName>{categoryName}</CategoryName>
                <ExploreText>→</ExploreText>
            </CardWrapper>
        </CardLink>
    );
};

export default CategoryCard;