import React, { useEffect, useState } from "react";
import {
  selectDishesImages,
} from "../../Images/state/reducers";
import {  useSelector } from "react-redux";
import Dish from "./Dish";
import Loader from "../../../components/Loader";

const DishesContainer = ({ shopId, categoryId, dishes}) => {
  const {dishesImages, loading, error}  = useSelector(selectDishesImages)
  const [dishesWithImages, setDishesWithImages] = useState([]);
console.log(dishes)
  const filteredDishes = dishes.filter(
    (dish) => dish.categoryId === categoryId && dish.shopId === shopId
  );

  useEffect(() => {
    const dishesWithImagesInstance = [];
    filteredDishes.forEach((dish) => {
      const image = dishesImages.find((img) => img.dishId === dish.dish.id);
      if (image) {
        const dishWithImageInstance = {
          dishData: dish.dish,
          dishImage: image,
        };
        dishesWithImagesInstance.push(dishWithImageInstance);
      }
    });
    setDishesWithImages(dishesWithImagesInstance);
  }, [dishes, dishesImages]);

  if (loading) return <Loader/>;

  if (error) {
    return <h5>error {error}</h5>;
  }

  return (
    <div>
      {dishesWithImages.map((dish) => (
        <Dish
          key={dish.dishData.id}
          dish={dish.dishData}
          imageData={dish.dishImage.image}
        />
      ))}
    </div>
  );
};

export default DishesContainer;
