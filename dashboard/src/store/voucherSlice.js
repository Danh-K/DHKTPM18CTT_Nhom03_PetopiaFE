import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { voucherService } from "../api/voucherService";

export const fetchVouchers = createAsyncThunk("voucher/fetchAll", async ({ page = 0, size = 9 }, { rejectWithValue }) => {
  try {
    const data = await voucherService.getAll(page, size);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Lỗi tải voucher");
  }
});

export const fetchVoucherByCode = createAsyncThunk("voucher/fetchByCode", async (code, { rejectWithValue }) => {
  try {
    const data = await voucherService.getByCode(code);
    return data;
  } catch (error) {
    return rejectWithValue("Không tìm thấy voucher");
  }
});

export const searchVouchers = createAsyncThunk("voucher/search", async (filters, { rejectWithValue }) => {
  try {
    const data = await voucherService.search(filters);
    return data;
  } catch (error) {
    return rejectWithValue("Lỗi tìm kiếm voucher");
  }
});

export const inactiveVoucher = createAsyncThunk("voucher/inactive", async (voucherId, { rejectWithValue }) => {
  try {
    return await voucherService.inactive(voucherId);
  } catch (error) {
    return rejectWithValue("Không thể vô hiệu hóa voucher");
  }
});

export const addVoucher = createAsyncThunk("voucher/add", async (voucherData) => {
  const data = await voucherService.addVoucher(voucherData);
  return data;
});

export const updateVoucher = createAsyncThunk("voucher/update", async (voucherData) => {
  const data = await voucherService.updateVoucher(voucherData);
  return data;
});

const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    list: [],
    selected: null,
    totalElements: 0,
    currentPage: 1,
    loading: false,
    error: null,
    isSearching: false,
  },
  reducers: {
    setCurrentPage: (state, action) => { state.currentPage = action.payload; },
    setIsSearching: (state, action) => { state.isSearching = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchVouchers.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = (action.payload.page ?? 0) + 1;
        state.isSearching = false;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch by code
      .addCase(fetchVoucherByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })

      // search
      .addCase(searchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.currentPage = (action.payload.page ?? 0) + 1;
        state.isSearching = true;
      })

      // inactive
      .addCase(inactiveVoucher.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex(v => v.voucherId === action.payload.voucherId);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // add & update
      .addCase(addVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.list = [action.payload, ...state.list];
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex(v => v.voucherId === action.payload.voucherId);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.voucherId === action.payload.voucherId) {
          state.selected = action.payload;
        }
      });
  },
});

export const { setCurrentPage, setIsSearching } = voucherSlice.actions;
export default voucherSlice.reducer;