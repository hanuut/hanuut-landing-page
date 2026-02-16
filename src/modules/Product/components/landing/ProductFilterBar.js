import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: 1rem; 
    margin-top: 0.5rem;
    display: flex;   flex-direction: column;
    gap: 1rem; 
    position: relative;
    z-index: 10;
`;

const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 0; 
`;

const SearchInput = styled.input`
    width: 100%;
    background-color: #2C2C2E; 
    border: 1px solid rgba(255, 255, 255, 0.05); 
    color: white;
    font-size: 0.95rem; 
    padding: 0.8rem 2.8rem; 
    border-radius: 12px; 
    transition: all 0.3s ease;
    font-family: 'Tajawal', sans-serif;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primaryColor || '#F07A48'};
        background-color: #3A3A3C;
    }
    &::placeholder { color: #8E8E93; }
`;

const SearchIcon = styled.div`
    position: absolute;
    left: ${(props) => (props.isArabic ? 'auto' : '1rem')};
    right: ${(props) => (props.isArabic ? '1rem' : 'auto')};
    top: 50%;
    transform: translateY(-50%);
    color: #8E8E93;
    font-size: 1rem;
    pointer-events: none;
`;

const ClearButton = styled.button`
    position: absolute;
    right: ${(props) => (props.isArabic ? 'auto' : '1rem')};
    left: ${(props) => (props.isArabic ? '1rem' : 'auto')};
    top: 50%;
    transform: translateY(-50%);
    background: rgba(142, 142, 147, 0.2);
    border: none;
    color: #D1D1D6;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 4px; border-radius: 50%;
    width: 20px; height: 20px; font-size: 0.7rem;
    &:hover { background-color: rgba(255,255,255,0.2); color: white; }
`;

const CategoryList = styled.div`
    display: flex;
    gap: 0.6rem; 
    overflow-x: auto;
    padding: 4px 4px 12px 4px; 
    justify-content: flex-start;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    &::-webkit-scrollbar { display: none; }
`;

const CategoryPill = styled(motion.button)`
    padding: 0.5rem 1rem; 
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    font-family: 'Tajawal', sans-serif;
    
    border: 1px solid ${(props) => props.$isActive ? props.theme.primaryColor : 'transparent'};
    background-color: ${(props) => props.$isActive ? 'rgba(240, 122, 72, 0.15)' : '#2C2C2E'};
    color: ${(props) => props.$isActive ? props.theme.primaryColor : '#D1D1D6'};

    &:hover { background-color: #3A3A3C; color: white; }
`;

const ProductFilterBar = ({ 
    searchQuery, 
    setSearchQuery, 
    categories, 
    selectedCategory, 
    setSelectedCategory 
}) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    return (
        <Wrapper>
            <SearchContainer>
                <SearchIcon isArabic={isArabic}><FaSearch /></SearchIcon>
                <SearchInput
                    type="text"
                    placeholder={t('search_products', 'Search products...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    dir={isArabic ? 'rtl' : 'ltr'}
                />
                {searchQuery && (
                    <ClearButton isArabic={isArabic} onClick={() => setSearchQuery('')}><FaTimes /></ClearButton>
                )}
            </SearchContainer>

            {categories && categories.length > 0 && (
                <CategoryList>
                    <CategoryPill
                        $isActive={selectedCategory === null}
                        onClick={() => setSelectedCategory(null)}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('all_products', 'All')}
                    </CategoryPill>
                    
                    {categories.map(cat => (
                        <CategoryPill
                            key={cat.id}
                            $isActive={selectedCategory === cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isArabic ? cat.name : (cat.nameFr || cat.name)}
                        </CategoryPill>
                    ))}
                </CategoryList>
            )}
        </Wrapper>
    );
};

export default ProductFilterBar;