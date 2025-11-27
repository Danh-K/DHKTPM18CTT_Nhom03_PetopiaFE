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

export const searchPromotions = createAsyncThunk(
  "promotion/search",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await promotionService.search(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi tìm kiếm");
    }
  }
);

export const inactivePromotion = createAsyncThunk("promotion/inactive", async (promotionId, { rejectWithValue }) => {
    try {
      return await promotionService.inactive(promotionId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Không thể vô hiệu hóa");
    }
  }
);

export const addPromotion = createAsyncThunk("promotion/add", async (promotionData, { rejectWithValue }) => {
    try {
      const data = await promotionService.addPromotion(promotionData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Thêm khuyến mãi thất bại"
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
    currentPage: 1,
    size: 9,
    loading: false,
    error: null,
    isSearching: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setCurrentPage: (state, action) => { state.currentPage = action.payload; },
    setIsSearching: (state, action) => { state.isSearching = action.payload; },
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
        state.currentPage = (action.payload.page ?? 0) + 1;
        state.size = action.payload.size || 9;
        state.isSearching = false;
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
      })
      .addCase(searchPromotions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = (action.payload.page ?? 0) + 1;
        state.size = action.payload.size || 9;
        state.isSearching = true;
      })
      .addCase(searchPromotions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(inactivePromotion.pending, (state) => {
        state.loading = true;
      })
      .addCase(inactivePromotion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(p => p.promotionId === action.payload.promotionId);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(inactivePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.list = [action.payload, ...state.list]; // Tự động thêm vào đầu danh sách
      })
      .addCase(addPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearError, setCurrentPage, setIsSearching } = promotionSlice.actions;
export default promotionSlice.reducer;