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
    try {
      const response = await getProductById(productId);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

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

export const fetchNewArrivalsByShop = createAsyncThunk(
  "products/fetchNewArrivalsByShop",
  async (shopId, { rejectWithValue }) => {
    try {
      const products = await getAvailableProductsByShop(shopId);
      return products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch new arrivals");
    }
  }
);

// --- NEW REDUX THUNK ACCEPTING POD PARAMETER ---
export const fetchPaginatedProducts = createAsyncThunk(
  "products/fetchPaginated",
  async ({ shopId, page, limit, categoryId, search, isNewFilter, printOnDemand }, { rejectWithValue }) => {
    try {
      const response = await getAvailableProductsByShopPaginated({ 
        shopId, page, limit, categoryId, search, printOnDemand // <--- PASSED TO API
      });
      return { ...response, isNewFilter };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch products");
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
    resetPagination: (state) => {
      state.paginatedProducts = [];
      state.paginationMeta = { page: 1, totalPages: 1, total: 0, hasMore: true };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaginatedProducts.pending, (state) => {
        state.paginationLoading = true;
        state.paginationError = null;
      })
      .addCase(fetchPaginatedProducts.fulfilled, (state, action) => {
        state.paginationLoading = false;
        const { data, page, totalPages, total, isNewFilter } = action.payload;

        if (isNewFilter || page === 1) {
          state.paginatedProducts = data;
        } else {
          const newItems = data.filter(newItem => 
            !state.paginatedProducts.some(existing => existing._id === newItem._id)
          );
          state.paginatedProducts = [...state.paginatedProducts, ...newItems];
        }

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