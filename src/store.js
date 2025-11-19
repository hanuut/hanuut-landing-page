import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { reducer as shopsReducer } from "./modules/Partners/state/reducers";
import { reducer as imagesReducer } from "./modules/Images/state/reducers";
import { reducer as categoriesReducer } from "./modules/Categories/state/reducers";
import { reducer as dishesReducer } from "./modules/Dish/state/reducers";
import { reducer as cartReducer } from "./modules/Cart/state/reducers";
import { reducer as classesReducer } from "./modules/Classes/state/reducers";
import { reducer as productsReducer } from "./modules/Product/state/reducers";
import { reducer as familiesReducer } from "./modules/Families/state/reducers";
import blogReducer from './modules/Blog/state/reducers';
import marketplaceReducer from "./modules/Marketplace/state/reducers"; 

const rootReducer = combineReducers({
  shops: shopsReducer,
  images: imagesReducer,
  categories: categoriesReducer,
  dishes: dishesReducer,
  cart: cartReducer,
  classes: classesReducer,
  products: productsReducer,
  families: familiesReducer,
  blog: blogReducer,
  marketplace: marketplaceReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state check middleware
    }),
});

export default store;
