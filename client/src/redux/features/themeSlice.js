import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: true,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkmode: (state, action) => {
      state.darkMode = action.payload;
    },
    toggleMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    initializeTheme: (state) => {
      const storedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);
      state.darkMode = isDark;
    },
  },
});

export const { setDarkmode, toggleMode, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
