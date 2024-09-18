// categoriesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCategoriesByFamilyId,
  getCategory,
} from "../services/categoryServices";

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

export const fetchCategoriesByFamilyId = createAsyncThunk(
  "categories/fetchCategoriesByFamilyId",
  async (familyId) => {

    try {
      const response = await getCategoriesByFamilyId(familyId);
      return response.data;
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
      })
      .addCase(fetchCategoriesByFamilyId.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesByFamilyId.fulfilled, (state, action) => {
        state.loading = false;

        // Filter out categories that are already in state.categories
        const newCategories = action.payload.filter(
          (newCategory) =>
            !state.categories.some(
              (existingCategory) => existingCategory.id === newCategory.id
            )
        );

        // Add only the new, non-duplicate categories
        state.categories = [...state.categories, ...newCategories];
      })
      .addCase(fetchCategoriesByFamilyId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = categoriesSlice;
export const selectCategories = (state) => state.categories;
