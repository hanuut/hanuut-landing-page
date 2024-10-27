// shopSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getShops,
  getShopById,
  getShopByUsername,
} from "../services/shopServices";
import { fetchShopImage } from "../../Images/state/reducers";

export const fetchShops = createAsyncThunk("shops/fetchShops", async () => {
  try {
    const response = await getShops();
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch shops");
  }
});

export const fetchShop = createAsyncThunk("shops/fetchShop", async (shopId) => {
  try {
    const response = await getShopById(shopId);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch shop with ID: ${shopId}`);
  }
});

export const fetchShopWithUsername = createAsyncThunk(
  "shops/fetchShopWithUsername",
  async (username) => {
    try {
      const response = await getShopByUsername(username);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch shop with username: ${username}`);
    }
  }
);

const initialState = {
  shops: [],
  selectedShop: {},
  loading: false,
  error: null,
};

const shopSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchShop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShop.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShop = action.payload;
      })
      .addCase(fetchShop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchShopWithUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopWithUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShop = action.payload;
      })
      .addCase(fetchShopWithUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = shopSlice;
export const selectShops = (state) => state.shops;
export const selectShop = (state) => state.shops.selectedShop;
