import React, { useState } from "react";
import styled from "styled-components";
import DishesContainer from "../../Dish/components/DishesContainer";

const Section = styled.button`
  width: 100%;
  align-self: center;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  border: none;
  padding: 1rem 0rem;
  font-size: ${(props) => props.theme.fontxxxl};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
    padding: 0.8rem 0rem;
  }
`;

const Heading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const CategoryName = styled.h4`
  transition: all 0.3s ease;
  font-family: "Tajawal", sans-serif;
  color: ${(props) => (props.expanded ? props.theme.primaryColor : "")};
  @media (max-width: 768px) {
    font-size: ${(props) =>
      props.expanded ? props.theme.fontxl : props.theme.fontmd};
  }
`;

const Arrow = styled.h4`
  transition: all 0.3s ease;
  font-family: "Tajawal", sans-serif;
  @media (max-width: 768px) {
    font-size: ${(props) =>
      props.expanded ? props.theme.fontxl : props.theme.fontmd};
  }
`;

const Category = ({ category, shopId, onCategoryClick, dishes }) => {
  const [expanded, setExpanded] = useState(false);

  const filteredDishes = dishes.filter(
    (dish) => dish.categoryId === category.id && dish.shopId === shopId
  );

  const handleHeadingClick = () => {
    setExpanded(!expanded);
    onCategoryClick(category.id);
  };

  return (
    <Section onClick={handleHeadingClick}>
      <Heading>
        <CategoryName expanded={expanded}>{category.name}</CategoryName>
        <Arrow expanded={expanded}>{expanded ? "-" : "+"}</Arrow>
      </Heading>
      {expanded && (
        <DishesContainer
          categoryId={category.id}
          shopId={shopId}
          dishes={filteredDishes}
          expanded={expanded}
        />
      )}
    </Section>
  );
};

export default Category;
