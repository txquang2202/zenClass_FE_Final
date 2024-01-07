// store.js
import { configureStore } from "@reduxjs/toolkit";
import commentsReducer from "./commentSlice";

export const store = configureStore({
  reducer: {
    comments: commentsReducer,
  },
});
