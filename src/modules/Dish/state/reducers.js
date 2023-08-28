// categoriesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDishesByShopAndCategory } from "../services/dishServices";

export const fetchDishesByCategory = createAsyncThunk(
  "dishes/fetchDishesByCategory",
  async ({ shopId, categoryId }) => {
const dishesByCategory= [];
    try {
      const response = await getDishesByShopAndCategory(shopId, categoryId);
      response.forEach(dish => {
        dishesByCategory.push({
          shopId: shopId,
          categoryId: categoryId,
          dish: dish
        });
      });
      return dishesByCategory;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
const initialState = {
  dishes: [],
  loading: false,
  error: null,
};

const dishesSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDishesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.dishes = [...state.dishes, ...action.payload];
      })
      .addCase(fetchDishesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = dishesSlice;
export const selectDishes = (state) => state.dishes;
