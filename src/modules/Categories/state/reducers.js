// categoriesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCategory } from "../services/categoryServices";

// export const fetchCategory = createAsyncThunk('categories/fetchCategory', async (categoryId) => {
//   try {
//     const response = await getCategory(categoryId);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch category with ID: ${categoryId}`);
//   }
// });

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (categories) => {
    try {
      const response = [];

      for (const category of categories) {
        const categorySnap = await getCategory(category);
        response.push(categorySnap.data);
      }
      return response;
    } catch (error) {
      throw new Error("Failed to fetch shop categories");
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = categoriesSlice;
export const selectCategories = (state) => state.categories;
