import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAdById } from "../services/adServices";

export const fetchAdById = createAsyncThunk(
  "marketplace/fetchAdById",
  async (adId, { rejectWithValue }) => {
    try {
      const response = await getAdById(adId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch Ad" }
      );
    }
  }
);

const initialState = {
  selectedAd: null,
  loading: false,
  error: null,
};

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    clearSelectedAd: (state) => {
      state.selectedAd = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedAd = null;
      })
      .addCase(fetchAdById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAd = action.payload;
      })
      .addCase(fetchAdById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedAd } = marketplaceSlice.actions;
export const selectMarketplace = (state) => state.marketplace;

export default marketplaceSlice.reducer;