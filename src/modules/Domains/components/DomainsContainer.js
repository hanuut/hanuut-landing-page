// src/pages/Dish/components/DishesContainer.js

import React from "react";
import styled from "styled-components";
import DishCard from "./DishCard.js"; // Using .js for consistency

// We're renaming DishesGrid to MasonryLayout and changing its properties
const MasonryLayout = styled.div`
  width: 100%;
  padding-top: 2rem;

  // This is the core of the new layout.
  // It tells the browser to create columns that are ideally 320px wide.
  column-width: 320px;
  column-gap: 1.5rem; // The space between columns

  opacity: ${(props) => (props.expanded ? 1 : 0)};
  transform: ${(props) => (props.expanded ? "translateY(0)" : "translateY(20px)")};
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const DishesContainer = ({ dishes, expanded, isSubscribed }) => {
  return (
    <MasonryLayout expanded={expanded}>
      {dishes.map((dish) => (
        <DishCard
          key={dish._id}
          dish={dish}
          isSubscribed={isSubscribed}
        />
      ))}
    </MasonryLayout>
  );
};

export default DishesContainer;