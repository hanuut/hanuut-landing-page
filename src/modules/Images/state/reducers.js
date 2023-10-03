// imageSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getImage } from "../services/imageServices";

export const fetchShopsImages = createAsyncThunk(
  "images/fetchShopsImages",
  async (shops) => {
    try {
      const filteredShops = shops.filter((shop) => shop.imageId); // Filter out shops with empty or null imageId
      const imageIds = filteredShops.map((shop) => shop.imageId);
      const response = [];

      for (const imageId of imageIds) {
        const imageSnap = await getImage(imageId);
        filteredShops.forEach((shop) => {
          if (shop.imageId === imageId) {
            response.push({ shopId: shop.id, image: imageSnap.data });
          }
        });
      }

      return response; // Return the response to update the state
    } catch (error) {
      throw new Error("Failed to fetch shop images");
    }
  }
);

export const fetchDishesImages = createAsyncThunk(
  "images/fetchDishesImages",
  async (dishes) => {
    try {
      const filteredDishes = dishes.filter((dish) => dish.dish.imageId); // Filter out dishes with empty or null imageId
      const imageIds = filteredDishes.map((dish) => dish.dish.imageId);
      const response = [];

      for (const imageId of imageIds) {
        const imageSnap = await getImage(imageId);
        filteredDishes.forEach((dish) => {
          if (dish.dish.imageId === imageId) {
            response.push({ dishId: dish.dish.id, image: imageSnap.data });
          }
        });
      }
      return response; // Return the response to update the state
    } catch (error) {
      throw new Error("Failed to fetch dishes images");
    }
  }
);

export const fetchShopImage = createAsyncThunk(
  "images/fetchShopImage",
  async (imageId) => {
    try {
      const response = await getImage(imageId);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch shop image with ID: ${imageId}`);
    }
  }
);

const imageSlice = createSlice({
  name: "images",
  initialState: {
    images: [],
    selectedShopImage: {},
    dishesImages: [],
    imagesLoading: false,
    selectedImageLoading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopsImages.pending, (state) => {
        state.imagesLoading = true;
        state.error = null;
      })
      .addCase(fetchShopsImages.fulfilled, (state, action) => {
        state.imagesLoading = false;
        state.images = [...state.images, ...action.payload];
      })
      .addCase(fetchShopsImages.rejected, (state, action) => {
        state.imagesLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDishesImages.pending, (state) => {
        state.imagesLoading = true;
        state.error = null;
      })
      .addCase(fetchDishesImages.fulfilled, (state, action) => {
        state.imagesLoading = false;
        state.dishesImages = [...state.dishesImages, ...action.payload];
      })
      .addCase(fetchDishesImages.rejected, (state, action) => {
        state.imagesLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchShopImage.pending, (state) => {
        state.selectedImageLoading = true;
        state.error = null;
      })
      .addCase(fetchShopImage.fulfilled, (state, action) => {
        state.selectedImageLoading = false;
        state.selectedShopImage = action.payload;
      })
      .addCase(fetchShopImage.rejected, (state, action) => {
        state.selectedImageLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = imageSlice;
export const selectShopsImages = (state) => state.images;
export const selectDishesImages = (state) => state.images.dishesImages;
export const selectSelectedShopImage = (state) =>
  state.images.selectedShopImage;
