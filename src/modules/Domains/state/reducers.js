// categoriesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDomain } from "../services/DomainServices";

export const fetchDomain = createAsyncThunk(
  "domains/fetchDomain",
  async (domainId) => {
    try {
      const response = await getDomain(domainId);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch shop domain");
    }
  }
);

const initialState = {
  domains: [],
  selectedDomain: null,
  loading: false,
  error: null,
};

const domainsSlice = createSlice({
  name: "domains",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDomain.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDomain = action.payload;
        state.domains = [...state.domains, action.payload];
      })
      .addCase(fetchDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = domainsSlice;
export const selectDomain = (state) => state.selectedDomain;
export const domains = (state) => state.domains;
