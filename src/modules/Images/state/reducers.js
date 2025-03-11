// imageSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getImage } from "../services/imageServices";

export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (imageIds) => {
    try {
      const response = [];
      for (const imageId of imageIds) {
        const imageSnap = await getImage(imageId);
        response.push({ imageId: imageId, imageData: imageSnap.data });
      }

      return response;
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

export const fetchImage = createAsyncThunk(
  "images/fetchImage",
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
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.imagesLoading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.imagesLoading = false;
        state.images = [...state.images, ...action.payload];
      })
      .addCase(fetchImages.rejected, (state, action) => {
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
      .addCase(fetchImage.pending, (state) => {
        state.selectedImageLoading = true;
        state.error = null;
      })
      .addCase(fetchImage.fulfilled, (state, action) => {
        state.selectedImageLoading = false;
        state.selectedShopImage = action.payload;
      })
      .addCase(fetchImage.rejected, (state, action) => {
        state.selectedImageLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { reducer, actions } = imageSlice;
export const selectImages = (state) => state.images;
export const selectDishesImages = (state) => state.images.dishesImages;
export const selectSelectedShopImage = (state) =>
  state.images.selectedShopImage;
