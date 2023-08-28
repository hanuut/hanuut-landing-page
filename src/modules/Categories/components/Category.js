import React, { useState } from "react";
import styled from "styled-components";
import DishesContainer from "../../Dish/components/DishesContainer";

const Section = styled.button`
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 1rem 0rem;
  font-size: ${(props) => props.theme.fontxxxl};
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontlg};
  }
`;

const Heading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const CategoryName = styled.h5`
  font-family: "Tajawal", sans-serif;
`;

const Arrow = styled.h5`
  font-family: "Tajawal", sans-serif;
`;

const Category = ({ category, shopId, selectedCategory, onCategoryClick }) => {
  const [expanded, setExpanded] = useState(false);

  const handleHeadingClick = () => {
    setExpanded(!expanded);
    onCategoryClick(category.id);
  };

  return (
    <Section>
      <Heading onClick={handleHeadingClick}>
        <CategoryName>{category.name}</CategoryName>
        <Arrow>{expanded ? "-" : "+"}</Arrow>
      </Heading>
      {expanded && (
        <DishesContainer categoryId={category.id} shopId={shopId} />
      )}
    </Section>
  );
};

export default Category;
