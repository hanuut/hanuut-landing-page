import React from "react";
import Dish from "./Dish";
import Loader from "../../../components/Loader";
import styled from "styled-components";
import { selectDishes } from "../../Dish/state/reducers";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const Section = styled.div`
  margin-top: 1rem;
  width: 100%;
  overflow-y: scroll;
  max-height: ${(props) => (props.expanded ? "100%" : "0")};
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
`;
const NoAvailableDishes = styled.div`
  min-height: ${(props) => `calc(100vh - ${props.theme.navHeight} - 11rem)`};
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.p`
  font-size: 2.5rem;
  @media (max-width: 768px) {
    margin-top: 1rem;
    font-size: ${(props) => props.theme.fontxxl};
  }
`;
const DishesContainer = ({ dishes, expanded }) => {
  const { t } = useTranslation();
  const { loading: dishesLoading, error: dishesError } =
    useSelector(selectDishes);
  if (dishesLoading) return <Loader />;
  if (dishesError) return <div>Error: {dishesError}</div>;
  return (
    <Section expanded={expanded}>
      {dishes.length > 0 ? (
        dishes.map((dish) => <Dish key={dish.id} dish={dish.dish} />)
      ) : (
        <NoAvailableDishes>
          {" "}
          <Content> {t("noDishesAvailable")}</Content>{" "}
        </NoAvailableDishes>
      )}
    </Section>
  );
};

export default DishesContainer;
