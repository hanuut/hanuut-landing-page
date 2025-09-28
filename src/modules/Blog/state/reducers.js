// src/modules/Blog/state/reducers.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllBlogPosts as fetchAllPostsService,
  fetchBlogPostBySlug as fetchPostBySlugService,
} from "../services/blogServices";

export const fetchAllBlogPosts = createAsyncThunk(
  "blog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const posts = await fetchAllPostsService();
      return posts;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch posts");
    }
  }
);

export const fetchBlogPostBySlug = createAsyncThunk(
  "blog/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const post = await fetchPostBySlugService(slug);
      return post;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch post");
    }
  }
);

const initialState = {
  posts: [],
  loading: false, // For the list of posts
  error: null, // For the list of posts

  selectedPost: null,
  // --- THIS IS THE FIX: Dedicated loading/error state for the single post ---
  selectedPostLoading: false,
  selectedPostError: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
      state.selectedPostError = null; // Also clear the error
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducers for fetchAllBlogPosts (unchanged)
      .addCase(fetchAllBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAllBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- Reducers for fetchBlogPostBySlug now use the dedicated state ---
      .addCase(fetchBlogPostBySlug.pending, (state) => {
        state.selectedPostLoading = true;
        state.selectedPostError = null;
      })
      .addCase(fetchBlogPostBySlug.fulfilled, (state, action) => {
        state.selectedPostLoading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchBlogPostBySlug.rejected, (state, action) => {
        state.selectedPostLoading = false;
        state.selectedPostError = action.payload;
      });
  },
});

export const { clearSelectedPost } = blogSlice.actions;

export const selectBlog = (state) => state.blog;

export default blogSlice.reducer;
