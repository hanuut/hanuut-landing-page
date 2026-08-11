// src/modules/Categories/state/reducers.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCategoriesByFamilyId,
  getCategory,
} from "../services/categoryServices";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (categories) => {
    try {
      const response = [];

      for (const category of categories) {
        if (!category) continue;
        const catId = typeof category === "object" ? category.id || category._id : category;
        if (!catId) continue;
        
        const categorySnap = await getCategory(catId);
        if (categorySnap && categorySnap.data) {
          response.push(categorySnap.data);
        }
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
        const incoming = Array.isArray(action.payload) ? action.payload : [];
        const existingIds = new Set(
          state.categories.map((c) => String(c.id || c._id))
        );
        const newCats = incoming.filter(
          (c) => c && !existingIds.has(String(c.id || c._id))
        );
        state.categories = [...state.categories, ...newCats];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategoriesByFamilyId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesByFamilyId.fulfilled, (state, action) => {
        state.loading = false;
        const incoming = Array.isArray(action.payload) ? action.payload : [];
        const existingIds = new Set(
          state.categories.map((c) => String(c.id || c._id))
        );
        const newCategories = incoming.filter(
          (newCat) => newCat && !existingIds.has(String(newCat.id || newCat._id))
        );
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