import { createSlice } from "@reduxjs/toolkit";

const common = createSlice({
  name: "common",
  initialState: {
    loading: false,
    message: {
      variant: "",
      text: "",
    },
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMessage: (state, action) => {
      state.message.variant = action.payload.variant;
      state.message.text = action.payload.text;
    },
  },
});

export default common;
