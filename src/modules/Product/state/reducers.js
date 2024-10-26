import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProductById,
  getProductByShopAndCategory,
} from "../services/productsService";

export const fetchProductByShopAndCategory = createAsyncThunk(
  "products/fetchProductByShopAndCategory",
  async ({ shopId, categoryId }) => {
    const productByCategory = [];
    try {
      const response = await getProductByShopAndCategory(shopId, categoryId);
      console.log(response);
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

const initialState = {
  products: [],
  selectedProduct: null,
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

        // Only add unique products to the state
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
      });
  },
});

export const { reducer, actions } = productSlice;
export const selectProducts = (state) => state.products;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
