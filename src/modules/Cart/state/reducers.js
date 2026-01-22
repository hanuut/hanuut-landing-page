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
  cart: loadCartFromStorage(),
  isCartOpen: false, // <--- NEW: Controls the modal visibility globally
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    addToCart: (state, action) => {
      const { variantId, quantity } = action.payload;
      const existingIndex = state.cart.findIndex(
        (item) => item.variantId === variantId
      );

      if (existingIndex >= 0) {
        state.cart[existingIndex].quantity += quantity;
      } else {
        state.cart.push(action.payload);
      }
      
      saveCartToStorage(state.cart);
      // Optional: Auto-open cart on add
      //state.isCartOpen = true; 
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
      saveCartToStorage(state.cart);
    },

    clearCart: (state) => {
      state.cart = [];
      saveCartToStorage([]);
    },
    
    removeFromCart: (state, action) => {
       const variantId = action.payload;
       state.cart = state.cart.filter((item) => item.variantId !== variantId);
       saveCartToStorage(state.cart);
    }
  },
});

export const { addToCart, updateCartQuantity, clearCart, removeFromCart, toggleCart, openCart, closeCart } = cartSlice.actions;
export const reducer = cartSlice.reducer;
export const selectCart = (state) => state.cart;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;