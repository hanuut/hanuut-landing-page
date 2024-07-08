import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { reducer as shopsReducer } from "./modules/Partners/state/reducers";
import { reducer as imagesReducer } from "./modules/Images/state/reducers";
import { reducer as categoriesReducer } from "./modules/Categories/state/reducers";
import { reducer as dishesReducer } from "./modules/Dish/state/reducers";
import { reducer as cartReducer } from "./modules/Cart/state/reducers";
const rootReducer = combineReducers({
  shops: shopsReducer,
  images: imagesReducer,
  categories: categoriesReducer,
  dishes: dishesReducer,
  cart: cartReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
