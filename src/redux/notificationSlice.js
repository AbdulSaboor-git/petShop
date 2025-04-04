import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    isVisible: false,
    msg: "",
    success: true,
  },
  reducers: {
    showNotification: (state, action) => {
      state.isVisible = true;
      state.msg = action.payload.msg;
      state.success = action.payload.success;
    },
    hideNotification: (state) => {
      state.isVisible = false;
      // state.msg = "";
      // state.success = true;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
