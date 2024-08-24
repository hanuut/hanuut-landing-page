import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductByShopAndCategory } from "../services/productsService";

export const fetchProductByShopAndCategory = createAsyncThunk(
  "products/fetchProductByShopAndCategory",
  async ({ shopId, categoryId }) => {
    const productByCategory = [];
    try {
      const response = await getProductByShopAndCategory(shopId, categoryId);

      response.forEach((product) => {
        productByCategory.push({
          shopId: shopId,
          categoryId: categoryId,
          product: product,
        });
      });
      return productByCategory;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductByShopAndCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByShopAndCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, ...action.payload];
      })
      .addCase(fetchProductByShopAndCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = productSlice;
export const selectProducts = (state) => state.products;
