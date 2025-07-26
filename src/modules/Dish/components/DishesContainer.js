// src/pages/Dish/components/DishesContainer.js

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Dish from "./Dish.js";
import Loader from "../../../components/Loader";
import NothingFoundImage from "../../../assets/nothing.png";

// This layout is ONLY for when there are dishes to display.
const MasonryLayout = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-top: 2rem;
  column-width: 320px;
  column-gap: 1.5rem;
   opacity: ${(props) => (props.$expanded ? 1 : 0)};
  transform: ${(props) => (props.$expanded ? "translateY(0)" : "translateY(20px)")};
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

// This is a separate layout for the empty state.
const NoAvailableDishes = styled.div`
  padding: 4rem 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const EmptyStateImage = styled.img`
  width: 500px;
  max-width: 40%;
  opacity: 0.7;
`;

const Content = styled.p`
  font-size: ${(props) => props.theme.fontxl};
  color: ${(props) => props.theme.secondaryText};
  text-align: center;
`;

const DishesContainer = ({ dishes, expanded, isSubscribed, isLoading }) => {
  const { t } = useTranslation();

  // --- THE FIX: We structure the entire return ---

  // Case 1: We are currently loading.
  if (isLoading) {
    return <Loader fullscreen={false} />;
  }

  // Case 2: We are done loading, and there are no dishes.
  if (dishes.length === 0) {
    return (
      <NoAvailableDishes>
        <EmptyStateImage src={NothingFoundImage} alt="No items found" />
        <Content>{t("noDishesAvailable")}</Content>
      </NoAvailableDishes>
    );
  }

  // Case 3: We are done loading, and there ARE dishes.
  return (
    <MasonryLayout $expanded={expanded}>
      {dishes.map((dishWrapper) => (
        dishWrapper.isHidden !== true ? (
          <Dish
            key={dishWrapper.id}
            dish={dishWrapper.dish}
            isSubscribed={isSubscribed}
          />
        ) : null
      ))}
    </MasonryLayout>
  );
};

export default DishesContainer;