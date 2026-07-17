import React, { useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.75rem;
  direction: ${props => props.$isArabic ? 'rtl' : 'ltr'};
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  font-family: 'Tajawal', sans-serif;
  margin: 0;
`;

const SubText = styled.span`
  font-size: 0.85rem;
  color: #71717a;
  font-family: 'Cairo', sans-serif;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 0;
  width: 100%;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CollectionRail = ({ title, products, onSelectCanvas }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const cleanProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return products.slice(0, 10); // Display the top 10 custom canvases
  }, [products]);

  if (cleanProducts.length === 0) return null;

  return (
    <Container>
      <SectionHeader $isArabic={isArabic}>
        <Title>{title}</Title>
        <SubText>{t("pod_store.swipe_to_view", "Swipe to view")}</SubText>
      </SectionHeader>
      <CardContainer style={{ direction: isArabic ? "rtl" : "ltr" }}>
        {cleanProducts.map((product, index) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            index={index}
            onSelect={() => onSelectCanvas(product)}
          />
        ))}
      </CardContainer>
    </Container>
  );
};

CollectionRail.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  onSelectCanvas: PropTypes.func.isRequired
};

export default CollectionRail;