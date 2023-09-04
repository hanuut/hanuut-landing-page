import React from "react";
import Dish from "./Dish";
import Loader from "../../../components/Loader";
import styled from "styled-components";
import { selectDishes } from "../../Dish/state/reducers";
import { useSelector } from "react-redux";
const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;
const DishesContainer = ({ dishes, expanded }) => {
  // const [dishesWithImages, setDishesWithImages] = useState([]);
  // const { dishesImages, loading, error} = useSelector(selectDishesImages)
  const { loading: dishesLoading, error: dishesError } =
    useSelector(selectDishes);
  // useEffect(() => {
  //   const dishesWithImagesInstance = [];
  //   filteredDishes.forEach((dish) => {
  //     const image = dishesImages.find((img) => img.dishId === dish.dish.id);
  //     if (image) {
  //       const dishWithImageInstance = {
  //         dishData: dish.dish,
  //         dishImage: image,
  //       };
  //       dishesWithImagesInstance.push(dishWithImageInstance);
  //     }
  //   });
  //   setDishesWithImages(dishesWithImagesInstance);
  // }, [dishes, dishesImages]);
  if (dishesLoading) return <Loader />;
  if (dishesError) return <div>Error: {dishesError}</div>;
  return (
    <Section expanded={expanded}>
      {dishes.map((dish) => (
        <Dish key={dish.id} dish={dish.dish} />
      ))}
    </Section>
  );
};

export default DishesContainer;
