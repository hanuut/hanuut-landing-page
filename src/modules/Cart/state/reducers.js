import { createSlice } from "@reduxjs/toolkit";

// 1. Helper to Load from Browser Storage
const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const serializedState = localStorage.getItem("hanuut_cart");
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading cart:", err);
    return [];
  }
};

// 2. Helper to Save to Browser Storage
const saveCartToStorage = (cart) => {
  try {
    const serializedState = JSON.stringify(cart);
    localStorage.setItem("hanuut_cart", serializedState);
  } catch (err) {
    console.error("Error saving cart:", err);
  }
};

const initialState = {
  cart: loadCartFromStorage(), // <--- LOADS SAVED DATA ON STARTUP
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { variantId, quantity } = action.payload;

      // Check if item exists
      const existingIndex = state.cart.findIndex(
        (item) => item.variantId === variantId
      );

      if (existingIndex >= 0) {
        // Update quantity if exists
        state.cart[existingIndex].quantity += quantity;
      } else {
        // Add new item
        state.cart.push(action.payload);
      }
      
      // Save immediately
      saveCartToStorage(state.cart);
    },

    updateCartQuantity: (state, action) => {
      const { variantId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.cart = state.cart.filter((item) => item.variantId !== variantId);
      } else {
        const index = state.cart.findIndex((item) => item.variantId === variantId);
        if (index >= 0) {
          state.cart[index].quantity = quantity;
        }
      }
      // Save immediately
      saveCartToStorage(state.cart);
    },

    clearCart: (state) => {
      state.cart = [];
      saveCartToStorage([]);
    },
    
    // Add specific removal action if needed
    removeFromCart: (state, action) => {
       const variantId = action.payload;
       state.cart = state.cart.filter((item) => item.variantId !== variantId);
       saveCartToStorage(state.cart);
    }
  },
});

export const { addToCart, updateCartQuantity, clearCart, removeFromCart } = cartSlice.actions;
export const reducer = cartSlice.reducer;
export const selectCart = (state) => state.cart;