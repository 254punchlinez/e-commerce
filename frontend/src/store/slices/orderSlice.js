import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
});

export const { clearError, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;