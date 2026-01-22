// src/modules/Product/state/reducers.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProductById,
  getProductByShopAndCategory,
  getAvailableProductsByShopPaginated,
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

/**
 * @summary Fetches paginated products. 
 * @param {Object} args - { shopId, page, categoryId, search, isNewFilter }
 * 'isNewFilter' is a boolean flag. If true, we wipe existing products.
 */
export const fetchPaginatedProducts = createAsyncThunk(
  "products/fetchPaginated",
  async ({ shopId, page, limit, categoryId, search, isNewFilter }, { rejectWithValue }) => {
    try {
      const response = await getAvailableProductsByShopPaginated({ 
        shopId, page, limit, categoryId, search 
      });
      // Return response + the flag so the reducer knows whether to append or replace
      return { ...response, isNewFilter };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

const initialState = {
  products: [],         // Legacy (keep if needed for other components)
  selectedProduct: null,
  loading: false,
  error: null,

  featuredProducts: [],
  featuredLoading: false,
  featuredError: null,

  newArrivals: [],
  newArrivalsLoading: false,
  newArrivalsError: null,

  // --- NEW PAGINATION STATE ---
  paginatedProducts: [],
  paginationLoading: false,
  paginationError: null,
  paginationMeta: {
    page: 1,
    totalPages: 1,
    total: 0,
    hasMore: true
  }
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Optional: Action to clear list manually
    resetPagination: (state) => {
      state.paginatedProducts = [];
      state.paginationMeta = { page: 1, totalPages: 1, total: 0, hasMore: true };
    }
  },
  extraReducers: (builder) => {
    builder
      // ... existing extraReducers

      // --- PAGINATION REDUCERS ---
      .addCase(fetchPaginatedProducts.pending, (state) => {
        state.paginationLoading = true;
        state.paginationError = null;
      })
      .addCase(fetchPaginatedProducts.fulfilled, (state, action) => {
        state.paginationLoading = false;
        
        const { data, page, totalPages, total, isNewFilter } = action.payload;

        if (isNewFilter || page === 1) {
          // Replace Mode (New Category / Search)
          state.paginatedProducts = data;
        } else {
          // Append Mode (Infinite Scroll)
          // Filter out duplicates just in case
          const newItems = data.filter(newItem => 
            !state.paginatedProducts.some(existing => existing._id === newItem._id)
          );
          state.paginatedProducts = [...state.paginatedProducts, ...newItems];
        }

        // Update Meta
        state.paginationMeta = {
          page: page,
          totalPages: totalPages,
          total: total,
          hasMore: page < totalPages
        };
      })
      .addCase(fetchPaginatedProducts.rejected, (state, action) => {
        state.paginationLoading = false;
        state.paginationError = action.payload;
      });
  },
});

export const { resetPagination } = productSlice.actions;
export const { reducer, actions } = productSlice;

export const selectProducts = (state) => state.products;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectPaginatedState = (state) => ({
  products: state.products.paginatedProducts,
  loading: state.products.paginationLoading,
  error: state.products.paginationError,
  meta: state.products.paginationMeta
});