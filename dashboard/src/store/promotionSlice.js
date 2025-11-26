import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { promotionService } from "../api/promotionService";

export const fetchPromotions = createAsyncThunk("promotion/fetchAll", async ({ page = 0, size = 9 }, { rejectWithValue }) => {
    try {
      const data = await promotionService.getAll(page, size);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Lỗi tải khuyến mãi"
      );
    }
  }
);

export const fetchPromotionByCode = createAsyncThunk("promotion/fetchByCode", async (code, { rejectWithValue }) => {
    try {
      const data = await promotionService.getByCode(code);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Không tìm thấy khuyến mãi"
      );
    }
  }
);

const promotionSlice = createSlice({
  name: "promotion",
  initialState: {
    list: [],
    selected: null,
    totalElements: 0,
    currentPage: 0,
    size: 9,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = action.payload.page || 0;
        state.size = action.payload.size || 9;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPromotionByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotionByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchPromotionByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = promotionSlice.actions;
export default promotionSlice.reducer;