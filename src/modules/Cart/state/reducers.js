import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartItem) => cartItem
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId) => productId
);

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const { _id, name, sellingPrice, shopId } = action.payload;
        const existingItem = state.cart.find((item) => item.productId === _id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.cart.push({
            productId: _id,
            title: name,
            quantity: 1,
            sellingPrice,
            shopId,
          });
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const _id = action.payload;
        const existingItem = state.cart.find((item) => item.productId === _id);
        if (existingItem) {
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          } else {
            state.cart = state.cart.filter((item) => item.productId !== _id);
          }
        } else {
          state.cart = state.cart.filter((item) => item.productId !== _id);
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = cartSlice;
export const selectCart = (state) => state.cart;
