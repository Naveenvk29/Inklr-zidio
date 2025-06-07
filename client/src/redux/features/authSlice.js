import { createSlice } from "@reduxjs/toolkit";
import {
  saveUserInStorage,
  getUserFromStorage,
  clearUserFromStorage,
} from "../../utils/storage";

const initialState = {
  userInfo: getUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      const rememberMe = action.payload?.rememberMe ?? true;
      saveUserInStorage(action.payload, rememberMe);
    },
    logout: (state) => {
      state.userInfo = null;
      clearUserFromStorage();
    },
    updateUserInfo: (state, action) => {
      if (state.userInfo) {
        state.userInfo.user = {
          ...state.userInfo.user,
          ...action.payload,
        };
        saveUserInStorage(state.userInfo);
      }
    },
  },
});

export const { setCredentials, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
