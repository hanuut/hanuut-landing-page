import React, { useState } from "react";
import styled from "styled-components";

const Section = styled.button`
  width: 100%;
  align-self: center;
  background-color: ${(props) =>
    props.selected ? props.theme.primaryColor : props.theme.body};
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
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: ${(props) => props.theme.defaultRadius};

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontxl};
    padding: 0.8rem 1rem; /* Adjust the padding values as needed */
  }
`;

const Heading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const CategoryName = styled.h5`
  width: 100%;
  text-align: center;
  transition: all 0.3s ease;
  font-family: "Tajawal", sans-serif;
  font-size: ${(props) =>
    props.selected ? props.theme.fontmd : props.theme.fontsm};
  color: ${(props) =>
    props.selected ? props.theme.body : props.theme.primaryColor};

  @media (max-width: 768px) {
    font-size: ${(props) => props.theme.fontsm};

  }
`;
const Category = ({ category, onCategoryClick, selectedCategory }) => {
  const handleHeadingClick = () => {
    onCategoryClick(category.id);
  };

  return (
    <Section
      onClick={handleHeadingClick}
      selected={selectedCategory === category.id}
    >
      <Heading>
        <CategoryName selected={selectedCategory === category.id}>
          {category.name}
        </CategoryName>
      </Heading>
    </Section>
  );
};

export default Category;
