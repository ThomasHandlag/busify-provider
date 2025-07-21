import { configureStore, type Action, type ThunkAction } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";

// Configure the Redux store
// This is where we combine all our slices and middleware
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
