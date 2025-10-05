// src/modules/Product/state/reducers.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProductById,
  getProductByShopAndCategory,
  // ADDED: Import the new service functions
  getFeaturedProductsByShop,
  getAvailableProductsByShop,
} from "../services/productsService";

export const fetchProductByShopAndCategory = createAsyncThunk(
  "products/fetchProductByShopAndCategory",
  async ({ shopId, categoryId }) => {
    // ... (this thunk remains unchanged)
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

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId) => {
    // ... (this thunk remains unchanged)
    try {
      const response = await getProductById(productId);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

/**
 * @summary Fetches products marked as 'isFeatured' for a specific shop.
 */
export const fetchFeaturedProductsByShop = createAsyncThunk(
  "products/fetchFeaturedProductsByShop",
  async (shopId, { rejectWithValue }) => {
    try {
      const products = await getFeaturedProductsByShop(shopId);
      return products;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch featured products");
    }
  }
);

/**
 * @summary Fetches the latest available products for a specific shop to be used as "New Arrivals".
 */
export const fetchNewArrivalsByShop = createAsyncThunk(
  "products/fetchNewArrivalsByShop",
  async (shopId, { rejectWithValue }) => {
    try {
      const products = await getAvailableProductsByShop(shopId);
      // Sort by creation date to get the newest items first and take the top 8
      return products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch new arrivals");
    }
  }
);


const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  featuredProducts: [],
  featuredLoading: false,
  featuredError: null,

  newArrivals: [],
  newArrivalsLoading: false,
  newArrivalsError: null,
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
        const newProducts = action.payload.filter((newProduct) => {
          return !state.products.some(
            (existingProduct) =>
              existingProduct.product._id === newProduct.product._id
          );
        });
        state.products = [...state.products, ...newProducts];
      })
      .addCase(fetchProductByShopAndCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(fetchFeaturedProductsByShop.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedProductsByShop.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProductsByShop.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = action.payload;
      })
      .addCase(fetchNewArrivalsByShop.pending, (state) => {
        state.newArrivalsLoading = true;
        state.newArrivalsError = null;
      })
      .addCase(fetchNewArrivalsByShop.fulfilled, (state, action) => {
        state.newArrivalsLoading = false;
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivalsByShop.rejected, (state, action) => {
        state.newArrivalsLoading = false;
        state.newArrivalsError = action.payload;
      });
  },
});

export const { reducer, actions } = productSlice;

export const selectProducts = (state) => state.products;
export const selectSelectedProduct = (state) => state.products.selectedProduct;