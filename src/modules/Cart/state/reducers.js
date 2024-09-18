import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Thunks for cart operations
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartItem) => cartItem
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItem) => cartItem
);

export const incrementQuantity = createAsyncThunk(
  "cart/incrementQuantity",
  async (productId) => productId
);

export const decrementQuantity = createAsyncThunk(
  "cart/decrementQuantity",
  async (cartItem) => cartItem
);

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;

        const {
          _id: productId,
          name: title,
          sellingPrice,
          shopId,
          brand,
          type = "product", // Default to "product" if type is not provided
          color = "Not Specified", // Provide default value if color is not provided
          size = "Not Specified", // Provide default value if size is not provided
          imageId = "", // Default to empty string if imageId is not provided
        } = action.payload;

        const existingItemIndex = state.cart.findIndex(
          (item) =>
            item.productId === productId &&
            item.color === color &&
            item.size === size &&
            item.type === type
        );

        if (existingItemIndex !== -1) {
          // If the item exists, increment its quantity
          state.cart[existingItemIndex] = {
            ...state.cart[existingItemIndex],
            quantity: state.cart[existingItemIndex].quantity + 1,
          };
        } else {
          // If the item doesn't exist, add it to the cart
          state.cart.push({
            productId,
            title,
            quantity: 1,
            sellingPrice,
            shopId,
            brand,
            type,
            color,
            size,
            imageId,
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
        const { _id } = action.payload;
        state.cart = state.cart.filter((item) => !(item.productId === _id));
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(incrementQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        state.loading = false;

        const existingItemIndex = state.cart.findIndex(
          (item) => item.productId === action.payload
        );

        if (existingItemIndex !== -1) {
          state.cart[existingItemIndex].quantity += 1;
        }
      })
      .addCase(incrementQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(decrementQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        const existingItemIndex = state.cart.findIndex(
          (item) => item.productId === action.payload
        );

        if (existingItemIndex !== -1) {
          if (state.cart[existingItemIndex].quantity > 1) {
            state.cart[existingItemIndex].quantity -= 1;
          } else {
            state.cart = state.cart.filter(
              (item) => !(item.productId === action.payload)
            );
          }
        }
      })
      .addCase(decrementQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export const { reducer } = cartSlice;

export const selectCart = (state) => state.cart;
