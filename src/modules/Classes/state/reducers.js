import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getshopClass } from "../services/classesServices";

export const fetchClasses = createAsyncThunk(
  "classes/fetchclasses",
  async (classes) => {
    try {
      const response = [];

      for (const shopClass of classes) {
        const shopClassSnap = await getshopClass(shopClass);
        response.push(shopClassSnap.data);
      }
      return response;
    } catch (error) {
      throw new Error("Failed to fetch shop classes");
    }
  }
);

const initialState = {
  classes: [],
  loading: false,
  error: null,
};

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = classesSlice;
export const selectClasses = (state) => state.classes;
