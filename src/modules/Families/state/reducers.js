import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFamiliesByClassId, getFamily } from "../services/familiesService";

export const fetchFamilies = createAsyncThunk(
  "families/fetchFamilies",
  async (classId) => {
    const familiesByClassId = [];
    try {
      const response = await getFamiliesByClassId(classId);
      response.forEach((family) => {
        familiesByClassId.push({
          classId: classId,
          family: family,
        });
      });
      return familiesByClassId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const initialState = {
  families: [],
  loading: false,
  error: null,
};

const familiesSlice = createSlice({
  name: "families",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFamilies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilies.fulfilled, (state, action) => {
        state.loading = false;

        const newFamilies = action.payload.filter(
          (newFamily) =>
            !state.families.some(
              (existingFamily) => existingFamily.id === newFamily.id
            )
        );

        // Add only the new, non-duplicate categories
        state.families = [...state.families, ...newFamilies];
      })
      .addCase(fetchFamilies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = familiesSlice;
export const selectFamilies = (state) => state.families;
