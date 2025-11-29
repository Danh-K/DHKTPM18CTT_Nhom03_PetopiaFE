import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategories } from "../api/categoryService";

export const fetchCategories = createAsyncThunk("category/fetchCategories", async (_, { rejectWithValue }) => {
    try {
      const data = await getAllCategories();
      return data;
    } catch (error) {
      return rejectWithValue("Không thể tải danh mục");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;