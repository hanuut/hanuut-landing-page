import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: relative;
    z-index: 10;
`;

// --- Search Input Styling ---
const SearchContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
`;

const SearchInput = styled.input`
    width: 100%;
    background-color: #18181B; /* Zinc 900 */
    border: 1px solid #27272A; /* Zinc 800 */
    color: white;
    font-size: 1rem;
    padding: 1rem 3rem; /* Space for icons */
    border-radius: 99px;
    transition: all 0.3s ease;
    font-family: 'Tajawal', sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primaryColor || '#F07A48'};
        box-shadow: 0 0 0 4px rgba(240, 122, 72, 0.1);
        background-color: #27272A;
    }

    &::placeholder {
        color: #71717a;
    }
`;

const SearchIcon = styled.div`
    position: absolute;
    left: ${(props) => (props.isArabic ? 'auto' : '1.2rem')};
    right: ${(props) => (props.isArabic ? '1.2rem' : 'auto')};
    top: 50%;
    transform: translateY(-50%);
    color: #71717a;
    font-size: 1.1rem;
    pointer-events: none;
`;

const ClearButton = styled.button`
    position: absolute;
    right: ${(props) => (props.isArabic ? 'auto' : '1.2rem')};
    left: ${(props) => (props.isArabic ? '1.2rem' : 'auto')};
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #71717a;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
        background-color: rgba(255,255,255,0.1);
        color: white;
    }
`;

// --- Category Pills Styling ---
const CategoryList = styled.div`
    display: flex;
    gap: 0.8rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    justify-content: flex-start;
    
    /* Hide scrollbar */
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    &::-webkit-scrollbar { display: none; }

    @media (min-width: 768px) {
        justify-content: center;
    }
`;

const CategoryPill = styled(motion.button)`
    padding: 0.6rem 1.4rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    font-family: 'Tajawal', sans-serif;
    border: 1px solid ${(props) => props.$isActive ? props.theme.primaryColor : 'transparent'};
    background-color: ${(props) => props.$isActive ? 'rgba(240, 122, 72, 0.15)' : '#18181B'};
    color: ${(props) => props.$isActive ? props.theme.primaryColor : '#A1A1AA'};

    &:hover {
        background-color: #27272A;
        color: white;
    }
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
            {/* 1. Search Input */}
            <SearchContainer>
                <SearchIcon isArabic={isArabic}>
                    <FaSearch />
                </SearchIcon>
                <SearchInput
                    type="text"
                    placeholder={t('search_products', 'Search products...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    dir={isArabic ? 'rtl' : 'ltr'}
                />
                {searchQuery && (
                    <ClearButton 
                        isArabic={isArabic} 
                        onClick={() => setSearchQuery('')}
                    >
                        <FaTimes />
                    </ClearButton>
                )}
            </SearchContainer>

            {/* 2. Category Pills */}
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