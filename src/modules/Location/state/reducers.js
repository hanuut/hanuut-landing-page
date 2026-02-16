import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { reverseGeocodeLocal } from "../../../utils/geoUtils";

// --- Async Thunk to Request & Process Location ---
export const detectUserLocation = createAsyncThunk(
  "location/detect",
  async (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(rejectWithValue({ code: "UNSUPPORTED", message: "Geolocation not supported" }));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Perform local reverse geocoding to match backend data
          const geoData = reverseGeocodeLocal(latitude, longitude);

          if (geoData?.error) {
             return reject(rejectWithValue({ code: "OUT_OF_BOUNDS", message: "Location appears to be outside Algeria" }));
          }

          resolve({
            lat: latitude,
            lng: longitude,
            wilayaCode: geoData?.wilayaCode || null,
            wilayaName: geoData?.wilayaName || null,
            communeName: geoData?.communeName || null
          });
        },
        (error) => {
          let errorCode = "UNKNOWN";
          if (error.code === error.PERMISSION_DENIED) errorCode = "DENIED";
          else if (error.code === error.POSITION_UNAVAILABLE) errorCode = "UNAVAILABLE";
          else if (error.code === error.TIMEOUT) errorCode = "TIMEOUT";
          
          reject(rejectWithValue({ code: errorCode, message: error.message }));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });
  }
);

const initialState = {
  lat: null,
  lng: null,
  wilayaCode: null, // "16"
  wilayaName: null, // "Alger"
  communeName: null, // "Bab El Oued"
  
  status: "idle", // 'idle' | 'loading' | 'success' | 'error'
  error: null,    // { code: string, message: string }
  permissionStatus: "prompt" // 'prompt' | 'granted' | 'denied'
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    // Action to manually set location (e.g. from a dropdown override)
    setManualLocation: (state, action) => {
        const { wilayaCode, wilayaName, communeName } = action.payload;
        state.wilayaCode = wilayaCode;
        state.wilayaName = wilayaName;
        state.communeName = communeName;
        // Reset GPS coords if manual override implies imprecise location
        state.status = "success"; 
    },
    resetLocation: (state) => {
        return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectUserLocation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(detectUserLocation.fulfilled, (state, action) => {
        state.status = "success";
        state.lat = action.payload.lat;
        state.lng = action.payload.lng;
        state.wilayaCode = action.payload.wilayaCode;
        state.wilayaName = action.payload.wilayaName;
        state.communeName = action.payload.communeName;
        state.permissionStatus = "granted";
      })
      .addCase(detectUserLocation.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || { code: "UNKNOWN", message: "Unknown error" };
        if (state.error.code === "DENIED") {
            state.permissionStatus = "denied";
        }
      });
  },
});

export const { setManualLocation, resetLocation } = locationSlice.actions;
export const reducer = locationSlice.reducer;

// Selectors
export const selectLocation = (state) => state.location;
export const selectWilayaCode = (state) => state.location.wilayaCode;
export const selectCoordinates = (state) => ({ lat: state.location.lat, lng: state.location.lng });